import CustomStats from "./CustomStats"

const MainStats = () => {
    return (
        <div className="card cardInner">
            <div className="text" >
                <h2>Current Balance:</h2> 
                <h2 style={{color: "#23AA31"}}>&nbsp;390</h2>
            </div>
            <div className="text" >           
                <h2>Current APY:</h2>
                <h2 style={{color: "#4DB069"}}>&nbsp;39800%</h2>
            </div> 
            <div className="text" >           
                <h2>5 Day ROI:</h2>
                <h2 style={{color: "#4DB09F"}}>&nbsp;3.9%</h2>
            </div> 
            <div className="card2" >
                <div style={{width: "35%"}}>
                    <h3><u>Duration</u></h3>
                    <h4>🌳 1 Week</h4>
                    <h4>🌳 2 Weeks</h4>
                    <h4>🌳 1 Month</h4>
                    <h4>🌳 6 Months</h4>
                    <h4 style={{marginBottom: "20px"}}>🌳 1 Year</h4>
                </div>
                <div style={{width: "30%"}}>
                    <h3><u>Balance</u></h3>
                    <h4>20</h4>
                    <h4>22</h4>
                    <h4>25</h4>
                    <h4>45</h4>
                    <h4>120</h4>
                </div>
                <div style={{width: "33%"}}>
                    <h3><u>Daily Reward</u></h3>
                    <h4>0.5</h4>
                    <h4>0.7</h4>
                    <h4>0.9</h4>
                    <h4>1.3</h4>
                    <h4>3</h4>
                </div>
            </div>
            <CustomStats />
        </div>
    )
}

export default MainStats