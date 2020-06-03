const PubNub = require('pubnub')

const credentials = {
  publishKey: 'pub-c-190af375-d9fe-4289-9dec-e028558356e0',
  subscribeKey: 'sub-c-0df161da-a56a-11ea-9d71-da51a68c7938',
  secretKey: 'sec-c-YjYwYjkyNTgtNDk0MS00OTlkLTllMjAtNDEwZDJlOGEzMGU3', // just for tests
}

const CHANNELS = {
  TEST: 'TEST',
  BLOCKCHAIN: 'BLOCKCHAIN',
}

class PubSub {
  constructor({ blockchain }) {
    this.blockchain = blockchain
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

        if (channel === CHANNELS.BLOCKCHAIN) {
          this.blockchain.replaceChain(parsedMessage)
        }
      },
    }
  }

  // PubNub fallback fix
  publish({ channel, message }) {
    this.pubnub.publish({ message, channel })
  }

  broadcastChain() {
    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain),
    })
  }
}

module.exports = PubSub
