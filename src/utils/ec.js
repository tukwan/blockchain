const elliptic = require('elliptic')
const cryptoHash = require('./crypto-hash')

const ec = new elliptic.ec('secp256k1')

const verifySignature = ({ publicKey, data, signature }) => {
  const keyFromPublic = ec.keyFromPublic(publicKey, 'hex')
  return keyFromPublic.verify(cryptoHash(data), signature)
}

module.exports = { ec, verifySignature }
