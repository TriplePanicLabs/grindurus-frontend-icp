import { useNavigate } from 'react-router-dom'

import InstancesTable from './InstancesTable'

import styles from './InstancesDashboard.module.scss'

function InstancesDashboard() {
  const navigate = useNavigate()

  const handleCreateInstance = () => {
    navigate('/instances/create')
  }

  return (
    <section>
      <div className="container">
        <div className={styles['dashboard']}>
          <div className={styles['header']}>
            <h1 className={styles['title']}>Instances</h1>
            <button 
              onClick={handleCreateInstance}
              className={`${styles['create-button']} button`}
            >
              <span className={styles['plus']}>+</span>
              Create Instance
            </button>
          </div>
          <InstancesTable />
        </div>
      </div>
    </section>
  )
}

export default InstancesDashboard
