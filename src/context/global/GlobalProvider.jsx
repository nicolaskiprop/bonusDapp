import axios from 'axios';
import React, { useState } from 'react';
import { config } from '../../Components/helpers/config/config';
import { GlobalContext } from './GlobalContext';

export const GlobalProvider = ({
  children,
}) => {


  // address => amount
  const [recipients, setRecipients] = useState({});
  const [transfers, setTransfer] = useState([]);
  const [details, setDetails] = useState([]);


  const [isLoading, setIsLoading] = useState(false);


  const Config = {
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key':
        config.MORALIS_API_KEY,
      'Access-Control-Allow-Origin': '*',
    },
  }

  //fetches the token details i.e balance, symbol, balance
  const tokenDetails = async (walletAddress) => {

    try {


      const url = `https://deep-index.moralis.io/api/v2/${walletAddress}/erc20?chain=bsc`

      const tokenData = await axios.get(url, Config)

      const { data } = tokenData


      const token = []

      for (let i = 0; i < data.length; i++) {

        const { token_address, symbol, balance } = data[i]

        token.push({ token_address, symbol, balance })

        setDetails(tokenData)


      }
      return token

    } catch (error) {
      console.log(error)
    }
  }

  //fetches the transaction details i.e amount, from, to, 
  const transferHistory = async (walletAddress) => {

    try {

      const url = `https://deep-index.moralis.io/api/v2/${walletAddress}/erc20/transfers?chain=goerli`

      const transferData = await axios.get(url, Config)

      const { data } = transferData


      const tokenTransfers = []

      console.log("transferData", data.result)

      for (let i = 0; i < data.length; i++) {

        const { transaction_hash, address, to_address } = data[i]

        tokenTransfers.push({ transaction_hash, address, to_address })

        setTransfer(data.result)


      }
      return tokenTransfers

    } catch (error) {
      console.log(error)
    }
  }

  console.log("TRANSFERS", transfers)



  return (
    <GlobalContext.Provider
      value={{
        setRecipients,
        recipients,
        tokenDetails,
        setDetails,
        details,
        transferHistory,
        transfers,
        setTransfer,

      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};