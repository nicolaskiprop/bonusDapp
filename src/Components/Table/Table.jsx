import React, { useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useContext } from 'react';
import { GlobalContext } from '../../context';
import { useAccount } from 'wagmi'


export default function HistoryTable() {


    const { transferHistory, transfers, setTransfer } = useContext(GlobalContext);

    const { address } = useAccount()
    console.log("ADRESDR", address)


    console.log("transfers", transfers)


    useEffect(() => {

        try {
            transferHistory("0x266fedED59399AFC982EEa44724fCa7Ba31C054f")
                .then((transfer) => {
                    setTransfer(transfer)
                })
                .catch((err) => {
                    console.log("Could not Fetch Transfer History", err)
                });
        } catch (error) {

            console.log(error)
        }

    }, []);



    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>

                        <TableCell align="right">TokenAddress</TableCell>
                        <TableCell align="right">Receiver</TableCell>
                        <TableCell align="right">Tx Hash</TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>
                    {transfers.map((detail) => (
                        <TableRow
                            key={detail.name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {detail.name}
                            </TableCell>
                            <TableCell align="right">{detail.address}</TableCell>
                            <TableCell align="right">{detail.to_address}</TableCell>
                            <TableCell align="right">{detail.transaction_hash}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
