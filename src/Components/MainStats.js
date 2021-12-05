import CustomStats from "./CustomStats"

const MainStats = ({APY,fiveDayROI,balances,dailyReward,epochReward,tokens}) => {
    return (
        <div className="card cardInner" >
            <div style={{display:"flex"}}>
                <div style={{width:"89%"}}>
                    <div className="text" >
                        <h2>Current Balance:</h2> 
                        <h2 style={{color: "#23AA31"}}>&nbsp;{balances[0]}</h2>
                    </div>
                    <div className="text" >           
                        <h2>Current APY:</h2>
                        <h2 style={{color: "#4DB069"}}>&nbsp;{APY}%</h2>
                    </div> 
                    <div className="text" >           
                        <h2>5 Day ROI:</h2>
                        <h2 style={{color: "#4DB09F"}}>&nbsp;{fiveDayROI}%</h2>
                    </div>
                </div>
                <div style={{width:"11%"}} className="right">
                    <h5 className={`${tokens[0] && "white"}`}>sKlima {tokens[0]}</h5>
                    <h5 className={`${tokens[1] && "white"}`}>wKlima</h5>
                </div>
            </div> 
            <div className="card2" >
                <div style={{width: "34%"}}>
                    <h3><u>Duration</u></h3>
                    <h4>🌳 1 Week</h4>
                    <h4>🌳 2 Weeks</h4>
                    <h4>🌳 1 Month</h4>
                    <h4>🌳 6 Months</h4>
                    <h4 style={{marginBottom: "20px"}}>🌳 1 Year</h4>
                </div>
                <div style={{width: "30%"}}>
                    <h3><u>Balance</u></h3>
                    <h4>{balances[1]}</h4>
                    <h4>{balances[2]}</h4>
                    <h4>{balances[3]}</h4>
                    <h4>{balances[4]}</h4>
                    <h4>{balances[5]}</h4>
                </div>
                <div style={{width: "36%"}}>
                    <h3><u>Daily Reward</u></h3>
                    <h4>{dailyReward[0]}</h4>
                    <h4>{dailyReward[1]}</h4>
                    <h4>{dailyReward[2]}</h4>
                    <h4>{dailyReward[3]}</h4>
                    <h4>{dailyReward[4]}</h4>
                </div>
            </div>
            <CustomStats APY={APY} balances={balances} epochReward={epochReward}/>
        </div>
    )
}

export default MainStats