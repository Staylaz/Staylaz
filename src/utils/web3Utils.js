import axios from "axios";
import web3Instance from "./web3Instance";

let getBalanceByWeb3 = async (address, type) => {
  let tokenContract = await web3Instance.getErc20Contract(type);
  let balance = await tokenContract.methods.balanceOf(address).call();
  return balance;
};

export default {
  getBalanceByWeb3,
};
