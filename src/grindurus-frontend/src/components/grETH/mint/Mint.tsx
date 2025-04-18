import styles from './Mint.module.scss'
import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useProtocolContext } from '../../../context/ProtocolContext'
import { useAppKitAccount } from '@reown/appkit/react'
import { FormGroup, Checkbox } from '../../ui'

function Mint() {
  const { networkConfig, grETH } = useProtocolContext()
  const { address: userAddress } = useAppKitAccount()

  const [mintAmount, setMintAmount] = useState<string>('')

  const [receiverAddress, setReceiverAddress] = useState<string>('')
  const [changeAddress, setChangeAddress] = useState<boolean>(false)

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (!mintAmount || parseFloat(mintAmount) <= 0) return console.error("mintAmount not set!")
      if(!grETH) return console.error("grETH not set!")

      const receiver = changeAddress ? receiverAddress : userAddress!
      const value = ethers.parseUnits(mintAmount, 18)

      const tx = await grETH.mintTo(receiver, { value })
      await tx.wait()
    } catch (err) {
      console.error('Mint failed:', err)
    }
  }

  const handleMaxClick = () => {
    // TODO: Change to user ETH balance
    setMintAmount('100')
  }

  const isFormValid = mintAmount && parseFloat(mintAmount) > 0

  return (
    <div className={`${styles["mint-form"]} form`}>
      <div className={`${styles["title"]} form-title`}>Mint grETH</div>
      <FormGroup label="grETH To Mint">
        <div className="form-input">
          <input
            value={mintAmount}
            placeholder="0"
            className="input-field"
            onChange={(e) => setMintAmount(e.target.value)}
          />
          <button
            type="button"
            onClick={handleMaxClick}
            className="max-button button"
          >
            MAX
          </button>
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
      <button
        className={`${styles["mint-button"]} button`}
        disabled={!isFormValid}
        onClick={handleMint}
      >
        Mint
      </button>
    </div>
  )
}

export default Mint