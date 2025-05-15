import { useEffect, useState } from 'react'

import refreshIcon from '@/assets/icons/refresh.svg'

import styles from './Grind.module.scss'

function Grind() {
  const [poolId, setPoolId] = useState<number | null>(null)
  const [refresh, setRefresh] = useState<boolean>(true)
  const [buttonActive, setButtonActive] = useState<boolean>(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const fetchPoolId = async () => {
      setPoolId(null)
      setTimeout(() => {
        const id = Math.floor(Math.random() * 10)
        setPoolId(id)
      }, 1000)
    }

    fetchPoolId()
  }, [refresh])

  useEffect(() => {
    const disableButton = async () => {
      setTimeout(() => {
        setButtonActive(false)
      }, 300)
    }

    disableButton()
  }, [buttonActive])

  return (
    <section className={styles['grind-section']}>
      <div className={`${styles['container']} container`}>
        <div className={`${styles['grind-form']}`}>
          <button onClick={() => setButtonActive(true)} className={styles['grind']}>
            <div
              className={`${styles['grind-button']} ${buttonActive ? styles['active'] : ''} button`}
            >
              $ GRIND $
            </div>
            <div className={styles['background']}></div>
          </button>
          <div className={`${styles['content']}`}>
            <div className={styles['grinder-ai']}>
              <div>GrinderAI choosen pool id: {poolId !== null ? poolId : '...'}</div>
              <button onClick={() => setRefresh(!refresh)}>
                <img src={refreshIcon} alt="Refresh Icon" />
              </button>
            </div>
            <div className={styles['tokens-infos']}>
              <div className={styles['token-info']}>+ 1 grAI ($0.01)</div>
              <div className={styles['token-info']}>+ 0.05 USDT ($0.05)</div>
              <div className={styles['token-info']}>+ 0.00001 ETH ($0.01)</div>
            </div>
            <button className={`${styles['button']} button`}>Grind</button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Grind
