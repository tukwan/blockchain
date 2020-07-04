# Private Blockchain

Bitcoin's implementation of Blockchain in JS.

## Demo

* https://private-block.herokuapp.com

<img src="https://i.ibb.co/8PR1nQH/Screen-Shot-2020-07-04-at-20-36-35.png" width="50%">

## Run Scripts
```json
"start": "node ./build/server/server.app.js",
"build": "yarn tsc",
"heroku-postbuild": "yarn tsc && yarn --cwd client install && yarn --cwd client build",
"dev-client": "yarn --cwd client start",
"dev-ts": "ENV='development' nodemon",
"dev": "ENV='development' node build/server/server.app.js",
"dev-peer": "GENERATE_PEER_PORT='true' nodemon build/server/server.app.js",
"test": "jest --watchAll"
```

## Built With
* Typescript
* Node
* Express
* PubNub
* Socket.IO
* React
* RxJS
* Heroku
* Test-driven development (TDD) 
* Jest

## Project Tree
```
.
├── client
│   ├── public
│   │   └── index.html
│   ├── src
│   │   ├── app
│   │   │   ├── core
│   │   │   │   ├── block.tsx
│   │   │   │   ├── blocks.tsx
│   │   │   │   ├── conduct-transaction.tsx
│   │   │   │   ├── mining-stats.tsx
│   │   │   │   ├── transaction-pool.tsx
│   │   │   │   ├── transaction.tsx
│   │   │   │   └── wallet.tsx
│   │   │   ├── app.scss
│   │   │   ├── app.tsx
│   │   │   └── index.ts
│   │   ├── config.ts
│   │   ├── index.tsx
│   │   └── react-app-env.d.ts
│   ├── .gitignore
│   ├── package.json
│   ├── README.md
│   ├── tsconfig.json
│   └── yarn.lock
├── core
│   ├── app
│   │   ├── pubsub.ts
│   │   ├── seed-blockchain.ts
│   │   └── transaction-miner.ts
│   ├── blockchain
│   │   ├── __test__
│   │   │   ├── block.test.ts
│   │   │   └── blockchain.app.test.ts
│   │   ├── block.ts
│   │   └── blockchain.app.ts
│   ├── utils
│   │   ├── __test__
│   │   │   └── crypto-hash.test.ts
│   │   ├── research
│   │   │   ├── average-time.ts
│   │   │   └── crypto.js
│   │   ├── elliptic.types.ts
│   │   └── index.ts
│   ├── wallet
│   │   ├── __test__
│   │   │   ├── transaction-pool.test.ts
│   │   │   ├── transaction.test.ts
│   │   │   └── wallet.app.test.ts
│   │   ├── transaction-pool.ts
│   │   ├── transaction.ts
│   │   └── wallet.app.ts
│   └── config.ts
├── server
│   └── server.app.ts
├── .eslintrc.js
├── .gitignore
├── .prettierrc
├── jest.config.js
├── nodemon.json
├── package.json
├── README.md
├── tsconfig.json
└── yarn.lock
```
