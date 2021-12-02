import { useState } from "react"
import { FaSearch } from "react-icons/fa"
import PropTypes from "prop-types"

import './SearchBar.css'

const SearchBar = ({onChange, connectedWallet, showConnectedMeta}) => {
    const [showSearch, setShowSearch]= useState(false)
    const [inputText, setInputText]= useState("")
      
    const checkShowSearch = (e) => {
        onChange()
        setInputText(e.target.value)
        if (inputText.length>3){
            setShowSearch(true)
        } else {
            setShowSearch(false) 
        }
    }

    let showWalletComp;
    if(showConnectedMeta) {
        showWalletComp = <div className="card showConnectedWallet" style={{height: "40px"}} >
            {connectedWallet}
        </div>
        
    } else {
        showWalletComp = <div className={`card ${showSearch ? "cardSearch" : ""}`} style={{height: "40px"}} ><input placeholder="30xb12......." onChange={checkShowSearch} value={inputText}/>{showSearch && <button className="searchCard"><FaSearch /></button>}</div>
    }

    return ( 
        <div>
            {showWalletComp}
        </div>   
    )
}

SearchBar.propTypes = {
    connectedWallet: PropTypes.string,
    onChange: PropTypes.func,
}

export default SearchBar
