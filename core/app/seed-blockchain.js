const Wallet = require('../wallet/wallet.app')

function seedBlockchain(chain, wallet, transactionPool, transactionMiner) {
  const walletA = wallet
  const walletB = new Wallet()
  const walletC = new Wallet()

  const generateWalletTransaction = ({ wallet, recipient, amount }) => {
    const transaction = wallet.createTransaction({ recipient, amount, chain })
    transactionPool.setTransaction(transaction)
  }

  const walletActionA = () =>
    generateWalletTransaction({
      wallet: walletA,
      recipient: walletB.publicKey,
      amount: 5,
    })
  const walletActionB = () =>
    generateWalletTransaction({
      wallet: walletB,
      recipient: walletC.publicKey,
      amount: 10,
    })
  const walletActionC = () =>
    generateWalletTransaction({
      wallet: walletC,
      recipient: walletA.publicKey,
      amount: 15,
    })

  for (let i = 0; i < 10; i++) {
    if (i % 3 === 0) {
      walletActionA()
      walletActionB()
    } else if (i % 3 === 1) {
      walletActionA()
      walletActionC()
    } else {
      walletActionB()
      walletActionC()
    }

    transactionMiner.mineTransactions()
  }
}

module.exports = seedBlockchain
