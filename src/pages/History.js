import { Box, Button } from '@mui/material'
import React from 'react'
import HistoryTable from '../Components/Table/Table'


function History() {
  return (
    <div>
        <HistoryTable />
        <Box display='flex' justifyContent='center'>
          <Button variant='contained'>Home</Button>
        </Box>
    </div>
  )
}

export default History