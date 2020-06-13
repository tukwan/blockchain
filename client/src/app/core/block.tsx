import React, { FC } from 'react'

export interface IBlock {
  data: []
  difficulty: number
  hash: string
  lastHash: string
  nonce: number
  timestamp: Date
}

export const Block: FC<IBlock> = ({ timestamp, hash, data }) => {
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
    </div>
  )
}
