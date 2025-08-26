import React, { ReactNode } from 'react'
import { Route, Routes } from 'react-router-dom'

import ConnectWallet from '@/components/connect/ConnectWallet'
import Dashboard from '@/components/dashboard/Dashboard'
import Create from '@/components/create/Create'
import GrETH from '@/components/grETH/GrETH'
import Grind from '@/components/grind/Grind'
import GrinderAI from '@/components/grinderAI/GrinderAI'
import Header from '@/components/header/Header'
import Pool from '@/components/pool/Pool'
import GRAI from '@/components/grAI/GRAI'
import { useProtocolContext } from '@/context/ProtocolContext'

type RouterGuardProps = {
  networkConfig: Record<string, any>
  isConnected: boolean
  children: ReactNode
}

const RouterGuard: React.FC<RouterGuardProps> = ({ networkConfig, isConnected, children }) => {
  if (!networkConfig || Object.keys(networkConfig).length === 0) {
    return <div>Loading network configuration...</div>
  }

  if (!isConnected) {
    return <ConnectWallet />
  }

  return <>{children}</>
}

function App() {
  const { networkConfig, isConnected } = useProtocolContext()

  return (
    <>
      <Header />
      <main className="page">
        <Routes>
          <Route
            path="/"
            element={
              <RouterGuard networkConfig={networkConfig} isConnected={isConnected}>
                <Dashboard />
              </RouterGuard>
            }
          />
          <Route
            path="/grind"
            element={
              <RouterGuard networkConfig={networkConfig} isConnected={isConnected}>
                <Grind />
              </RouterGuard>
            }
          />
          <Route
            path="/explore"
            element={
              <RouterGuard networkConfig={networkConfig} isConnected={isConnected}>
                <Dashboard />
              </RouterGuard>
            }
          />
          <Route
            path="/create"
            element={
              <RouterGuard networkConfig={networkConfig} isConnected={isConnected}>
                {/* <MintPool /> */}
                <Create />
              </RouterGuard>
            }
          />
          <Route
            path="/greth"
            element={
              <RouterGuard networkConfig={networkConfig} isConnected={isConnected}>
                <GrETH />
              </RouterGuard>
            }
          />
          <Route
            path="/grinder-ai"
            element={
              <RouterGuard networkConfig={networkConfig} isConnected={isConnected}>
                <GrinderAI />
              </RouterGuard>
            }
          />
          <Route
            path="/grai"
            element={
              <RouterGuard networkConfig={networkConfig} isConnected={isConnected}>
                <GRAI/>
              </RouterGuard>
            }
          />
          <Route
            path="/pool/:poolId"
            element={
              <RouterGuard networkConfig={networkConfig} isConnected={isConnected}>
                <Pool />
              </RouterGuard>
            }
          />
        </Routes>
      </main>
    </>
  )
}

export default App
