<h3 align='center'>USDT BULK SEND DAPP SPEC SHEET</h3>

## Overview

This dAPP will facilitate sending of ```batch transactions``` on the ```bsc``` network to multiple wallet addresses. This is made possible using wallet connect where the user first connects to metamask upon landing on the dAPP. Then the user will have an interface to interact where he/she will input ```addresses``` and ```amounts``` to send to each address, then after filling in the inputs, the owner can click the send button to submit transactions.

## Features of the build

* The dAPP will have a react front-end where user is first prompted to connect wallet i.e metamask before interacting with the dAPP.
* The user will have multiple input fields where owner provides wallet addresses with their corresponding input amounts. 
* The user is prompted with a confirmation message before sending the transactions.
* Approve button to allow the smart contract to approve the total amounts.
* A confirmation popup to confirm the addresses and amounts before sending.
* A send button which when user clicks does the actual sending of the funds.
* A pop up message to show if transaction is successful or not , plus a link with the transaction hash to bsc-scan.
* History page to show all the transactions that ever happened

## Technologies used

* [TypeScript](https://www.typescriptlang.org//)
* [Solidity](https://soliditylang.org/)
* [NodeJS](https://nodejs.org/en/)
* [Foundry](https://book.getfoundry.sh/)
* [Ethers.JS](https://docs.ethers.io/v5/)

## Milestones and task allocation
1. Reasearch - (Henry & Nicolas)
2. smartcontract development and testing - (Henry)
3. User Inteface development - (Nicolas)
4. Integrations - (Henry & Nicolas)
5. Full testing of the dapp - (Henry & Nicolas)
6. Deployment -(Henry & Nicolas)

## Team
1. Henry
2. Nicolas