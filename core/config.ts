import { IBlock } from './blockchain/block'

const MINE_RATE = 1000
const INIT_DIFFICULTY = 1
const STARTING_BALANCE = 1000

const GENESIS_DATA: IBlock = {
  timestamp: 1,
  lastHash: '-----',
  hash: 'first hash',
  difficulty: INIT_DIFFICULTY,
  nonce: 0,
  data: [],
}

const REWARD_INPUT = { address: '*authorized-reward*' }
const MINING_REWARD = 50

export { GENESIS_DATA, MINE_RATE, STARTING_BALANCE, REWARD_INPUT, MINING_REWARD }
