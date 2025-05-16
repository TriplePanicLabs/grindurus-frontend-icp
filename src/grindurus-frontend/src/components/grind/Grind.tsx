import { useEffect, useState } from 'react'
import refreshIcon from '@/assets/icons/refresh.svg'

import styles from './Grind.module.scss'
import { useProtocolContext } from '@/context/ProtocolContext'
import { BigNumberish } from 'ethers'

function Grind() {
  const { grinderAI, agentsNFT } = useProtocolContext()

  const [poolId, setPoolId] = useState<bigint | null>(null)
  const [refresh, setRefresh] = useState<boolean>(true)
  const [buttonActive, setButtonActive] = useState<boolean>(false)
  const [quoteTokenProfits, setQuoteTokenProfits] = useState<string>('0.0')
  const [baseTokenProfits, setBaseTokenProfits] = useState<string>('0.0')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    generatePoolId()
  }, [refresh])

  const generatePoolId = async () => {
    try {
      const totalAgents = await agentsNFT?.totalAgents()
      const agentId = Math.floor(Math.random() * Number(totalAgents)) + 1
      
      const scope = 2
      let agentIds = []
      for (let i = agentId - scope; i <= agentId + scope; i++) {
        if (i > 0 && i < Number(totalAgents)) {
          agentIds.push(i)
        }
      }
      const intents = await agentsNFT?.getIntents(agentIds) ?? []
      const randomIntentId = Math.floor(Math.random() * intents.length)
      const intent = intents[randomIntentId]

      const poolIds = intent.poolIds
      const randomPoolIdIndex = Math.floor(Math.random() * poolIds.length)
      const _poolId = poolIds[randomPoolIdIndex]
      
      setPoolId(_poolId);
    } catch (error) {
      console.error('Error generating pool ID:', error)
      setPoolId(null)
    }
  }

  const fetchPnL = async () => {
    try {
      const pnl = await grinderAI?.getEstimatedPnL(poolId as BigNumberish);
      
    } catch {
      console.log('Error fetch pnl');
    }
  }

  useEffect(() => {
    const disableButton = async () => {
      setTimeout(() => {
        setButtonActive(false)
      }, 300)
    }

    disableButton()
  }, [buttonActive])

  useEffect(() => {
    fetchPnL()
  }, [poolId])

  const handleGrind = async () => {
    setButtonActive(true)
    if(!poolId) {
      console.log("da")
      return
    }
    let grindTx= await grinderAI?.grind(poolId);
    grindTx?.wait()

  }

  return (
    <section className={styles['grind-section']}>
      <div className={`${styles['container']} container`}>
        <div className={`${styles['grind-form']}`}>
          <button onClick={() => handleGrind()} className={styles['grind']}>
            <div
              className={`${styles['grind-button']} ${buttonActive ? styles['active'] : ''} button`}
            >
              $ GRIND $
            </div>
            <div className={styles['background']}></div>
          </button>
          <div className={`${styles['content']}`}>
            <div className={styles['grinder-ai']}>
              <div>GrinderAI choose pool id: {poolId !== null ? poolId.toString() : '...'}</div>
              <button onClick={() => setRefresh(!refresh)}>
                <img src={refreshIcon} alt="Refresh Icon" />
              </button>
            </div>
            <div className={styles['tokens-infos']}>
              <div className={styles['token-info']}>+ 1 grAI ($0.01)</div>
              <div className={styles['token-info']}>+ 0.05 USDT ($0.05)</div>
              <div className={styles['token-info']}>+ 0.00001 ETH ($0.01)</div>
            </div>
            <button
              onClick={ () => handleGrind() } 
              className={`${styles['button']} button`}>Grind</button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Grind
