import SearchBar from './Components/SearchBar';
import MainStats from './Components/MainStats';
import RebaseAleart from './Components/RebaseAleart';
import Footer from './Components/Footer';

import './App.css';


function App() {
  const onChange = () => {
    
  }
  return (
    <div className="App">
      <h1>Klima Incoom</h1>
      <SearchBar onChange={onChange} />
      <MainStats />
      <RebaseAleart />
      <Footer />
    </div>
    
  );
}

export default App;
