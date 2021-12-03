import SearchBar from './Components/SearchBar';
import MainStats from './Components/MainStats';
import RebaseAleart from './Components/RebaseAleart';
import Footer from './Components/Footer';
import ConnectWallet from './Components/ConnectWallet';
import Web3 from 'web3'
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
  const web3 = new Web3(window.ethereum);
  const stakingABI = require("./ABI/KlimaStaking.json")
  const sKlimaABI = require("./ABI/sKlima.json")
  const stakingAddress = "0x25d28a24ceb6f81015bb0b2007d795acac411b4d"
  const sKlima = "0xb0C22d8D350C67420f06F48936654f567C73E8C8"
  
  
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
    const sKlimaContract = new web3.eth.Contract(sKlimaABI, sKlima);
    const stakingContract = new web3.eth.Contract(stakingABI, stakingAddress)

    //Staking Stats
    const epoch = await stakingContract.methods.epoch().call()
    const stakingReward = epoch.distribute;
    const excess = await sKlimaContract.methods.balanceOf(stakingAddress).call()
    const totalSupply = await sKlimaContract.methods.totalSupply().call()
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
    const sKlimaContract = new web3.eth.Contract(sKlimaABI, sKlima);
    const baseBalance = await sKlimaContract.methods.balanceOf(tempAddress).call({from:address}) / (Math.pow(10, 9))
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
    const currentBlock = await web3.eth.getBlockNumber()
    const stakingContract = new web3.eth.Contract(stakingABI, stakingAddress);
    const epoch = await stakingContract.methods.epoch().call();
    const rebaseBlock = epoch.endBlock
    console.log(rebaseBlock,currentBlock)
    const seconds = helpers.secondsUntilBlock(currentBlock, rebaseBlock)
    setRebaseTime(helpers.prettifySeconds(seconds))
  }

  const getENSAddress = async () => {
    //const web3 = await getWeb3ForNetwork('1')
    //var fetchedAddress = web3.ens.getAddress('alice.eth');
    //console.log(fetchedAddress)

  }
  const connectWalletManual = async (address) => {
    try {
      const sKlimaContract = new web3.eth.Contract(sKlimaABI, sKlima);
      const baseBalance = await sKlimaContract.methods.balanceOf(address).call({from:address}) / (Math.pow(10, 9))
      console.log(baseBalance)
      getAPY(address)
      setShowConnectedAcc(false)
      setAddress(address)
      } catch (error) {
        alert("Invalid address or 0 staked Klima")
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
      <MainStats APY={fetchedStakingAPY} fiveDayROI={fiveDayROI} balances={balances} dailyReward={dailyReward} epochReward={epochReward}/>
      <RebaseAleart time={rebaseTime}/>
      <Footer /> 
    </div>
  );
}

export default App;

