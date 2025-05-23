import { formatUnits } from 'ethers'
import { useEffect, useState } from 'react'

import { NumberView } from '@/components/ui'
import { useProtocolContext } from '@/context/ProtocolContext'
import { useIsMobile } from '@/hooks'
import { IPoolsNFTLens } from '@/typechain-types/PoolsNFT'

import styles from './ThresholdsTable.module.scss'

type ThresholdsTableProps = {
  poolId: number
}

type ThresholdEntry = {
  param: string
  value: string
}

const ThresholdsTable = ({ poolId }: ThresholdsTableProps) => {
  const { poolsNFT } = useProtocolContext()
  const isMobile = useIsMobile(500)
  const [tableData, setTableData] = useState<ThresholdEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchThresholds()
  }, [poolId, poolsNFT])

  const checkRequired = () => {
    if (!poolsNFT) {
      console.error('PoolsNFT is null!')
      return false
    }
    return true
  }

  const fetchThresholds = async () => {
    if (!checkRequired()) return

    setIsLoading(true)
    try {
      const poolInfos: IPoolsNFTLens.PoolInfoStructOutput[] = await poolsNFT!.getPoolInfosBy([poolId])
      const _thresholds = poolInfos[0].thresholds
      const oracleQuoteTokenPerBaseTokenDecimals = poolInfos[0].oracleQuoteTokenPerBaseTokenDecimals
      const quoteTokenDecimals = poolInfos[0].quoteTokenDecimals
      const baseTokenDecimals = poolInfos[0].baseTokenDecimals
      const priceDecimals = oracleQuoteTokenPerBaseTokenDecimals !== BigInt(0) ? oracleQuoteTokenPerBaseTokenDecimals : 8n
      const thresholds = {
        spotPrice: formatUnits(_thresholds.spotPrice, priceDecimals),
        longBuyPriceMin: formatUnits(_thresholds.longBuyPriceMin, priceDecimals),
        longSellQuoteTokenAmountThreshold: formatUnits(_thresholds.longSellQuoteTokenAmountThreshold, quoteTokenDecimals),
        longSellSwapPriceThreshold: formatUnits(_thresholds.longSellSwapPriceThreshold, priceDecimals),
        hedgeSellInitPriceThresholdHigh: formatUnits(_thresholds.hedgeSellInitPriceThresholdHigh, priceDecimals),
        hedgeSellInitPriceThresholdLow: formatUnits(_thresholds.hedgeSellInitPriceThresholdLow, priceDecimals),
        hedgeSellLiquidity: formatUnits(_thresholds.hedgeSellLiquidity, quoteTokenDecimals),
        hedgeSellQuoteTokenAmountThreshold: formatUnits(_thresholds.hedgeSellQuoteTokenAmountThreshold, priceDecimals),
        hedgeSellTargetPrice: formatUnits(_thresholds.hedgeSellTargetPrice, priceDecimals),
        hedgeSellSwapPriceThreshold: formatUnits(_thresholds.hedgeSellSwapPriceThreshold, priceDecimals),
        hedgeRebuyBaseTokenAmountThreshold: formatUnits(_thresholds.hedgeRebuyBaseTokenAmountThreshold, baseTokenDecimals),
        hedgeRebuySwapPriceThreshold: formatUnits(_thresholds.hedgeRebuySwapPriceThreshold, priceDecimals),
      }

      const formatted: ThresholdEntry[] = Object.entries(thresholds).map(([param, value]) => ({
        param,
        value,
      }))

      setTableData(formatted)
    } catch (err) {
      console.log('Failed to load thresholds: ', err)
    }
    setIsLoading(false)
  }

  const formatLabel = (label: string) => {
    if (!isMobile) return label

    return label
      .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase → spaced
      .replace(/^./, str => str.toUpperCase()) // capitalize first letter
  }

  return (
    <div className={styles['block']}>
      <h3 className={styles['title']}>Thresholds</h3>
      <div className={styles['thresholds']}>
        {tableData.map((entry, idx) => (
          <div className={styles['info-block']} key={idx}>
            <div className={styles['element']}>{formatLabel(entry.param)}</div>
            <div className={styles['element']}>
              <NumberView value={entry.value} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ThresholdsTable
