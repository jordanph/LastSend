import React, { useState, useEffect } from "react";
import LastSend from "./LastSend";
import { Typography, CircularProgress, Divider } from "@material-ui/core";

const Connected = () => {
  const [currentBlockNumber, setCurrentBlockNumber] = useState<number>();

  useEffect(() => {
    const getCurrentBlock = async () => {
      const currentBlock = await connex.thor.block().get();

      setCurrentBlockNumber(currentBlock!.number);
    };

    connex.thor
      .ticker()
      .next()
      .then(async () => {
        const currentBlock = await connex.thor.block().get();

        setCurrentBlockNumber(currentBlock!.number);
      });

    getCurrentBlock();
  });

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Last Sender
      </Typography>
      <Divider variant="middle" />
      {!currentBlockNumber && <CircularProgress />}
      {currentBlockNumber && <LastSend currentBlock={currentBlockNumber} />}
    </div>
  );
};

export default Connected;
