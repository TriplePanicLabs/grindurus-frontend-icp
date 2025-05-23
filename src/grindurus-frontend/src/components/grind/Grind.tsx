import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { Checkbox } from '@/components/ui';
import refreshIcon from '@/assets/icons/refresh.svg'

import styles from './Grind.module.scss'
import { useProtocolContext } from '@/context/ProtocolContext'
import { BigNumberish } from 'ethers'

import { IPoolsNFT, IPoolsNFTLens } from "@/typechain-types/PoolsNFT"
import { IGrinderAI } from '@/typechain-types/GrinderAI' 

const ETH = '0x0000000000000000000000000000000000000000'

function Grind() {
  const { poolsNFT, grinderAI, agentsNFT, provider } = useProtocolContext()

  const [poolId, setPoolId] = useState<bigint | null>(null)
  const [calculating, setCalculating] = useState<boolean>(false)
  const [baseTokenSymbol, setBaseTokenSymbol] = useState<string>('')
  const [quoteTokenSymbol, setQuoteTokenSymbol] = useState<string>('')
  const [refresh, setRefresh] = useState<number>(1)
  const [buttonActive, setButtonActive] = useState<boolean>(false)
  const [optimizeGrind, setOptimizeGrind] = useState<boolean>(false)
  const [allShares, setAllShares] = useState<boolean>(false)
  const [poolOwnerShare, setPoolOwnerShare] = useState<IGrinderAI.PnLSharesStruct | null>(null)
  const [poolBuyerShare, setPoolBuyerShare] = useState<IGrinderAI.PnLSharesStruct | null>(null)
  const [reserveShare, setReserveShare] = useState<IGrinderAI.PnLSharesStruct | null>(null)
  const [grinderShare, setGrinderShare] = useState<IGrinderAI.PnLSharesStruct | null>(null)
  // const [grethPrice, setGRETHPrice] = useState<string>('0.0')
  // const [graiPrice, setGRAIPrice] = useState<string>('0.0')
  // const [baseTokenPrice, setBaseTokenPrice] = useState<string>('0.0')
  // const [quoteTokenPrice, setQuoteTokenPrice] = useState<string>('0.0')

  const [grinderGRETHShare, setGrinderGRETHShare] = useState<string>('...') 
  const [grinderGRAIShare, setGrinderGRAIShare] = useState<string>('...')
  const [grinderBaseTokenShare, setGrinderBaseTokenShare] = useState<string>('...')
  const [grinderQuoteTokenShare, setGrinderQuoteTokenShare] = useState<string>('...')
  const [grinderGRETHShareUSD, setGrinderGRETHShareUSD] = useState<number>(0.0) 
  const [grinderGRAIShareUSD, setGrinderGRAIShareUSD] = useState<number>(0.0)
  const [grinderBaseTokenShareUSD, setGrinderBaseTokenShareUSD] = useState<number>(0.0)
  const [grinderQuoteTokenShareUSD, setGrinderQuoteTokenShareUSD] = useState<number>(0.0)

  const [poolOwnerGRETHShare, setPoolOwnerGRETHShare] = useState<string>('...') 
  const [poolOwnerGRAIShare, setPoolOwnerGRAIShare] = useState<string>('...')
  const [poolOwnerBaseTokenShare, setPoolOwnerBaseTokenShare] = useState<string>('...')
  const [poolOwnerQuoteTokenShare, setPoolOwnerQuoteTokenShare] = useState<string>('...')

  const [poolBuyerGRETHShare, setPoolBuyerGRETHShare] = useState<string>('...') 
  const [poolBuyerGRAIShare, setPoolBuyerGRAIShare] = useState<string>('...')
  const [poolBuyerBaseTokenShare, setPoolBuyerBaseTokenShare] = useState<string>('...')
  const [poolBuyerQuoteTokenShare, setPoolBuyerQuoteTokenShare] = useState<string>('...')

  const [reserveGRETHShare, setReserveGRETHShare] = useState<string>('...') 
  const [reserveGRAIShare, setReserveGRAIShare] = useState<string>('...')
  const [reserveBaseTokenShare, setReserveBaseTokenShare] = useState<string>('...')
  const [reserveQuoteTokenShare, setReserveQuoteTokenShare] = useState<string>('...')

  const [grindCostETH, setGrindCostETH] = useState<string>('0.0')
  const [grindCostUSD, setGrindCostUSD] = useState<string>('0.0')
  const [grindProfitUSD, setGrindProfitUSD] = useState<string>('0.0')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    generatePoolId()
  }, [refresh])

  useEffect(() => {
    if (poolId) {
      fetchPoolInfoWithPnLShares()
    }
  }, [poolId])

  const handleRefresh = () => {
    setRefresh((prev) => prev + 1)
  }

  const getRandomInt = (max: number) => Math.floor(Math.random() * max);

  const generatePoolId = async () => {
    try {
      if (!agentsNFT) return
      const totalAgents = Number(await agentsNFT?.totalAgents())
      const pivotAgentId = getRandomInt(totalAgents)
      console.log("pivotAgentId: ", pivotAgentId)
      const scope = 2
      let agentIds = []
      for (let agentId = pivotAgentId - scope; agentId <= pivotAgentId + scope; agentId++) {
        if (agentId >= 0 && agentId < Number(totalAgents)) {
          agentIds.push(agentId)
        }
      }
      console.log("agentIds: ", agentIds)
      const intents = await agentsNFT?.getIntents(agentIds) ?? []
      const randomIntentId = getRandomInt(intents.length)
      console.log("randomIntentId: ", randomIntentId)
      const intent = intents[randomIntentId]

      const poolIds: bigint[] = intent.poolIds
      console.log("poolIds: ", poolIds)
      const randomPoolIdIndex = getRandomInt(poolIds.length)
      console.log("randomPoolIdIndex: ", randomPoolIdIndex)
      const _poolId = poolIds[randomPoolIdIndex]
      console.log("poolId: ", _poolId)
      setPoolId(() => _poolId);
    } catch (error) {
      console.error('Error generating pool ID:', error)
      setPoolId(null)
    }
  }

  const fetchPoolInfoWithPnLShares = async () => {
    try {
      if (!poolId) return
      setCalculating(true)
      const shares: IGrinderAI.PnLSharesStruct[] = await grinderAI?.getPnLShares(poolId as BigNumberish) as IGrinderAI.PnLSharesStruct[]
      const poolInfos: IPoolsNFTLens.PoolInfoStruct[] = await poolsNFT?.getPoolInfosBy([poolId as BigNumberish]) as IPoolsNFTLens.PoolInfoStruct[]
      const poolInfo = poolInfos[0]
      setBaseTokenSymbol(poolInfo.baseTokenSymbol)
      setQuoteTokenSymbol(poolInfo.quoteTokenSymbol)

      setPoolOwnerShare(shares[0])
      setPoolBuyerShare(shares[1])
      setReserveShare(shares[2])

      setGrinderShare(shares[3])
      const grinderGRETHAmount = Number(ethers.formatUnits(shares[3].grethAmount, 18).toString())
      const grinderGRAIAmount = Number(ethers.formatUnits(shares[3].graiAmount, 18).toString())
      const grinderBaseTokenAmount = Number(ethers.formatUnits(shares[3].baseTokenAmount, poolInfo?.baseTokenDecimals).toString())
      const grinderQuoteTokenAmount = Number(ethers.formatUnits(shares[3].quoteTokenAmount, poolInfo?.quoteTokenDecimals).toString())
      setGrinderGRETHShare(grinderGRETHAmount.toString())
      setGrinderGRAIShare(grinderGRAIAmount.toString())
      setGrinderBaseTokenShare(grinderBaseTokenAmount.toString())
      setGrinderQuoteTokenShare(grinderQuoteTokenAmount.toString())

      setPoolOwnerShare(shares[0])
      setPoolOwnerGRETHShare(ethers.formatUnits(shares[0].grethAmount, 18).toString())
      setPoolOwnerGRAIShare(ethers.formatUnits(shares[0].graiAmount, 18).toString())
      setPoolOwnerBaseTokenShare(ethers.formatUnits(shares[0].baseTokenAmount, poolInfo?.baseTokenDecimals).toString())
      setPoolOwnerQuoteTokenShare(ethers.formatUnits(shares[0].quoteTokenAmount, poolInfo?.quoteTokenDecimals).toString())

      setPoolBuyerShare(shares[1])
      setPoolBuyerGRETHShare(ethers.formatUnits(shares[1].grethAmount, 18).toString())
      setPoolBuyerGRAIShare(ethers.formatUnits(shares[1].graiAmount, 18).toString())
      setPoolBuyerBaseTokenShare(ethers.formatUnits(shares[1].baseTokenAmount, poolInfo?.baseTokenDecimals).toString())
      setPoolBuyerQuoteTokenShare(ethers.formatUnits(shares[1].quoteTokenAmount, poolInfo?.quoteTokenDecimals).toString())

      setReserveShare(shares[2])
      setReserveGRETHShare(ethers.formatUnits(shares[2].grethAmount, 18).toString())
      setReserveGRAIShare(ethers.formatUnits(shares[2].graiAmount, 18).toString())
      setReserveBaseTokenShare(ethers.formatUnits(shares[2].baseTokenAmount, poolInfo?.baseTokenDecimals).toString())
      setReserveQuoteTokenShare(ethers.formatUnits(shares[2].quoteTokenAmount, poolInfo?.quoteTokenDecimals).toString())

      const feeData = await provider?.getFeeData()
      const gasPrice = feeData?.gasPrice as bigint
      const estimateGas = await grinderAI!.grind.estimateGas(poolId)
      const grindEstimatedFee = ethers.formatEther(gasPrice * estimateGas)
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
      const data = await response.json()
      const ethPrice = parseFloat(data.ethereum.usd)
      const _grindCostUSD = parseFloat(grindEstimatedFee) * ethPrice
      setGrindCostETH(grindEstimatedFee)
      setGrindCostUSD(_grindCostUSD.toFixed(2))
      const rateRaw = await grinderAI?.ratePerGRAI(ETH) as bigint
      const rate = Number(ethers.formatUnits(rateRaw, 18))
      const grethPrice = rate * ethPrice
      console.log(grethPrice)
      const graiPrice = rate * ethPrice
      const baseTokenPrice = Number(ethers.formatUnits(poolInfo.positions.long.price.toString(), poolInfo.oracleQuoteTokenPerBaseTokenDecimals)) // [baseTokenPrice]=quoteToken/baseToken
      const quoteTokenPrice = Number(1.0) // [quoteTokenPrice] = USD/quoteToken
      // setGRETHPrice(grethPrice.toString())
      // setGRAIPrice(graiPrice.toString())
      // setBaseTokenPrice(baseTokenPrice.toString())
      // setQuoteTokenPrice(quoteTokenPrice.toString())
      // setGrinderBaseTokenShareUSD()
      const _grinderGRETHAmountUSD = grinderGRETHAmount * grethPrice
      const _grinderGRAIAmountUSD = grinderGRAIAmount * graiPrice
      const _grinderBaseTokenAmountUSD = grinderBaseTokenAmount * baseTokenPrice
      const _grinderQuoteTokenAmountUSD = grinderQuoteTokenAmount * quoteTokenPrice
      setGrinderGRETHShareUSD(_grinderGRETHAmountUSD)
      setGrinderGRAIShareUSD(_grinderGRAIAmountUSD)
      setGrinderBaseTokenShareUSD(_grinderBaseTokenAmountUSD)
      setGrinderQuoteTokenShareUSD(_grinderQuoteTokenAmountUSD)
      const totalGrinderProfitsUSD = 
        _grinderGRETHAmountUSD + 
        _grinderGRAIAmountUSD + 
        _grinderBaseTokenAmountUSD + 
        _grinderQuoteTokenAmountUSD - 
        _grindCostUSD
      setGrindProfitUSD(totalGrinderProfitsUSD.toFixed(2))
      setCalculating(false)
    } catch (error) {
      setCalculating(false)
      console.log("Error fetch pnl shares: ", error)
    }
  }

  const showUSD = (usd: number) => {
    if (usd == 0) {
      return "$0.0"
    }
    else if (usd < 0) {
      return "-$" + Math.abs(usd).toFixed(2);
    }
    return usd >= 0.01 ? "$" + usd.toFixed(2) : "<$0.01";
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
    try {
      if (optimizeGrind) {
  
      } else {
        let grindTx= await grinderAI?.grind(poolId);
        grindTx?.wait()
      }

    } catch {
      console.log("ad")
    }
  }

  return (
    <div className={`${styles['container']} container`}>
      <div style={{marginBottom: '30px'}}>
        <button onClick={() => handleGrind()} className={styles['grind']}>
          <div className={`${styles['grind-button']} ${buttonActive ? styles['active'] : ''} button`}>
            <div>
              <div>$ GRIND $</div>
              <div style={{ fontSize: '18px' }}>POOL #{poolId?.toString()}</div>
            </div>
          </div>
          <div className={styles['background']}></div>
        </button>
      </div>
      <div className={`${styles['grind-form']}`}>
        <div className={`${styles['content']}`}>
          <div className={styles['grinder-ai']}>
            <div>GrinderAI generated pool #{poolId?.toString()}</div>
            <button onClick={() => handleRefresh()}>
              <img src={refreshIcon} alt="Refresh Icon" />
            </button>
          </div>
          <div className={styles['grinder-share']}>Grinder receive: {calculating? 'Loading...': ''}</div>
          <div className={styles['tokens-infos']}>
            <div className={styles['token-info']}>+ {grinderGRETHShare} grETH ({showUSD(grinderGRETHShareUSD)})</div>
            <div className={styles['token-info']}>+ {grinderGRAIShare} grAI ({showUSD(grinderGRAIShareUSD)})</div>
            <div className={styles['token-info']}>+ {grinderBaseTokenShare} {baseTokenSymbol} ({showUSD(grinderBaseTokenShareUSD)})</div>
            <div className={styles['token-info']}>+ {grinderQuoteTokenShare} {quoteTokenSymbol} ({showUSD(grinderQuoteTokenShareUSD)})</div>
          </div>
          <div className={styles['divider']}>------------------------------</div>
          <div style={{ marginBottom: '12px' }}>
            <Checkbox
            defaultChecked={false}
            onChange={(e) => { 
              setOptimizeGrind(e)
            }}
            >
            Optimize GRIND
            </Checkbox>
          </div>
          <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
            <div>Grind cost ~ </div>
            <div>{grindCostETH} ETH (${grindCostUSD})</div>
          </div>
          <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
            <div>Grinder net PnL:</div>
            <div>{showUSD(Number(grindProfitUSD))}</div>
          </div>
          <div style={{ marginTop: '12px' }}>
            <Checkbox
            defaultChecked={false}
            onChange={(e) => { 
              setAllShares(e)
            }}
            >
            See all shares
            </Checkbox>
          </div>
          {allShares && (
            <>
            <div className={styles['divider']}>------------------------------</div>
            <div className={styles['pool-owner-share']}>Pool Owner share:</div>
            <div className={styles['tokens-infos']}>
              <div className={styles['token-info']}>+ {poolOwnerGRETHShare} grETH ($0.01)</div>
              <div className={styles['token-info']}>+ {poolOwnerGRAIShare} grAI ($0.01)</div>
              <div className={styles['token-info']}>+ {poolOwnerBaseTokenShare} {baseTokenSymbol} ($0.01)</div>
              <div className={styles['token-info']}>+ {poolOwnerQuoteTokenShare} {quoteTokenSymbol} ($0.01)</div>
            </div>
            <div>Pool Owner net PnL</div>
            <div className={styles['divider']}>------------------------------</div>
            <div className={styles['pool-owner-share']}>Pool Buyer share:</div>
            <div className={styles['tokens-infos']}>
              <div className={styles['token-info']}>+ {poolBuyerGRETHShare} grETH ($0.01)</div>
              <div className={styles['token-info']}>+ {poolBuyerGRAIShare} grAI ($0.01)</div>
              <div className={styles['token-info']}>+ {poolBuyerBaseTokenShare} {baseTokenSymbol} ($0.01)</div>
              <div className={styles['token-info']}>+ {poolBuyerQuoteTokenShare} {quoteTokenSymbol} ($0.01)</div>
            </div>
            <div className={styles['divider']}>------------------------------</div>
            <div className={styles['pool-owner-share']}>Reserve share:</div>
            <div className={styles['tokens-infos']}>
              <div className={styles['token-info']}>+ {reserveGRETHShare} grETH ($0.01)</div>
              <div className={styles['token-info']}>+ {reserveGRAIShare} grAI ($0.01)</div>
              <div className={styles['token-info']}>+ {reserveBaseTokenShare} {baseTokenSymbol} ($0.01)</div>
              <div className={styles['token-info']}>+ {reserveQuoteTokenShare} {quoteTokenSymbol} ($0.01)</div>
            </div>
            <div className={styles['divider']}>------------------------------</div>
            </>
          )}

        </div>
      </div>
    </div>
  )
}

export default Grind
