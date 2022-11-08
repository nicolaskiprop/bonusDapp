import { AddCircle, DeleteForever } from '@mui/icons-material'
import { Box, TextField } from '@mui/material'
import React, { useContext } from 'react'
import { useState } from 'react'
import { GlobalContext } from '../../context'
import { addressIsValid } from './Stepper'

function Recipient({
    setActiveStep,
    recipient,

}) {

    const [userAddress, setUserAddress] = useState("")
    const [userAmount, setUserAmount] = useState(0)
    const { recipients, setRecipients } = useContext(GlobalContext);


    // Sets the addresses for the bulksending
    const handleSetReciepient = (address, amount) => {
        console.log(address, amount);
        // check if address is valid
        if (!addressIsValid(address)) {

            window.alert("Invalid address");
            return;
        }

        // ensure amount > 0
        if (amount <= 0) {
            window.alert("Amount must be greater than 0");
            return;
        }
        setRecipients({
            ...recipients,
            [address]: amount,
        });


        // clear the input fields
        setUserAddress("");
        setUserAmount(0);

        if (Object.keys(recipients).length > 0) {
            setActiveStep(1);
        }
    };

    const handleRemoveRecipient = (address) => {
        console.log("Remove recipient", address);
        const newRecipients = { ...recipients };

        delete newRecipients[address];

        setRecipients(newRecipients);
    };


    let [address, amount] = recipient || []
    return (
        <Box display='flex' justifyContent='space-between' alignItems='center' gap={1}>
            <div style={{ maxWidth: "67%", width: "100%" }}>
                <TextField
                    size="small"
                    onChange={(e) => {
                        e.preventDefault()
                        setUserAddress(e.target.value)
                    }
                    }
                    name="address"
                    fullWidth
                    label="Wallet Address"
                    id="fullWidth"
                    value={recipient ? address : userAddress}
                    disabled={address ? true : false}
                />
            </div>
            <TextField
                size="small"
                defaultValue={0}
                onChange={(e) => {
                    e.preventDefault()
                    setUserAmount(e.target.value)

                }}
                name="amount"
                value={parseFloat(recipient ? amount : userAmount)}
                disabled={address ? true : false}
            />
            <div
                ml={2}
                style={{ maxWidth: "10%", width: "100%" }} >
                {recipient ?
                    <DeleteForever sx={{ color: "red", cursor: 'pointer' }} onClick={() => handleRemoveRecipient(address)} />
                    :
                    <AddCircle sx={{ color: "green", cursor: 'pointer' }} onClick={() =>
                        handleSetReciepient(userAddress, userAmount)
                    } />
                }
            </div>
        </Box >
    )
}

export default Recipient