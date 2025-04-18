import styles from './MintIntent.module.scss'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useAppKitAccount } from '@reown/appkit/react'
import { FormGroup, Checkbox } from '../../../ui'
import { useProtocolContext } from '../../../../context/ProtocolContext'

const GRIND_AMOUNT_MAP = [1, 5, 10, 20, 50, 75, 100]
const ETH = '0x0000000000000000000000000000000000000000'

function MintIntent() {
  const { provider, networkConfig, intentNFT } = useProtocolContext()
  const { address: userAddress } = useAppKitAccount()

  const [changeAddress, setChangeAddress] = useState<boolean>(false)
  const [receiverAddress, setReceiverAddress] = useState<string>('')
  const [price, setPrice] = useState<string>('0.1')
  const [grindAmount, setGrindAmount] = useState<number>(1)

  const checkRequired = () => {
    if (!provider) {
      console.error("provider not set!")
      return false
    }
    if(!networkConfig) {
      console.error("networkConfig not set!")
      return false
    }
    if(!intentNFT) {
      console.error("intentNFT not set!")
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
  }, [grindAmount])

  const calcPayment = async (): Promise<bigint> => {
    if(!checkRequired()) {
      return 0n
    }

    try {
      const paymentAmount = await intentNFT!.calcPayment(ETH, grindAmount)
      return paymentAmount
    } catch (error) {
      console.error("Error calculating payment: ", error)
      return 0n
    }
  }

  const handleMint = async () => {
    if(!checkRequired()) {
      return
    }

    try {
      const paymentAmount = await calcPayment()
      const receiver = receiverAddress ? receiverAddress : userAddress
      const tx = await intentNFT!.mintTo(ETH, receiver!, grindAmount, { value: paymentAmount })
      await tx.wait()
    } catch (error) {
      console.error("Error minting intent: ", error)
    }
  }

  const addGrindAmount = (num: number) => {
    setGrindAmount(prev => prev + num)
  }

  return (
    <div className={`${styles["form"]} form`}>
      <h2 className="form-title">Intent NFT</h2>
      <div className={styles["description"]}>
        <p>Holds grinds amount for auto grinding with GrinderAI</p>
      </div>
      <FormGroup label={`Grinds Amount ~ (${grindAmount} times)`}>
        <div className={`${styles["grind-amount-input"]} form-input`}>
          <input
            type="number"
            value={grindAmount}
            placeholder="0"
            onChange={(e) => setGrindAmount(Number(e.target.value))}
          />
        </div>
        <div className={styles["grind-amount-buttons"]}>
          {GRIND_AMOUNT_MAP.map((num) => (
            <button key={num} className={styles["grind-amount-button"]} onClick={() => addGrindAmount(num)}>
              +{num}
            </button>
          ))}
        </div>
      </FormGroup>
      <FormGroup>
        <Checkbox defaultChecked={false} onChange={setChangeAddress}>
          Receiver wallet (optional)
        </Checkbox>
        {changeAddress && (
          <div className="form-input">
            <input
              type="text"
              value={receiverAddress}
              placeholder="0x..."
              onChange={(e) => setReceiverAddress(e.target.value)}
            />
          </div>
        )}
      </FormGroup>
      <div className="form-label">
        <span className="price-label">Price:</span> <span className="price-value">{price} ETH</span>
      </div>
      <button className={`${styles["button"]} button`} onClick={handleMint}>
        Mint
      </button>
    </div>
  )
}

export default MintIntent