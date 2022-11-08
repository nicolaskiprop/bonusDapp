import axios from 'axios';
import React, { useState } from 'react';
import { GlobalContext } from './GlobalContext';

export const GlobalProvider = ({
  children,
}) => {


  // address => amount
  const [recipients, setRecipients] = useState({});
  const [transfers, setTransfer] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  const [details, setDetails] = useState({});

  //fetches the token details i.e balance, symbol, balance
  const tokenDetails = async (walletAddress) => {

    try {
      const Config = {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key':
            'suaRJoN9tr6XjAhiuwdCR7MwYBkQKTRlzGWkEyd07e2cP9O4W5EcoNelZS6jmh93',
          'Access-Control-Allow-Origin': '*',
        },
      }

      const url = `https://deep-index.moralis.io/api/v2/${walletAddress}/erc20?chain=bsc`

      const tokenData = await axios.get(url, Config)

      const { data } = tokenData


      const token = []

      for (let i = 0; i < data.length; i++) {

        const { token_address, symbol, balance } = data[i]

        token.push({ token_address, symbol, balance })

        setDetails(data)


      }
      return token

    } catch (error) {
      console.log(error)
    }
  }

  //fetches the transaction details i.e amount, from, to, 
  const transferHistory = async (walletAddress) => {

    try {
      const Config = {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key':
            'suaRJoN9tr6XjAhiuwdCR7MwYBkQKTRlzGWkEyd07e2cP9O4W5EcoNelZS6jmh93',
          'Access-Control-Allow-Origin': '*',
        },
      }

      const url = `https://deep-index.moralis.io/api/v2/${walletAddress}/erc20/transfers?chain=goerli`

      const transferData = await axios.get(url, Config)

      console.log("Transfer Details", transferData);


      const { data } = transferData


      const tokenTransfers = []

      for (let i = 0; i < data.length; i++) {

        const { transaction_hash, address, to_address } = data[i]

        tokenTransfers.push({ transaction_hash, address, to_address })

        setTransfer(data)


      }
      return tokenTransfers

    } catch (error) {
      console.log(error)
    }
  }


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