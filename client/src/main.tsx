import React, { useState, useEffect } from 'react'

interface IWalletInfo {
  balance: string
  address: string
}

export const Main = () => {
  const [walletInfo, setWalletInfo] = useState<IWalletInfo>({
    balance: '',
    address: '',
  })
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
      <h1>Blockchain App</h1>
      <p>Address: {address}</p>
      <p>Balance: {balance}</p>
    </div>
  )
}
