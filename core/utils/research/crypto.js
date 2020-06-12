// Research bitcoin: Private Key / Public Key / Sign / Verify / Address
const elliptic = require('elliptic')
const { SHA256, RIPEMD160 } = require('crypto-js')
const crypto = require('crypto') // node module
const BS58 = require('bs58')
const BN = require('bn.js')

// ----------------------------
// -------- Set up ECDSA ------
// ----------------------------
// ECDSA: Elliptic Curve Digital Signature Algorithm
// secp256k1 (y^2 = x^3 + 7)
// Bitcoin Domain Parameters: (http://www.secg.org/sec2-v2.pdf - Page 9)
// curve  = y^2 = x^3 + Acurve * x + Bcurve
// Pcurve = 2**256 - 2**32 - 2**9 - 2**8 - 2**7 - 2**6 - 2**4 -1   // The proven prime
// Acurve = 0
// Bcurve = 7
// Gx = 0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798
// Gy = 0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8
// GPoint = (Gx, Gy)   // Generator point
// N = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141
// N -> Number of points in the field / Straight line up&down on the chart = GPoint * N / How many private keys can be in bitocin
const ec = new elliptic.ec('secp256k1')

// -----------------------------
// -------- Private Key --------
// -----------------------------
// Generate a Private key: BIG number of 256 bits < N
// should be random, not pseudo-random
console.log(' -------- Private Key --------')
const privKey = crypto.randomBytes(32).toString('hex')
const N = new BN('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141', 16)
const privKeyBN = new BN(privKey, 16)
console.log('Private key valid? (key < N):', privKeyBN.lt(N))
console.log('Private key: ', privKey)
console.log()

// ----------------------------
// -------- Public Key --------
// ----------------------------
// Get a Public key from a Private key
// Use elliptic curve multiplication (bouncing around a graph of an elliptic curve)
// to get cooridnates of the final RPoint (Rx, Ry) = publicKey = privateKey * GPoint
// Graphical view: Draw a tangent -> Take the intersect -> Find the inverse (flip it over)
console.log('-------- Public Key --------')
const keyPair = ec.keyFromPrivate(privKey)

// Public key: = RPoint (Rx, Ry) = (32 bytes / 32 bytes)
const pubKey = keyPair.getPublic()
const pubKey_x = pubKey.getX().toString(16) // hex
const pubKey_y = pubKey.getY().toString(16) // hex
console.log('Public key Px:', pubKey_x)
console.log('Public key Py:', pubKey_y)

// Public key: Uncompressed
// Add 0x04 for uncompressed: 04(Rx)(Ry)
const uncompPubKey = pubKey.encode('hex')
console.log('Public key (uncompressed):', uncompPubKey)

// Public key: Compressed
// Only R(x) coordiante
// R(y) can be easlily compute from y^2 = x^3 + 7 (secp256k1)
// Add 0x02: If R(y) is even, it’s above the x-axis
// Add 0x03  If R(y) is odd, it’s below the x-axis
console.log('Public key (compressed):', pubKey.encodeCompressed('hex'))
console.log()

// -----------------------------
// -------- ECDSA Signing ------
// -----------------------------
console.log('-------- ECDSA Signing ------')
const txData = 'My bitcoin transaction data'
const txDataHash = SHA256(txData).toString()
console.log('TX data:', txData)
console.log('Tx data hash:', txDataHash)

// Signature Generation: simplified steps
// Private Key + Data Hash -> Signature(r,s)
// 1. Generate random number RandNum
// 2. R(Rx,Ry) = RandNum * GPoint
// 3. r = Rx
// 4. s = (r * PrivKey + txDataHash) / RandNum
const signature = ec.sign(txDataHash, privKey, 'hex')
const r = signature.r.toString(16)
const s = signature.s.toString(16)
console.log('Signature is (r,s):')
console.log('r:', r)
console.log('s:', s)

// Signature Verification: simplified steps
// Signature + Public key -> Data Hash == Data Hash (original)
// Find out if verfied point Vx == Rx from Signature Generation
// 1. u1 = txDataHash / s
// 2. u2 = r / s
// 3. (Vx,Vy) = u1 * GPoint + u2 * PublicKey
// 4. Rx == Vx  // r == Vx
const validSignature = ec.verify(txDataHash, signature, pubKey)
console.log('Signature valid?', validSignature)
console.log()

// ---------------------------------
// -------- Bitcoin Address --------
// ---------------------------------
// Get a Bitcoin address from a Public key
// Based on: https://en.bitcoin.it/wiki/Technical_background_of_version_1_Bitcoin_addresses
console.log(' -------- Bitcoin Address --------')
// 1. SHA-256 of uncompressed Public key
const hash1 = SHA256(uncompPubKey).toString()

// 2. RIPEMD-160 of #1
const hash2 = RIPEMD160(hash1).toString()

// 3. Add first 1 byte of network ID (0x00 main net) to #2
const hash3Network = '00' + hash2

// 4. SHA-256 of #3
const hash4 = SHA256(hash3Network).toString()

// 5. SHA-256 of #4
const hash5 = SHA256(hash4).toString()

// 6. Get first 4 bytes of #5 (address checksum)
const addresChecksum = hash5.substring(0, 8)

// 7. Add #7 at the end of #3  (25 bytes)
const addressWithNetworkAndChecksum = hash3Network + addresChecksum
// 8. BS58 of #7
const bitcoinAddress = BS58.encode(Buffer.from(addressWithNetworkAndChecksum, 'hex'))
console.log('Bitcoin Address:', bitcoinAddress)
