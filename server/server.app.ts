import http from 'http'
import express from 'express'
import io from 'socket.io'
import bodyParser from 'body-parser'
import path from 'path'
import request from 'request'
import { Blockchain } from '../core/blockchain/blockchain.app'
import { PubSub } from '../core/app/pubsub'
import { TransactionPool } from '../core/wallet/transaction-pool'
import { Wallet } from '../core/wallet/wallet.app'
import { TransactionMiner } from '../core/app/transaction-miner'
import { seedBlockchain } from '../core/app/seed-blockchain'

const isDevelopment = process.env.ENV === 'development'

const app = express()

// socket io
const server = http.createServer(app);
const ioi = io(server);

ioi.on('connection', (socket) => {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', (data) => {
    console.log(data);
  });


app.use(bodyParser.json())
// Client react-app
app.use(express.static(path.join(__dirname, '../client/build')))
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'))
})

const blockchain = new Blockchain()
const transactionPool = new TransactionPool()
const wallet = new Wallet()
const pubsub = new PubSub({ blockchain, transactionPool, wallet })
const transactionMiner = new TransactionMiner({ blockchain, transactionPool, wallet, pubsub })

const DEFAULT_PORT = 8080
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`

app.get('/api/blocks', (req, res) => {
  res.json(blockchain.chain)
})

app.get('/api/blocks/length', (req, res) => {
  res.json(blockchain.chain.length)
})

app.get('/api/blocks/:id', (req, res) => {
  const id = Number(req.params.id)
  const { length } = blockchain.chain
  const blocksReversed = blockchain.chain.slice().reverse()
  let startIndex = (id - 1) * 5
  let endIndex = id * 5
  startIndex = startIndex < length ? startIndex : length
  endIndex = endIndex < length ? endIndex : length
  res.json(blocksReversed.slice(startIndex, endIndex))
})

app.post('/api/mine', (req, res) => {
  const { data } = req.body
  blockchain.addBlock({ data })
  pubsub.broadcastChain()
  res.redirect('/api/blocks')
})

app.post('/api/transact', (req, res) => {
  const { recipient, amount } = req.body
  let transaction = transactionPool.existingTransaction({ inputAddress: wallet.publicKey })

  try {
    if (transaction) {
      transaction.update({ senderWallet: wallet, recipient, amount })
    } else {
      transaction = wallet.createTransaction({ recipient, amount, chain: blockchain.chain })
    }
  } catch (error) {
    res.status(400).json({ type: 'error', message: error.message })
  }
  transactionPool.setTransaction(transaction)
  pubsub.broadcastTransaction(transaction)
  res.json({ type: 'success', transaction })
})

app.get('/api/transaction-pool-map', (req, res) => {
  res.json(transactionPool.transactionMap)
})

app.get('/api/mine-transactions', (req, res) => {
  transactionMiner.mineTransactions()
  res.redirect('/api/blocks')
})

app.get('/api/wallet-info', (req, res) => {
  const address = wallet.publicKey
  res.json({ address, balance: Wallet.calculateBalance({ chain: blockchain.chain, address }) })
})

app.get('/api/known-addresses', (req, res) => {
  const addressMap = {}
  for (let block of blockchain.chain) {
    for (let transaction of block.data) {
      const recipient = Object.keys(transaction.outputMap)
      recipient.forEach((recipient) => (addressMap[recipient] = recipient))
    }
  }

  res.json(Object.keys(addressMap))
})

const syncWithRootState = () => {
  request(`${ROOT_NODE_ADDRESS}/api/blocks`, (err, res, body) => {
    if (!err && res.statusCode === 200) {
      const rootChain = JSON.parse(body)
      console.log('replace chain on a sync with', rootChain)
      blockchain.replaceChain(rootChain)
    }
  })

  request(`${ROOT_NODE_ADDRESS}/api/transaction-pool-map`, (err, res, body) => {
    if (!err && res.statusCode === 200) {
      const rootTransactionPoolMap = JSON.parse(body)
      console.log('replace transaction pool map on a sync with', rootTransactionPoolMap)
      transactionPool.setMap(rootTransactionPoolMap)
    }
  })
}

// seed a blockchain
if (isDevelopment) seedBlockchain(blockchain, wallet, transactionPool, transactionMiner)

// dev-peer
let PEER_PORT
if (process.env.GENERATE_PEER_PORT === 'true') {
  PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000)
}

const PORT = process.env.PORT || PEER_PORT || DEFAULT_PORT
server.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`)

  if (PORT !== DEFAULT_PORT) {
    syncWithRootState()
  }
})
