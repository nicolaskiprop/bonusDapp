
import React, { useEffect } from 'react'
import '../../App.css'
import { useContext } from 'react';
import { GlobalContext } from '../../context';
import { useAccount } from 'wagmi'
import Select from '@mui/material/Select';
import { Button, FormControl, MenuItem } from '@mui/material'
import { HashLink } from 'react-router-hash-link';



function About() {

    const { details, setDetails, tokenDetails } = useContext(GlobalContext);

    const [token, setToken] = React.useState('');

    //get the logged in user address
    const { address } = useAccount()


    const handleChange = (event) => {
        setToken(event.target.value);
    };

    console.log('details', details)

    useEffect(() => {

        // getTokenDetails()


        // console.log("details  here", details)

    }, []);


    const getTokenDetails = async () => {

        await tokenDetails(address)
            .then((token) => {

                //filter out the tokens to specific symbol and balance
                let newDetails = token.filter(function (detail) {
                    return detail.symbol === "CALO";
                }).map(function ({ symbol, token_address }) {
                    return { symbol, token_address };
                });
                setDetails(newDetails);
            })
    }


    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                <div className='tokenaddress'>
                    <h6 >Token Address:  0x5C49...19505c </h6>

                </div>

                <div className='tokenaddress2'>
                    <HashLink to="/History"
                        style={{ textDecoration: 'none' }}
                    >
                        <Button
                            sx={{ display: 'flex', maxHeight: '100px', color: '#fff', fontFamily: 'IBM Plex Mono, monospace', fontWeight: 500 }}
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

                        <MenuItem value={10}>MASSAI-TOKEN</MenuItem>

                    </Select>
                </FormControl>

            </div>
        </div>
    )
}

export default About