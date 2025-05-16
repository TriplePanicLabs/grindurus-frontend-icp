import { useEffect } from 'react'

import Tables from './tables/Tables'

function Dashboard() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Tables />
    </>
  )
}

export default Dashboard
