import React, { useState, useEffect, FC, FormEvent, ChangeEvent } from 'react'

interface IConductTxForm {
  recipient: string
  amount: number
}
const initConductTxForm = {
  recipient: '',
  amount: 0,
}

export const ConductTransaction: FC = () => {
  const [form, setState] = useState<IConductTxForm>(initConductTxForm)
  const { recipient, amount } = form

  const [knownAddresses, setKnownAddresses] = useState<any>([])

  useEffect(() => {
    const fetchKnownAddresses = async () => {
      const response = await fetch('/api/known-addresses')
      const json = await response.json()
      setKnownAddresses(json)
    }
    fetchKnownAddresses()
  }, [])

  const conductTx = async () => {
    const response = await fetch('/api/transact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipient, amount: Number(amount) }),
    })

    const tx = await response.json()
    console.log(tx)
  }

  const printValues = (e: FormEvent) => {
    e.preventDefault()
    conductTx()
  }

  const updateField = (e: ChangeEvent<HTMLInputElement>) => {
    setState({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div>
      <h2>Transaction</h2>
      {/* <h3>Known addresses:</h3>
      {knownAddresses.map((knownAddresses) => (
        <div key={knownAddresses}>{`${knownAddresses.substring(0, 35)}...`}</div>
      ))} */}
      <form onSubmit={printValues}>
          <div className="form-row">
            <div className="col-md-8">
              <input
                type="text"
                className="form-control"
                placeholder="Recipient"
                value={recipient}
                name="recipient"
                onChange={updateField}
              />
            </div>
            <div className="col-md-4">
              <input type="number" className="form-control" value={amount} name="amount" onChange={updateField} />
            </div>
          </div>
        <button className="btn btn-secondary btn-block mt-2">Submit</button>
      </form>
    </div>
  )
}
