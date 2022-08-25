import logo from './logo.svg';
import React, { useEffect,useLayoutEffect, useState, Component } from 'react';
import './App.css';
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



function App() {
  var wax;
  
  const { Title } = Typography;
  const { Header, Content, Footer } = Layout;
  const [size, setSize] = useState([0, 0]);
  const [userAccount, setUserAccount] = useState('')
  const [waxAcc, setWaxAcc] = useState('');
  const [balance, setBalance] = useState('');
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

  

  const [sysbolCurent, setSysbolCurent] = useState(null);
  
  const [dataSysbol, setDataSysbol] = useState([
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
      console.log(dataChart)
      console.log(data)
    })
    
  },[]);
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
    login();
  }
  async function login(){
    console.log('Logging in');
   
    try {
      const userAccount = await wax.login();
      // const actions = [
      //   {
      //     account: "m.federation",
      //     name: "mine",
      //     authorization: [
      //       {
      //         actor: userAccount,
      //         permission: "active",
      //       },
      //     ],
      //     data: {
      //       miner: userAccount,
      //       nonce: 'f4a7636591f9c29b'
      //     }
      //   },
      // ];
      // await wax.api
      //   .transact(
      //     {
      //       actions,
      //     },
      //     {
      //       blocksBehind: 3,
      //       expireSeconds: 90,
      //     }
      //   )
      //   .then((result) => {
      //      console.log(result);
      //   })
      setUserAccount(userAccount);
      const pubKeys = wax.pubKeys;
      console.log('User logged as:',userAccount, pubKeys);
    } catch (error){
      console.error('User fail to login.', error);
    }
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
                    <Menu.Item style={{display: 'table'}} key={item.symbol} icon={<Icon component={() => (<img className="ant-menu-item" src={item.image} />)} />}>
                          <span style={{display: 'table-cell', verticalAlign: 'top'}}>
                            {item.name}/Tlm
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
                  <Menu.Item style={{display: 'table'}} key={item.symbol} icon={<Icon component={() => (<img className="ant-menu-item" src={item.image} />)} />}>
                        <span style={{display: 'table-cell', verticalAlign: 'top'}}>
                          {item.name}/Wax
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
                    <Button onClick={login}>Login</Button>
                  </Menu.Item>
                )
          }
        </Menu>
        
      </Header>
      <Content style={{ padding: '0 50px' }}>
          <Row>
            <Col xs={{span: 24}}>
              <Row justify="start">
                <Col xs={{span: 3, offset: 1}}>
                  IMG
                </Col>
                <Col xs={{span: 3, offset: 1}}>
                  Drill / Wax
                </Col>
                <Col xs={{span: 3, offset: 1}}>
                  Vol: 100
                </Col>
                <Col xs={{span: 3, offset: 1}}>
                  Low: 48
                </Col>
                <Col xs={{span: 3, offset: 1}}>
                  Height: 54
                </Col>
              </Row>
            </Col>
            <br/>
          </Row>
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
              <Table dataSource={dataSysbol} columns={columnsSymbol} pagination={false}  scroll={{ y: 500 }} size="small"/>
            </Col>
          </Row>
          <Row justify="start">
            <Col xs={{span: 11, offset: 0}}>
                <Title level={5}>Open orders</Title>
                <Table dataSource={openOrder} columns={columnsOpenOrder} pagination={false}  scroll={{ y: 500 }}/>
                <br/>
                <Title level={5}>Trade history</Title>
                <Table dataSource={tradeHistory} columns={columnsTradeHistory} pagination={false}  scroll={{ y: 500 }}/>
              
            </Col>
            <Col xs={{span: 13}}>
              <Row justify="start">
                  <Col xs={{span: 11, offset: 1}}>
                  
                    <Input.Group size="large"></Input.Group>
                    <Space direction="vertical">
                      <Title level={5}>Buy</Title>
                        <Typography.Text className="ant-form-text" type="secondary">
                          Balance: 5,000 Wax
                        </Typography.Text>
                        <Input addonBefore="Price"  addonAfter="Wax" defaultValue="" value={buyPrice} onChange={(v) => setBuyPrice(v.target.value)}/>
                        <InputNumber min={1} max={100} addonBefore="Amount" addonAfter="Drill"   value={buyAmount} onChange={(v) => setBuyAmount(Math.floor(v))}/>
                        
                        <Slider defaultValue={0} marks={{0:'0%', 25: '25%', 50: '50%', 75: '75%', 100: '100%'}} onChange={(v)=> console.log(v)}/>
                        <Input addonBefore="Total"  addonAfter="Wax" defaultValue="" value={sellPrice && buyAmount ? buyPrice*buyAmount : ''}/>

                        <Button style={{ width: "100%" }} onClick={login} type="primary" success>Buy Drill</Button>
                      
                      
                    </Space>
                  </Col>
                  <Col xs={{span: 12,offset: 0}}>
                    <Space direction="vertical">
                      <Title level={5}>Sell</Title>
                      <Typography.Text className="ant-form-text" type="secondary">
                          Balance: 15 Drill
                      </Typography.Text>
                      <Input addonBefore="Price"  addonAfter="WAX" defaultValue="" value={sellPrice} onChange={(v) => setSellPrice(v.target.value)}/>
                      <InputNumber min={1} max={100} addonBefore="Amount" addonAfter="Drill"  value={sellAmount} onChange={(v) => setSellAmount(Math.floor(v))} />
                      <Slider defaultValue={0} marks={{0:'0%', 25: '25%', 50: '50%', 75: '75%', 100: '100%'}} />
                      <Input addonBefore="Total"  addonAfter="Wax" value={sellPrice && sellAmount ? sellPrice*sellAmount : ''} />
                      <Button style={{ width: "100%" }} onClick={login} type="primary" danger>Sell Drill</Button>
                    </Space>
                  </Col>
              </Row>
            </Col>
          </Row>
      </Content>   
      <Footer style={{ textAlign: 'center' }}> ©2022 Created by Cleancodevietnam</Footer>
    </Layout>
  );
}

export default App;
