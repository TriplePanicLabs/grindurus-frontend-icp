import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'

import { NumberView } from '@/components/ui'

import styles from './InstanceDetail.module.scss'

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
  chartData: Array<{ time: string; value: number }>
}

function InstanceDetail() {
  const { instanceId } = useParams()
  const [instanceData, setInstanceData] = useState<InstanceData | null>(null)
  const [activeTab, setActiveTab] = useState<'info' | 'configs'>('info')
  const [isLoading, setIsLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState<number>(0)

  useEffect(() => {
    fetchInstanceData()
  }, [instanceId])

  const fetchInstanceData = async () => {
    setIsLoading(true)
    try {
      // Mock data - replace with actual contract calls
      const mockData: InstanceData = {
        id: instanceId || '1',
        terminal: 'Uniswap v3',
        pair: 'WETH/USDC',
        strategy: 'Grid Trading',
        totalLiquidity: '10,000',
        activeQty: '5.5',
        avgBuyPrice: '2,850',
        netPnL: '+450.25',
        startDate: '2024-01-15',
        chartData: [
          { time: '2024-01-15', value: 10000 },
          { time: '2024-01-16', value: 10200 },
          { time: '2024-01-17', value: 10150 },
          { time: '2024-01-18', value: 10300 },
          { time: '2024-01-19', value: 10450 },
          { time: '2024-01-20', value: 10450 },
        ]
      }
      setInstanceData(mockData)
    } catch (err) {
      console.error('Failed to fetch instance data', err)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const renderChart = () => {
    if (!instanceData) return null

    const chartData = instanceData.chartData
    const maxValue = Math.max(...chartData.map(d => d.value))
    const minValue = Math.min(...chartData.map(d => d.value))
    const range = maxValue - minValue

    const width = Math.max(300, containerWidth || 0)
    const height = Math.max(240, Math.round(width * 0.5))
    const padding = 40

    const points = chartData.map((point, index) => {
      const x = padding + (index / (chartData.length - 1)) * (width - 2 * padding)
      const y = height - padding - ((point.value - minValue) / range) * (height - 2 * padding)
      return `${x},${y}`
    }).join(' ')

    return (
      <div className={styles['chart-container']} ref={containerRef}>
        <svg className={styles['chart']} viewBox={`0 0 ${width} ${height}`}>
          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#333333" strokeWidth="1" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#333333" strokeWidth="1" />
          
          {/* Chart line */}
          <polyline
            points={points}
            fill="none"
            stroke="#933DC9"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          {chartData.map((point, index) => {
            const x = padding + (index / (chartData.length - 1)) * (width - 2 * padding)
            const y = height - padding - ((point.value - minValue) / range) * (height - 2 * padding)
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill="#933DC9"
              />
            )
          })}
          
          {/* Y-axis labels */}
          <text x={10} y={padding} fill="#ffffff" fontSize="12">${maxValue.toLocaleString()}</text>
          <text x={10} y={height - padding} fill="#ffffff" fontSize="12">${minValue.toLocaleString()}</text>
          
          {/* X-axis labels */}
          <text x={padding} y={height - 10} fill="#ffffff" fontSize="10">{chartData[0].time}</text>
          <text x={width - padding - 30} y={height - 10} fill="#ffffff" fontSize="10">{chartData[chartData.length - 1].time}</text>
        </svg>
      </div>
    )
  }

  if (isLoading) {
    return <div>Loading instance...</div>
  }

  if (!instanceData) {
    return <div>Instance not found</div>
  }

  return (
    <section>
      <div className="container">
        <div className={styles['detail']}>
          <div className={styles['header']}>
            <h1 className={styles['title']}>Instance {instanceData.id}</h1>
          </div>
          
          <div className={styles['content']}>
            <div className={styles['chart-section']}>
              {renderChart()}
            </div>
            
            <div className={styles['info-section']}>
              <div className={styles['tabs']}>
                <button
                  className={`${styles['tab']} ${activeTab === 'info' ? styles['active'] : ''}`}
                  onClick={() => setActiveTab('info')}
                >
                  Info
                </button>
                <button
                  className={`${styles['tab']} ${activeTab === 'configs' ? styles['active'] : ''}`}
                  onClick={() => setActiveTab('configs')}
                >
                  Configs
                </button>
              </div>
              
              <div className={styles['tab-content']}>
                {activeTab === 'info' && (
                  <div className={styles['info-content']}>
                    <div className={styles['metric']}>
                      <span className={styles['metric-label']}>Total Liquidity:</span>
                      <span className={styles['metric-value']}>${instanceData.totalLiquidity}</span>
                    </div>
                    <div className={styles['metric']}>
                      <span className={styles['metric-label']}>Active Qty:</span>
                      <span className={styles['metric-value']}>{instanceData.activeQty}</span>
                    </div>
                    <div className={styles['metric']}>
                      <span className={styles['metric-label']}>Average Buy Price:</span>
                      <span className={styles['metric-value']}>${instanceData.avgBuyPrice}</span>
                    </div>
                    <div className={styles['metric']}>
                      <span className={styles['metric-label']}>Net PnL:</span>
                      <span className={`${styles['metric-value']} ${styles['pnl']}`}>
                        {instanceData.netPnL}
                      </span>
                    </div>
                  </div>
                )}
                
                {activeTab === 'configs' && (
                  <div className={styles['configs-content']}>
                    <div className={styles['config']}>
                      <span className={styles['config-label']}>Terminal:</span>
                      <span className={styles['config-value']}>{instanceData.terminal}</span>
                    </div>
                    <div className={styles['config']}>
                      <span className={styles['config-label']}>Pair:</span>
                      <span className={styles['config-value']}>{instanceData.pair}</span>
                    </div>
                    <div className={styles['config']}>
                      <span className={styles['config-label']}>Strategy:</span>
                      <span className={styles['config-value']}>{instanceData.strategy}</span>
                    </div>
                    <div className={styles['config']}>
                      <span className={styles['config-label']}>Started:</span>
                      <span className={styles['config-value']}>{instanceData.startDate}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default InstanceDetail
