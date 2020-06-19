import React, { FC, useEffect } from 'react'
import socketIOClient from 'socket.io-client'
import { Wallet } from './core/wallet'
import { ConductTransaction } from './core/conduct-transaction'
import { Blocks } from './core/blocks'
import { TransactionPool } from './core/transaction-pool'

export const App: FC = () => {
  useEffect(() => {
    const socket = socketIOClient('http://localhost:8080')
    socket.on('FromAPI', (data) => {
      console.log('FromAPI', data)
    })
    return () => socket.disconnect()
  }, [])

  return (
    <>
      <Wallet />
      <ConductTransaction />
      <TransactionPool />
      <Blocks />
    </>
  )
}
