import React, { useState, useEffect, FunctionComponent } from "react";
import Submit from "./Submit";
import { Typography, Divider } from "@material-ui/core";

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

const endedABI = {
  constant: true,
  inputs: [],
  name: "ended",
  outputs: [
    {
      name: "",
      type: "bool"
    }
  ],
  payable: false,
  stateMutability: "view",
  type: "function",
  signature: "0x12fa6feb"
};

const account = "0xf8dB240A39D50bd37cDd8EdB9B65FeaaB7d6e428";

interface LastSendProps {
  currentBlock: number;
}

interface CurrentDetails {
  currentWinner: string;
  expiryBlock: number;
  ended: boolean;
  balance: number;
  isCurrentWinner: boolean;
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
      const ended = await connex.thor
        .account(account)
        .method(endedABI)
        .call();
      const balance = await connex.thor.account(account).get();
      const currentWinnerAddress = currentWinner.decoded!["0"]!;

      setCurrentDetails({
        currentWinner: currentWinnerAddress,
        expiryBlock: parseInt(expiryBlock.data, 16),
        ended: parseInt(ended.data, 16) == 1,
        balance: parseInt(balance.balance, 16) / 1000000000000000000,
        isCurrentWinner: connex.vendor.owned(currentWinnerAddress)
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
              {currentDetails.isCurrentWinner && <button>Withdraw</button>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LastSend;
