import axios from "axios";

let getTokenBalance = async (address, contract) => {
  let urls = "https://api.bscscan.com/api";
  let res = await axios.get(urls, {
    params: {
      module: "account",
      action: "tokenbalance",
      contractaddress: contract,
      address: address,
      tag: "latest",
      apikey: "E75R8FC6XC1M6WPN7TG7HWTYD2XK4Z865N",
    },
  });

  return res;
};

export default {
  getTokenBalance,
};
