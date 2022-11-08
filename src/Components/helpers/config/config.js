require('dotenv').config()

export const config = {
  /**
   * @description PRIVATE_KEY is the private key of the account that will be used to sign transactions
   */
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  /**
   * @description JSON RPC endpoint
   * @type {string}
   */
  JSON_RPC: '',

  /**
   * @description WSS_URL is the websocket endpoint of the WSS  endpoint
   */

  WSS_URL: process.env.WSS_URL,

  /**
   * @description BSC_SCAN_API_KEY provided by bscscan
   */
  BSCSCAN_API_KEY: process.env.BSCSCAN_API_KEY,

  /**
   * @description WBNB contract address
   * @type {string}
   */
  WBNB_ADDRESS: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',

  /**
   * @description account address i.e WALLET_ADDRESS
   * @type {string}
   */

  PUBLIC_KEY: '0x266feded59399afc982eea44724fca7ba31c054f',

  /**
   * @description SPENDER_ADDRESS is the address of the contract that will be used to spend the users tokens
   */

  SPENDER_ADDRESS: '0x21d56d126230d9ed78a042b044a9cf3f2ee25fc2', //smart contract to be approve amounts
}
