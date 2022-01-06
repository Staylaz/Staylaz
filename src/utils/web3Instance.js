import Web3 from "web3";
import erc20Abi from "../contracts/erc20.json";

const TokenAddress = {
  BNB: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
  BUSD: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
  USDT: "0x55d398326f99059fF775485246999027B3197955",
  main: "0xC60e8207b820ff0c1168845eD35AA47288cC6FDC",
  vice: "0x1De4dDc38d885ea11F304b0b7884b6F1F069616f",
};
var web3Instance = {
  networks: [
    "https://speedy-nodes-nyc.moralis.io/e848d15634346b0532a67432/bsc/mainnet",
    // "https://bsc-dataseed.binance.org/",
    // "https://bsc-dataseed1.defibit.io/",
    // "https://bsc-dataseed1.ninicoin.io/",
    // "https://bsc-dataseed1.binance.org/",
    // "https://bsc-dataseed2.binance.org/",
    // "https://bsc-dataseed3.binance.org/",
    // "https://bsc-dataseed4.binance.org/",
    // "https://bsc-dataseed2.defibit.io/",
    // "https://bsc-dataseed3.defibit.io/",
  ],
  // network: "https://bsc-dataseed.binance.org/",
  network: "https://bsc-dataseed3.binance.org/",
  _web3Instance: null,
  contracts: {},
  initWeb3Instance(isForce) {
    if (!isForce && this._web3Instance) {
      return this._web3Instance;
    }
    var len = this.networks.length;
    var network = this.networks[parseInt(len * Math.random())];

    console.log(network);
    try {
      this._web3Instance = new Web3(network);
      return this._web3Instance;
    } catch (err) {
      console.log(err);
    }
  },

  getErc20Contract(contractName) {
    if (this.contracts[contractName]) {
      return this.contracts[contractName];
    }
    let instance = this.initWeb3Instance(true);
    console.log(instance);
    let contract = new instance.eth.Contract(
      erc20Abi,
      TokenAddress[contractName]
    );
    this.contracts[contractName] = contract;
    return this.contracts[contractName];
  },
};

export default web3Instance;
