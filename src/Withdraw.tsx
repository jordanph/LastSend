import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import React, { useState } from "react";

const withdrawABI = {
  constant: false,
  inputs: [],
  name: "withdraw",
  outputs: [],
  payable: false,
  stateMutability: "nonpayable",
  type: "function",
  signature: "0x3ccfd60b"
};

const account = process.env.REACT_APP_CONTRACT_ADDRESS!;

const rootStyle = {
  alignItems: "center"
};

const wrapperStyle = {
  margin: "10px",
  position: "relative"
} as React.CSSProperties;

const progressStyle = {
  left: "50%",
  marginLeft: -12,
  marginTop: -12,
  position: "absolute",
  top: "50%"
} as React.CSSProperties;

const WithdrawButton = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>();

  const onClick = async () => {
    setLoading(true);

    const signingService = connex.vendor.sign("tx");

    const sendClause = connex.thor
      .account(account)
      .method(withdrawABI)
      .asClause();

    try {
      await signingService.request([{ ...sendClause }]);
      setSuccess(true);
    } catch {}
    setLoading(false);
  };

  return (
    <div style={rootStyle}>
      <div style={wrapperStyle}>
        <Button
          variant="contained"
          color="primary"
          disabled={loading || success}
          onClick={onClick}
          size="large"
        >
          Withdraw Winnings
        </Button>
        {loading && <CircularProgress size={24} style={progressStyle} />}
      </div>
    </div>
  );
};

export default WithdrawButton;
