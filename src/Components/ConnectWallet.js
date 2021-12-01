import './ConnectWallet.css'

const ConnectWallet = ({clicked,btnText}) => {
    return (
        <div>
            <button className="metamaskBtn" onClick={() => clicked()} ><h2>Connect Wallet</h2>
            </button>
        </div>
    )
}



export default ConnectWallet
