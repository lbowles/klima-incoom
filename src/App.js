import SearchBar from './Components/SearchBar';
import MainStats from './Components/MainStats';
import RebaseAleart from './Components/RebaseAleart';
import Footer from './Components/Footer';
import ConnectWallet from './Components/ConnectWallet';
import Web3 from 'web3'
import './App.css';


function App() {
  const onChange = () => {
  }

  async function logInWithEth() {
    if (window.ethereum) {
    } else {
      alert("No ETH browser extention detected")
    }
  }
  return (
    <div className="App">
      
      <h1>Klima Incoom </h1>
      <ConnectWallet />
      <SearchBar onChange={onChange} />
      <MainStats />
      <RebaseAleart />
      <Footer />
      
    </div>
    
  );
}

export default App;
