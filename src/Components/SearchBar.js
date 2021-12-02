import { useState } from "react"
import { FaSearch } from "react-icons/fa"
import './SearchBar.css'

const SearchBar = ({ connectedWallet, showConnectedMeta,connectWalletManual}) => {
    const [showSearch, setShowSearch]= useState(false)
    const [inputText, setInputText]= useState("")
      
    const checkShowSearch = (e) => {
        setInputText(e.target.value)
        if (e.target.value.length>3){
            setShowSearch(true)
        } else {
            setShowSearch(false) 
        }
    }

    let showWalletComp;
    if(showConnectedMeta ) {
        showWalletComp = <div className="card showConnectedWallet" style={{height: "40px"}} >
            {connectedWallet}
        </div>
        
    } else {
        showWalletComp = <div className={`card ${showSearch ? "cardSearch" : ""}`} style={{height: "40px"}} >
            {showSearch ? <input placeholder="30xb12......." onChange={checkShowSearch}  value={inputText} className="inputSearch"/> : 
                <input placeholder="30xb12......." onChange={checkShowSearch} value={inputText}/>
            }
            {showSearch && <button className="searchCard" onClick={()=>connectWalletManual(inputText)}><FaSearch /></button>}
        </div>
    }

    return ( 
        <div>
            {showWalletComp}
        </div>   
    )
}


export default SearchBar
