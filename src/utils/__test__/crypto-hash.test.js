const cryptoHash = require('../crypto-hash')

it('generate a SHA-256 hashed outpout', () => {
  expect(cryptoHash('test')).toEqual('9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08')
})