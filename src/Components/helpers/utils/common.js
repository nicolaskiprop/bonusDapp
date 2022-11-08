import { Contract, providers, utils, Wallet } from 'ethers'
import { config } from '../config/config'
import { PANCAKESWAP_ABI } from '../constants/pancakeswap'
import axios from 'axios'
import { BULK_SEND_ABI } from '../constants/bulksendABI'
require('dotenv').config()

export class Helpers {
  constructor() {
    // initialize some variables i.e provider, signers
    this._provider = new providers.JsonRpcProvider('')
    this.signer = new Wallet('', this._provider)
    this.spender = config.SPENDER_ADDRESS
  }

  /**
   *
   * @param tokenAddress the token address to get the balance for
   * @returns the balance of the tokenAddress
   */
  getTokenBalance = async (tokenAddress) => {
    try {
      const tokenContract = new Contract(
        tokenAddress,
        PANCAKESWAP_ABI,
        this._provider,
      )

      return await tokenContract.balanceOf(config.PUBLIC_KEY)
    } catch (error) {
      console.log('Error fecthing Token Balance ', error)
    }
  }

  /**
   *  @param walletAddress the walletAddress to get the nonce for
   * @returns nonce of the walletAddress
   */
  getNonce = async () => {
    try {
      return await this._provider.getTransactionCount(config.PUBLIC_KEY)
    } catch (error) {
      console.log('Could not fetch wallet Nonce', error)
    }
  }

  /**
   *
   * @param _tokenAddress the token address to get the allowance for
   * @returns
   */
  approveContract = async (tokenAddress, signer) => {
    return new Contract(
      tokenAddress,
      [
        'function approve(address _spender, uint256 _value) public returns (bool success)',
      ],
      signer,
    )
  }

  /**
   *
   * @param {*} signer
   * @returns an instance of the contract for batch transfer
   */

  sendContract = async (signer) => {
    console.log('ABI', BULK_SEND_ABI)

    return new Contract(
      '0x21d56d126230d9ed78a042b044a9cf3f2ee25fc2',
      BULK_SEND_ABI,
      signer,
    )
  }

  /**
   *
   * @param _params the params to send to the contract. this function approves the contract [spender] to spend the users tokens
   * @returns
   */
  approve = async ({ tokenAddress, overLoads, balanceToApprove, signer }) => {
    try {
      const contract = await this.approveContract(tokenAddress, signer)

      const tx = await contract.approve(
        this.spender,
        balanceToApprove,
        overLoads,
      )

      console.log('**'.repeat(20))
      console.log('******APPROVE TRANSACTION********', tx.hash)
      return { success: true, data: `${tx.hash}` }
    } catch (error) {
      console.log(`Error approve`, error)
    }
  }

  /**
   *
   * @param tokenAddress the token address to get the allowance for. This function does the magic of approving
   */
  actualApproval = async (tokenAddress, amount, _signer) => {
    try {
      const nonce = await this.getNonce()
      let overLoads = {
        gasLimit: 1000000,
        gasPrice: 30 * 1e9,
        nonce: nonce,
      }
      // approve the contract to spend the users tokens
      await this.approve({
        tokenAddress,
        overLoads,
        balanceToApprove: amount,
        signer: _signer,
      })
    } catch (error) {
      console.log('Error approving contract', error)
    }
  }

  /**
   *
   * @param walletAddress the wallet address to get the details for
   */

  tokenDetails = async (walletAddress) => {
    try {
      const Config = {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key':
            'hVAFqq9DI6lp2JY4G5H2dNyl71WEQQtLuDH6V2cbKdO6HJuZkor9vKNFbdgHixM',
          'Access-Control-Allow-Origin': '*',
        },
      }

      const url = `https://deep-index.moralis.io/api/v2/${walletAddress}/erc20?chain=bsc`

      const tokenData = await axios.get(url, Config)

      const { data } = tokenData

      for (let i = 0; i < data.length; i++) {
        const { token_address, symbol, balance } = tokenData[i]

        console.log('DATA', token_address, symbol, balance)
      }
    } catch (error) {
      console.log(error)
    }
  }
}
