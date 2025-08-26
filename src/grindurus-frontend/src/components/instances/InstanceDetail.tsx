import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

import { NumberView } from '@/components/ui'

import styles from './InstanceDetail.module.scss'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

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
          { time: 'Aug 11', value: 10000 },
          { time: 'Aug 12', value: 10200 },
          { time: 'Aug 13', value: 10150 },
          { time: 'Aug 14', value: 10300 },
          { time: 'Aug 15', value: 10450 },
          { time: 'Aug 16', value: 10600 },
          { time: 'Aug 17', value: 10550 },
          { time: 'Aug 18', value: 10700 },
          { time: 'Aug 19', value: 10850 },
          { time: 'Aug 20', value: 10900 },
          { time: 'Aug 21', value: 11100 },
          { time: 'Aug 22', value: 11250 },
          { time: 'Aug 23', value: 11300 },
          { time: 'Aug 24', value: 11450 },
          { time: 'Aug 25', value: 11600 },
          { time: 'Aug 26', value: 11750 },
        ]
      }
      setInstanceData(mockData)
    } catch (err) {
      console.error('Failed to fetch instance data', err)
    }
    setIsLoading(false)
  }

  const renderChart = () => {
    if (!instanceData) return null

    const chartData = instanceData.chartData

    const data = {
      labels: chartData.map(d => d.time),
      datasets: [
        {
          label: 'Portfolio Value',
          data: chartData.map(d => d.value),
          borderColor: '#933DC9',
          backgroundColor: 'rgba(147, 61, 201, 0.1)',
          borderWidth: 3,
          pointBackgroundColor: '#933DC9',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.4,
          pointHoverBackgroundColor: '#ffffff',
          pointHoverBorderColor: '#933DC9',
        }
      ]
    }

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: '#933DC9',
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            label: function(context: any) {
              return `$${context.parsed.y.toLocaleString()}`
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
            drawBorder: false,
          },
          ticks: {
            color: '#6b7280',
            font: {
              size: 12,
            },
          },
          border: {
            display: false,
          }
        },
        y: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
            drawBorder: false,
          },
          ticks: {
            color: '#6b7280',
            font: {
              size: 12,
            },
            callback: function(value: any) {
              return `$${(value / 1000).toFixed(0)}k`
            }
          },
          border: {
            display: false,
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index' as const,
      },
      elements: {
        point: {
          hoverBorderWidth: 3,
        }
      }
    }

    return (
      <div className={styles['chart-container']}>
        <div className={styles['chart-header']}>
          <h3 className={styles['chart-title']}>Portfolio Performance</h3>
          <div className={styles['chart-stats']}>
            <div className={styles['stat']}>
              <span className={styles['stat-label']}>Current Value:</span>
              <span className={styles['stat-value']}>${chartData[chartData.length - 1].value.toLocaleString()}</span>
            </div>
            <div className={styles['stat']}>
              <span className={styles['stat-label']}>Change:</span>
              <span className={styles['stat-change']}>+{((chartData[chartData.length - 1].value - chartData[0].value) / chartData[0].value * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
        <div className={styles['chart-wrapper']}>
          <Line data={data} options={options} className={styles['chart']} />
        </div>
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
                    <div className={styles['info-block']}>
                      <div className={styles['element']}>Total Liquidity</div>
                      <div className={styles['element']}>${instanceData.totalLiquidity}</div>
                    </div>
                    <div className={styles['info-block']}>
                      <div className={styles['element']}>Active Qty</div>
                      <div className={styles['element']}>{instanceData.activeQty}</div>
                    </div>
                    <div className={styles['info-block']}>
                      <div className={styles['element']}>Average Buy Price</div>
                      <div className={styles['element']}>${instanceData.avgBuyPrice}</div>
                    </div>
                    <div className={styles['info-block']}>
                      <div className={styles['element']}>Net PnL</div>
                      <div className={`${styles['element']} ${styles['pnl']}`}>
                        {instanceData.netPnL}
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'configs' && (
                  <div className={styles['configs-content']}>
                    <div className={styles['info-block']}>
                      <div className={styles['element']}>Terminal</div>
                      <div className={styles['element']}>{instanceData.terminal}</div>
                    </div>
                    <div className={styles['info-block']}>
                      <div className={styles['element']}>Pair</div>
                      <div className={styles['element']}>{instanceData.pair}</div>
                    </div>
                    <div className={styles['info-block']}>
                      <div className={styles['element']}>Strategy</div>
                      <div className={styles['element']}>{instanceData.strategy}</div>
                    </div>
                    <div className={styles['info-block']}>
                      <div className={styles['element']}>Started</div>
                      <div className={styles['element']}>{instanceData.startDate}</div>
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
