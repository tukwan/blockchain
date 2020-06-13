import React, { FC } from 'react'
import { Wallet } from './core/wallet'
import { Blocks } from './core/blocks'

export const App: FC = () => {
  return (
    <>
      <Wallet />
      <Blocks />
    </>
  )
}
