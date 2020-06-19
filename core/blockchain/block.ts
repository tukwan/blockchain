import hexToBinary from 'hex-to-binary'
import { GENESIS_DATA, MINE_RATE } from '../config'
import { cryptoHash } from '../utils'

export interface IBlock {
  timestamp: number
  lastHash: string
  hash: string
  nonce: number
  difficulty: number
  data: any[]
}
export interface Block extends IBlock {}

export class Block implements IBlock {
  constructor({ timestamp, lastHash, hash, nonce, difficulty, data }: IBlock) {
    this.timestamp = timestamp
    this.lastHash = lastHash
    this.hash = hash
    this.nonce = nonce
    this.difficulty = difficulty
    this.data = data
  }

  static genesis(): IBlock {
    return new this(GENESIS_DATA)
  }

  static mineBlock(
    { lastBlock, data }: { lastBlock: IBlock; data: any[] },
    mineBlockStats
  ): IBlock {
    const lastHash = lastBlock.hash
    let hash: string, timestamp: number
    let { difficulty } = lastBlock
    let nonce = 0

    do {
      nonce++
      timestamp = Date.now()
      difficulty = Block.adjustDifficulty({ originalBlock: lastBlock, timestamp })
      hash = cryptoHash(timestamp, lastHash, nonce, difficulty, data)
      if (mineBlockStats) mineBlockStats({ difficulty, hash })
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

  static adjustDifficulty({
    originalBlock,
    timestamp,
  }: {
    originalBlock: IBlock
    timestamp: number
  }): number {
    const { difficulty } = originalBlock
    if (difficulty < 1) return 1
    if (timestamp - originalBlock.timestamp > MINE_RATE) return difficulty - 1
    return difficulty + 1
  }
}
