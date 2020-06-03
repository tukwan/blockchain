const express = require('express')
const bodyParser = require('body-parser')
const Blockchain = require('./src/blockchain')
const PubSub = require('./pubsub')

const app = express()
const PORT = 3000
app.use(bodyParser.json())
const blockchain = new Blockchain()
const pubsub = new PubSub({ blockchain })

setTimeout(() => {
  pubsub.broadcastChain()
}, 1000)

app.get('/api/blocks', (req, res) => res.json(blockchain.chain))

app.post('/api/mine', (req, res) => {
  const { data } = req.body
  blockchain.addBlock({ data })
  res.redirect('/api/blocks')
})

app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`))
