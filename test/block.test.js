const Block = require('../src/block')
const { GENESIS_DATA, MINE_RATE } = require('../src/config')
const cryptoHash = require('../src/crypto-hash')

describe('Block', () => {
  const timestamp = 2000
  const lastHash = 'lastHash'
  const hash = 'hash'
  const data = ['a', 'b']
  const nonce = 1
  const difficulty = 1

  const block = new Block({ timestamp, lastHash, hash, nonce, difficulty, data })

  it('has timestamp, lastHash, hash and data', () => {
    expect(block.timestamp).toEqual(timestamp)
    expect(block.lastHash).toEqual(lastHash)
    expect(block.hash).toEqual(hash)
    expect(block.nonce).toEqual(nonce)
    expect(block.difficulty).toEqual(difficulty)
    expect(block.data).toEqual(data)
  })

  describe('genesis()', () => {
    const genesisBlock = Block.genesis()

    it('return a Block instance', () => {
      expect(genesisBlock instanceof Block).toBe(true)
    })

    it('returns the gensis data', () => {
      expect(genesisBlock).toEqual(GENESIS_DATA)
    })
  })

  describe('mineBlock()', () => {
    const lastBlock = Block.genesis()
    const data = 'block data'
    const minedBlock = Block.mineBlock({ lastBlock, data })

    it('returns a Block instance', () => {
      expect(minedBlock instanceof Block).toBe(true)
    })

    it('sets a `timestamp`', () => {
      expect(minedBlock.timestamp).not.toEqual(undefined)
    })

    it('sets `lasthash` to be the `hash` of the lastBlock', () => {
      expect(minedBlock.lastHash).toBe(lastBlock.hash)
    })

    it('sets the `data`', () => {
      expect(minedBlock.data).toBe(data)
    })

    it('creates a `hash` SHA-256 based on the proper inputs', () => {
      const inputs = [
        minedBlock.timestamp,
        lastBlock.hash,
        minedBlock.nonce,
        minedBlock.difficulty,
        data,
      ]
      expect(minedBlock.hash).toEqual(cryptoHash(...inputs))
    })

    it('sets a `hash` that matches the difficulty criteria', () => {
      expect(minedBlock.hash.substring(0, minedBlock.difficulty)).toEqual(
        '0'.repeat(minedBlock.difficulty)
      )
    })

    it('adjust the difficulty', () => {
      const possibleResults = [lastBlock.difficulty + 1, lastBlock.difficulty - 1]
      expect(possibleResults.includes(minedBlock.difficulty)).toBe(true)
    })
  })

  describe('adjustDifficulty()', () => {
    it('raises the difficulty for a qucikly mined block', () => {
      expect(
        Block.adjustDifficulty({
          originalBlock: block,
          timestamp: block.timestamp + MINE_RATE - 100,
        })
      ).toEqual(block.difficulty + 1)
    })

    it('lowers the difficulty for a slowly mined block', () => {
      expect(
        Block.adjustDifficulty({
          originalBlock: block,
          timestamp: block.timestamp + MINE_RATE + 100,
        })
      ).toEqual(block.difficulty - 1)
    })

    it('has a lower limit of 1', () => {
      block.difficulty = -1
      expect(Block.adjustDifficulty({ originalBlock: block })).toEqual(1)
    })
  })
})
