import React, { FC } from 'react'
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
        </div>

        <div className="col">
          <Blocks />
        </div>

        <div className="col">
          <TransactionPool />
          <MiningStats />
        </div>
      </div>
    </div>
  )
}
