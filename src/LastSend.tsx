import React, { useState, useEffect, FunctionComponent } from "react";
import Submit from "./Submit";
import { Typography, Divider } from "@material-ui/core";
import Withdraw from "./Withdraw";

const currentWinnerABI = {
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

const claimedABI = {
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

const expiryBlockNumberABI = {
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

const finalBalanceABI = {
  constant: true,
  inputs: [],
  name: "finalBalance",
  outputs: [
    {
      name: "",
      type: "uint256"
    }
  ],
  payable: false,
  stateMutability: "view",
  type: "function"
};

const account = process.env.REACT_APP_CONTRACT_ADDRESS!;

interface LastSendProps {
  currentBlock: number;
}

interface CurrentDetails {
  currentWinner: string;
  expiryBlock: number;
  ended: boolean;
  balance: number;
  isCurrentWinner: boolean;
  claimed: boolean;
}

const LastSend: FunctionComponent<LastSendProps> = ({ currentBlock }) => {
  const [currentDetails, setCurrentDetails] = useState<CurrentDetails>();

  useEffect(() => {
    const getCurrentDetails = async () => {
      const currentWinner = await connex.thor
        .account(account)
        .method(currentWinnerABI)
        .call();
      const expiryBlock = await connex.thor
        .account(account)
        .method(expiryBlockNumberABI)
        .call();
      const claimed = await connex.thor
        .account(account)
        .method(claimedABI)
        .call();
      const balance = await connex.thor.account(account).get();
      const currentWinnerAddress = currentWinner.decoded!["0"]!;
      const ended = expiryBlock.decoded!["0"]! <= currentBlock;

      const getFinalBalance = async (gameEnded: boolean) => {
        if (gameEnded) {
          const final = await connex.thor
            .account(account)
            .method(finalBalanceABI)
            .call();

          return parseInt(final.decoded!["0"]!) / 1000000000000000000;
        } else {
          return parseInt(balance.balance, 16) / 1000000000000000000;
        }
      };

      const finalBalance = await getFinalBalance(ended);

      setCurrentDetails({
        currentWinner: currentWinnerAddress,
        expiryBlock: parseInt(expiryBlock.data, 16),
        ended: ended,
        balance: finalBalance,
        isCurrentWinner: connex.vendor.owned(currentWinnerAddress),
        claimed: claimed.decoded!["0"]!
      });
    };

    getCurrentDetails();
  }, [currentBlock]);

  return (
    <div>
      {currentDetails && (
        <div>
          {!currentDetails.ended && (
            <div>
              <Typography variant="subtitle1" gutterBottom>
                {currentDetails.isCurrentWinner && (
                  <p>You are currently winning!</p>
                )}
                {!currentDetails.isCurrentWinner && (
                  <p>Somebody else is winning...</p>
                )}
              </Typography>
              {currentDetails.balance} VET
              <br />
              <br />
              {currentDetails.expiryBlock - currentBlock} Blocks Left
              <br />
              {!currentDetails.isCurrentWinner && (
                <p>Current Winner: {currentDetails.currentWinner}</p>
              )}
              <br />
              <Divider variant="middle" />
              <Submit currentlyWinning={currentDetails.isCurrentWinner} />
            </div>
          )}
          {currentDetails.ended && (
            <div>
              <Typography variant="subtitle1" gutterBottom>
                Game is over!
              </Typography>
              Final pool was {currentDetails.balance} VET
              <br />
              {currentDetails.isCurrentWinner && <p>You are the winner!</p>}
              {!currentDetails.isCurrentWinner && (
                <p>
                  Congratulations to <b>{currentDetails.currentWinner}!</b>
                </p>
              )}
              <br />
              <Divider variant="middle" />
              {currentDetails.isCurrentWinner && !currentDetails.claimed && (
                <Withdraw />
              )}
              {currentDetails.isCurrentWinner && currentDetails.claimed && (
                <Typography variant="subtitle1" gutterBottom>
                  Thank you for withdrawing your winnings :)
                </Typography>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LastSend;
