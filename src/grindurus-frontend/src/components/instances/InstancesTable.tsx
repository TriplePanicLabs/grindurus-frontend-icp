import { debounce } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import visible from '@/assets/icons/eye.svg'
import logoArbitrum from '@/assets/tokens/logoArbitrum.png'
import { useProtocolContext } from '@/context/ProtocolContext'

import styles from './InstancesTable.module.scss'

interface InstanceData {
  id: string
  terminal: string
  pair: string
  strategy: string
  totalLiquidity: string
  activeQty: string
  avgBuyPrice: string
  netPnL: string
  startDate: string
}

function InstancesTable() {
  const [tableData, setTableData] = useState<InstanceData[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { isConnected } = useProtocolContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (isConnected) {
      fetchInstances()
    } else {
      setTableData([])
    }
  }, [isConnected])

  const fetchInstances = async () => {
    setIsLoading(true)
    try {
      // Mock data for now - replace with actual contract calls
      const mockInstances: InstanceData[] = [
        {
          id: '0',
          terminal: 'Uniswap v3',
          pair: 'WETH/USDC',
          strategy: 'Grid Trading',
          totalLiquidity: '10,000',
          activeQty: '5.5',
          avgBuyPrice: '2,850',
          netPnL: '+450.25',
          startDate: '2024-01-15',
        },
        {
          id: '1',
          terminal: 'ICP Swap',
          pair: 'WBTC/USDT',
          strategy: 'DCA Strategy',
          totalLiquidity: '25,000',
          activeQty: '0.8',
          avgBuyPrice: '42,500',
          netPnL: '+1,250.75',
          startDate: '2024-01-10',
        },
        {
          id: '2',
          terminal: 'Binance',
          pair: 'WBTC/USDT',
          strategy: 'DCA Strategy',
          totalLiquidity: '25,000',
          activeQty: '0.8',
          avgBuyPrice: '42,500',
          netPnL: '+1,250.75',
          startDate: '2024-01-10',
        },
      ]
      setTableData(mockInstances)
    } catch (err) {
      console.error('Failed to fetch instances', err)
    }
    setIsLoading(false)
  }

  const handleViewInstance = (instanceId: string) => {
    navigate(`/instances/${instanceId}`)
  }

  const handleSearch = debounce(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim()
    try {
      if (!value) {
        fetchInstances()
        return
      }

      // Filter mock data - replace with actual search logic
      const filtered = tableData?.filter(instance => 
        instance.id.includes(value) || 
        instance.pair.toLowerCase().includes(value.toLowerCase())
      )
      setTableData(filtered || [])
    } catch (error) {
      console.log('Search failed', error)
    }
  }, 300)

  if (isLoading) {
    return <div>Loading instances...</div>
  }

  return (
    <>
      <div className={`${styles['header']} table-header`}>
        <h2 className={`${styles['title']}`}>Your Instances</h2>
        <div className={`${styles['search']} table-search`}>
          <input onChange={handleSearch} placeholder="Search instances" type="text" />
        </div>
      </div>
      {tableData?.map((data, index) => (
        <div className={styles['instance']} key={index}>
          <div className={styles['content']}>
            <div className={styles['instance-header']}>
              <div className={styles['instance-header-left']}>
                <img className={styles['network-img']} alt="Network Icon" src={logoArbitrum} />
                <h3 className={styles['instance-title']}>Instance {data.id}</h3>
              </div>
              <div className={styles['instance-header-right']}>
                <div className={styles['pair-info']}>{data.pair}</div>
                <div className={styles['terminal-info']}>{data.terminal}</div>
              </div>
            </div>
            <div className={styles['body']}>
              <div className={styles['metrics']}>
                <div className={styles['block']}>
                  <div className={styles['block-title']}>Strategy:</div>
                  <div className={styles['block-text']}>{data.strategy}</div>
                </div>
                <div className={styles['block']}>
                  <div className={styles['block-title']}>Total Liquidity:</div>
                  <div className={styles['block-text']}>${data.totalLiquidity}</div>
                </div>
                <div className={styles['block']}>
                  <div className={styles['block-title']}>Active Qty:</div>
                  <div className={styles['block-text']}>{data.activeQty}</div>
                </div>
              </div>
              <div className={styles['performance']}>
                <div className={styles['block']}>
                  <div className={styles['block-title']}>Avg Buy Price:</div>
                  <div className={styles['block-text']}>${data.avgBuyPrice}</div>
                </div>
                <div className={styles['block']}>
                  <div className={styles['block-title']}>Net PnL:</div>
                  <div className={`${styles['block-text']} ${styles['pnl']}`}>
                    {data.netPnL}
                  </div>
                </div>
                <div className={styles['block']}>
                  <div className={styles['block-title']}>Started:</div>
                  <div className={styles['block-text']}>{data.startDate}</div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles['buttons']}>
            <button
              onClick={() => handleViewInstance(data.id)}
              className={`${styles['view-button']} ${styles['button']} button`}
            >
              <img className={styles['view-img']} src={visible} alt="Eye Icon" />
              View Instance
            </button>
          </div>
        </div>
      ))}
    </>
  )
}

export default InstancesTable
