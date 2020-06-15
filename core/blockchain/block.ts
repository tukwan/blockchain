const hexToBinary = require('hex-to-binary')
const { GENESIS_DATA, MINE_RATE } = require('../config')
const { cryptoHash } = require('../utils')

export class Block {
  timestamp: Date
  lastHash: string
  hash: string
  nonce: number
  difficulty: number
  data: {}
  adjustDifficulty({ originalBlock: Block, timestamp: Date  }): void

  constructor({ timestamp, lastHash, hash, nonce, difficulty, data }) {
    this.timestamp = timestamp
    this.lastHash = lastHash
    this.hash = hash
    this.nonce = nonce
    this.difficulty = difficulty
    this.data = data
  }

  static genesis() {
    return new this(GENESIS_DATA)
  }

  static mineBlock({ lastBlock, data }) {
    const lastHash = lastBlock.hash
    let hash, timestamp
    let { difficulty } = lastBlock
    let nonce = 0

    do {
      nonce++
      timestamp = Date.now()
      difficulty = Block.adjustDifficulty({ originalBlock: lastBlock, timestamp })
      hash = cryptoHash(timestamp, lastHash, nonce, difficulty, data)
    } while (hexToBinary(hash).substring(0, difficulty) !== '0'.repeat(difficulty))

    return new this({
      timestamp,
      lastHash,
      hash,
      difficulty,
      nonce,
      data,
    })
  }

  public static adjustDifficulty({ originalBlock, timestamp }) {
    const { difficulty } = originalBlock
    if (difficulty < 1) return 1
    if (timestamp - originalBlock.timestamp > MINE_RATE) return difficulty - 1
    return difficulty + 1
  }
}
