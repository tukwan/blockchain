const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const Blockchain = require('./src/blockchain')
const PubSub = require('./pubsub')

const app = express()
app.use(bodyParser.json())

const blockchain = new Blockchain()
const pubsub = new PubSub({ blockchain })

const DEFAULT_PORT = 3000
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`

app.get('/api/blocks', (req, res) => {
  return res.json(blockchain.chain)
})

app.post('/api/mine', (req, res) => {
  const { data } = req.body
  blockchain.addBlock({ data })
  pubsub.broadcastChain()
  res.redirect('/api/blocks')
})

const syncChains = () => {
  request(`${ROOT_NODE_ADDRESS}/api/blocks`, (err, res, body) => {
    if (!err && res.statusCode === 200) {
      const rootChain = JSON.parse(body)
      console.log('replace chain on a sync with', rootChain)
      blockchain.replaceChain(rootChain)
    }
  })
}

// dev-peer
let PEER_PORT
if (process.env.GENERATE_PEER_PORT === 'true') {
  PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000)
}

const PORT = PEER_PORT || DEFAULT_PORT
app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`)

  if (PORT !== DEFAULT_PORT) {
    syncChains()
  }
})
