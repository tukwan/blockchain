import React, { FC } from 'react'

export interface ITransaction {
  id: string
  input: { address: string; amount: number }
  outputMap: []
}
interface IProps {
  transaction: ITransaction
}

export const Transaction: FC<IProps> = ({ transaction }) => {
  const { input, outputMap } = transaction
  const recipients = Object.keys(outputMap)
  const from = `${input.address.substring(0, 20)}...`
  const balance = input.amount

  return (
    <div>
      <div>
        From: {from} | Balance: {balance}
      </div>
      {recipients.map((recipient) => (
        <div key={recipient}>
          To: {`${recipient.substring(0, 20)}...`} | Sent: {outputMap[recipient]}
        </div>
      ))}
    </div>
  )
}
