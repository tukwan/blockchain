import React, { useState, useEffect, FC } from 'react'
import socketIOClient from 'socket.io-client'
import { Transaction, ITransaction } from './transaction'
import { CONFIG } from '../../config'

interface ITransactionPool {
  [hash: string]: ITransaction
}

export const TransactionPool: FC = () => {
  const [transactionPoolMap, setTransactionPoolMap] = useState<ITransactionPool>({})

  useEffect(() => {
    const socket = socketIOClient(CONFIG.API_URL)
    socket.on('FromAPIPool', (data) => {
      console.log('FromAPIPool', data)
      setTransactionPoolMap(data)
    })
    // fetchMineTransactions()
    return () => socket.disconnect()
  }, [])

  const fetchMineTransactions = async () => {
    const response = await fetch('/api/mine-transactions')
    const data = await response.json()
    // console.log(data)
    // setTransactionPoolMap(data)
  }

  return (
    <div className="pool">
      <h2>Transaction Pool</h2>
      <button className="btn btn-secondary" onClick={fetchMineTransactions}>
        Mine Transactions
      </button>
      <div className="pool-list">
        {Object.values(transactionPoolMap).map((transaction) => (
          <div key={transaction.id}>
            <Transaction transaction={transaction} />
          </div>
        ))}
      </div>
    </div>
  )
}
