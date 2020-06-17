import { Transaction, ITx } from './transaction'
import { IBlockchain } from 'core/blockchain/blockchain.app'

interface ITransactionPool {
  [transactionID: string]: ITx
}

export class TransactionPool {
  transactionMap = {} as ITransactionPool

  clear(): void {
    this.transactionMap = {}
  }

  setTransaction(transaction: ITx): void {
    this.transactionMap[transaction.id] = transaction
  }

  setMap(transactionMap: ITransactionPool): void {
    this.transactionMap = transactionMap
  }

  existingTransaction({ inputAddress }: { inputAddress: string }): ITx {
    const transactions = Object.values(this.transactionMap)
    return transactions.find((transaction) => transaction.input.address === inputAddress)
  }

  validTransactions(): ITx[] {
    return Object.values(this.transactionMap).filter((transaction) =>
      Transaction.validTransaction(transaction)
    )
  }

  clearBlockchainTransactions({ chain }: { chain: IBlockchain }): void {
    for (let i = 0; i < chain.length; i++) {
      const block = chain[i]

      for (let transaction of block.data) {
        if (this.transactionMap[transaction.id]) delete this.transactionMap[transaction.id]
      }
    }
  }
}
