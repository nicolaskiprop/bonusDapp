import { Contract, providers, Wallet } from 'ethers'
import { config } from '../config/config'
import { BULK_SEND_ABI } from '../constants/bulksendABI'
import 'dotenv/config'

export class Helpers {
  constructor() {
    // initialize some variables i.e provider, signers
    this._provider = new providers.JsonRpcProvider(config.JSON_RPC)
    this.signer = new Wallet(config.PRIVATE_KEY, this._provider)
    this.spender = config.SPENDER_ADDRESS
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

  sendContract = async () => {
    console.log('ABI', BULK_SEND_ABI)

    return new Contract(
      '0x871422643E116C364Db4f0Bc0dEB5202a624D2E9',
      BULK_SEND_ABI,
      this.signer,
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
}
