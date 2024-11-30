import React, { useState } from "react";

import { Button, Grid, TextField } from "@mui/material";

const AddFriend = (props) => {
  const [friend, setFriend] = useState({ name: "" });
  const addFriend = props.addFriend;

  const enterKeyEventHandler = (e) => {
    if (e.key === "Enter") {
      onButtonClick();
    }
  };
  const onButtonClick = () => {
    console.log("send to" + friend.name);
    addFriend(friend.name, "ask");
    setFriend({ name: "" });
  };

  const onInputChange = (e) => {
    setFriend({ name: e.target.value });
    console.log(friend);
  };
  return (
    <Grid container style={{ marginTop: 20 }}>
      <Grid xs={11} md={11} item style={{ paddingRight: 16 }}>
        <TextField
          placeholder="Add Friend here"
          fullWidth
          onChange={onInputChange}
          onKeyDown={enterKeyEventHandler}
          value={friend.name}
        />
      </Grid>
      <Grid xs={1} md={1} item>
        <Button
          fullWidth
          style={{ height: "100%" }}
          color="secondary"
          variant="outlined"
          onClick={onButtonClick}
        >
          +
        </Button>
      </Grid>
    </Grid>
  );
};

export default AddFriend;
