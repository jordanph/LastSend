import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import React, { FunctionComponent, useState } from "react";
import BigNumber from "bignumber.js";

const sendABI = {
  constant: false,
  inputs: [],
  name: "send",
  outputs: [],
  payable: true,
  stateMutability: "payable",
  type: "function",
  signature: "0xb46300ec"
};

const account = "0xf8dB240A39D50bd37cDd8EdB9B65FeaaB7d6e428";
const tenVET =
  "0x" +
  new BigNumber(10)
    .multipliedBy(1e18)
    .dp(0)
    .toString(16);

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

interface SubmitButtonProps {
  currentlyWinning: boolean;
}

const SubmitButton: FunctionComponent<SubmitButtonProps> = ({
  currentlyWinning
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const onClick = async () => {
    setLoading(true);

    const signingService = connex.vendor.sign("tx");

    const sendClause = connex.thor
      .account(account)
      .method(sendABI)
      .value(tenVET)
      .asClause();

    try {
      await signingService.request([{ ...sendClause }]);
    } catch {}
    setLoading(false);
  };

  return (
    <div style={rootStyle}>
      <div style={wrapperStyle}>
        <Button
          variant="contained"
          color="primary"
          disabled={loading}
          onClick={onClick}
          size="large"
        >
          Send {currentlyWinning && "(More)"} VET
        </Button>
        {loading && <CircularProgress size={24} style={progressStyle} />}
      </div>
    </div>
  );
};

export default SubmitButton;
