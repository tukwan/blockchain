const PubNub = require('pubnub')

const credentials = {
  publishKey: 'pub-c-190af375-d9fe-4289-9dec-e028558356e0',
  subscribeKey: 'sub-c-0df161da-a56a-11ea-9d71-da51a68c7938',
  secretKey: 'sec-c-YjYwYjkyNTgtNDk0MS00OTlkLTllMjAtNDEwZDJlOGEzMGU3', // just for tests
}

const CHANNELS = {
  BLOCKCHAIN: 'BLOCKCHAIN',
  TRANSACTION: 'TRANSACTION',
}

class PubSub {
  constructor({ blockchain, transactionPool, wallet }) {
    this.blockchain = blockchain
    this.transactionPool = transactionPool
    this.wallet = wallet
    this.pubnub = new PubNub(credentials)
    this.pubnub.subscribe({ channels: Object.values(CHANNELS) })
    this.pubnub.addListener(this.listener())
  }

  subscribeToChannels() {
    this.pubnub.subscribe({
      channels: Object.values(CHANNELS),
    })
  }

  listener() {
    return {
      message: (messageObject) => {
        const { channel, message } = messageObject
        const parsedMessage = JSON.parse(message)
        console.log(`Message received. Channel: ${channel}. Message: ${message}`)

        switch (channel) {
          case CHANNELS.BLOCKCHAIN:
            this.blockchain.replaceChain(parsedMessage, () => {
              this.transactionPool.clearBlockchainTransactions({ chain: parsedMessage })
            })
            break
          case CHANNELS.TRANSACTION:
            // pubnub is not able to prevent self-broadcasts
            const isEmptyTransaction = !this.transactionPool.existingTransaction({
              inputAddress: this.wallet.publicKey,
            })
            if (isEmptyTransaction) this.transactionPool.setTransaction(parsedMessage)
            break
          default:
            break
        }
      },
    }
  }

  publish({ channel, message }) {
    this.pubnub.publish({ message, channel })
  }

  broadcastChain() {
    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain),
    })
  }

  broadcastTransaction(transaction) {
    this.publish({
      channel: CHANNELS.TRANSACTION,
      message: JSON.stringify(transaction),
    })
  }
}

module.exports = PubSub
