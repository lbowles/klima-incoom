import SearchBar from './Components/SearchBar';
import MainStats from './Components/MainStats';
import RebaseAleart from './Components/RebaseAleart';
import Footer from './Components/Footer';
import ConnectWallet from './Components/ConnectWallet';
import { ethers } from 'ethers';
import { useState } from "react"
import './App.css';
import helpers from './helpers'


function App() {
  const [showConnectedAcc, setShowConnectedAcc ] = useState(false)
  const [metamaskInstalled, setMetamaskInstalled] = useState(false)
  const [address, setAddress]= useState("")
  const [fetchedStakingAPY, setFetchedStakingAPY]= useState("")
  const [fiveDayROI, setFiveDayROI]= useState("")
  const [balances, setBalances]= useState([])
  const [epochReward,setEpochReward] = useState("")
  const [rebaseTime,setRebaseTime] = useState("")
  const [dailyReward, setDailyReward]= useState([])
  const [tokens, setTokens]= useState([])
  const provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com")
  const stakingABI = require("./ABI/KlimaStaking.json")
  const sKlimaABI = require("./ABI/sKlima.json")
  const wsKlimaABI = require("./ABI/wsKlima.json")
  const stakingAddress = "0x25d28a24ceb6f81015bb0b2007d795acac411b4d"
  const sKlima = "0xb0C22d8D350C67420f06F48936654f567C73E8C8"
  const wsKlima = "0x6f370dba99E32A3cAD959b341120DB3C9E280bA6"
  const fsKlima = "0x535e3F59Afb1De1a5694D5840224F964d53f7688"
  
  
  window.onload = () => {
    if (window.ethereum) {
      setMetamaskInstalled(true)
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) { //check if Metamask is installed
          try {
              const connectedAddress = await window.ethereum.enable(); //connect Metamask
              await setAddress(connectedAddress[0])
              getAPY(connectedAddress[0])
              const obj = {
                      connectedStatus: true,
                      status: "",
                      address: connectedAddress
                  }
                 // window.localStorage.setItem("userAddress",connectedAddress[0])
                  setShowConnectedAcc(true)
                  window.ethereum.on("accountsChanged", accounts => {
                    if (accounts.length > 0) {
                      console.log("Metamask Connected")
                    } 
                    else {
                      console.log("Metamask Disconnected")
                      setShowConnectedAcc(false)
                      setAddress("");
                    }
                });
                  return obj;
          } catch (error) {
              console.log("account disconnected")
              return {
                  connectedStatus: false,
                  status: "🦊 Connect to Metamask"
              }
          }
    } else {
          return {
              connectedStatus: false,
              status: "🦊 You must install Metamask into your browser: https://metamask.io/download.html"
          }
        }
     
  };

  const getAPY = async (tempAddress) => {
    const sKlimaContract = new ethers.Contract(sKlima,sKlimaABI, provider);
    const stakingContract = new ethers.Contract(stakingAddress, stakingABI, provider)

    //Staking Stats
    const epoch = await stakingContract.epoch()
    const stakingReward = epoch.distribute;
    const excess = await sKlimaContract.balanceOf(stakingAddress)
    const totalSupply = await sKlimaContract.totalSupply()
    const circulation = totalSupply - excess
    const stakingRebase = stakingReward / circulation;
    const fiveDayROI = ((Math.pow(1 + stakingRebase, 5 * 3) - 1)*100).toFixed(2);
    const stakingAPY = await ((Math.pow(1 + stakingRebase, 365 * 3) - 1)*100).toFixed(0);
    
    setEpochReward(stakingRebase)
    setFetchedStakingAPY(stakingAPY)
    setFiveDayROI(fiveDayROI)
    setAllBalances(stakingAPY,tempAddress,stakingRebase)
    timeNextRebase()
    return stakingAPY
  }

  const setAllBalances = async (APY,tempAddress,stakingRebase) => {
    const sKlimaContract = new ethers.Contract(sKlima, sKlimaABI, provider);
    const wsKlimaContract = new ethers.Contract(wsKlima, wsKlimaABI, provider)
    const fsKlimaContract = new ethers.Contract(fsKlima, wsKlimaABI, provider)
    var baseBalance = await sKlimaContract.balanceOf(tempAddress) / (Math.pow(10, 9))
    const wstemp = await wsKlimaContract.balanceOf(tempAddress) 
    const wBaseBalance = await wsKlimaContract.wKLIMATosKLIMA(wstemp) / (Math.pow(10, 9))
    console.log("ws base "+wBaseBalance)
    //const fstemp = await fsKlimaContract.balanceOf(tempAddress) 
    //const fsBaseBalance = await fsKlimaContract.fsKLIMA5TosKLIMA(fstemp) / (Math.pow(10, 9))
    baseBalance = baseBalance + wBaseBalance
    let tempTokens = []
    if (baseBalance > 0) {
      tempTokens[0] = true 
    }
    if (wBaseBalance > 0) {
      tempTokens[1] = true 
    }
    setTokens(tempTokens)

    let arrBalances = Array() ; 
      arrBalances[0] = baseBalance.toFixed(2)
      
      const arrDays = [0,7,14,30,180,365]
      for (var i = 1; i < arrDays.length ; i++) {
        arrBalances[i] = getBalanceAfterDays(baseBalance,arrDays[i], APY).toFixed(2)
      }
      setBalances(arrBalances);

      const arrDaily = Array();
      for (var i = 0; i < arrDays.length-1 ; i++) {
        arrDaily[i] = ((arrBalances[i+1]*stakingRebase)*3).toFixed(2)
      } 
      setDailyReward(arrDaily)
  }

  const getBalanceAfterDays = (balance, days, APY) => {
    const rebasePerEpoch = Math.log(APY/100)/(3*365) 
    return balance * Math.pow(1+rebasePerEpoch, days*3)
  }

  const timeNextRebase = async() => {
    const currentBlock = await provider.getBlockNumber()
    const stakingContract = new ethers.Contract(stakingAddress, stakingABI, provider);
    const epoch = await stakingContract.epoch() 
    const rebaseBlock = epoch.endBlock
    console.log(rebaseBlock,currentBlock)
    const seconds = helpers.secondsUntilBlock(currentBlock, rebaseBlock)
    setRebaseTime(helpers.prettifySeconds(seconds))
  }

  const connectWalletManual = async (address) => {
    const pEthMainNet = new ethers.getDefaultProvider()
    const resolver = await pEthMainNet.getResolver(address);
    var ensAddress = ""
    if (resolver) {
      ensAddress = await resolver.getAddress()
      console.log(ensAddress)
    }

    try {
      const sKlimaContract = new ethers.Contract( sKlima,sKlimaABI, provider);
      if (ensAddress) {
        const baseBalance = await sKlimaContract.balanceOf(ensAddress)
        getAPY(ensAddress)
        setAddress(ensAddress)
      } else {
        const baseBalance = await sKlimaContract.balanceOf(address)
        getAPY(address)
        setAddress(address)
      }
      setShowConnectedAcc(false)
      } catch (error) {
        alert("Invalid address")
      }
  }

  let connectBtn 
  if (showConnectedAcc || !metamaskInstalled) {
    connectBtn = ""
  } else {
    connectBtn = <ConnectWallet clicked={connectWallet} onClicked={getAPY}/>
  }

  return (
    <div className="App">
      <h1>Klima Incoom </h1>
      {connectBtn}
      <SearchBar connectedWallet={address} showConnectedMeta={showConnectedAcc} connectWalletManual={connectWalletManual}/>
      <MainStats APY={fetchedStakingAPY} fiveDayROI={fiveDayROI} balances={balances} dailyReward={dailyReward} epochReward={epochReward} tokens={tokens}/>
      <RebaseAleart time={rebaseTime}/>
      <Footer /> 
    </div>
  );
}

export default App;

