const { cryptoHash } = require('../')

it('generate a SHA-256 hashed outpout', () => {
  expect(cryptoHash('test')).toEqual(
    '4d967a30111bf29f0eba01c448b375c1629b2fed01cdfcc3aed91f1b57d5dd5e'
  )
})

it('produces hash with th4d967a30111bf29f0eba01c448b375c1629b2fed01cdfcc3aed91f1b57d5dd5e e same input arguments in any order', () => {
  expect(cryptoHash('1', '2', '3')).toEqual(cryptoHash('2', '1', '3'))
})

it('produces a unique hash when properies have change on an input', () => {
  const foo = {}
  const originalHash = cryptoHash(foo)
  foo['a'] = 'a'

  expect(cryptoHash(foo)).not.toEqual(originalHash)
})
