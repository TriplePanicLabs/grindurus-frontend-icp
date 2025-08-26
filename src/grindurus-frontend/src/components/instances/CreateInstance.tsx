import { useState } from 'react'

import { FormGroup, Option, Select } from '@/components/ui'
import { useProtocolContext } from '@/context/ProtocolContext'

import styles from './CreateInstance.module.scss'

function CreateInstance() {
  const { networkConfig } = useProtocolContext()

  const [selectedTerminal, setSelectedTerminal] = useState<string>('')
  const [selectedBase, setSelectedBase] = useState<string>('')
  const [selectedQuote, setSelectedQuote] = useState<string>('')
  const [selectedStrategyIndex, setSelectedStrategyIndex] = useState<number>(0)

  const terminals = ['Uniswap v3', 'ICP Swap', 'Binance']

  return (
    <div className={`${styles['form']} form`}>
      <div className={styles['header']}>
        <h2 className={`${styles['title']} form-title`}>Create Instance</h2>
      </div>
      <div className={styles['subtitle']}>
        <h2>Configure terminal, trading pair and strategy</h2>
      </div>

      <FormGroup label="Terminal">
        <Select value={selectedTerminal} onChange={value => setSelectedTerminal(value as string)}>
          {terminals.map((t, i) => (
            <Option key={i} value={t}>
              {t}
            </Option>
          ))}
        </Select>
      </FormGroup>

      <FormGroup label="Pair">
        <div className={styles['pair-row']}>
          <Select value={selectedBase} onChange={value => setSelectedBase(value as string)}>
            {networkConfig.baseTokens?.map((token, i) => (
              <Option key={i} value={token.symbol}>
                <img src={token.logo} alt={token.symbol} className={styles['token-icon']} />
                {token.symbol}
              </Option>
            ))}
          </Select>
          <span className={styles['pair-sep']}>/</span>
          <Select value={selectedQuote} onChange={value => setSelectedQuote(value as string)}>
            {networkConfig.quoteTokens
              ?.filter(t => t.symbol !== selectedBase)
              .map((token, i) => (
                <Option key={i} value={token.symbol}>
                  <img src={token.logo} alt={token.symbol} className={styles['token-icon']} />
                  {token.symbol}
                </Option>
              ))}
          </Select>
        </div>
      </FormGroup>

      <FormGroup label="Strategy">
        <Select
          value={selectedStrategyIndex}
          onChange={value => setSelectedStrategyIndex(value as number)}
        >
          {networkConfig.strategies?.map((strategy, i) => (
            <Option key={i} value={i}>
              {strategy.description}
            </Option>
          ))}
        </Select>
      </FormGroup>

      <div className={styles['buttons']}>
        <button className={`${styles['create-button']} button`} disabled={!selectedBase || !selectedQuote}>
          Create Instance
        </button>
      </div>
    </div>
  )
}

export default CreateInstance


