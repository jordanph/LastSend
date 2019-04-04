import React, { Component } from "react";
import Connected from "./Connected";
import NotConnected from "./NotConnected";
import styled from "styled-components";
import Paper from "@material-ui/core/Paper";
import { Typography, Grid } from "@material-ui/core";

const MarginedPaper = styled(Paper)`
  margin-top: 20px;
  margin-left: 100px;
  margin-right: 100px;
  padding: 20px;
`;

const MainGame = styled(MarginedPaper)`
  min-width: 500px;
`;

const CenteredDiv = styled.div`
  text-align: center;
`;

class App extends Component {
  render() {
    return (
      <CenteredDiv>
        <Grid container direction="row" justify="center" alignItems="center">
          <MainGame>
            {!window.connex && <NotConnected />}
            {window.connex && <Connected />}
          </MainGame>
        </Grid>
        <MarginedPaper>
          <Typography variant="h5">How it works</Typography>
          <Typography variant="subtitle1" gutterBottom>
            The aim of the game is to be the last sender to the game and win the
            pot when the block counter reaches 0
          </Typography>
          <Typography variant="subtitle2">
            The game starts out with 0 VET and an endtime of 5000 blocks
          </Typography>
          <Typography variant="subtitle2">
            Everytime a person sends to the contract, the amount is added to the
            pool
          </Typography>
          <Typography variant="subtitle2">
            If the block counter reaches 0 and you were the last sender, you
            win!
          </Typography>
          <Typography variant="subtitle2">
            However, be warned, the block counter is reset to 5000 everytime
            someone sends their VET!
          </Typography>
        </MarginedPaper>
      </CenteredDiv>
    );
  }
}

export default App;
