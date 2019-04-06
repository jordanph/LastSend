import React from "react";
import { Typography, Divider, Grid, Paper, Link } from "@material-ui/core";
import sync from "./images/sync.png";
import comet from "./images/comet.png";

const NotConnected = () => {
  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Whoops!
      </Typography>
      <Divider variant="middle" style={{ marginBottom: 10 }} />
      <Typography variant="subtitle2" style={{ marginBottom: 20 }}>
        In order to play the game you must have one of the following installed:
      </Typography>
      <Grid container spacing={24}>
        <Grid item xs={6}>
          <Paper style={{ padding: 5 }}>
            <Link href={"https://env.vechain.org/#sync"}>
              <img
                src={sync}
                style={{ height: 150, marginBottom: 10 }}
                alt="Sync"
              />
              <br />
              Sync
            </Link>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper style={{ padding: 5 }}>
            <Link href={"https://www.cometpowered.com/"}>
              <img
                src={comet}
                style={{ height: 150, marginBottom: 10 }}
                alt="Comet"
              />
              <br />
              Comet
            </Link>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default NotConnected;
