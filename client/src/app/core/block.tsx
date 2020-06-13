import React, { FC } from 'react'
import { Transaction, ITransaction } from './transaction'

export interface IBlock {
  data: ITransaction[]
  difficulty: number
  hash: string
  lastHash: string
  nonce: number
  timestamp: Date
}
interface IProps {
  block: IBlock
}

export const Block: FC<IProps> = ({ block }) => {
  const { timestamp, hash, data } = block
  const hashDisplay = `${hash.substring(0, 15)}...`
  const stringifiedData = JSON.stringify(data)
  const dataDisplay =
    stringifiedData.length > 35 ? `${stringifiedData.substring(0, 35)}...` : stringifiedData
  const timestampDisply = new Date(timestamp).toLocaleDateString()

  return (
    <div>
      <p>
        <b>Hash:</b> {hashDisplay}
      </p>
      <p>
        <b>Timestamp:</b> {timestampDisply}
      </p>
      <p>
        <b>Data:</b> {dataDisplay}
      </p>
      <div>
        {data.map((transaction) => (
          <div key={transaction.id}>
            <hr />
            <Transaction transaction={transaction} />
          </div>
        ))}
      </div>
    </div>
  )
}
