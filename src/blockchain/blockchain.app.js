const Block = require('./block')
const cryptoHash = require('../utils/crypto-hash')

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()]
  }

  addBlock({ data }) {
    const newBlock = Block.mineBlock({
      lastBlock: this.chain[this.chain.length - 1],
      data,
    })
    this.chain.push(newBlock)
  }

  static isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false

    for (let i = 1; i < chain.length; i++) {
      const { timestamp, lastHash, hash, nonce, difficulty, data } = chain[i]
      const actualLastHash = chain[i - 1].hash
      const lastDifficulty = chain[i - 1].difficulty

      if (lastHash !== actualLastHash) return false

      const validateHash = cryptoHash(timestamp, lastHash, nonce, difficulty, data)
      if (hash !== validateHash) return false

      if (Math.abs(lastDifficulty - difficulty > 1)) return false
    }

    return true
  }

  replaceChain(chain) {
    if (chain.length <= this.chain.length) {
      console.error('chain is not long enough', chain)
      return
    }
    if (!Blockchain.isValidChain(chain)) {
      console.error('chain is invalid', chain)
      return
    }
    console.log('replacing chain with ', chain)
    this.chain = chain
  }
}

module.exports = Blockchain
