import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { Checkbox } from '@/components/ui';
import refreshIcon from '@/assets/icons/refresh.svg'

import styles from './Grind.module.scss'
import { useProtocolContext } from '@/context/ProtocolContext'
import { BigNumberish } from 'ethers'

import { IPoolsNFT, IPoolsNFTLens } from "@/typechain-types/PoolsNFT"
import { IGrinderAI } from '@/typechain-types/GrinderAI' 

function Grind() {
  const { poolsNFT, grinderAI, agentsNFT } = useProtocolContext()

  const [poolId, setPoolId] = useState<bigint | null>(null)
  const [poolInfo, setPoolInfo] = useState<IPoolsNFTLens.PoolInfoStruct | null>(null)
  const [refresh, setRefresh] = useState<boolean>(true)
  const [buttonActive, setButtonActive] = useState<boolean>(false)
  const [extendedMode, setExtendedMode] = useState<boolean>(false)
  const [poolOwnerShare, setPoolOwnerShare] = useState<IGrinderAI.PnLSharesStruct | null>(null)
  const [poolBuyerShare, setPoolBuyerShare] = useState<IGrinderAI.PnLSharesStruct | null>(null)
  const [reserveShare, setReserveShare] = useState<IGrinderAI.PnLSharesStruct | null>(null)
  const [grinderShare, setGrinderShare] = useState<IGrinderAI.PnLSharesStruct | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    generatePoolId()
  }, [refresh])

  useEffect(() => {
    fetchPnLShares()
    fetchPoolInfo()
  }, [poolId])

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

  const fetchPnLShares = async () => {
    try {
      const shares: IGrinderAI.PnLSharesStruct[] = await grinderAI?.getPnLShares(poolId as BigNumberish) as IGrinderAI.PnLSharesStruct[]
      setPoolOwnerShare(shares[0])
      setPoolBuyerShare(shares[1])
      setReserveShare(shares[2])
      setGrinderShare(shares[3])
    } catch (error) {
      console.log("Error fetch pnl shares: ", error)
    }
  }

  const fetchPoolInfo = async () => {
    try {
      const _poolInfo: IPoolsNFTLens.PoolInfoStruct[] = await poolsNFT?.getPoolInfosBy([poolId as BigNumberish]) as IPoolsNFTLens.PoolInfoStruct[]
      setPoolInfo(_poolInfo[0])
    } catch (error) {
      console.log("Error fetch pool info: ", error)
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
              <div>GrinderAI generated pool id: {poolId !== null ? poolId.toString() : '...'}</div>
              <button onClick={() => setRefresh(!refresh)}>
                <img src={refreshIcon} alt="Refresh Icon" />
              </button>
            </div>
            <div className={styles['grinder-share']}>Grinder receive:</div>
            <div className={styles['tokens-infos']}>
              <div className={styles['token-info']}>+ {grinderShare !== null ? ethers.parseUnits(grinderShare.grethAmount.toString(), 18).toString() : '...'} grETH ($0.01)</div>
              <div className={styles['token-info']}>+ {grinderShare !== null ? ethers.parseUnits(grinderShare.graiAmount.toString(), 18).toString() : '...'} grAI ($0.01)</div>
              <div className={styles['token-info']}>+ {grinderShare !== null ? ethers.parseUnits(grinderShare.baseTokenAmount.toString(), poolInfo?.baseTokenDecimals).toString() : '...'} {poolInfo?.baseTokenSymbol} ($0.01)</div>
              <div className={styles['token-info']}>+ {grinderShare !== null ? ethers.parseUnits(grinderShare.quoteTokenAmount.toString(), poolInfo?.quoteTokenDecimals).toString() : '...'} {poolInfo?.quoteTokenSymbol} ($0.01)</div>
            </div>
            <button
              onClick={ () => handleGrind() } 
              className={`${styles['button']} button`}>
              Grind
            </button>
            <div style={{ marginTop: '12px' }}>
              <Checkbox
              defaultChecked={false}
              onChange={(e) => { 
                console.log(e)
                setExtendedMode(e)
              }}
              >
              See another receivers share
              </Checkbox>
            </div>
            {extendedMode && (
              <>
              <div className={styles['pool-owner-share']}>Pool Owner receive:</div>
              <div className={styles['tokens-infos']}>
                <div className={styles['token-info']}>+ {poolOwnerShare !== null ? ethers.parseUnits(poolOwnerShare.grethAmount.toString(), 18).toString() : '...'} grETH ($0.01)</div>
                <div className={styles['token-info']}>+ {poolOwnerShare !== null ? ethers.parseUnits(poolOwnerShare.graiAmount.toString(), 18).toString() : '...'} grAI ($0.01)</div>
                <div className={styles['token-info']}>+ {poolOwnerShare !== null ? ethers.parseUnits(poolOwnerShare.baseTokenAmount.toString(), poolInfo?.baseTokenDecimals).toString() : '...'} {poolInfo?.baseTokenSymbol} ($0.01)</div>
                <div className={styles['token-info']}>+ {poolOwnerShare !== null ? ethers.parseUnits(poolOwnerShare.quoteTokenAmount.toString(), poolInfo?.quoteTokenDecimals).toString() : '...'} {poolInfo?.quoteTokenSymbol} ($0.01)</div>
              </div>
              <div className={styles['pool-owner-share']}>Pool Buyer receive:</div>
              <div className={styles['tokens-infos']}>
                <div className={styles['token-info']}>+ {poolBuyerShare !== null ? ethers.parseUnits(poolBuyerShare.grethAmount.toString(), 18).toString() : '...'} grETH ($0.01)</div>
                <div className={styles['token-info']}>+ {poolBuyerShare !== null ? ethers.parseUnits(poolBuyerShare.graiAmount.toString(), 18).toString() : '...'} grAI ($0.01)</div>
                <div className={styles['token-info']}>+ {poolBuyerShare !== null ? ethers.parseUnits(poolBuyerShare.baseTokenAmount.toString(), poolInfo?.baseTokenDecimals).toString() : '...'} {poolInfo?.baseTokenSymbol} ($0.01)</div>
                <div className={styles['token-info']}>+ {poolBuyerShare !== null ? ethers.parseUnits(poolBuyerShare.quoteTokenAmount.toString(), poolInfo?.quoteTokenDecimals).toString() : '...'} {poolInfo?.quoteTokenSymbol} ($0.01)</div>
              </div>
              <div className={styles['pool-owner-share']}>Reserve receive:</div>
              <div className={styles['tokens-infos']}>
                <div className={styles['token-info']}>+ {reserveShare !== null ? ethers.parseUnits(reserveShare.grethAmount.toString(), 18).toString() : '...'} grETH ($0.01)</div>
                <div className={styles['token-info']}>+ {reserveShare !== null ? ethers.parseUnits(reserveShare.graiAmount.toString(), 18).toString() : '...'} grAI ($0.01)</div>
                <div className={styles['token-info']}>+ {reserveShare !== null ? ethers.parseUnits(reserveShare.baseTokenAmount.toString(), poolInfo?.baseTokenDecimals).toString() : '...'} {poolInfo?.baseTokenSymbol} ($0.01)</div>
                <div className={styles['token-info']}>+ {reserveShare !== null ? ethers.parseUnits(reserveShare.quoteTokenAmount.toString(), poolInfo?.quoteTokenDecimals).toString() : '...'} {poolInfo?.quoteTokenSymbol} ($0.01)</div>
              </div>
              </>
            )}

          </div>
        </div>
      </div>
    </section>
  )
}

export default Grind
