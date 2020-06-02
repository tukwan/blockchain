const Blockchain = require('../src/blockchain')
const Block = require('../src/block')
const R = require('ramda')

describe('Blockchain', () => {
  let blockchain, newChain, originalChain

  beforeEach(() => {
    blockchain = new Blockchain()
    newChain = new Blockchain()
    originalChain = R.clone(blockchain.chain)
  })

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

  describe('replaceChain()', () => {
    describe('when the new chain is not longer', () => {
      it('does not repleace the chain', () => {
        newChain.chain[0] = { data: 'a1' }
        blockchain.replaceChain(newChain.chain)
        expect(blockchain.chain).toEqual(originalChain)
      })
    })

    describe('when the new chain is longer', () => {
      beforeEach(() => {
        newChain.addBlock({ data: 'a1' })
        newChain.addBlock({ data: 'a2' })
        newChain.addBlock({ data: 'a3' })
      })

      describe('and the new chain is invalid', () => {
        it('does not repleace the chain', () => {
          newChain.chain[2].hash = 'fake hash'
          blockchain.replaceChain(newChain.chain)
          expect(blockchain.chain).toEqual(originalChain)
        })
      })

      describe('and the new chain is valid', () => {
        it('replaces the chain ', () => {
          blockchain.replaceChain(newChain.chain)
          expect(blockchain.chain).toEqual(newChain.chain)
        })
      })
    })
  })


})
