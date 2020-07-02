import React, { useState, useEffect, FC } from 'react'
import { Block, IBlock } from './block'

type IBlocks = IBlock[]

export const Blocks: FC = () => {
  const [blocks, setBlocks] = useState<IBlocks>([])
  useEffect(() => {
    const fetchBlocks = async () => {
      const response = await fetch('/api/blocks')
      const blocks = await response.json()
      setBlocks(blocks)
    }
    fetchBlocks()
  }, [])

  return (
    <div>
      <h2>Blocks</h2>
      <div className="blocks-list">
        {blocks.map((block) => (
          <div key={block.hash}>
            <Block block={block} />
          </div>
        ))}
      </div>
    </div>
  )
}
