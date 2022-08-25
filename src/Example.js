import logo from './logo.svg';
import React, { Component }  from 'react';
import './App.css';
import * as waxjs from "@waxio/waxjs/dist";
import { useEffect, useState } from 'react';
import { sha256, sha224 } from 'js-sha256';
import { Button } from 'antd';

function App() {
  var wax;
  const [userAccount, setUserAccount] = useState('')
  const [waxAcc, setWaxAcc] = useState('')
  useEffect(() => {
    //wax = new waxjs.WaxJS('https://wax.greymass.com', null, null, false);
    wax = new waxjs.WaxJS({
      rpcEndpoint: 'https://wax.greymass.com'
    });
    setWaxAcc(wax);
    checkAutoLoginAndLogin();
    console.log('started wax:', wax);
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

  async function checkAutoLoginAndLogin(){
    var isAutoLoginAwailable = await wax.isAutoLoginAvailable();
    console.log("Auto login", isAutoLoginAwailable);
    login();
  }
  async function login(){
    console.log('Logging in');
   
    try {
      const userAccount = await wax.login();
      const actions = [
        {
          account: "m.federation",
          name: "mine",
          authorization: [
            {
              actor: userAccount,
              permission: "active",
            },
          ],
          data: {
            miner: userAccount,
            nonce: 'f4a7636591f9c29b'
          }
        },
      ];
      await wax.api
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
           console.log(result);
        })
      setUserAccount(userAccount);
      const pubKeys = wax.pubKeys;
      console.log('User logged as:',userAccount, pubKeys);
    } catch (error){
      console.error('User fail to login.', error);
    }
  }
  async function setAcc(){
    console.log('Logging in');
   
    try {
      const actions = [
        {
          account: "federation",
          name: "agreeterms",
          authorization: [
            {
              actor: userAccount,
              permission: "active",
            },
          ],
          data: {
            account: userAccount,
            terms_id: 1,
            terms_hash: 'e2e07b7d7ece0d5f95d0144b5886ff74272c9873d7dbbc79bc56f047098e43ad'
          },
        },
        {
          account: "federation",
          name: "settag",
          authorization: [
            {
              actor: userAccount,
              permission: "active",
            },
          ],
          data: {
            account: userAccount,
            tag: 'cleancodevn'
          },
        },
      ];
      await waxAcc.api
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
          console.log(result)
        })
    } catch (error){
      console.error('User fail to login.', error);
    }
  }
  return (
    <div className="App">
        <div className="App-header">
          {userAccount}
          <button onClick={login}>Login</button>
          <button onClick={setAcc}>Set term</button>
        </div>
    </div>
  );
}

export default App;
