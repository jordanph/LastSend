export const currentWinnerABI = {
  constant: true,
  inputs: [],
  name: "lastSender",
  outputs: [
    {
      name: "",
      type: "address"
    }
  ],
  payable: false,
  stateMutability: "view",
  type: "function",
  signature: "0x256fec88"
};

export const sendABI = {
  constant: false,
  inputs: [],
  name: "send",
  outputs: [],
  payable: true,
  stateMutability: "payable",
  type: "function",
  signature: "0xb46300ec"
};

export const claimedABI = {
  constant: true,
  inputs: [],
  name: "claimed",
  outputs: [
    {
      name: "",
      type: "bool"
    }
  ],
  payable: false,
  stateMutability: "view",
  type: "function",
  signature: "0xe834a834"
};

export const expiryBlockNumberABI = {
  constant: true,
  inputs: [],
  name: "expiryBlockNumber",
  outputs: [
    {
      name: "",
      type: "uint256"
    }
  ],
  payable: false,
  stateMutability: "view",
  type: "function",
  signature: "0xc9f89ea5"
};
