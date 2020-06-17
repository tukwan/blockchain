import { Transaction, ITx } from './transaction'
import { STARTING_BALANCE } from '../config'
import { ec, cryptoHash } from '../utils'
import { IBlockchain } from '../blockchain/blockchain.app'

export type IWallet = Wallet

export class Wallet {
  balance = STARTING_BALANCE
  keyPair = ec.genKeyPair()
  publicKey = this.keyPair.getPublic().encode('hex')

  sign(data: any): {} {
    return this.keyPair.sign(cryptoHash(data))
  }

  createTransaction({
    recipient,
    amount,
    chain,
  }: {
    recipient: string
    amount: number
    chain: IBlockchain
  }): ITx {
    if (chain) {
      this.balance = Wallet.calculateBalance({
        chain,
        address: this.publicKey,
      })
    }
    if (amount > this.balance) {
      throw new Error('Amount exceeds balance')
    }

    return new Transaction({ senderWallet: this, recipient, amount })
  }

  static calculateBalance({ chain, address }: { chain: IBlockchain; address: string }): number {
    let outputsTotal = 0
    let hasConductedTransaction = false

    for (let i = chain.length - 1; i > 0; i--) {
      const block = chain[i]

      for (let transaction of block.data) {
        if (transaction.input.address === address) hasConductedTransaction = true
        const addressOutput = transaction.outputMap[address]
        if (addressOutput) outputsTotal = outputsTotal + addressOutput
      }

      if (hasConductedTransaction) break
    }

    return hasConductedTransaction ? outputsTotal : STARTING_BALANCE + outputsTotal
  }
}
