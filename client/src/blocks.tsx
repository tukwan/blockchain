import React, { useState, useEffect } from 'react'

interface IBlock {
  data: []
  difficulty: number
  hash: string
  lastHash: string
  nonce: number
  timestamp: Date
}
type IBlocks = IBlock[]

export const Blocks = () => {
  const [blocks, setBlocks] = useState<IBlocks>([])
  useEffect(() => {
    const fetchBlocks = async () => {
      const response = await fetch('/api/blocks')
      const blocks = await response.json()
      console.log(blocks)
      setBlocks(blocks)
    }
    fetchBlocks()
  }, [])

  return (
    <div>
      <h2>Blocks:</h2>
      {blocks.map((block) => (
        <div key={block.hash}>{block.hash}</div>
      ))}
    </div>
  )
}
