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
  const { oracleETHUSD, poolsNFT, grinderAI, agentsNFT, provider } = useProtocolContext()

  const [poolId, setPoolId] = useState<bigint | null>(0n)
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
  const [poolOwnerGRETHShareUSD, setPoolOwnerGRETHShareUSD] = useState<number>(0.0) 
  const [poolOwnerGRAIShareUSD, setPoolOwnerGRAIShareUSD] = useState<number>(0.0)
  const [poolOwnerBaseTokenShareUSD, setPoolOwnerBaseTokenShareUSD] = useState<number>(0.0)
  const [poolOwnerQuoteTokenShareUSD, setPoolOwnerQuoteTokenShareUSD] = useState<number>(0.0)

  const [poolBuyerGRETHShare, setPoolBuyerGRETHShare] = useState<string>('...') 
  const [poolBuyerGRAIShare, setPoolBuyerGRAIShare] = useState<string>('...')
  const [poolBuyerBaseTokenShare, setPoolBuyerBaseTokenShare] = useState<string>('...')
  const [poolBuyerQuoteTokenShare, setPoolBuyerQuoteTokenShare] = useState<string>('...')
  const [poolBuyerGRETHShareUSD, setPoolBuyerGRETHShareUSD] = useState<number>(0.0) 
  const [poolBuyerGRAIShareUSD, setPoolBuyerGRAIShareUSD] = useState<number>(0.0)
  const [poolBuyerBaseTokenShareUSD, setPoolBuyerBaseTokenShareUSD] = useState<number>(0.0)
  const [poolBuyerQuoteTokenShareUSD, setPoolBuyerQuoteTokenShareUSD] = useState<number>(0.0)

  const [reserveGRETHShare, setReserveGRETHShare] = useState<string>('...') 
  const [reserveGRAIShare, setReserveGRAIShare] = useState<string>('...')
  const [reserveBaseTokenShare, setReserveBaseTokenShare] = useState<string>('...')
  const [reserveQuoteTokenShare, setReserveQuoteTokenShare] = useState<string>('...')
  const [reserveGRETHShareUSD, setReserveGRETHShareUSD] = useState<number>(0.0) 
  const [reserveGRAIShareUSD, setReserveGRAIShareUSD] = useState<number>(0.0)
  const [reserveBaseTokenShareUSD, setReserveBaseTokenShareUSD] = useState<number>(0.0)
  const [reserveQuoteTokenShareUSD, setReserveQuoteTokenShareUSD] = useState<number>(0.0)

  const [grindCostETH, setGrindCostETH] = useState<string>('0.0')
  const [grindCostUSD, setGrindCostUSD] = useState<string>('0.0')
  const [grindProfitUSD, setGrindProfitUSD] = useState<string>('0.0')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (!poolId) {
      generatePoolId()
    }
    fetchPoolInfoWithPnLShares()
  }, [refresh])

  const handleRefresh = () => {
    setRefresh((prev) => prev + 1)
  }

  const getRandomInt = (max: number) => Math.floor(Math.random() * max);

  const generatePoolId = async () => {
    try {
      if (!agentsNFT || !poolsNFT) return
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
      setPoolId(_poolId);
    } catch (error) {
      console.error('Error generating pool ID:', error)
      setPoolId(null)
    }
  }

  const fetchPoolInfoWithPnLShares = async () => {
    try {
      setCalculating(true)
      const shares: IGrinderAI.PnLSharesStruct[] = await grinderAI?.getPnLShares(poolId as BigNumberish) as IGrinderAI.PnLSharesStruct[]
      const poolInfos: IPoolsNFTLens.PoolInfoStruct[] = await poolsNFT?.getPoolInfosBy([poolId as BigNumberish]) as IPoolsNFTLens.PoolInfoStruct[];
      // console.log(poolInfos);
      const poolInfo = poolInfos[0]
      const baseTokenDecimals = poolInfo?.baseTokenDecimals as number
      const quoteTokenDecimals = poolInfo?.quoteTokenDecimals as number
      setBaseTokenSymbol(poolInfo.baseTokenSymbol)
      setQuoteTokenSymbol(poolInfo.quoteTokenSymbol)

      setPoolOwnerShare(shares[0])
      setPoolBuyerShare(shares[1])
      setReserveShare(shares[2])
      setGrinderShare(shares[3])

      const grinderGRETHAmount = ethers.formatUnits(shares[3].grethAmount, 18)
      const grinderGRAIAmount = ethers.formatUnits(shares[3].graiAmount, 18)
      const grinderBaseTokenAmount = ethers.formatUnits(shares[3].baseTokenAmount, baseTokenDecimals)
      const grinderQuoteTokenAmount = ethers.formatUnits(shares[3].quoteTokenAmount, quoteTokenDecimals)
      setGrinderGRETHShare(grinderGRETHAmount)
      setGrinderGRAIShare(grinderGRAIAmount)
      setGrinderBaseTokenShare(grinderBaseTokenAmount)
      setGrinderQuoteTokenShare(grinderQuoteTokenAmount)

      const poolOwnerGRETHAmount = ethers.formatUnits(shares[0].grethAmount, 18)
      const poolOwnerGRAIAmount = ethers.formatUnits(shares[0].graiAmount, 18)
      const poolOwnerBaseTokenAmount = ethers.formatUnits(shares[0].baseTokenAmount, baseTokenDecimals)
      const poolOwnerQuoteTokenAmount = ethers.formatUnits(shares[0].quoteTokenAmount, quoteTokenDecimals)
      setPoolOwnerGRETHShare(poolOwnerGRETHAmount)
      setPoolOwnerGRAIShare(poolOwnerGRAIAmount)
      setPoolOwnerBaseTokenShare(poolOwnerBaseTokenAmount)
      setPoolOwnerQuoteTokenShare(poolOwnerQuoteTokenAmount)

      const poolBuyerGRETHAmount = ethers.formatUnits(shares[1].grethAmount, 18)
      const poolBuyerGRAIAmount = ethers.formatUnits(shares[1].graiAmount, 18)
      const poolBuyerBaseTokenAmount = ethers.formatUnits(shares[1].baseTokenAmount, baseTokenDecimals)
      const poolBuyerQuoteTokenAmount = ethers.formatUnits(shares[1].quoteTokenAmount, quoteTokenDecimals)
      setPoolBuyerGRETHShare(poolBuyerGRETHAmount)
      setPoolBuyerGRAIShare(poolBuyerGRAIAmount)
      setPoolBuyerBaseTokenShare(poolBuyerBaseTokenAmount)
      setPoolBuyerQuoteTokenShare(poolBuyerQuoteTokenAmount)

      const reserveGRETHAmount = ethers.formatUnits(shares[2].grethAmount, 18)
      const reserveGRAIAmount = ethers.formatUnits(shares[2].graiAmount, 18)
      const reserveBaseTokenAmount = ethers.formatUnits(shares[2].baseTokenAmount, baseTokenDecimals)
      const reserveQuoteTokenAmount = ethers.formatUnits(shares[2].quoteTokenAmount, quoteTokenDecimals)
      setReserveGRETHShare(reserveGRETHAmount)
      setReserveGRAIShare(reserveGRAIAmount)
      setReserveBaseTokenShare(reserveBaseTokenAmount)
      setReserveQuoteTokenShare(reserveQuoteTokenAmount)

      const feeData = await provider?.getFeeData()
      const gasPrice = feeData?.gasPrice as bigint
      const estimateGas = await grinderAI!.grind.estimateGas(poolId)
      const grindEstimatedFee = ethers.formatEther(gasPrice * estimateGas)
      const latestRoundData = await oracleETHUSD?.latestRoundData();
      const answer = latestRoundData?.answer as bigint;
      const ethPrice = Number(ethers.formatUnits(answer, 8))
      const _grindCostUSD = parseFloat(grindEstimatedFee) * ethPrice
      setGrindCostETH(grindEstimatedFee)
      setGrindCostUSD(_grindCostUSD.toFixed(2))
      const rateRaw = await grinderAI?.ratePerGRAI(ETH) as bigint
      const rate = Number(ethers.formatUnits(rateRaw, 18))
      const grethPrice = rate * ethPrice
      // console.log(grethPrice)
      const graiPrice = rate * ethPrice
      const baseTokenPrice = Number(ethers.formatUnits(poolInfo.positions.long.price.toString(), poolInfo.oracleQuoteTokenPerBaseTokenDecimals)) // [baseTokenPrice]=quoteToken/baseToken
      const quoteTokenPrice = Number(1.0) // [quoteTokenPrice] = USD/quoteToken

      const _grinderGRETHAmountUSD = Number(grinderGRETHAmount) * grethPrice
      const _grinderGRAIAmountUSD = Number(grinderGRAIAmount) * graiPrice
      const _grinderBaseTokenAmountUSD = Number(grinderBaseTokenAmount) * baseTokenPrice
      const _grinderQuoteTokenAmountUSD = Number(grinderQuoteTokenAmount) * quoteTokenPrice
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
      
      const _poolOwnerGRETHAmountUSD = Number(poolOwnerGRETHAmount) * grethPrice
      const _poolOwnerGRAIAmountUSD = Number(poolOwnerGRAIAmount) * graiPrice
      const _poolOwnerBaseTokenAmountUSD = Number(poolOwnerBaseTokenAmount) * baseTokenPrice
      const _poolOwnerQuoteTokenAmountUSD = Number(poolOwnerQuoteTokenAmount) * quoteTokenPrice
      setPoolOwnerGRETHShareUSD(_poolOwnerGRETHAmountUSD)
      setPoolOwnerGRAIShareUSD(_poolOwnerGRAIAmountUSD)
      setPoolOwnerBaseTokenShareUSD(_poolOwnerBaseTokenAmountUSD)
      setPoolOwnerQuoteTokenShareUSD(_poolOwnerQuoteTokenAmountUSD)

      const _poolBuyerGRETHAmountUSD = Number(poolBuyerGRETHAmount) * grethPrice
      const _poolBuyerGRAIAmountUSD = Number(poolBuyerGRAIAmount) * graiPrice
      const _poolBuyerBaseTokenAmountUSD = Number(poolBuyerBaseTokenAmount) * baseTokenPrice
      const _poolBuyerQuoteTokenAmountUSD = Number(poolBuyerQuoteTokenAmount) * quoteTokenPrice
      setPoolBuyerGRETHShareUSD(_poolBuyerGRETHAmountUSD)
      setPoolBuyerGRAIShareUSD(_poolBuyerGRAIAmountUSD)
      setPoolBuyerBaseTokenShareUSD(_poolBuyerBaseTokenAmountUSD)
      setPoolBuyerQuoteTokenShareUSD(_poolBuyerQuoteTokenAmountUSD)

      const _reserveGRETHAmountUSD = Number(reserveGRETHAmount) * grethPrice
      const _reserveGRAIAmountUSD = Number(reserveGRAIAmount) * graiPrice
      const _reserveBaseTokenAmountUSD = Number(reserveBaseTokenAmount) * baseTokenPrice
      const _reserveQuoteTokenAmountUSD = Number(reserveQuoteTokenAmount) * quoteTokenPrice
      setReserveGRETHShareUSD(_reserveGRETHAmountUSD)
      setReserveGRAIShareUSD(_reserveGRAIAmountUSD)
      setReserveBaseTokenShareUSD(_reserveBaseTokenAmountUSD)
      setReserveQuoteTokenShareUSD(_reserveQuoteTokenAmountUSD)

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
    if (!poolId) {
      console.log("da")
      return
    }
    try {
      if (optimizeGrind) {
        
      } else {
        let grindTx = await grinderAI?.grind(poolId);
        await grindTx?.wait()
      }
    } catch (err) {
      console.log("error grind: ", err)
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
            <div> {grindCostETH} ETH (${grindCostUSD})</div>
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
              <div className={styles['token-info']}>+ {poolOwnerGRETHShare} grETH ({showUSD(poolOwnerGRETHShareUSD)})</div>
              <div className={styles['token-info']}>+ {poolOwnerGRAIShare} grAI ({showUSD(poolOwnerGRAIShareUSD)})</div>
              <div className={styles['token-info']}>+ {poolOwnerBaseTokenShare} {baseTokenSymbol} ({showUSD(poolOwnerBaseTokenShareUSD)})</div>
              <div className={styles['token-info']}>+ {poolOwnerQuoteTokenShare} {quoteTokenSymbol} ({showUSD(poolOwnerQuoteTokenShareUSD)})</div>
            </div>
            <div>Pool Owner net PnL</div>
            <div className={styles['divider']}>------------------------------</div>
            <div className={styles['pool-owner-share']}>Pool Buyer share:</div>
            <div className={styles['tokens-infos']}>
              <div className={styles['token-info']}>+ {poolBuyerGRETHShare} grETH ({showUSD(poolBuyerGRETHShareUSD)})</div>
              <div className={styles['token-info']}>+ {poolBuyerGRAIShare} grAI ({showUSD(poolBuyerGRAIShareUSD)})</div>
              <div className={styles['token-info']}>+ {poolBuyerBaseTokenShare} {baseTokenSymbol} ({showUSD(poolBuyerBaseTokenShareUSD)})</div>
              <div className={styles['token-info']}>+ {poolBuyerQuoteTokenShare} {quoteTokenSymbol} ({showUSD(poolBuyerQuoteTokenShareUSD)})</div>
            </div>
            <div className={styles['divider']}>------------------------------</div>
            <div className={styles['pool-owner-share']}>Reserve share:</div>
            <div className={styles['tokens-infos']}>
              <div className={styles['token-info']}>+ {reserveGRETHShare} grETH ({showUSD(reserveGRETHShareUSD)})</div>
              <div className={styles['token-info']}>+ {reserveGRAIShare} grAI ({showUSD(reserveGRAIShareUSD)})</div>
              <div className={styles['token-info']}>+ {reserveBaseTokenShare} {baseTokenSymbol} ({showUSD(reserveBaseTokenShareUSD)})</div>
              <div className={styles['token-info']}>+ {reserveQuoteTokenShare} {quoteTokenSymbol} ({showUSD(reserveQuoteTokenShareUSD)})</div>
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
