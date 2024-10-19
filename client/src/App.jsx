import { useEffect, useState } from "react"
import { createClient } from "urql";
import Wallet from "./components/Wallet/Wallet"
import Navigation from "./components/Navigation/Navigation"
import DisplayPannel from './components/Display Pannel/DisplayPannel'
import TokenApproval from './components/StakeToken/TokenApproval'
import StakeAmount from './components/StakeToken/StakeAmount'
import WithdrawStakeAmount from './components/Withdraw/Withdraw'
import { StakingProvider } from './context/StakingContext'
import './App.css'
function App() {

  const QueryURL = "https://gateway.thegraph.com/api/0eb5981fdbdf26a9129ebcc621ff1d27/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV"
  const query = `{
  factories(first: 5) {
    id
    poolCount
    txCount
    totalVolumeUSD
    }
 
  } `
  

  const [tokens, setTokens] = useState([]);

  const client = createClient({
    url: QueryURL
  })

  useEffect(() => {
    const getTokens = async() => {
      const {data} = await client.query(query).toPromise();
      console.log(data);
      setTokens(data.tokens);
    }
    getTokens();
  },[])


  const [displaySection, setDisplaySection] = useState("stake");

  const handleButtonClick = (section) => {
    setDisplaySection(section);
  };

  return (
    <div className="main-section">
      <Wallet>
        <Navigation />
        <StakingProvider>
          <DisplayPannel />
          <div className="main-content">
            <div className="button-section">
              <button
                onClick={() => handleButtonClick("stake")}
                className={displaySection === "stake" ? "" : "active"}
              >
                Stake
              </button>
              <button
                onClick={() => handleButtonClick("withdraw")}
                className={displaySection === "withdraw" ? "" : "active"}
              >
                Withdraw
              </button>
            </div>
            {displaySection === "stake" && (
              <div className="stake-wrapper">
                <TokenApproval />
                <StakeAmount />
              </div>
            )}
            {displaySection === "withdraw" && (
              <div className="stake-wrapper">
                <WithdrawStakeAmount />
              </div>
            )}
          </div>
        </StakingProvider>
      </Wallet>
    </div>
  )
}

export default App
