const elliptic = require('elliptic')

const ec = new elliptic.ec('secp256k1')

module.exports = { ec }
