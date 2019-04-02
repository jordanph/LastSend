import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import React, { FunctionComponent, useState } from "react";

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

const account = "0x2008795b014eA4931AfFa3357461B2696f1d1B64";

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
      .value("1000000000000000000")
      .asClause();

    await signingService.request([{ ...sendClause }]);

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
