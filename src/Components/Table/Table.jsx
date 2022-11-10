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

    console.log(address)


    useEffect(() => {

        try {
            transferHistory(address)
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


    console.log("transfers", transfers)

    return (
        <TableContainer
            component={Paper}
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}
        >
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>

                        <TableCell align="right">TokenAddress</TableCell>
                        <TableCell align="right">Receiver</TableCell>
                        <TableCell align="right">Tx Hash</TableCell>
                        <TableCell align="right">Amount</TableCell>

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
                            <TableCell align="right">{detail.block_hash}</TableCell>
                            <TableCell align="right">{detail.value}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
