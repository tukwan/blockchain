const Blockchain = require('../src/blockchain')
const Block = require('../src/block')

describe('Blockchain', () => {
  let blockchain = new Blockchain()

  it('containas a `chain` Array of instance', () => {
    expect(blockchain.chain instanceof Array).toBe(true)
  })

  it('starts with the genesis block', () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis())
  })

  it('adds a new block to the chain', () => {
    const newData = 'new data'
    blockchain.addBlock({ data: newData })
    const lastBlockInChain = blockchain.chain[blockchain.chain.length - 1]
    expect(lastBlockInChain.data).toEqual(newData)
  })

  describe('isValidChain()', () => {
    describe('when the chain does not start with the genesis block', () => {
      it('returns false', () => {
        blockchain = new Blockchain()
        blockchain.chain[0] = { data: 'fake block' }
        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)
      })
    })

    describe('when the chain starts with the genesis block and has muliple blocks', () => {
      beforeEach(() => {
        blockchain = new Blockchain()
        blockchain.addBlock({ data: 'a1' })
        blockchain.addBlock({ data: 'a2' })
        blockchain.addBlock({ data: 'a3' })
      })

      describe('and a lastHash reference has change', () => {
        it('returns false', () => {
          blockchain.chain[2].hash = 'fake hash'
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)
        })
      })

      describe('and the chain contains a block with an invalid field ', () => {
        it('returns false', () => {
          blockchain.chain[2].data = 'fake data'
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)
        })
      })

      describe('and the chain does not contain any invalid blocks ', () => {
        it('returns true', () => {
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(true)
        })
      })
    })
  })
})
