const Block = require('../src/block')
const { GENESIS_DATA } = require('../src/config')
const cryptoHash = require('../src/crypto-hash')

describe('Block', () => {
  const timestamp = 'time'
  const lastHash = 'lastHash'
  const hash = 'hash'
  const data = ['a', 'b']

  const block = new Block({ timestamp, lastHash, hash, data })

  it('has timestamp, lastHash, hash and data', () => {
    expect(block.timestamp).toEqual(timestamp) //?
    expect(block.lastHash).toEqual(lastHash)
    expect(block.hash).toEqual(hash)
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

    it('creates a `hash` SHA-256 based on the proper inputs', () => {
      const inputs = [ minedBlock.timestamp, lastBlock.hash, data ]
      expect(minedBlock.hash).toEqual(cryptoHash(...inputs))
    })

    it('sets the `data`', () => {
      expect(minedBlock.data).toBe(data)
    })
  })
})
