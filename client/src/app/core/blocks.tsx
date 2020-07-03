import React, { useState, useEffect, FC } from 'react'
import socketIOClient from 'socket.io-client'
import { Block, IBlock } from './block'
import { CONFIG } from '../../config'

type IBlocks = IBlock[]

export const Blocks: FC = () => {
  const [blocks, setBlocks] = useState<IBlocks>([])

  useEffect(() => {
    const socket = socketIOClient(CONFIG.API_URL)
    socket.on('FromAPIMineFinished', () => {
      fetchBlocks()
    })
    fetchBlocks()
    return () => socket.disconnect()
  }, [])

  const fetchBlocks = async () => {
    const response = await fetch('/api/blocks')
    const blocks = await response.json()
    const blocksReversed = blocks.reverse() // TODO: to optimize
    setBlocks(blocksReversed)
  }

  return (
    <div>
      <h2>Blocks</h2>
      <div className="blocks-list">
        {blocks.map((block) => (
          <div key={block.hash} className="border p-1 mb-3">
            <Block block={block} />
          </div>
        ))}
      </div>
    </div>
  )
}
