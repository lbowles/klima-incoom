import SearchBar from './Components/SearchBar';
import MainStats from './Components/MainStats';
import RebaseAleart from './Components/RebaseAleart';
import Footer from './Components/Footer';
import ConnectWallet from './Components/ConnectWallet';
import Web3 from 'web3'
import { useState } from "react"
import './App.css';


function App() {
  const onChange = () => {
  }
  const [showConnectedAcc, setShowConnectedAcc ] = useState(false)
  const [address, setAddress]= useState("")
  const [fetchedStakingAPY, setFetchedStakingAPY]= useState("")
  const [fiveDayROI, setfiveDayROI]= useState("")

  const web3 = new Web3(window.ethereum);
  const stakingABI = require("./ABI/KlimaStaking.json")
  const sklimaABI = require("./ABI/sKlima.json")
  const stakingAddress = "0x25d28a24ceb6f81015bb0b2007d795acac411b4d"
  const sKlima = "0xb0C22d8D350C67420f06F48936654f567C73E8C8"

  const connectWallet = async () => {
    if (window.ethereum) { //check if Metamask is installed
          try {
            
              const connectedAddress = await window.ethereum.enable(); //connect Metamask
              setAddress(connectedAddress[0])
              const obj = {
                      connectedStatus: true,
                      status: "",
                      address: connectedAddress
                  }
                 // window.localStorage.setItem("userAddress",connectedAddress[0])
                  setShowConnectedAcc(true)
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

  const getAPY = async () => {
    const sKlimaContract = new web3.eth.Contract(sklimaABI, sKlima);
    const stakingContract = new web3.eth.Contract(stakingABI, stakingAddress)

    const epoch = await stakingContract.methods.epoch().call()
    const stakingReward = epoch.distribute;

    const excess = await sKlimaContract.methods.balanceOf(stakingAddress).call()
    const totalSupply = await sKlimaContract.methods.totalSupply().call()
    const circulation = totalSupply - excess
    

    const stakingRebase = stakingReward / circulation;
    const fiveDayROI = Math.pow(1 + stakingRebase, 5 * 3) - 1;
    const stakingAPY = Math.pow(1 + stakingRebase, 365 * 3) - 1;
    
    setFetchedStakingAPY((stakingAPY*100).toFixed(0))
  }

  let connectBtn 
  if (showConnectedAcc) {
    connectBtn = ""
  } else {
    connectBtn = <ConnectWallet clicked={connectWallet}/>
  }

  return (
    <div className="App">
      <h1>Klima Incoom </h1>
      {connectBtn}
      <SearchBar connectedWallet={address} onChange={onChange} showConnectedMeta={showConnectedAcc} />
      <MainStats APY={fetchedStakingAPY}/>
      <RebaseAleart />
      <Footer /> 
      <button onClick={getAPY}>fetchIt</button>
    </div>
  );
}

export default App;

