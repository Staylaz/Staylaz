import web3Utils from "../utils/web3Utils";
const address = {
  main: "0xC60e8207b820ff0c1168845eD35AA47288cC6FDC",
  vice: "0x1De4dDc38d885ea11F304b0b7884b6F1F069616f",
  busd: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
};
const lpAddress = {
  main: "0x527011e353bdc5673fde6a08cba3517f86c426ee",
  vice: "0x42ad46f5e20755db19eff6fa94c0547537ef7be4",
};

const getTokenPrice = async (type) => {
  let usdRes = await web3Utils.getTokenBalance(lpAddress[type], address.busd);
  let tokenRes = await web3Utils.getTokenBalance(
    lpAddress[type],
    address[type]
  );
  let usdBalance = usdRes.data.result,
    tokenBalance = tokenRes.data.result;
  return (usdBalance / tokenBalance).toFixed(8);
};
export default getTokenPrice;
