const Blockchain = require('../src/blockchain')
const Block = require('../src/block')

describe('Blockchain', () => {
  const blockchain = new Blockchain()

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
})
