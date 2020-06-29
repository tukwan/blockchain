import React, { useState, useEffect, FC } from 'react'
import socketIOClient from 'socket.io-client'
import { Transaction, ITransaction } from './transaction'

interface ITransactionPool {
  [hash: string]: ITransaction
}

export const TransactionPool: FC = () => {
  const [transactionPoolMap, setTransactionPoolMap] = useState<ITransactionPool>({})

  useEffect(() => {
    const socket = socketIOClient('https://private-block.herokuapp.com/')
    socket.on('FromAPI', (data) => {
      console.log('FromAPI', data)
      setTransactionPoolMap(data)
    })
    return () => socket.disconnect()
  }, [])

  const fetchMineTransactions = async () => {
    const response = await fetch('/api/mine-transactions')
    const json = await response.json()
    console.log('mined', json)
  }

  return (
    <div className="pool">
      <h2>Transaction Pool:</h2>
      <button onClick={fetchMineTransactions}>Mine Transactions</button>
      <div className="pool-list">
        {Object.values(transactionPoolMap).map((transaction) => (
          <div key={transaction.id}>
            <hr />
            <Transaction transaction={transaction} />
          </div>
        ))}
      </div>
    </div>
  )
}
