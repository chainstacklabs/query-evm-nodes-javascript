<img width="1200" alt="Labs" src="https://user-images.githubusercontent.com/99700157/213291931-5a822628-5b8a-4768-980d-65f324985d32.png">

<p>
 <h3 align="center">Chainstack is the leading suite of services connecting developers with Web3 infrastructure</h3>
</p>

<p align="center">
  <a target="_blank" href="https://chainstack.com/build-better-with-ethereum/"><img src="https://github.com/soos3d/blockchain-badges/blob/main/protocols_badges/Ethereum.svg" /></a>&nbsp;  
  <a target="_blank" href="https://chainstack.com/build-better-with-bnb-smart-chain/"><img src="https://github.com/soos3d/blockchain-badges/blob/main/protocols_badges/BNB.svg" /></a>&nbsp;
  <a target="_blank" href="https://chainstack.com/build-better-with-polygon/"><img src="https://github.com/soos3d/blockchain-badges/blob/main/protocols_badges/Polygon.svg" /></a>&nbsp;
  <a target="_blank" href="https://chainstack.com/build-better-with-avalanche/"><img src="https://github.com/soos3d/blockchain-badges/blob/main/protocols_badges/Avalanche.svg" /></a>&nbsp;
  <a target="_blank" href="https://chainstack.com/build-better-with-fantom/"><img src="https://github.com/soos3d/blockchain-badges/blob/main/protocols_badges/Fantom.svg" /></a>&nbsp;
</p>

<p align="center">
  • <a target="_blank" href="https://chainstack.com/">Homepage</a> •
  <a target="_blank" href="https://chainstack.com/protocols/">Supported protocols</a> •
  <a target="_blank" href="https://chainstack.com/blog/">Chainstack blog</a> •
  <a target="_blank" href="https://docs.chainstack.com/quickstart/">Chainstack docs</a> •
  <a target="_blank" href="https://docs.chainstack.com/quickstart/">Blockchain API reference</a> •
  <a target="_blank" href="https://console.chainstack.com/user/account/create">Start for free</a> •
</p>

# Querying full and archive EVM nodes with JavaScript

This project allows the retrieval of historical data from the blockchain programmatically, switching between a full and archive node provider when necessary.

See the full tutorial on the Chainstack blog:
* [Querying full and archive Ethereum nodes with JavaScript](https://chainstack.com/querying-full-and-archive-evm-nodes-with-javascript/)

## Project details

This repository holds the JavaScript version of a tool to query common state functions. Some essential functions include getting an address balance and storage at a given position, a contract bytecode, or even the whole transactions included on a given block.

This tool queries the blockchain using the web3 and inquirer libraries for JavaScript. 

## Quick start

### Clone this repository

```sh
git clone https://github.com/yieniggu/chainstack-full-vs-archive-query-js.git
```

### Install dependencies

```sh
npm ci
```

> Use `npm ci` to launch a `clean install` of the dependencies, this will install the same version as in the `package.json` file.

### edit the .env.sample file

Add your RPC node URLs and rename the file to `.env`.

```env
CHAINSTACK_FULL_NODE="CHAINSTACK_FULL_NODE_URL"
CHAINSTACK_ARCHIVE_NODE="CHAINSTACK_ARCHIVE_NODE_URL"
```

### Run the program

```sh
npm run start
```

## Prerequisites

* Node.js: ^16.17.0— [install Node](https://nodejs.org/en/download/)
* A full and archive node RPC endpoints.

Deploy a full and archive node with Chainstack:

1. [Sign up with Chainstack](https://console.chainstack.com/user/account/create).  
1. [Deploy a node](https://docs.chainstack.com/platform/join-a-public-network).  
1. [View node access and credentials](https://docs.chainstack.com/platform/view-node-access-and-credentials). 

## Dependencies

* dotenv: ^16.0.3
* inquirer: ^8.2.4
* web3.js: ^1.7.4

## Install

Clone this repository:

```sh
git clone https://github.com/yieniggu/chainstack-full-vs-archive-query-js.git
```

Install the dependencies in the project's directory:

```sh
cd query-full-and-archive-nodes-javascript
```

```sh
npm ci
```
> Use `npm ci` to launch a `clean install` of the dependencies, this will install the same version as in the `package.json` file.
