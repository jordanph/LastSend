import { useState } from "react";
import {
  currentWinnerABI,
  expiryBlockNumberABI,
  claimedABI,
  sendABI
} from "./abis";
import { contractAddress, tenVET } from "./constants";

export interface CurrentDetails {
  currentWinner: string;
  expiryBlock: number;
  balance: number;
  isCurrentWinner: boolean;
  claimed: boolean;
}

export const sendVET = async () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  try {
    setLoading(true);

    const signingService = connex.vendor.sign("tx");
    const sendClause = connex.thor
      .account(contractAddress)
      .method(sendABI)
      .value(tenVET)
      .asClause();

    await signingService.request([{ ...sendClause }]);
    setSuccess(true);
  } catch {}

  return { loading, success };
};

export const getCurrentDetails = async () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [currentDetails, setCurrentDetails] = useState<CurrentDetails>();

  try {
    setLoading(true);
  } catch (error) {
    setError(error);
  }
  const { data } = await getCurrentWinner();

  const expiryBlock = await connex.thor
    .account(contractAddress)
    .method(expiryBlockNumberABI)
    .call();
  const claimed = await connex.thor
    .account(contractAddress)
    .method(claimedABI)
    .call();
  const balance = await connex.thor.account(contractAddress).get();
  const currentWinnerAddress = data!;

  setCurrentDetails({
    currentWinner: currentWinnerAddress,
    expiryBlock: parseInt(expiryBlock.data, 16),
    balance: parseInt(balance.balance, 16) / 1000000000000000000,
    isCurrentWinner: connex.vendor.owned(currentWinnerAddress),
    claimed: claimed.decoded!["0"]!
  });

  return { loading, error, currentDetails };
};

const getCurrentWinner = async () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [data, setData] = useState<string>();

  try {
    setLoading(true);

    const currentWinner = await connex.thor
      .account(contractAddress)
      .method(currentWinnerABI)
      .call();

    setData(currentWinner.decoded!["0"]!);
  } catch (error) {
    setError(error);
  }

  return { loading, error, data };
};
