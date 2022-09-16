import React, { useEffect, useLayoutEffect, useState } from 'react';
import '../../App.css';
import * as waxjs from "@waxio/waxjs/dist";
import { Spin, Button, Menu, Row, Col, Space, Table, Typography, Layout, Input, Slider, InputNumber, notification } from 'antd';
import {
  LineChartOutlined,
  LoginOutlined,
  RadiusBottomleftOutlined,
  RadiusBottomrightOutlined,
  RadiusUpleftOutlined,
  RadiusUprightOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import Icon from '@ant-design/icons';
import nftsWaxList from "./nftsList";
import {
  symbolDefine,
  columnsOrder,
  columnsSymbol,
  columnsTradeHistory,
  columnsOpenOrder,
  contractName,
} from "./../../define";

import { Link, useNavigate } from "react-router-dom";
import { useParams } from 'react-router';
import axios from 'axios';
import ChartData from '../../components/Chart/ChartData';
import { timeParse } from "d3-time-format";

function Tradding() {
  var wax;
  const navigate = useNavigate();
  const parseDateTime = timeParse("%Y-%m-%d %H:%M:%S");

  const [pubKeys, setPubKeys] = useState('No Public Keys')
  const params = useParams();
  const { Title } = Typography;
  const { Header, Content, Footer } = Layout;
  
  const [userAccount, setUserAccount] = useState('');
  const [waxJs, setWaxJs] = useState(null);
  const [balance, setBalance] = useState(null);
  const [balanceSymbol, setBalanceSymbol] = useState([]);
  const [market,setMarket] = useState([]);
  const [textToast, contextHolder] = notification.useNotification();
  const [noti, setNoti] = useState({ status: '', content: '' });
  const [orderBuy, setOrderBuy] = useState([]);
  //----Form---//
  const [loading, setLoading] = useState(false);
  const [buyPrice, setBuyPrice] = useState();
  const [sellPrice, setSellPrice] = useState();
  const [buyAmount, setBuyAmount] = useState(1);
  const [sellAmount, setSellAmount] = useState(1);
  const [curentPrice, setCurentPrice] = useState();
  //----End Form---//
  const [orderSell, setOrderSell] = useState([]);

  // Info pair
  const [priceHighest, setPriceHighest] = useState(0);
  const [priceLowest, setPriceLowest] = useState(999999);
  const [volumeDay, setVolumeDay] = useState(0);
  const [volumePriceDay, setVolumePriceDay] = useState(0);

  // Notification
  const openNotification = (placement) => {
    if (noti.status) {
      textToast.info({
        message: `${noti.status}`,
        description: `${noti.content}`,
        placement,
      });
    }
  };

  const [] = useState(null);



  const [symbolCurent, setSymbolCurent] = useState(nftsWaxList[1]);
  const [pairSymbol, setPairSymbol] = useState('TLM');

  // const [dataSymbol] = useState([...nftsWaxList.map(x => { return { pair: x.symbol + '/Wax', price: '-', volume: '-' } }), ...nftsWaxList.map(x => { return { pair: x.symbol + '/Tlm', price: '-', volume: '-' } })]);
  const [dataSymbol] = useState([...nftsWaxList.map(x => { return { pair: x.symbol + '/TLM', price: '-', volume: '-' } })]);
  const [openOrder, setOpenOrder] = useState([]);
  const [openOrderBuy, setOpenOrderBuy] = useState([]);
  const [openOrderSell, setOpenOrderSell] = useState([]);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [dataMarket, setDataMarket] = useState([]);

  

  // --- Get data wallet ---//
  const getBlance = async (userAccount) => {
    if (userAccount) {
      axios({
        method: 'post',
        url: 'https://wax.greymass.com/v1/chain/get_currency_balance',
        data: JSON.stringify({ "code": symbolDefine[pairSymbol].code, "account": userAccount, "symbol": pairSymbol.toUpperCase() })
      }).then(res => {
        if (res.status === 200) {
          // console.log(res.data);
          setBalance(parseFloat(res.data[0]));
          // setBalance(parseFloat(res.data.core_liquid_balance));
        } else {
          setBalance(null);
        }

      })
        .catch(error => {
          setNoti({
            status: 'Error',
            content: error,
          })
        });

    }
  }

  const getBlanceNfts = async (userAccount) => {
    if (userAccount) {
      setLoading(true);
      // console.log(symbolCurent);
      axios.get(`https://wax.api.atomicassets.io/atomicassets/v1/assets?owner=` + userAccount + `&collection_name=alien.worlds&template_id=` + symbolCurent.template_id + `&limit=1000`)
        .then(res => {

          if (res.data) {
            setBalanceSymbol([...res.data.data])
            setLoading(false);
          } else {
            setBalanceSymbol([]);
          }
        })
        .catch(error => {
          setNoti({
            status: 'Nfts loading Error',
            content: error,
          })
          
        });
    }

  }

  // -- End get wallet data
  useEffect(() => {
    if (params.symbol) {
      const newSymbol = nftsWaxList.filter((item) => item.symbol == params.symbol);
      setSymbolCurent(newSymbol[0]);

    }
    if (params.pair) {
      setPairSymbol(params.pair);
    }
  }, [params])
  useEffect(() => {
    openNotification('topRight');
  }, [noti]);
  useEffect(() => {
    setOpenOrder([...openOrderBuy, ...openOrderSell])
  }, [openOrderBuy, openOrderSell])
  useEffect(() => {
    getMarketData();
    setTimeout(function(){
      clearData();
    },200)
    
  }, [symbolCurent, pairSymbol])
  useEffect(() => {
    //wax = new waxjs.WaxJS('https://wax.greymass.com', null, null, false);
    wax = new waxjs.WaxJS({
      rpcEndpoint: 'https://wax.greymass.com'
    });
    setWaxJs(wax);
    checkAutoLoginAndLogin();
    
  }, []);

  const clearData = () => {
    setBalance(null);
    setBalanceSymbol([]);
    setOpenOrder([]);
    setOpenOrderBuy([]);
    setOpenOrderSell([]);
    setOrderBuy([]);
    setOrderSell([]);
    getBlance(userAccount);
    getBlanceNfts(userAccount);
    getOrderBook();
    
  }
  async function getMarketData() { 
    axios({
      method: 'post',
      url: 'https://api.cleancodevietnam.com/wax/api/v0/search',
      data: {
        "mk_id": symbolCurent.scope,
        "base_token_sym": symbolDefine[pairSymbol].unit+','+symbolDefine[pairSymbol].symbol,
        "base_token_id": symbolCurent.scope,
      }
    }).then(res => {
      if(res.data){
        let newData = [...res.data].map(item => {
          if(item.type == 'buymatch'){
            return {
              x: new Date(item.timestamp * 1000),
              y: item.bid[0].split` `[0]/item.ask.length,
              z: item.ask.length
            }
          }else{
            return {
              x: new Date(item.timestamp * 1000),
              y: item.ask[0].split` `[0]/item.bid.length,
              z: item.bid.length
            }
          }
        });
        setMarket([...newData]);
        var today = new Date();
        var volumeToday = 0;
        var volumePriceToday = 0;
        var highest = priceHighest;
        var lowest = priceLowest;
        let newMarket = [...res.data].map(item => {
          var time = new Date(item.timestamp * 1000);
          if(time  > today - 1000*60*60*24){
              
              if(item.type == 'buymatch'){ 
                var price = item.bid[0].split` `[0]/item.ask.length;
                volumeToday += parseInt(item.ask.length);
                volumePriceToday += parseFloat(item.bid[0].split` `[0]);
              }else{
                var price = item.ask[0].split` `[0]/item.bid.length;
                volumeToday += parseInt(item.bid.length);
                volumePriceToday += parseFloat(item.ask[0].split` `[0]);
              }
              if(price >  highest){
                highest = price;
              }
              if(price <  lowest){
                lowest = price;
              }

          }
          if(item.type == 'buymatch'){
            return {
              type: 'buy',
              time: [time.getHours(),time.getMinutes(),time.getSeconds()].join`:`,
              price: item.bid[0].split` `[0]/item.ask.length,
              amount: item.ask.length
            }
          }else{
            return {
              type: 'sell',
              time: [time.getHours(),time.getMinutes(),time.getSeconds()].join`:`,
              price: item.ask[0].split` `[0]/item.bid.length,
              amount: item.bid.length
            }
          }
          
          
        });
        setPriceHighest(highest);
        setPriceLowest(lowest);
        setVolumeDay(volumeToday);
        setVolumePriceDay(volumePriceToday);
        setDataMarket([...newMarket]);
        if(userAccount){
          let newTrade = [...res.data].map(item => {
            if(item.asker == userAccount || item.bidder == userAccount){
              
              if(item.type == 'buymatch'){
                var time = new Date(item.timestamp * 1000)
                return {
                  type: 'buy',
                  time: [time.getHours(),time.getMinutes(),time.getSeconds()].join`:`,
                  pair: symbolCurent.symbol + '/' + pairSymbol,
                  price: item.bid[0].split` `[0]/item.ask.length,
                  amount: item.ask.length,
                  total: item.bid[0].split` `[0],
                }
              }else{
                var time = new Date(item.timestamp * 1000)
                return {
                  type: 'sell',
                  time: [time.getHours(),time.getMinutes(),time.getSeconds()].join`:`,
                  pair: symbolCurent.symbol + '/' + pairSymbol,
                  price: item.ask[0].split` `[0]/item.bid.length,
                  amount: item.bid.length,
                  total: item.ask[0].split` `[0],
                }
              }
            }
          });
          setTradeHistory([...newTrade]);
        }
        
      }
      
    })
  }
  async function getOrderBook() {
    createBuyOrder();
    createSellOrder();

    if (orderBuy.length > 0) {
      setCurentPrice(orderBuy[orderBuy.length - 1].price);
      if (!buyPrice) {
        setBuyPrice(orderBuy[orderBuy.length - 1].price)
      }
    }
    if (orderSell.length > 0) {
      setCurentPrice(orderSell[0].price)
      if (!sellPrice) {
        setSellPrice(orderSell[0].price)
      }
    }
  }
  async function createBuyOrder() {
    axios({
      method: 'post',
      url: 'https://wax.greymass.com/v1/chain/get_table_rows',
      data: JSON.stringify({
        code: "awmarketmain",
        index_position: 1,
        json: true,
        key_type: "",
        limit: "10000",
        lower_bound: null,
        reverse: false,
        scope: symbolCurent.scope,
        show_payer: true,
        table: "buyorders",
        upper_bound: null,
      })
    }).then(res => {
      if (res.data) {
        const baseOrder = [];
        const baseData = res.data.rows.map(it => {
          var item = it.data;
          if (item.account == userAccount) {
            baseOrder.push({
              id: item.id,
              time: item.timestamp,
              pair: symbolCurent.symbol + '/' + item.bid.split(' ')[1],
              type: 'Buy',
              price: parseFloat(item.bid.split(' ')[0]/item.ask).toFixed(4),
              amount: ~~(item.ask),
              total: parseFloat(item.bid.split(' ')[0]).toFixed(4),
            });
          }
          if (item.bid.split(symbolDefine[pairSymbol].symbol).length == 2) {
            
            let total = parseFloat(item.bid.split(symbolDefine[pairSymbol].symbol)[0]).toFixed(symbolDefine[pairSymbol].unit);
            return {
              price: '' + parseFloat(total/item.ask).toFixed(symbolDefine[pairSymbol].unit),
              amount: item.ask,
              total: total,
            }
          }
        });
        setOpenOrderBuy(baseOrder);
        const processBuyOrder = {};
        for (let i = 0; i < baseData.length; i++) {
          if (!processBuyOrder[baseData[i].price]) {
            processBuyOrder[baseData[i].price] = {
              amount: +baseData[i].amount,
              total: +parseFloat(baseData[i].total).toFixed(4),
            }
          } else {
            processBuyOrder[baseData[i].price].amount += +baseData[i].amount;
            processBuyOrder[baseData[i].price].total += +parseFloat(baseData[i].total).toFixed(symbolDefine[pairSymbol].unit);
          }
        }
        var orderBuyArray = [];
        for (let key in processBuyOrder) {
          orderBuyArray.push(
            {
              price: +key,
              amount: processBuyOrder[key].amount,
              total: processBuyOrder[key].total,
            }
          )
        }
        if (orderBuyArray.length > 0) {
          setOrderBuy(orderBuyArray.sort((a, b) => a.price - b.price));
        }
      }
    })
      .catch(error => {
        setNoti({
          status: 'Error',
          content: error,
        })
      });
  }
  async function createSellOrder() {
    axios({
      method: 'post',
      url: 'https://wax.greymass.com/v1/chain/get_table_rows',
      data: JSON.stringify({
        code: "awmarketmain",
        index_position: 1,
        json: true,
        key_type: "",
        limit: "10000",
        lower_bound: null,
        reverse: false,
        scope: symbolCurent.scope,
        show_payer: true,
        table: "sellorders",
        upper_bound: null,
      })
    }).then(res => {
      if (res.data) {
        const baseOrder = [];
        const baseData = res.data.rows.map(it => {
          var item = it.data;
          if (item.account == userAccount) {
            baseOrder.push({
              id: item.id,
              time: item.timestamp,
              pair: symbolCurent.symbol + '/' + item.ask.split(' ')[1],
              type: 'Sell',
              price: item.ask.split(' ')[0]/item.bid.length,
              amount: item.bid.length,
              total: parseFloat(item.ask.split(' ')[0]),
            });
          }
          if (item.ask.split(symbolDefine[pairSymbol].symbol).length == 2) {
            
            let price = parseFloat(item.ask.split(symbolDefine[pairSymbol].symbol)[0]/item.bid.length).toFixed(symbolDefine[pairSymbol].unit);
            return {
              price: '' + (price),
              amount: item.bid.length,
              total: parseFloat(item.ask.split(symbolDefine[pairSymbol].symbol)[0]).toFixed(symbolDefine[pairSymbol].unit),
            }
          }
        });
        setOpenOrderSell(baseOrder);
        const processBuyOrder = {};
        for (let i = 0; i < baseData.length; i++) {
          if (!processBuyOrder[baseData[i].price]) {
            processBuyOrder[baseData[i].price] = {
              amount: +baseData[i].amount,
              total: +parseFloat(baseData[i].total).toFixed(4),
            }
          } else {
            processBuyOrder[baseData[i].price].amount += +baseData[i].amount;
            processBuyOrder[baseData[i].price].total += +parseFloat(baseData[i].total).toFixed(4);
          }
        }
        var orderBuyArray = [];
        for (let key in processBuyOrder) {
          orderBuyArray.push(
            {
              price: +key,
              amount: processBuyOrder[key].amount,
              total: processBuyOrder[key].total,
            }
          )
        }
        if (orderBuyArray.length > 0) {
          setOrderSell(orderBuyArray.sort((a, b) => a.price - b.price));
        }
      }
    })
      .catch(error => {
        setNoti({
          status: 'Error',
          content: error,
        })
      });
  }
  async function checkAutoLoginAndLogin() {
    if (!wax) {
      wax = new waxjs.WaxJS({
        rpcEndpoint: 'https://wax.greymass.com'
      });
      setWaxJs(wax);
    }
    var isAutoLoginAwailable = await wax.isAutoLoginAvailable();
    console.log("Auto login", isAutoLoginAwailable);
    var userAccount2 = wax.userAccount
    setUserAccount(userAccount2);
    // var pubKeys2 = wax.pubKeys
    // setPubKeys(pubKeys2);
    getBlance(userAccount2);
    getBlanceNfts(userAccount2);
    return isAutoLoginAwailable;
  }
  async function buyEvent() {
    if (!buyPrice) {
      setNoti({
        status: 'Error',
        content: 'Price Missing!'
      })
      return;
    }
    if (!buyAmount) {
      setNoti({
        status: 'Error',
        content: 'Amount Missing!'
      })
      return;
    }
    const actions = [
      {
        account: symbolDefine[pairSymbol].code,
        name: "transfer",
        authorization: [
          {
            actor: userAccount,
            permission: "active",
          },
        ],
        data: {
          from: userAccount,
          to: contractName,
          quantity: parseFloat(buyPrice * buyAmount).toFixed(symbolDefine[pairSymbol].unit) + ' ' + symbolDefine[pairSymbol].symbol,
          memo: 'awnftmarket#' + symbolCurent.scope + '#' + buyAmount,
        }
      },
    ];
    callAction(actions);
  }
  async function sellEvent() {
    if (!sellPrice) {
      setNoti({
        status: 'Error',
        content: 'Price Missing!'
      })
      return;
    }
    if (!sellAmount) {
      setNoti({
        status: 'Error',
        content: 'Amount Missing!'
      })
      return;
    }
    const actions = [
      {
        account: "atomicassets",
        name: "transfer",
        authorization: [
          {
            actor: userAccount,
            permission: "active",
          },
        ],
        data: {
          from: userAccount,
          to: contractName,
          asset_ids: [...balanceSymbol.slice(0, sellAmount).map(item => item.asset_id)],
          memo: 'awnftmarket#' + symbolCurent.scope + '#' + (sellPrice*sellAmount) * (10 ** symbolDefine[pairSymbol].unit),
        }
      },
    ];
    callAction(actions);
  }
  async function callAction(actions) {
    try {
      const isLogin = await checkAutoLoginAndLogin();
      if (!isLogin) {
        await login();
      }
      await waxJs.api
        .transact(
          {
            actions,
          },
          {
            blocksBehind: 3,
            expireSeconds: 90,
          }
        )
        .then((result) => {
          setNoti({
            status: 'Success',
            content: 'transaction id: ' + result.transaction_id,
          });
          setTimeout(function(){
            clearData();
          },2000)
          
        })
    } catch (error) {
      setNoti({
        status: 'Error',
        content: error,
      })
    }
  }
  async function cancelOrder(id,type){
    const actions = [
      {
        account: "awmarketmain",
        name: type =='Buy'? "cancelbuy" : "cancelsell",
        authorization: [
          {
            actor: userAccount,
            permission: "active",
          },
        ],
        data: {
          executor: userAccount,
          market_id: symbolCurent.scope,
          order_id: id,
        }
      },
    ];
    callAction(actions);
  }
  async function login() {
    console.log('Logging in');

    try {
      wax = new waxjs.WaxJS({
        rpcEndpoint: 'https://wax.greymass.com'
      });
      const userAccount2 = await wax.login();
      setUserAccount(userAccount2);
      const pubKeys2 = wax.pubKeys;
      console.log('User logged as:', userAccount2, pubKeys);
      setPubKeys(pubKeys2);
      getBlance(userAccount2);
      getBlanceNfts(userAccount2);
      setWaxJs(wax);
    } catch (error) {
      console.error('User fail to login.', error);
      setNoti({
        status: 'Error',
        content: 'User fail to login.' + error,
      })
    }
  }
  const infomationSymbol = () => {
    return (
      <Row style={{ margin: '10px 0' }}>
        <Col xs={{ span: 24 }}>
          <Row justify="start" gutter={16}>
            <Col md="6" xs="24" >
              <img src={symbolCurent.image} style={{ maxWidth: '40px' }} />
            </Col>
            <Col md="6" xs="24">
              <Typography.Text>
                NFT Name: {symbolCurent.name}
                <br />
                Shine: Stone
              </Typography.Text>
            </Col>
            <Col md="6" xs="24">
              <Typography.Text>
                Pair: {symbolCurent.symbol}/{pairSymbol}
                <br />
                Template Id: {symbolCurent.template_id}
              </Typography.Text>
            </Col>
            <Col md="6" xs="24">
              <Typography.Text>
                Vol: {Intl.NumberFormat().format(volumeDay)} - {symbolCurent.symbol}
                <br />
                Vol: {Intl.NumberFormat().format(volumePriceDay)} - {pairSymbol}
              </Typography.Text>
            </Col>
            <Col md="6" xs="24">
              <Typography.Text>
                Low: {Intl.NumberFormat().format(priceLowest)}
                <br/>
                Height: {Intl.NumberFormat().format(priceHighest)}
              </Typography.Text>
            </Col>

          </Row>
        </Col>
        <br />
      </Row>

    )
  }
  const Context = React.createContext({
    name: noti.content,
  });
  const menuItems = [
    {
      key: 'logo',
      label: 'ALIENWORLDS MARKET',
      className: 'fontsize150',
    },
    {
      key: 'SubMenu',
      label: "Tradding Tools",
      icon: <LineChartOutlined />,
      children: nftsWaxList.map((item) => {
        return {
          key: item.symbol + 'TLM',
          label: (
            <span style={{ display: 'table-cell', verticalAlign: 'top' }}>
              <Link to={`/tradding/` + item.symbol + '/TLM'}>{item.name}/TLM</Link>
            </span>
          ),
          icon: <Icon component={() => (<img className="ant-menu-item" src={item.image} />)} />,
        }
      })
    },
    {
      key: 'info',
      label: userAccount ? (
        userAccount
      ) :
      (
        <Button onClick={()=>login()}>Login</Button>
      ),
      icon: <LoginOutlined />,
    }
  ]
  
  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu theme="light" mode="horizontal" defaultSelectedKeys={['mail']} items={menuItems} />

      </Header>
      <Content style={{ padding: '0 50px' }}>
        <Context.Provider
          value={{
            name: 'Notification',
          }}
        >
          {contextHolder}
        </Context.Provider>
        {infomationSymbol()}
        <Row justify="start" gutter={16}>
          <Col xs={24} md={6}>
            <Table dataSource={orderBuy} columns={columnsOrder} pagination={false} scroll={{ y: 250 }} rowClassName="green" size="small" onRow={(r) => ({
              onClick: () => {
                setSellPrice(r.price);
                setBuyPrice(r.price);
              }
            })} />
            <div style={{ float: 'left', fontWeight: 'bold', fontSize: '20px', margin: '5px' }}>
              {curentPrice}
            </div>
            <Table dataSource={orderSell} columns={columnsOrder} pagination={false} showHeader={false} scroll={{ y: 250 }} rowClassName="red" size="small" onRow={(r) => ({
              onClick: () => {
                setSellPrice(r.price);
                setBuyPrice(r.price);
              }
            })} />
          </Col>
          <Col xs={0} md={12}>
            { market.length > 0 && (
              <ChartData market={market} symbol={pairSymbol} name={symbolCurent.name}/>
            )}

          </Col>
          <Col xs={24} md={6}>
            <Table dataSource={dataMarket} columns={columnsSymbol} pagination={false} scroll={{ y: 380 }} size="small" />
          </Col>
        </Row>
        <Row justify="start" gutter={16}>
          <Col xs="24" md={{ span: 12 }}>
            <Title level={5}>Open orders</Title>
            <Table dataSource={openOrder} columns={[...columnsTradeHistory,{
                title: 'Action',
                dataIndex: 'action',
                align: 'center',
                render: (_, record) => (
                  <Space size="middle">
                    <CloseOutlined onClick={() => cancelOrder(record.id,record.type)} />
                  </Space>
                ),
            }]} pagination={false} scroll={{ y: 220 }} />
            <br />
            <Title level={5}>Trade history</Title>
            <Table dataSource={tradeHistory} columns={columnsTradeHistory} pagination={false} scroll={{ y: 220 }} />

          </Col>
          <Col xs="24" md={{ span: 12 }}>
            <Row justify="start" gutter={16}>
              <Col xs="24" md={{ span: 12 }}>

                <Input.Group size="large"></Input.Group>
                <Space direction="vertical">
                  <Title level={5}>Buy {symbolCurent.name} | Limit trade</Title>
                  <Typography.Text className="ant-form-text" type="secondary">
                    Balance: {balance ? new Intl.NumberFormat().format(balance) : '-'} {pairSymbol}
                  </Typography.Text>
                  <Input addonBefore="Price" addonAfter={pairSymbol} defaultValue="" value={buyPrice} onChange={(v) => setBuyPrice(v.target.value)} />
                  <InputNumber min={1} addonBefore="Amount" addonAfter={symbolCurent.symbol} value={buyAmount} onChange={(v) => setBuyAmount(Math.floor(v))} />

                  <Slider defaultValue={0} marks={{ 0: '0%', 25: '25%', 50: '50%', 75: '75%', 100: '100%' }} onChange={(v) => setBuyAmount(Math.floor(balance / buyPrice * v / 100))} />
                  <Input addonBefore="Total" addonAfter={pairSymbol} defaultValue="" value={sellPrice && buyAmount ? new Intl.NumberFormat().format(buyPrice * buyAmount) : ''} disabled />

                  <Button style={{ width: "100%" }} onClick={buyEvent} type="primary" success>Buy {symbolCurent.name}</Button>


                </Space>
              </Col>
              <Col xs="24" md={{ span: 12 }}>
              <Spin spinning={loading}>
                <Space direction="vertical">
                  <Title level={5}>Sell {symbolCurent.name} | Limit trade</Title>
                  
                    <Typography.Text className="ant-form-text" type="secondary">
                      Balance:  {balanceSymbol.length >= 1000 ? '>=' : ''}{Intl.NumberFormat().format(balanceSymbol.length)} {symbolCurent.name}
                      
                    </Typography.Text>
                    <Input addonBefore="Price" addonAfter={pairSymbol} defaultValue="" value={sellPrice} onChange={(v) => setSellPrice(v.target.value)} />
                    <InputNumber min={1} addonBefore="Amount" addonAfter={symbolCurent.symbol} value={sellAmount} onChange={(v) => setSellAmount(Math.floor(v))} />
                    <Slider defaultValue={0} marks={{ 0: '0%', 25: '25%', 50: '50%', 75: '75%', 100: '100%' }} onChange={(v) => setSellAmount(Math.floor(balanceSymbol.length * v / 100))} />
                    <Input addonBefore="Total" addonAfter={pairSymbol} value={sellPrice && sellAmount ? new Intl.NumberFormat().format(sellPrice * sellAmount) : ''} disabled />
                    <Button style={{ width: "100%" }} onClick={sellEvent} type="primary" danger>Sell {symbolCurent.name}</Button>
                 
                  
                </Space>
              </Spin>
              </Col>
            </Row>
          </Col>
        </Row>
      </Content>
      <Footer style={{ textAlign: 'center' }}> ©2022 Created by Alienworlds marketplace</Footer>
    </Layout>
  );
}

export default Tradding;
