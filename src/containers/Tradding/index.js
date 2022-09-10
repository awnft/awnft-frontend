import React, { useEffect,useLayoutEffect, useState } from 'react';
import '../../App.css';
import * as waxjs from "@waxio/waxjs/dist";
import { Button, Menu, Row, Col, Space, Table, Typography, Layout,Input,Slider,InputNumber, notification} from 'antd';
import { 
    LineChartOutlined, 
    LoginOutlined,
    RadiusBottomleftOutlined,
    RadiusBottomrightOutlined,
    RadiusUpleftOutlined,
    RadiusUprightOutlined,
} from '@ant-design/icons';
import Icon from '@ant-design/icons';
import { getData } from "./ultils";
import nftsWaxList from "./nftsList";
import {
  symbolDefine,
  columnsOrder,
  columnsSymbol,
  columnsTradeHistory,
  columnsOpenOrder,
  contractName,
} from "./../../define";
import { scaleTime } from "d3-scale";

import { ChartCanvas, Chart } from "react-stockcharts";
import { AreaSeries } from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import { curveMonotoneX } from "d3-shape";
import { createVerticalLinearGradient, hexToRGBA } from "react-stockcharts/lib/utils";

import {Link, useNavigate} from "react-router-dom" ;
import { useParams } from 'react-router';
import axios from 'axios';

function Tradding() {
  var wax;
  const navigate = useNavigate();
  const [pubKeys, setPubKeys] = useState('No Public Keys')
  const params = useParams();
  const { Title } = Typography;
  const { Header, Content, Footer } = Layout;
  const [size, setSize] = useState([0, 0]);
  const [userAccount, setUserAccount] = useState('');
  const [waxJs, setWaxJs] = useState(null);
  const [balance, setBalance] = useState(null);
  const [balanceSymbol, setBalanceSymbol] = useState([]);
  const [textToast, contextHolder] = notification.useNotification();
  const [noti,setNoti] = useState({status:'',content:''});
  const [orderBuy, setOrderBuy] = useState([]);
  //----Form---//
  const [buyPrice, setBuyPrice] = useState();
  const [sellPrice, setSellPrice] = useState();
  const [buyAmount, setBuyAmount] = useState(1);
  const [sellAmount, setSellAmount] = useState(1);
  const [curentPrice, setCurentPrice] = useState();
  //----End Form---//
  const [orderSell, setOrderSell] = useState([]);

  // Notification
  const openNotification = (placement) => {
    if(noti.status){
      textToast.info({
        message: `${noti.status}`,
        description: `${noti.content}`,
        placement,
      });
    }
  };

  const [] = useState(null);

  

  const [symbolCurent, setSymbolCurent] = useState(nftsWaxList[1]);
  const [pairSymbol, setPairSymbol] = useState('Tlm');

  const [dataSymbol] = useState([...nftsWaxList.map(x => {return {pair: x.symbol+'/Wax',price: '-', volume: '-'} }),...nftsWaxList.map(x => {return {pair: x.symbol+'/Tlm',price: '-', volume: '-'} })]);

  const [openOrder, setOpenOrder] = useState([]);
  const [openOrderBuy, setOpenOrderBuy] = useState([]);
  const [openOrderSell, setOpenOrderSell] = useState([]);
  const [tradeHistory,setTradeHistory] = useState([]);
  const [dataChart, setDataChart] = useState([]);
  

  const canvasGradient = createVerticalLinearGradient([
    { stop: 0, color: hexToRGBA("#b5d0ff", 0.2) },
    { stop: 0.7, color: hexToRGBA("#6fa4fc", 0.4) },
    { stop: 1, color: hexToRGBA("#4286f4", 0.8) },
  ]);
  
  // --- Get data wallet ---//
  const getBlance = async (userAccount) => {
    if(userAccount){
        axios({
          method: 'post',
          url: 'https://wax.greymass.com/v1/chain/get_currency_balance',
          data: JSON.stringify({"code":symbolDefine[pairSymbol].code,"account":userAccount,"symbol":pairSymbol.toUpperCase()})
        }).then(res => {
          if(res.status === 200){
            // console.log(res.data);
            setBalance(parseFloat(res.data[0]));
            // setBalance(parseFloat(res.data.core_liquid_balance));
          }else{
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
    if(userAccount){
      // console.log(symbolCurent);
      axios.get(`https://wax.api.atomicassets.io/atomicassets/v1/assets?owner=`+userAccount+`&collection_name=alien.worlds&template_id=`+symbolCurent.template_id+`&limit=1000`)
      .then(res => {
        
        if(res.data){
          setBalanceSymbol([...res.data.data])
        }else{
          setBalanceSymbol([]);
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

  // -- End get dât wallet
  useEffect(() => { 
    
    if(params.symbol){
        const newSymbol = nftsWaxList.filter((item) => item.symbol == params.symbol);
        setSymbolCurent(newSymbol[0]);
    }
    if(params.pair){
      setPairSymbol(params.pair);
    }
    
    
  },[params])
  useEffect(() => { 
    openNotification('topRight');
  },[noti]);
  useEffect(() => { 
    setOpenOrder([...openOrderBuy,...openOrderSell])
  },[openOrderBuy,openOrderSell])
  useEffect(() => { 
    clearData()
  },[symbolCurent,pairSymbol])
  useEffect(() => {
    //wax = new waxjs.WaxJS('https://wax.greymass.com', null, null, false);
    wax = new waxjs.WaxJS({
      rpcEndpoint: 'https://wax.greymass.com'
    });
    setWaxJs(wax);
    checkAutoLoginAndLogin();
    // console.log('started wax:', wax);
    getData().then(data => {
      setDataChart(data)
      console.log(data);
      
    })
    
  },[]);
  
  const clearData = () => {
    setBalance(null);
    setBalanceSymbol([]);
    setOpenOrder([]);
    getBlance(userAccount);
    getBlanceNfts(userAccount);
    getOrderBook();
    
  }
  useLayoutEffect(() => {
      function updateSize() {
        setSize([window.innerWidth, window.innerHeight]);
      }
      window.addEventListener('resize', updateSize);
      updateSize();
      window.removeEventListener('resize', updateSize);
  }, []);
  async function getOrderBook(){
    createBuyOrder();
    createSellOrder();
    
    if(orderBuy.length > 0){
      setCurentPrice(orderBuy[orderBuy.length-1].price);
      if(!buyPrice){
        setBuyPrice(orderBuy[orderBuy.length-1].price)
      }
    }
    if(orderSell.length > 0){
      setCurentPrice(orderSell[0].price)
      if(!sellPrice){
        setSellPrice(orderSell[0].price)
      }
    }
  }
  async function createBuyOrder(){
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
      if(res.data){
        const baseOrder = [];
        const baseData = res.data.rows.map(it => {
          var item = it.data;
          
          if(item.account == userAccount){
            baseOrder.push({
              time: item.timestamp,
              pair: symbolCurent.symbol +'/'+ item.bid.split(' ')[1],
              type: 'Buy',
              price: item.ask/10000,
              amount: ~~(item.bid.split(' ')[0]/(item.ask/10000)),
              total: item.bid.split` `[0],
            });
          }
          if(item.bid.split(symbolDefine[pairSymbol].symbol).length == 2){
            let total = parseFloat(item.bid.split(symbolDefine[pairSymbol].symbol)).toFixed(symbolDefine[pairSymbol].unit);
            return {
              price: ''+(item.ask/(10**symbolDefine[pairSymbol].unit)),
              amount: parseInt(total/(item.ask/(10**symbolDefine[pairSymbol].unit))),
              total: total,
            }
          }
        });
        setOpenOrderBuy(baseOrder);
        const processBuyOrder = {};
        for(let i=0;i<baseData.length;i++){
          if(!processBuyOrder[baseData[i].price]){
            processBuyOrder[baseData[i].price] = {
              amount: +baseData[i].amount,
              total: +parseFloat(baseData[i].total).toFixed(4),
            }
          }else{
            processBuyOrder[baseData[i].price].amount += +baseData[i].amount;
            processBuyOrder[baseData[i].price].total += +parseFloat(baseData[i].total).toFixed(4);
          }
        }
        var orderBuyArray = [];
        for(let key in processBuyOrder){
          orderBuyArray.push(
            {
              price: +key,
              amount: processBuyOrder[key].amount,
              total: processBuyOrder[key].total,
            }
          )
        }
        if(orderBuyArray.length > 0){
          setOrderBuy(orderBuyArray.sort((a,b)=> b.price-a.price));
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
  async function createSellOrder(){
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
      if(res.data){
        const baseOrder = [];
        const baseData = res.data.rows.map(it => {
          var item = it.data;
          if(item.account == userAccount){
            baseOrder.push({
              time: item.timestamp,
              pair: symbolCurent.symbol +'/'+ item.ask.split(' ')[1],
              type: 'Sell',
              price: item.ask.split(' ')[0],
              amount: item.bid.length,
              total: parseFloat(item.ask.split(' ')[0]*item.bid.length),
            });
          }
          if(item.ask.split(symbolDefine[pairSymbol].symbol).length == 2){
            let price = parseFloat(item.ask.split(symbolDefine[pairSymbol].symbol)).toFixed(symbolDefine[pairSymbol].unit);
            return {
              price: ''+(price),
              amount: item.bid.length,
              total: parseFloat(price*item.bid.length).toFixed(symbolDefine[pairSymbol].unit),
            }
          }
        });
        setOpenOrderSell(baseOrder);
        const processBuyOrder = {};
        for(let i=0;i<baseData.length;i++){
          if(!processBuyOrder[baseData[i].price]){
            processBuyOrder[baseData[i].price] = {
              amount: +baseData[i].amount,
              total: +parseFloat(baseData[i].total).toFixed(4),
            }
          }else{
            processBuyOrder[baseData[i].price].amount += +baseData[i].amount;
            processBuyOrder[baseData[i].price].total += +parseFloat(baseData[i].total).toFixed(4);
          }
        }
        var orderBuyArray = [];
        for(let key in processBuyOrder){
          orderBuyArray.push(
            {
              price: +key,
              amount: processBuyOrder[key].amount,
              total: processBuyOrder[key].total,
            }
          )
        }
        if(orderBuyArray.length > 0){
          setOrderSell(orderBuyArray.sort((a,b)=> a.price-b.price));
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
  async function checkAutoLoginAndLogin(){
    var isAutoLoginAwailable = await wax.isAutoLoginAvailable();
    console.log("Auto login", isAutoLoginAwailable);
    var userAccount2 = wax.userAccount
    var pubKeys2 = wax.pubKeys
    setUserAccount(userAccount2);
    setPubKeys(pubKeys2);
    getBlance(userAccount2);
    getBlanceNfts(userAccount2);
  }
  async function buyEvent(){
    if(!buyPrice){
      setNoti({
        status: 'Error',
        content: 'Price Missing!'
      })
      return;
    }
    if(!buyAmount){
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
          quantity: parseFloat(buyPrice*buyAmount).toFixed(symbolDefine[pairSymbol].unit) +' '+symbolDefine[pairSymbol].symbol,
          memo: 'awnftmarket#'+symbolCurent.scope+'#'+buyPrice*(10**symbolDefine[pairSymbol].unit),
        }
      },
    ];
    callAction(actions);
  }
  async function sellEvent(){
    if(!sellPrice){
      setNoti({
        status: 'Error',
        content: 'Price Missing!'
      })
      return;
    }
    if(!sellAmount){
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
          asset_ids: [...balanceSymbol.slice(0,sellAmount).map(item=>item.asset_id)],
          memo: 'awnftmarket#'+symbolCurent.scope+'#'+sellPrice*(10**symbolDefine[pairSymbol].unit),
        }
      },
    ];
    callAction(actions);
  }
  async function callAction(actions){
    try {
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
            content: 'transaction id: '+result.transaction_id,
          });
          clearData();
        })
    } catch (error){
      setNoti({
        status: 'Error',
        content: error,
      })
    }
  }

  async function login(){
    console.log('Logging in');
   
    try {
      wax = new waxjs.WaxJS({
        rpcEndpoint: 'https://wax.greymass.com'
      });
      const userAccount2 = await wax.login();
      setUserAccount(userAccount2);
      const pubKeys2 = wax.pubKeys;
      console.log('User logged as:',userAccount2, pubKeys);
      setPubKeys(pubKeys2);
      getBlance(userAccount2);
      getBlanceNfts(userAccount2);
      setWaxJs(wax);
    } catch (error){
      console.error('User fail to login.', error);
      setNoti({
        status: 'Error',
        content: 'User fail to login.'+ error,
      })
    }
  }
  const infomationSymbol = ()=> {
      return (
        <Row>
          <Col xs={{span: 24}}>
              <Row justify="start" gutter={16}>
                  <Col md="6" xs="24" >
                    <img src={symbolCurent.image} style={{maxWidth: '40px'}}/>
                  </Col> 
                  <Col md="6" xs="24">
                    <Typography.Text>
                        NFT Name: {symbolCurent.name}
                        <br/>
                        Shine: Stone
                    </Typography.Text>
                  </Col> 
                  <Col md="6" xs="24"> 
                    <Typography.Text>
                        Pair: {symbolCurent.symbol}/{pairSymbol}
                        <br/>
                        Template Id: {symbolCurent.template_id}
                    </Typography.Text>
                  </Col>
                  <Col md="6" xs="24"> 
                    <Typography.Text>
                        Vol: - {symbolCurent.symbol}
                    </Typography.Text>
                    <Typography.Text>
                        Low: -
                        <br/>
                        Height: -
                    </Typography.Text>
                  </Col>  
                    
                
            </Row>
        </Col>
        <br/>
      </Row>
      
      )
  }
  const Context = React.createContext({
    name: noti.content,
  });
  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu theme="light" mode="horizontal" defaultSelectedKeys={['mail']}>
          <Menu.Item key="logo" style={{ fontSize: '150%'}} >
            ALIENWORLDS MARKET
          </Menu.Item>
          {/* <Menu.Item key="wallet" icon={<AuditOutlined />}>
            Wallet
          </Menu.Item> */}
          <Menu.SubMenu key="SubMenu" title="Tradding Tools" icon={<LineChartOutlined />}>
            <Menu.ItemGroup title="TLM">
                {
                  nftsWaxList.map((item)=> {
                    return (
                      <Menu.Item style={{display: 'table'}} key={item.symbol+'tlm'} icon={<Icon component={() => (<img className="ant-menu-item" src={item.image} />)} />}>
                          <span style={{display: 'table-cell', verticalAlign: 'top'}}>
                            <Link to={`/tradding/`+item.symbol+'/Tlm'}>{item.name}/Tlm</Link>
                          </span>
                      </Menu.Item>
                    )
                  })
                }
                  
                
              </Menu.ItemGroup>
            <Menu.ItemGroup title="WAX">
              {
                nftsWaxList.map((item)=> {
                  return (
                  <Menu.Item style={{display: 'table'}} key={item.symbol+'wax'} icon={<Icon component={() => (<img className="ant-menu-item" src={item.image} />)} />} >
                        <span style={{display: 'table-cell', verticalAlign: 'top'}}>
                          <Link to={`/tradding/`+item.symbol+'/Wax'}>{item.name}/Wax</Link>
                        </span>
                        
                    </Menu.Item>
                  )
                })
              }
            </Menu.ItemGroup>
          </Menu.SubMenu>
          {userAccount && (
                  <Menu.Item key="info" icon={<LoginOutlined />}>
                    {userAccount}
                  </Menu.Item>
                )
          }
          {!userAccount && (
                  <Menu.Item key="login" icon={<LoginOutlined />}>
                    <Button onClick={login()}>Login</Button>
                  </Menu.Item>
                )
          }
        </Menu>
        
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
          <Row justify="start">
            <Col xs={24} md={6}>
              <Table dataSource={orderBuy} columns={columnsOrder} pagination={false}  scroll={{ y: 250 }} rowClassName="green" size="small" onRow={(r) => ({
                  onClick: () => {
                    setSellPrice(r.price);
                    setBuyPrice(r.price);
                  }
                })}/>
              <div style={{float: 'left', fontWeight: 'bold', fontSize: '20px', margin: '5px'}}>
                {curentPrice}
              </div>
              <Table dataSource={orderSell} columns={columnsOrder} pagination={false} showHeader={false}  scroll={{ y: 250 }} rowClassName="red" size="small" onRow={(r) => ({
                  onClick: () => {
                    setSellPrice(r.price);
                    setBuyPrice(r.price);
                  }
              })}/>
            </Col>
            <Col xs={0} md={12}>
              {dataChart.length >0 && (
                  <ChartCanvas height={400}
                      ratio={2}
                      width={size[0]*0.5 - 25}
                      margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
                      seriesName="MSFT"
                      data={dataChart}
                      xAccessor={d => d.date}
                      xScale={scaleTime()}
                      xExtents={[new Date(2011, 0, 1), new Date()]}
                    >

                    <Chart id={0} yExtents={[d => [d.high, d.low]]}>
                      <defs>
                        <linearGradient id="MyGradient" x1="0" y1="100%" x2="0" y2="0%">
                          <stop offset="0%" stopColor="#b5d0ff" stopOpacity={0.2} />
                          <stop offset="70%" stopColor="#6fa4fc" stopOpacity={0.4} />
                          <stop offset="100%"  stopColor="#4286f4" stopOpacity={0.8} />
                        </linearGradient>
                      </defs>
                      <XAxis axisAt="bottom" orient="bottom" ticks={6}/>
                      <YAxis axisAt="left" orient="left" />
                      <AreaSeries
                        yAccessor={d => d.close}
                        fill="url(#MyGradient)"
                        strokeWidth={2}
                        interpolation={curveMonotoneX}
                        canvasGradient={canvasGradient}
                      />
                    </Chart>
                  </ChartCanvas>
                )
              }
              
            </Col>
            <Col xs={24} md={6}>
              <Table dataSource={dataSymbol} columns={columnsSymbol} pagination={false}  scroll={{ y: 360 }} size="small"
              onRow={(r) => ({
                onClick: () => {
                  navigate('/tradding/'+r.pair);
                }
              })}
              />
            </Col>
          </Row>
          <Row justify="start" gutter={16}>
            <Col xs="24" md={{span: 12}}>
                <Title level={5}>Open orders</Title>
                <Table dataSource={openOrder} columns={columnsOpenOrder} pagination={false}  scroll={{ y: 220 }}/>
                <br/>
                <Title level={5}>Trade history</Title>
                <Table dataSource={tradeHistory} columns={columnsTradeHistory} pagination={false}  scroll={{ y: 220 }}/>
              
            </Col>
            <Col xs="24" md={{span: 12}}>
              <Row justify="start" gutter={16}>
                  <Col xs="24" md={{span: 12}}>
                  
                    <Input.Group size="large"></Input.Group>
                    <Space direction="vertical">
                      <Title level={5}>Buy {symbolCurent.name} | Limit trade</Title>
                        <Typography.Text className="ant-form-text" type="secondary">
                          Balance: {balance ? new Intl.NumberFormat().format(balance): '-'} {pairSymbol}
                        </Typography.Text>
                        <Input addonBefore="Price"  addonAfter={pairSymbol} defaultValue="" value={buyPrice} onChange={(v) => setBuyPrice(v.target.value)}/>
                        <InputNumber min={1} addonBefore="Amount" addonAfter={symbolCurent.symbol}  value={buyAmount} onChange={(v) => setBuyAmount(Math.floor(v))}/>
                        
                        <Slider defaultValue={0} marks={{0:'0%', 25: '25%', 50: '50%', 75: '75%', 100: '100%'}} onChange={(v) => setBuyAmount(Math.floor(balance/buyPrice*v/100)) }/>
                        <Input addonBefore="Total"  addonAfter={pairSymbol} defaultValue="" value={sellPrice && buyAmount ? new Intl.NumberFormat().format(buyPrice*buyAmount) : ''} disabled/>

                        <Button style={{ width: "100%" }} onClick={buyEvent} type="primary" success>Buy {symbolCurent.name}</Button>
                      
                      
                    </Space>
                  </Col>
                  <Col xs="24" md={{span: 12}}>
                    <Space direction="vertical">
                      <Title level={5}>Sell {symbolCurent.name} | Limit trade</Title>
                      <Typography.Text className="ant-form-text" type="secondary">
                          Balance: {new Intl.NumberFormat().format(balanceSymbol.length)} {symbolCurent.name}
                      </Typography.Text>
                      <Input addonBefore="Price"  addonAfter={pairSymbol} defaultValue="" value={sellPrice} onChange={(v) => setSellPrice(v.target.value)}/>
                      <InputNumber min={1} addonBefore="Amount" addonAfter={symbolCurent.symbol}  value={sellAmount} onChange={(v) => setSellAmount(Math.floor(v))} />
                      <Slider defaultValue={0} marks={{0:'0%', 25: '25%', 50: '50%', 75: '75%', 100: '100%'}} onChange={(v) => setSellAmount(Math.floor(balanceSymbol.length*v/100)) }/>
                      <Input addonBefore="Total"  addonAfter={pairSymbol} value={sellPrice && sellAmount ? new Intl.NumberFormat().format(sellPrice*sellAmount) : ''} disabled/>
                      <Button style={{ width: "100%" }} onClick={sellEvent} type="primary" danger>Sell {symbolCurent.name}</Button>
                    </Space>
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
