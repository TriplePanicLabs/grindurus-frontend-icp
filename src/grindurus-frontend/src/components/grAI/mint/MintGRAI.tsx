import { useAppKitAccount } from '@reown/appkit/react'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'

import { Checkbox, FormGroup } from '@/components/ui'
import { useProtocolContext } from '@/context/ProtocolContext'
import { useIsMobile } from '@/hooks'

import styles from './MintGRAI.module.scss'

const GRAI_AMOUNT_MAP = [1, 5, 10, 20, 50, 75, 100]
const GRAI_AMOUNT_MAP_MOBILE = [1, 5, 10, 20, 50]
const ETH = '0x0000000000000000000000000000000000000000'

function MintGRAI() {
  const { provider, networkConfig, grinderAI } = useProtocolContext()
  const { address: userAddress } = useAppKitAccount()

  const [ethPrice, setEthPrice] = useState<number>(2500)
  const [changeAddress, setChangeAddress] = useState<boolean>(false)
  const [receiverAddress, setReceiverAddress] = useState<string>('')
  const [price, setPrice] = useState<string>('0.0')
  const [graiAmount, setGraiAmount] = useState<number>(1)

  const isMobile = useIsMobile(500)

  const checkRequired = () => {
    if (!provider) {
      console.error('provider not set!')
      return false
    }
    if (!networkConfig) {
      console.error('networkConfig not set!')
      return false
    }
    if (!grinderAI) {
      console.error('grinderAI not set!')
      return false
    }
    return true
  }

  const initPrice = async () => {
    const paymentAmountRaw = await calcPayment()
    const paymentAmount = ethers.formatUnits(paymentAmountRaw, 18)
    setPrice(paymentAmount)
  }

  useEffect(() => {
    initPrice()
  }, [graiAmount])

  const calcPayment = async (): Promise<bigint> => {
    if (!checkRequired()) {
      return 0n
    }

    try {
      const paymentAmount = await grinderAI!.calcPayment(ETH, graiAmount)
      return paymentAmount
    } catch (error) {
      console.error('Error calculating payment: ', error)
      return 0n
    }
  }

  const handleMint = async () => {
    if (!checkRequired()) {
      return
    }

    try {
      const paymentAmount = await calcPayment()
      const receiver = receiverAddress ? receiverAddress : userAddress
      const tx = await grinderAI!.mintTo(ETH, receiver!, graiAmount, { value: paymentAmount })
      await tx.wait()
    } catch (error) {
      console.error('Error minting intent: ', error)
    }
  }

  const addGrindAmount = (num: number) => {
    setGraiAmount(prev => prev + num)
  }

  return (
    <>
        <div className={`${styles['container']}`}>
          <div className={`${styles['mint-grai-form']} form`}>
            <h2 className="form-title">Mint grAI</h2>
            <div className={`${styles['grai-description']}`}>GrinderAI attention token</div>
            <FormGroup label={`grAI Amount`}>
              <div className={`${styles['grai-amount-input']} form-input`}>
                <input
                  type="number"
                  value={graiAmount}
                  placeholder="0"
                  onChange={e => setGraiAmount(Number(e.target.value))}
                />
              </div>
              <div className={styles['grai-amount-buttons']}>
                {(isMobile ? GRAI_AMOUNT_MAP_MOBILE : GRAI_AMOUNT_MAP).map(num => (
                  <button
                    key={num}
                    className={styles['grai-amount-button']}
                    onClick={() => addGrindAmount(num)}
                  >
                    +{num}
                  </button>
                ))}
              </div>
            </FormGroup>
            <FormGroup className={`${changeAddress ? styles['checked'] : styles['not-checked']}`}>
              <Checkbox defaultChecked={false} onChange={setChangeAddress}>
                {changeAddress ? (
                  <div className="form-input">
                    <input
                      type="text"
                      placeholder="Enter recepient address"
                      onChange={e => setReceiverAddress(e.target.value)}
                      onClick={e => e.stopPropagation()}
                    />
                  </div>
                ) : (
                  'Another Recepient'
                )}
              </Checkbox>
            </FormGroup>
            <div className="form-label">
              Price: {price} ETH (${(Number(price) * ethPrice).toFixed(2)})
            </div>
            <div className={styles['buttons']}>
              <button className={`${styles['button']} button`} onClick={handleMint}>
                Mint
              </button>
            </div>
          </div>
        </div>
    </>
  )
}

export default MintGRAI
