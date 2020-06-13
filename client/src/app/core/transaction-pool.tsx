import React, { useState, useEffect, FC } from 'react'
import { Transaction, ITransaction } from './transaction'

interface ITransactionPool {
  [hash: string]: ITransaction
}

export const TransactionPool: FC = () => {
  const [transactionPoolMap, setTransactionPoolMap] = useState<ITransactionPool>({})

  useEffect(() => {
    const fetchTransactionPoolMap = async () => {
      const response = await fetch('/api/transaction-pool-map')
      const transactionPoolMapResponse = await response.json()
      setTransactionPoolMap(transactionPoolMapResponse)
    }
    fetchTransactionPoolMap()
  }, [])

  return (
    <div>
      <h2>Transaction Pool:</h2>
      {Object.values(transactionPoolMap).map((transaction) => (
        <div key={transaction.id}>
          <hr />
          <Transaction transaction={transaction} />
        </div>
      ))}
    </div>
  )
}
