import React, { useState, useEffect } from "react";
import { receivefriend, rejectfriend } from "./ApiService";
import {
  Container,
  List,
  Paper,
  Grid,
  Button,
  AppBar,
  Toolbar,
  Typography,
} from "@mui/material";

function AskFriend(props) {
  const [notifications, setNotifications] = useState([]);
  const WebSocketDTO = props.webSocketDTO;
  const SendFriendFunction = props.sendFriendFunction;
  const AcceptFunction = props.acceptFunction;
  // 새로운 메시지가 전달될 때 알림 스택에 추가
  useEffect(() => {
    if (WebSocketDTO) {
      setNotifications((prev) => [...prev, WebSocketDTO]);
    }
  }, [WebSocketDTO]);

  // 가장 최근 알림 가져오기
  const latestNotification =
    notifications.length > 0 ? notifications[notifications.length - 1] : null;

  // 친구 요청을 보낸 사용자
  const from = latestNotification ? latestNotification.sender : "";

  // Remove the top notification from the stack
  const removeNotification = () => {
    setNotifications((prev) => prev.slice(0, -1));
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <Container component="main" maxWidth="xs" style={{ marginTop: "8%" }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography component="h1" variant="h5">
            {from}님으로부터 친구 요청이 왔습니다. 수락하시겠습니까?
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => {
              SendFriendFunction(from, "accept");
              const newFriend = {
                username: from,
              };
              AcceptFunction((prev) => [...prev, newFriend]);
              removeNotification();
            }} // Fix typo: onclick -> onClick
          >
            예
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            onClick={() => {
              SendFriendFunction(from, "reject");
              removeNotification();
            }} // Fix typo: onclick -> onClick
          >
            아니오
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default AskFriend;
