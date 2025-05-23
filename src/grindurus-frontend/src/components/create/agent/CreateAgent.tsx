import { useAppKitAccount } from '@reown/appkit/react'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'

import { FormGroup, Option, Select, Checkbox } from '@/components/ui'
import { Token } from '@/config'
import { useProtocolContext } from '@/context/ProtocolContext'
import { useIsMobile } from '@/hooks'
import { ERC20, ERC20__factory } from '@/typechain-types'

import styles from './CreateAgent.module.scss'
import Config from '../config/Config'
import { IURUS, IAgent } from '@/typechain-types/AgentsNFT'

function CreateAgent() {
  const { provider, networkConfig, poolsNFT, agentsNFT } = useProtocolContext()
  const { address: userAddress } = useAppKitAccount()

  const [isApproved, setIsApproved] = useState<boolean>(false)
  const [selectedStrategyId, setSelectedStrategyId] = useState<number>(1)
  const [selectedQuoteToken, setSelectedQuoteToken] = useState<string>(
    networkConfig.quoteTokens![1].symbol,
  )
  const [selectedBaseToken, setSelectedBaseToken] = useState<string>(
    networkConfig.baseTokens![0].symbol,
  )

  const [quoteTokenContract, setQuoteTokenContract] = useState<ERC20 | null>(null)
  const [quoteTokenAmount, setQuoteTokenAmount] = useState<string>('')
  const [quoteTokenInfo, setQuoteTokenInfo] = useState<Token | null>(null)

  const [config, setConfig] = useState({});
  

  const [liquidityFragment, setLiqudityFragment] = useState<string>('')
  const [positionsMax, setPositionsMax] = useState<string>('3')
  const [subnodesMax, setSubnodesMax] = useState<string>('1')

  const [waitApproving, setWaitApproving] = useState<boolean>(false)
  const [waitCreate, setWaitCreate] = useState<boolean>(false)

  const isMobile = useIsMobile(1000)

  useEffect(() => {
    initQuoteToken()
  }, [networkConfig, selectedQuoteToken, provider])

  useEffect(() => {
    checkAllowance()
  }, [quoteTokenAmount])

  const initQuoteToken = async () => {
    if (!provider) return console.error('Provider not found!')

    const tokenInfo = networkConfig.quoteTokens!.find(q => q.symbol === selectedQuoteToken)
    if (!tokenInfo) return console.error('tokenInfo not found!')
    setQuoteTokenInfo(tokenInfo)

    const quoteTokenAddress = tokenInfo!.address
    const signer = await provider.getSigner()
    const contract = ERC20__factory.connect(quoteTokenAddress, signer)
    setQuoteTokenContract(contract)
  }

  const recalcMaxLiquidity = async () => {
    try {
      checkRequired()
      setWaitApproving(true)

      const balanceRaw = await quoteTokenContract!.balanceOf(userAddress!)
      const decimals = quoteTokenInfo!.decimals
      const balance = ethers.formatUnits(balanceRaw, decimals)

      setQuoteTokenAmount(balance)
      if (positionsMax == 'Infinity') {
        setPositionsMax('3')
      }
      const fragment = Number(balance) / Number(positionsMax)
      setLiqudityFragment(fragment.toFixed(decimals))
    } catch (err) {
      alert('Failed to fetch balance!')
      console.error('Error fetching balance: ', err)
    } finally {
      setWaitApproving(false)
    }
  }

  const recalcByLiqudity = async (liquidity: string) => {
    const fragment = Number(liquidity) / Number(positionsMax)
    setLiqudityFragment(fragment.toFixed(2))
  }

  const recalcByPositionsMax = async (positons: string) => {
    const fragment = Number(quoteTokenAmount) / Number(positons)
    setLiqudityFragment(fragment.toFixed(2))
  }

  const recalcByLiquidityFragment = async (fragment: string) => {
    const positionsMax = Math.floor(Number(quoteTokenAmount) / Number(fragment))
    setPositionsMax(positionsMax.toString())
  }

  const optimizePositionsMax = async () => {
    const optimizedPositionsMax = '3'
    setPositionsMax(optimizedPositionsMax)
    recalcByPositionsMax(optimizedPositionsMax)
  }


  const checkRequired = () => {
    if (!provider) return console.error('provider not set!')
    if (!quoteTokenContract) return console.error('quoteTokenContract is null!')
    if (!quoteTokenInfo) return console.error('quoteTokenInfo is null!')
  }

  const checkAllowance = async () => {
    try {
      checkRequired()

      const spenderAddress = networkConfig.agentsNFT!
      //console.log(spenderAddress)
      if (quoteTokenContract) {
        const allowanceRaw = await quoteTokenContract!.allowance(userAddress!, spenderAddress)
        const allowanceFormatted = ethers.formatUnits(allowanceRaw, quoteTokenInfo!.decimals)
        // console.log("allowanceFormatted: ", allowanceFormatted)
        // setIsApproved(true)
        setIsApproved(Number(quoteTokenAmount) <= Number(allowanceFormatted))
      }
    } catch (err) {
      console.error('Error checking allowance:', err)
    }
  }

  const handleApprove = async () => {
    try {
      checkRequired()
      setWaitApproving(true)

      const spenderAddress = networkConfig.agentsNFT
      const amount = ethers.parseUnits(quoteTokenAmount, quoteTokenInfo!.decimals)
      const tx = await quoteTokenContract!.approve(spenderAddress!, amount)
      await tx.wait()

      setIsApproved(true)
    } catch (err) {
      alert('Failed approve tokens')
      console.error('Error approving tokens', err)
    } finally {
      setWaitApproving(false)
    }
  }

  const handleCreate = async () => {
    try {
      checkRequired()
      if (!agentsNFT) return console.error('agentsNFT is null!')

      setWaitCreate(true)

      const strategyId = networkConfig.strategies![selectedStrategyId].id
      const baseTokenInfo = networkConfig.baseTokens!.find(b => b.symbol === selectedBaseToken)
      if (!baseTokenInfo || !quoteTokenInfo) return console.error('Tokens not set!')
      const baseTokenAddress = baseTokenInfo.address
      const quoteTokenAddress = quoteTokenInfo.address
      const quoteTokenDecimals = quoteTokenInfo.decimals
      const quoteTokenAmountRaw = ethers.parseUnits(quoteTokenAmount, quoteTokenDecimals)
      
      const agentConfig: IAgent.AgentConfigStruct = {
        liquidityFragment: ethers.parseUnits(liquidityFragment, quoteTokenDecimals),
        positionsMax: positionsMax,
        subnodesMax: subnodesMax
      }
      console.log(strategyId)
      console.log(baseTokenAddress)
      console.log(quoteTokenAddress)
      console.log(quoteTokenAmountRaw)
      console.log(config)
      console.log(agentConfig)
      const tx = await agentsNFT!.mint(
        strategyId,
        baseTokenAddress,
        quoteTokenAddress,
        quoteTokenAmountRaw,
        config as IURUS.ConfigStruct,
        agentConfig
      )
      await tx.wait()
    } catch (err) {
      alert('Error minting pool')
      console.error('Error minting pool', err)
    } finally {
      setWaitCreate(false)
    }
  }

  useEffect(() => {
    if (selectedQuoteToken === selectedBaseToken) {
      const fallback = networkConfig.quoteTokens!.find(q => q.symbol !== selectedBaseToken)
      if (fallback) setSelectedQuoteToken(fallback.symbol)
    }
  }, [selectedBaseToken])

  return (
    <div className={`${styles['form']} form`}>
      <div className={styles['header']}>
        <h2 className={`${styles['title']} form-title`}>Create Agent</h2>
        {/* <button
          className={`${styles['autofill-button']} ${
            configMode === 'default' ? styles['active'] : ''
          } button`}
        >
          {isMobile ? 'Autofill' : 'Autofill Fields'}
        </button> */}
      </div>
      <div className={styles['subtitle']}>
        <h2>Creation of agent with automated pools management</h2>
      </div>
      <FormGroup label="Strategy">
        <Select onChange={value => setSelectedStrategyId(value as number)}>
          {networkConfig.strategies!.map((strategy, index) => (
            <Option key={index} value={index}>
              {strategy.description}
            </Option>
          ))}
        </Select>
      </FormGroup>
      <FormGroup label="Base Token">
        <Select onChange={value => setSelectedBaseToken(value as string)}>
          {networkConfig.baseTokens!.map((token, index) => (
            <Option key={index} value={token.symbol}>
              <img src={token.logo} alt={token.symbol} className={styles['token-icon']} />
              {token.symbol}
            </Option>
          ))}
        </Select>
      </FormGroup>
      <FormGroup label="Quote Token">
        <Select onChange={value => setSelectedQuoteToken(value as string)}>
          {networkConfig
            .quoteTokens!.filter(t => t.symbol !== selectedBaseToken)
            .map((token, index) => (
              <Option key={index} value={token.symbol}>
                <img src={token.logo} alt={token.symbol} className={styles['token-icon']} />
                {token.symbol}
              </Option>
            ))}
        </Select>
      </FormGroup>
      <FormGroup label="Liquidity (Quote Token Amount)">
        <div className="form-input">
          <input
            value={quoteTokenAmount}
            placeholder="0"
            onChange={e => {
              setQuoteTokenAmount(e.target.value)
              recalcByLiqudity(e.target.value)
            }}
          />
          <button className="max-button button" type="button" onClick={recalcMaxLiquidity}>
            MAX
          </button>
        </div>
      </FormGroup>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ width: '49%' }}>
          <FormGroup 
            label='Liquidity Fragment'
            className={styles['form-group-left']}>
            <div className="form-input">
              <input
                value={liquidityFragment}
                placeholder="0"
                onChange={e => {
                  setLiqudityFragment(e.target.value)
                  recalcByLiquidityFragment(e.target.value)
                }}
              />
            </div>
          </FormGroup>
        </div>
        <div style={{ width: '49%' }}>
          <FormGroup 
            label='Liquidity Positions Max' 
            className={styles['form-group-right']}>
            <div className="form-input">
              <input
                value={positionsMax}
                placeholder="0"
                onChange={e => {
                  setPositionsMax(e.target.value)
                  recalcByPositionsMax(e.target.value)
                }}
              />
              <button className="max-button button" type="button" onClick={optimizePositionsMax}>
                OPTIMIZE
              </button>
            </div>
          </FormGroup>
        </div>
      </div>

      <Config setConfig={setConfig} setSubnodesMax={setSubnodesMax}/>

      <div className={styles['buttons']}>
        {!isApproved ? (
          <button
            className={`${styles['approve-button']} button`}
            onClick={handleApprove}
            disabled={waitApproving}
          >
            Approve
          </button>
        ) : (
          <button
            className={`${styles['mint-button']} button`}
            onClick={handleCreate}
            disabled={waitCreate}
          >
            Create Agent
          </button>
        )}
      </div>
    </div>
  )
}

export default CreateAgent
