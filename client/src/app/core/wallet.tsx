import React, { useState, useEffect, FC } from 'react'

interface IWalletInfo {
  balance: string
  address: string
}

const initWalletInfo = {
  balance: '',
  address: '',
}

export const Wallet: FC = () => {
  const [walletInfo, setWalletInfo] = useState<IWalletInfo>(initWalletInfo)
  useEffect(() => {
    const fetchWalletInfo = async () => {
      const response = await fetch('/api/wallet-info')
      const walletInfo = await response.json()
      setWalletInfo(walletInfo)
    }
    fetchWalletInfo()
  }, [])

  const { address, balance } = walletInfo
  return (
    <div>
      <h2>Wallet:</h2>
      <p>
        <b>Address:</b> {address}
      </p>
      <p>
        <b>Balance:</b> {balance}
      </p>
    </div>
  )
}
