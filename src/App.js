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
  const connectWallet = async () => {
    if (window.ethereum) { //check if Metamask is installed
      console.log("meta did something")
          try {
              const connectedAddress = await window.ethereum.enable(); //connect Metamask
              setAddress(connectedAddress[0])
              const obj = {
                      connectedStatus: true,
                      status: "",
                      address: connectedAddress
                  }
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
      <MainStats />
      <RebaseAleart />
      <Footer /> 
    </div>
  );
}

export default App;
