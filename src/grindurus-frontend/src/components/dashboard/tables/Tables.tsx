import { useState } from 'react'

import AgentsTable from './agents/AgentsTable'
import PoolsTable from './pools/PoolsTable'
import InstancesTable from '@/components/instances/InstancesTable'
import styles from './Tables.module.scss'

type TablesToShow = 'pools' | 'agents' | 'instances'

const tables: Record<TablesToShow, JSX.Element> = {
  pools: <PoolsTable />,
  agents: <AgentsTable />,
  instances: <InstancesTable />,
}

function Tables() {
  const [showTable, setShowTable] = useState<TablesToShow>('pools')

  return (
    <section>
      <div className="container">
        <div className={styles['tables']}>
          <div className={styles['select']}>
            <button
              onClick={() => setShowTable('pools')}
              className={`${styles['select-button']} ${
                showTable === 'pools' ? styles['active'] : ''
              } button`}
            >
              Pools
            </button>
            <button
              onClick={() => setShowTable('agents')}
              className={`${styles['select-button']} ${
                showTable === 'agents' ? styles['active'] : ''
              } button`}
            >
              Agents
            </button>
            <button
              onClick={() => setShowTable('instances')}
              className={`${styles['select-button']} ${
                showTable === 'instances' ? styles['active'] : ''
              } button`}
            >
              Instances
            </button>
          </div>
          {tables[showTable]}
        </div>
      </div>
    </section>
  )
}

export default Tables
