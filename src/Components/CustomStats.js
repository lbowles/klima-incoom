import './CustomStats.css';
import { useState } from "react"

const CustomStats = ({balances,APY,epochReward}) => {
    const [inputBalance,setInputBalance] = useState([])

    const customStakingStats = (e) => {
        const rebasePerEpoch = Math.log(APY/100)/(3*365) 
        console.log(epochReward)  
        const predBalance = (balances[0] * Math.pow(1+rebasePerEpoch, (e.target.value)*3)).toFixed(2)                                                                  //Make it on the new predicited value
        let arrResults = [predBalance, ((predBalance*epochReward)*3).toFixed(2)]
        setInputBalance(arrResults)
      }

    return (
        <div className="customStats">
            <input placeholder="5"  type="number" className="input2" onChange={customStakingStats}/>
            <h4 style={{marginTop: "8px"}}>Days  = {inputBalance[0]} Klima ({inputBalance[1]} Klima per day)</h4>
        </div>
    )
}

export default CustomStats

