import MintGRAI from '../../grAI/mint/MintGRAI'
import MintPool from '../../create/pool/CreatePool'
import styles from './Panel.module.scss'
import TotalInfo from './totalInfo/TotalInfo'

function Panel() {
  return (
    <section>
      <div className={`${styles['panel-container']} container`}>
        <div className={styles['center']}>
          <MintPool />
        </div>
      </div>
    </section>
  )
}

export default Panel
