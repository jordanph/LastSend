import BigNumber from "bignumber.js";

export const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS!;

export const tenVET =
  "0x" +
  new BigNumber(10)
    .multipliedBy(1e18)
    .dp(0)
    .toString(16);
