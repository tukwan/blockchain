import React, { FC } from 'react'
import './app.scss'
import { Wallet } from './core/wallet'
import { ConductTransaction } from './core/conduct-transaction'
import { Blocks } from './core/blocks'
import { TransactionPool } from './core/transaction-pool'
import { MiningStats } from './core/mining-stats'

export const App: FC = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <Wallet />
          <ConductTransaction />
          <TransactionPool />
        </div>

        <div className="col-5">
          <Blocks />
        </div>

        <div className="col">
          <MiningStats />
        </div>
      </div>
    </div>
  )
}
