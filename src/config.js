const MINE_RATE = 1000
const INIT_DIFFICULTY = 1

const GENESIS_DATA = {
  timestamp: 1,
  lastHash: '-----',
  hash: 'first hash',
  difficulty: INIT_DIFFICULTY,
  nonce: 0,
  data: []
}

module.exports = { GENESIS_DATA, MINE_RATE }
