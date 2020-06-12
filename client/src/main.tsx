import React, { useState, useEffect } from 'react'

export const Main = () => {
  const [blocks, setBlocks] = useState([])

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
      <h1>Blockchain App</h1>
      <code>
        <ul>
          {blocks.map((block) => (
            <li key={block.hash}>{block.hash}</li>
          ))}
        </ul>
      </code>
    </div>
  )
}
