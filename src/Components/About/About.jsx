
import React, { useEffect } from 'react'
import '../../App.css'
import { useContext } from 'react';
import { GlobalContext } from '../../context';
import { useAccount } from 'wagmi'
import Select from '@mui/material/Select';
import { Box, Button, FormControl, MenuItem, Typography } from '@mui/material'
import { HashLink } from 'react-router-hash-link';



function About() {

    const { details, setDetails, tokenDetails } = useContext(GlobalContext);

    const { address } = useAccount()

    const [token, setToken] = React.useState('');

    const handleChange = (event) => {
        setToken(event.target.value);
    };



    console.log("details  here", details)

    useEffect(() => {

        tokenDetails(address)
            .then((token) => {

                console.log("token", token)

                //filter out the tokens to specific symbol and balance
                let newDetails = token.filter(function (detail) {
                    return detail.symbol === "CALO";
                }).map(function (detail) {
                    return { detail: detail.balance, details: detail.symbol }
                });

                setDetails(newDetails);
            })
            .catch((err) => {
                console.log("Could not Fetch Token Details", err)
            });

    }, []);


    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                <div className='tokenaddress'>
                    <h6 >Token Address</h6>

                </div>

                <div className='tokenaddress2'>
                    <HashLink to="/History" 
                    style={{textDecoration:'none'}}
                    >
                        <Button
                            sx={{ display: 'flex', maxHeight: '100px', color: '#fff' }}
                            variant='contained'
                            size='small'
                        >
                            History
                        </Button>
                    </HashLink>

                </div>


            </div>
            <div className='select'>


                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        value={token}

                        onChange={handleChange}
                        labelStyle={{ color: '#fff' }}
                        sx={{
                            color: "white",
                            '.MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgba(228, 219, 233, 0.25)',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgba(228, 219, 233, 0.25)',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgba(228, 219, 233, 0.25)',
                            },
                            '.MuiSvgIcon-root ': {
                                fill: "white !important",
                            }
                        }}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </FormControl>

            </div>
        </div>
    )
}

export default About