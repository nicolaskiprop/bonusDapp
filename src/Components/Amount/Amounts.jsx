import React, { useRef, useState } from 'react'
import { TextField } from '@mui/material'

function Amounts() {

    //states
 
    const [activeStep, setActiveStep] = React.useState(0)
    const [amounts, setAmounts] = useState({})
    const [amountFields, setAmountFileds] = React.useState(1)
    const previousAmounts = useRef({})


    // add amounts to be sent
    const addAmounts = (index, amount) => {
        return setAmounts((amounts) => ({
            ...amounts,
            ...{ [index]: amount },
        }))
    }

    // Sets the amounts for the bulksending
  const handleSetAmounts = () => {
    previousAmounts.current = amounts

    console.log('Set Amounts', amounts)
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const addAmountFields = () => {
    setAmountFileds(amountFields + 1)
  }
    //update amount values
    const updateAmounts = (index, e) => {

        const amount = e.target.value
        //update the amounts
        addAmounts(index, amount)

        if (amount > 0) {
            addAmounts(index, amount)
        } else {
            addAmounts(index, 0)
        }
    }
    return (
        <div style={{ maxWidth: '20%', width: '100%' }}>
            {[...Array(amountFields)].map((
                el, index) => (
                <div >
                    {Object.keys(previousAmounts.current).length > 0 ? (
                        <TextField
                            label="Amount"
                            size="small"
                            name="amounts"
                            defaultValue={previousAmounts.current[index]}
                            key={index}
                            value={amounts}
                            onChange={(evt) => updateAmounts(index, evt)}
                            InputProps={{ style: { fontSize: 14 } }}
                        />
                    ) : (
                        <TextField
                            label="Amount"
                            size="small"
                            name="amounts"
                            key={index}
                            value={amounts}
                            onChange={(evt) => updateAmounts(index, evt)}
                            InputProps={{ style: { fontSize: 14 } }}
                        />
                    )}
                </div>
            ))}
        </div>
    )
}

export default Amounts