import React, { useContext } from 'react'
import { GlobalContext } from '../../context'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepContent from '@mui/material/StepContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { Box, Chip, Container, Divider, Grid } from '@mui/material'
import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { Contract, ethers, providers, utils } from 'ethers'
import Recipient from './Recipient'
import { Helpers } from '../helpers/utils'
import { useSigner, useProvider } from 'wagmi'
import { useSnackbar } from 'notistack'
import { BULK_SEND_ABI } from '../helpers/constants/bulksendABI'
import { config } from '../helpers/config/config'

const steps = [
  {
    label: 'Connect Wallet',
    description: `Connect your wallet then proceed to send assets`,
  },
  {
    label: 'Set receipient addresses',
    description: 'Add a group of addresses and amount you would wish to send',
  },
  {
    label: 'Approve smart contract to access the wallet ',
    description: `Approve for the total amount to be sent`,
  },
  {
    label: 'Send assets',
    description: 'You are about to send asset to the following wallet(s)',
  },
]

export const addressIsValid = (address) => {
  return ethers.utils.isAddress(address)
}

export const shortenAddress = (address) => {
  return `${address.slice(0, 6)}...${address.slice(address.length - 8)}`
}

// custom card
const CustomCard = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(3),
  color: theme.palette.text.secondary,
}))

export default function CreateBulkSend() {
  //States
  const [activeStep, setActiveStep] = React.useState(0)

  //context
  const { recipients } = useContext(GlobalContext)

  //notification
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  //for displaying alerts messages
  const displayAlert = (alertType, message) => {
    closeSnackbar()
    enqueueSnackbar(message, {
      variant: alertType,
    })
  }

  //instatiate helpers
  const HelpersWrapper = new Helpers()

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  //getting the signer
  const { data: signer } = useSigner({
    onSettled(data, error) {
      if (data) {
        displayAlert(
          'success',
          `Signer connected successfully ${data._isSigner}`,
        )
      } else {
        displayAlert('info', `Failed to Load signer ${error}`)
      }
    },
  })

  //getting the provider
  const provider = useProvider()

  //function handles the approve of the total amounts to be sent
  const hanldeApproveContract = async () => {
    try {
      //get the total amount to be approved
      const _sum = Object.keys(recipients).reduce(
        (sum, key) => sum + parseFloat(recipients[key] || 0),
        0,
      )

      const sum = (_sum * 1e18).toString()
      console.log('Here is the sum', sum)

      let tokenAddress = '0x5C46eC0Dd2AF140c24A194D1A091953dec44F05c'

      const aprroveTx = await HelpersWrapper.actualApproval(
        tokenAddress,
        sum,
        signer,
      )
      enqueueSnackbar(`Approval sent 💵....waitig for metamask confirmation`)

      const txReceipt = await provider.waitForTransaction(aprroveTx.hash, 1)

      if (txReceipt.status) {
        displayAlert('success', `Approval successful`)
        handleNext()
      } else {
        displayAlert('error', `Approval failed`)
      }
    } catch (error) {
      console.log(error)
    }
  }

  //function to send actual tokens and amounts

  const handleSendTokens = async () => {
    try {
      const data = Object.entries(recipients).map(([addr, amt]) => ({
        [addr]: utils.parseUnits(amt, 18),
      }))

      const contract2 = new Contract(
        config.TOKEN_TRANSFER,
        BULK_SEND_ABI,
        // console.log('Here is the data', addr)
        signer,
      )

      let addresses = []
      let amounts = []

      for (let i = 0; i < data.length; i++) {
        const address = Object.keys(data[i])[0]
        const amount = Object.values(data[i])[0]

        addresses.push(address)
        amounts.push(amount)
      }

      const sendTx = await contract2.batchTransfer(
        '0x210f4F7a092CCdc3487B8dAB8e317A6E29aeA720',
        addresses,
        amounts,
        {
          gasLimit: 1000000,
        },
      )

      enqueueSnackbar(
        `BatchTransfer Submitted 🚀....waitig for metamask confirmation`,
      )

      const txReceipt = await provider._waitForTransaction(
        sendTx.hash,
        1,
        120000,
      )

      if (txReceipt.status) {
        displayAlert('success', `Bulk Transaction is successful`)
        handleNext()
      } else {
        displayAlert('error', `Bulk Transaction failed`)
      }
    } catch (error) {
      console.log('Error sending tokens', error)
    }
    return (
      <Box>
        {Object.entries(recipients).map(([address, amount]) => (
          <Box display="flex" alignItems="center" gap={2}>
            <Typography key={address} mt={1}>
              {shortenAddress(address)}
            </Typography>

            <Typography key={address} mt={1}>
              {amount}
            </Typography>
          </Box>
        ))}
      </Box>
    )
  }

  // end of csv loads

  const addressesTextFields = () => {
    return (
      <Box mt={4}>
        <Box>
          {Object.entries(recipients).map((recipient, index) => (
            <Recipient recipient={recipient} key={index} />
          ))}
          <hr />
          <Recipient setActiveStep={setActiveStep} />
        </Box>
        <Box>
          <Typography>or</Typography>
        </Box>
        <Box>
          <Button
            variant="text"
            size="small"
            sx={{
              fontSize: '14px',
              fontFamily: 'IBM Plex Mono, monospace',
              fontWeight: 500,
            }}
          >
            Upload CSV file
            <input
              hidden
              type="file"
              accept=".csv"
              // onChange={handleOnChange}
            />
          </Button>
        </Box>
      </Box>
    )
  }

  return (
    <div>
      <Container>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Grid sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel>
                    <h6
                      style={{
                        color: 'white',
                        fontSize: 16,
                        fontFamily: 'IBM Plex Mono, monospace',
                        fontWeight: 500,
                      }}
                    >
                      {step.label}
                    </h6>
                  </StepLabel>
                  <StepContent>
                    <CustomCard style={{ marginBottom: '30px' }}>
                      <p
                        style={{
                          fontSize: 16,
                          fontFamily: 'IBM Plex Mono, monospace',
                          fontWeight: 500,
                        }}
                      >
                        {step.description}
                      </p>
                      {index === 1 ? addressesTextFields() : null}
                      <Divider sx={{ my: 1 }} />
                      {index === 2 ? (
                        <div>
                          <h4>Confirm Details</h4>

                          <Grid container>
                            <Grid item sm={6}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  p: 1,
                                  m: 1,
                                  bgcolor: 'background.paper',

                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  // p: 1,
                                  // m: 1,
                                  bgcolor: 'background.paper',

                                  borderRadius: 1,
                                  alignItems: 'center',
                                }}
                              >
                                <h4>Addresess</h4>
                                <Chip
                                  label={Object.keys(recipients).length}
                                ></Chip>
                              </Box>
                              <Box>
                                {Object.entries(recipients).map(
                                  ([address, amount]) => (
                                    <Box
                                      display="flex"
                                      alignItems="center"
                                      // gap={2}
                                      justifyContent="space-between"
                                    >
                                      <Typography
                                        key={address}
                                        mt={1}
                                        display="flex"
                                        alignItems="center"
                                      >
                                        {shortenAddress(address)}
                                        <a
                                          rel="noreferrer"
                                          href={`https://goerli.etherscan.io/address/${address}`}
                                          target="_blank"
                                        >
                                          <OpenInNewIcon />
                                        </a>
                                      </Typography>

                                      <Typography key={address} mt={1}>
                                        {amount}
                                      </Typography>
                                    </Box>
                                  ),
                                )}
                                {Object.keys(recipients).length === 0 && (
                                  <Typography>No Addresses set</Typography>
                                )}
                              </Box>
                            </Grid>
                          </Grid>
                        </div>
                      ) : null}
                      {index === 3 ? (
                        <>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              p: 1,
                              m: 1,
                              bgcolor: 'background.paper',

                              display: 'flex',
                              justifyContent: 'space-between',
                              // p: 1,
                              // m: 1,
                              bgcolor: 'background.paper',

                              borderRadius: 1,
                              alignItems: 'center',
                            }}
                          >
                            <h4>Addresess</h4>
                            <h4>Amount</h4>
                          </Box>
                          <Box>
                            {Object.entries(recipients).map(
                              ([address, amount]) => (
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  // gap={2}
                                  justifyContent="space-between"
                                >
                                  <Typography
                                    key={address}
                                    mt={1}
                                    display="flex"
                                    alignItems="center"
                                  >
                                    {shortenAddress(address)}
                                  </Typography>

                                  <Typography key={address} mt={1}>
                                    {amount}
                                  </Typography>
                                </Box>
                              ),
                            )}
                          </Box>
                        </>
                      ) : null}

                      <Box sx={{ mb: 1, mt: 1 }}>
                        <div>
                          <Button
                            size="small"
                            variant="contained"
                            sx={{
                              mt: 1,
                              mr: 1,
                              visibility: index === 2 ? 'block' : 'hidden',
                              fontSize: 12,
                            }}
                            onClick={hanldeApproveContract}
                          >
                            APPROVE
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            disabled={
                              index === steps.length - 3
                                ? Object.keys(recipients).length === 0
                                : false
                            }
                            onClick={
                              index === steps.length - 1
                                ? handleSendTokens
                                : handleNext
                            }
                            sx={{
                              mt: 1,
                              mr: 1,
                              fontSize: '14px',
                              fontFamily: 'IBM Plex Mono, monospace',
                              fontWeight: 500,
                            }}
                          >
                            {index === steps.length - 1 ? 'SEND' : 'Continue'}
                          </Button>

                          <Button
                            size="small"
                            disabled={index === 0}
                            onClick={handleBack}
                            sx={{
                              mt: 1,
                              mr: 1,
                              visibility: index === 0 ? 'hidden' : 'block',
                              fontSize: '14px',
                              fontFamily: 'IBM Plex Mono, monospace',
                              fontWeight: 500,
                            }}
                          >
                            BACK
                          </Button>
                        </div>
                      </Box>
                    </CustomCard>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}
