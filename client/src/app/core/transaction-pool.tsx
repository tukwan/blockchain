import React, { useState, useEffect, FC } from 'react'
import { Transaction, ITransaction } from './transaction'

interface ITransactionPool {
  [hash: string]: ITransaction
}

const POOL_INTERVAL_MS = 10000

export const TransactionPool: FC = () => {
  const [transactionPoolMap, setTransactionPoolMap] = useState<ITransactionPool>({})

  useEffect(() => {
    const fetchTransactionPoolMap = async () => {
      const response = await fetch('/api/transaction-pool-map')
      const json = await response.json()
      setTransactionPoolMap(json)
    }
    fetchTransactionPoolMap()

    const intervalFetchPoolMap = setInterval(() => {
      fetchTransactionPoolMap()
    }, POOL_INTERVAL_MS)
    return () => clearInterval(intervalFetchPoolMap)
  }, [])

  const fetchMineTransactions = async () => {
    const response = await fetch('/api/mine-transactions')
    const json = await response.json()
    console.log('mined', json)
  }

  return (
    <div>
      <h2>Transaction Pool:</h2>
      <button onClick={fetchMineTransactions}>Mine Transactions</button>
      {Object.values(transactionPoolMap).map((transaction) => (
        <div key={transaction.id}>
          <hr />
          <Transaction transaction={transaction} />
        </div>
      ))}
    </div>
  )
}
