import { Transaction } from '../wallet/transaction'
import { TransactionPool as ITransactionPoolClass } from '../wallet/transaction-pool'
import { Blockchain as IBlockchainClass } from '../blockchain/blockchain.app'
import { IWallet } from '../wallet/wallet.app'

export class TransactionMiner {
  blockchain: IBlockchainClass
  transactionPool: ITransactionPoolClass
  wallet: IWallet
  pubsub: any

  constructor({ blockchain, transactionPool, wallet, pubsub }) {
    this.blockchain = blockchain
    this.transactionPool = transactionPool
    this.wallet = wallet
    this.pubsub = pubsub
  }

  mineTransactions(): void {
    const validTransactions = this.transactionPool.validTransactions()
    validTransactions.push(Transaction.rewardTransaction({ minerWallet: this.wallet }))
    this.blockchain.addBlock({ data: validTransactions })
    this.pubsub.broadcastChain()
    this.transactionPool.clear()
  }
}
