import { v1 as uuid } from 'uuid'
import { verifySignature } from '../utils'
import { REWARD_INPUT, MINING_REWARD } from '../config'
import { IWallet } from '../wallet/wallet.app'

interface ITxInput {
  timestamp?: number
  amount?: number
  address: string
  signature?: any
}
interface ITxOutput {
  [address: string]: number
}
export type ITx = Transaction

export class Transaction {
  id: number
  outputMap: ITxOutput
  input: ITxInput

  constructor({
    senderWallet,
    recipient,
    amount,
    outputMap,
    input,
  }: {
    senderWallet?: IWallet
    recipient?: string
    amount?: number
    outputMap?: ITxOutput
    input?: ITxInput
  }) {
    this.id = uuid()
    this.outputMap = outputMap || this.createOutputMap({ senderWallet, recipient, amount })
    this.input = input || this.createInput({ senderWallet, outputMap: this.outputMap })
  }

  createOutputMap({
    senderWallet,
    recipient,
    amount,
  }: {
    senderWallet: IWallet
    recipient: string
    amount: number
  }): ITxOutput {
    const outputMap = {}
    outputMap[recipient] = amount
    outputMap[senderWallet.publicKey] = senderWallet.balance - amount
    return outputMap
  }

  createInput({
    senderWallet,
    outputMap,
  }: {
    senderWallet: IWallet
    outputMap: ITxOutput
  }): ITxInput {
    return {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(outputMap),
    }
  }

  update({
    senderWallet,
    recipient,
    amount,
  }: {
    senderWallet: IWallet
    recipient: string
    amount: number
  }): void {
    if (amount > this.outputMap[senderWallet.publicKey]) throw new Error('Amount exceeds balance')

    if (!this.outputMap[recipient]) {
      this.outputMap[recipient] = amount
    } else {
      this.outputMap[recipient] = this.outputMap[recipient] + amount
    }

    this.outputMap[senderWallet.publicKey] = this.outputMap[senderWallet.publicKey] - amount

    this.input = this.createInput({ senderWallet, outputMap: this.outputMap })
  }

  static validTransaction(transaction: ITx): boolean {
    const {
      input: { address, amount, signature },
      outputMap,
    } = transaction

    const outputTotal = Object.values(outputMap).reduce(
      (totalAmount, outputAmount) => totalAmount + outputAmount
    )

    if (amount !== outputTotal) {
      console.error(`Invalid transaction from ${address}`)
      return false
    }
    if (!verifySignature({ publicKey: address, data: outputMap, signature: signature })) {
      console.error(`Invalid signature from ${address}`)
      return false
    }

    return true
  }

  static rewardTransaction({ minerWallet }: { minerWallet: IWallet }): ITx {
    return new this({
      input: REWARD_INPUT,
      outputMap: { [minerWallet.publicKey]: MINING_REWARD },
    })
  }
}
