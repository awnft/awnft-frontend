
import React, { useEffect,useLayoutEffect, useState, Component } from 'react';
import { compose } from 'redux';
import '../../App.css';
import * as waxjs from "@waxio/waxjs/dist";
import { sha256, sha224 } from 'js-sha256';
import { Button, Menu, Row, Col, Divider ,Space, Table, Typography, Layout,Input,Slider,InputNumber} from 'antd';
import { MailOutlined, AppstoreOutlined, SettingOutlined, LineChartOutlined, StockOutlined, LoginOutlined, AuditOutlined } from '@ant-design/icons';
import Icon from '@ant-design/icons';

import { getData } from "./ultils"
import nftsWaxList from "./nftsList"
import PropTypes from "prop-types";

import { scaleTime } from "d3-scale";
import { utcDay } from "d3-time";

import { ChartCanvas, Chart } from "react-stockcharts";
import { CandlestickSeries, AreaSeries } from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import { curveMonotoneX } from "d3-shape";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last, createVerticalLinearGradient, hexToRGBA } from "react-stockcharts/lib/utils";

import {Link} from "react-router-dom" ;
import { useLocation, useParams } from 'react-router';
import axios from 'axios';

function Tradding(props) {
  var wax;
  // const myChain = {
  //   chainId: '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4',
  //   rpcEndpoints: [{
  //     protocol: 'https',
  //     host: 'wax.greymass.com',
  //     port: '443',
  //   }]
  // }
  const [pubKeys, setPubKeys] = useState('No Public Keys')
  const location = useLocation();
  const params = useParams();
  const { Title } = Typography;
  const { Header, Content, Footer } = Layout;
  const [size, setSize] = useState([0, 0]);
  const [userAccount, setUserAccount] = useState('');
  
  const [waxAcc, setWaxAcc] = useState('');
  const [balance, setBalance] = useState(null);
  const [balanceSymbol, setBalanceSymbol] = useState([]);
  const [orderBuy, setOrderBuy] = useState([{
    key: '1',
    price: 52,
    amount: 1,
    total: 52,
    },
    {
      key: '2',
      price: 53,
      amount: 2,
      total: 106,
    },
  ]);
  //----Form---//
  const [buyPrice, setBuyPrice] = useState();
  const [sellPrice, setSellPrice] = useState();
  const [buyAmount, setBuyAmount] = useState(1);
  const [sellAmount, setSellAmount] = useState(1);
  //----End Form---//
  const [orderSell, setOrderSell] = useState([{
      key: '1',
      price: 54,
      amount: 1,
      total: 54,
    },
    {
      key: '2',
      price: 55,
      amount: 2,
      total: 110,
    },
  ]);

  const [orderCurent, setOrderCurent] = useState(null);

  

  const [symbolCurent, setSymbolCurent] = useState(nftsWaxList[1]);
  const [pairSymbol, setPairSymbol] = useState('Tlm');

  const [dataSymbol, setDataSymbol] = useState([
    {
      key: '1',
      pair: 'Drill/Wax',
      price: 52,
      volume: 100,
    },
    {
      key: '2',
      pair: 'Drill/TLM',
      price: 195,
      volume: 50,
    },
  ]);

  const [openOrder, setOpenOrder] = useState([]);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [dataChart, setDataChart] = useState([]);
  const columnsOrder = [
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      align: 'center',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      align: 'right',
    },
  ];
  const columnsSymbol = [
    {
      title: 'Pair',
      dataIndex: 'pair',
      key: 'pair',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
    },
    {
      title: 'Volume',
      dataIndex: 'volume',
      key: 'volume',
      align: 'right',
    },
  ];
  const columnsTradeHistory = [
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Pair',
      dataIndex: 'pair',
      key: 'pair',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
    },
  ];
  const columnsOpenOrder = [...columnsTradeHistory,
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
    },
  ];

  const canvasGradient = createVerticalLinearGradient([
    { stop: 0, color: hexToRGBA("#b5d0ff", 0.2) },
    { stop: 0.7, color: hexToRGBA("#6fa4fc", 0.4) },
    { stop: 1, color: hexToRGBA("#4286f4", 0.8) },
  ]);
  
  // --- Get data wallet ---//
  const getBlance = async (userAccount) => {
    if(userAccount){
      if(pairSymbol.toUpperCase() == 'TLM'){
        axios({
          method: 'post',
          url: 'https://wax.greymass.com/v1/chain/get_currency_balance',
          data: JSON.stringify({"code":"alien.worlds","account":userAccount,"symbol":pairSymbol.toUpperCase()})
        }).then(res => {
          if(res.data){
            setBalance(parseFloat(res.data[0]));
          }else{
            setBalance(null);
          }
          
        })
        .catch(error => console.log(error));
      }else{
        // eosio.token
        // https://wax.alcor.exchange/api/markets
        // https://wax.alcor.exchange/api/account/..../deals?limit=100&skip=0

        axios({
          method: 'post',
          url: 'https://wax.greymass.com/v1/chain/get_account',
          data: JSON.stringify({"account_name":userAccount})
        }).then(res => {
          if(res.data){
            setBalance(parseFloat(res.data.core_liquid_balance));
          }else{
            setBalance(null);
          }
          
        })
        .catch(error => console.log(error));
      }
    }  
  }

  const getBlanceNfts = async (userAccount) => {
    if(userAccount){
      console.log(symbolCurent);
      axios.get(`https://wax.api.atomicassets.io/atomicassets/v1/assets?owner=`+userAccount+`&collection_name=alien.worlds&template_id=`+symbolCurent.template_id+`&limit=1000`)
      .then(res => {
        
        if(res.data){
          setBalanceSymbol([...res.data.data])
        }else{
          setBalanceSymbol([]);
        }
      })
      .catch(error => console.log(error));
    }
    
  }

  // -- End get dât wallet
  useEffect(() => { 
    
    if(params.symbol){
        const newSymbol = nftsWaxList.filter((item) => item.symbol == params.symbol);
        setSymbolCurent(newSymbol[0]);
        console.log(newSymbol[0]);
    }
    if(params.pair){
      setPairSymbol(params.pair);
    }
    
    
  },[params])
  useEffect(() => { 
    clearData()
  },[symbolCurent,pairSymbol])
  useEffect(() => {
    //wax = new waxjs.WaxJS('https://wax.greymass.com', null, null, false);
    wax = new waxjs.WaxJS({
      rpcEndpoint: 'https://wax.greymass.com'
    });
    // setWaxAcc(wax);
    checkAutoLoginAndLogin();
    // console.log('started wax:', wax);
    getData().then(data => {
      setDataChart(data)
    })
    
  },[]);
  
  const clearData = () => {
    setBalance(null);
    setBalanceSymbol([]);
    getBlance(userAccount);
    getBlanceNfts(userAccount);
  }
  
  const fromHexString = (hexString) =>
  new Uint8Array(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)))

  const getRandomArray = () => {
    const arr = new Uint8Array(8)
    for (let i = 0; i < 8; i += 1) {
      arr[i] = Math.floor(Math.random() * 255)
    }
    return arr
  }

  const toHex = (buffer) => {
    return Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  }

  useLayoutEffect(() => {
      function updateSize() {
        setSize([window.innerWidth, window.innerHeight]);
      }
      window.addEventListener('resize', updateSize);
      updateSize();
      window.removeEventListener('resize', updateSize);
  }, []);

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
  const settingLogin = () => {
    login();
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
      
    } catch (error){
      console.error('User fail to login.', error);
    }
  }
  const infomationSymbol = ()=> {
      return (
        <Row>
          <Col xs={{span: 24}}>
            <Row justify="start">
                <Space size={50}>
                    
                    <img src={symbolCurent.image} style={{maxWidth: '40px'}}/>
                    
                    
                    <Typography.Text>
                        NFT Name: {symbolCurent.name}
                        <br/>
                        Shine: Stone
                    </Typography.Text>
                    <Typography.Text>
                        Pair: {symbolCurent.symbol}/Tlm
                        <br/>
                        Template Id: {symbolCurent.template_id}
                    </Typography.Text>
                    <Typography.Text>
                        Vol: - {symbolCurent.symbol}
                    </Typography.Text>
                    <Typography.Text>
                        Low: -
                        <br/>
                        Height: -
                    </Typography.Text>
                </Space>
                
            </Row>
        </Col>
        <br/>
      </Row>
      
      )
  }
  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu theme="light" mode="horizontal" defaultSelectedKeys={['mail']}>
          <Menu.Item key="logo" style={{ fontSize: '150%'}} >
            ALIENWORLDS MARKET
          </Menu.Item>
          <Menu.Item key="wallet" icon={<AuditOutlined />}>
            Wallet
          </Menu.Item>
          <Menu.SubMenu key="SubMenu" title="Tradding" icon={<LineChartOutlined />}>
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
          {infomationSymbol()}
          <Row justify="start">
            <Col xs={6}>
              <Table dataSource={orderBuy} columns={columnsOrder} pagination={false}  scroll={{ y: 500 }} rowClassName="green" size="small" onRow={(r) => ({
                  onClick: () => {
                    setSellPrice(r.price);
                    setBuyPrice(r.price);
                  }
                })}/>
              <div style={{float: 'left', fontWeight: 'bold', fontSize: '20px', margin: '5px'}}>
                53
              </div>
              <Table dataSource={orderSell} columns={columnsOrder} pagination={false} showHeader={false}  scroll={{ y: 500 }} rowClassName="red" size="small" onRow={(r) => ({
                  onClick: () => {
                    setSellPrice(r.price);
                    setBuyPrice(r.price);
                  }
              })}/>
            </Col>
            <Col xs={12}>
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
            <Col xs={6}>
              <Table dataSource={dataSymbol} columns={columnsSymbol} pagination={false}  scroll={{ y: 500 }} size="small"/>
            </Col>
          </Row>
          <Row justify="start" gutter={16}>
            <Col xs={{span: 12}}>
                <Title level={5}>Open orders</Title>
                <Table dataSource={openOrder} columns={columnsOpenOrder} pagination={false}  scroll={{ y: 500 }}/>
                <br/>
                <Title level={5}>Trade history</Title>
                <Table dataSource={tradeHistory} columns={columnsTradeHistory} pagination={false}  scroll={{ y: 500 }}/>
              
            </Col>
            <Col xs={{span: 12}}>
              <Row justify="start" gutter={16}>
                  <Col xs={{span: 12}}>
                  
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

                        <Button style={{ width: "100%" }} onClick={login} type="primary" success>Buy {symbolCurent.name}</Button>
                      
                      
                    </Space>
                  </Col>
                  <Col xs={{span: 12}}>
                    <Space direction="vertical">
                      <Title level={5}>Sell {symbolCurent.name} | Limit trade</Title>
                      <Typography.Text className="ant-form-text" type="secondary">
                          Balance: {new Intl.NumberFormat().format(balanceSymbol.length)} {symbolCurent.name}
                      </Typography.Text>
                      <Input addonBefore="Price"  addonAfter={pairSymbol} defaultValue="" value={sellPrice} onChange={(v) => setSellPrice(v.target.value)}/>
                      <InputNumber min={1} addonBefore="Amount" addonAfter={symbolCurent.symbol}  value={sellAmount} onChange={(v) => setSellAmount(Math.floor(v))} />
                      <Slider defaultValue={0} marks={{0:'0%', 25: '25%', 50: '50%', 75: '75%', 100: '100%'}} onChange={(v) => setSellAmount(Math.floor(balanceSymbol.length*v/100)) }/>
                      <Input addonBefore="Total"  addonAfter={pairSymbol} value={sellPrice && sellAmount ? new Intl.NumberFormat().format(sellPrice*sellAmount) : ''} disabled/>
                      <Button style={{ width: "100%" }} onClick={login} type="primary" danger>Sell {symbolCurent.name}</Button>
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
