import './styles/index.scss'
import './client'

import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'

import { ProtocolContextProvider } from '@/context/ProtocolContext'

import App from './App'

const rootElement = document.getElementById('root')

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <ProtocolContextProvider>
      <Router>
        <App />
      </Router>
    </ProtocolContextProvider>,
  )
} else {
  console.error('Element with id "root" not found')
}
