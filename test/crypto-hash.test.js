const cryptoHash = require('../src/crypto-hash')

describe('generate a SHA-256 hashed outpout', () => {
  expect(cryptoHash('test')).toEqual('...')
})
