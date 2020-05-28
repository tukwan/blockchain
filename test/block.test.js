const Block = require('../src/block')

describe('Block', () => {
  const timestamp = 'time'
  const lastHash = 'lastHash'
  const hash = 'hash'
  const data = ['a', 'b']

  const block = new Block ({ timestamp, lastHash, hash, data })

  it('has timestamp, lastHash, hash and data', () => {
    expect(block.timestamp).toEqual(timestamp)
    expect(block.lastHash).toEqual(lastHash)
    expect(block.hash).toEqual(hash)
    expect(block.data).toEqual(data)
  })
})
