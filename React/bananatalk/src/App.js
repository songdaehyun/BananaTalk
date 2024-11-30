import React, { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import AddFriend from "./AddFriend";
import AskFriend from "./AskFriend";
import Friend from "./Friend";
import Chat from "./Chat";
import {
  Container,
  List,
  Paper,
  Grid,
  Button,
  AppBar,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";
import { call, getmyname, signout } from "./ApiService";
import "./App.css";

const App = () => {
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [askfriend, setAskfriend] = useState(null);

  const [items, setItems] = useState([]);
  const [mynanme, setMyname] = useState("");
  const [friends, setFriends] = useState([
    { username: "Alice" },
    { username: "Bob" },
  ]);

  const [chatMap, setChatMap] = useState(
    new Map([
      [
        "Alice", // key
        [
          { sender: "me", receiver: "Alice", content: "Hello!" }, // value (배열)
          { sender: "Alice", receiver: "me", content: "Hi there!" },
        ],
      ],
      ["Bob", [{ sender: "me", receiver: "Bob", content: "Hey Bob!" }]],
    ])
  );

  // 대화 추가 함수
  const addChat = (friend, chat) => {
    setChatMap((prevMap) => {
      const newMap = new Map(prevMap); // 기존 Map 복사
      const chats = newMap.get(friend) || []; // 기존 대화 리스트 가져오기 (없으면 빈 배열)
      newMap.set(friend, [...chats, chat]); // 새 대화 추가
      return newMap; // 새 Map 반환
    });
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    call("/friends", "GET", null)
      .then((response) => {
        setFriends(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        // 에러 처리 로직 추가
      });
  }, []);

  useEffect(() => {
    const fetchDataAndExecute = async () => {
      try {
        // 사용자 이름을 가져오는 비동기 함수
        const response = await getmyname();
        console.log(response);
        setMyname(response.username); // 사용자 이름을 설정
        setLoading(false);

        // STOMP Client 생성 및 연결
        const socket = new SockJS("http://localhost:8080/ws");
        const stompClient = new Client({
          webSocketFactory: () => socket,
          onConnect: (frame) => {
            console.log("Connected: " + frame);
            setConnected(true);

            // 친구요청 관리 채널
            stompClient.subscribe(
              `/topic/friend/${response.username}`,
              (msg) => {
                const receivedMessage = JSON.parse(msg.body);
                console.log(receivedMessage);
                const content = receivedMessage.content;
                if (content === "ask") {
                  setAskfriend(receivedMessage);
                } else if (content === "accept") {
                  //친구목록창에 친구 추가
                  const newFriend = {
                    username: receivedMessage.sender,
                  };
                  setFriends((prev) => [...prev, newFriend]);
                  console.log(content);
                } else {
                  // 할거딱히 없는듯
                  console.log(content);
                }
              }
            );
          },
          onDisconnect: () => setConnected(false),
        });

        stompClient.activate(); // WebSocket 연결 활성화
        setClient(stompClient); // STOMP Client 상태로 설정
      } catch (error) {
        console.log(error);
      }
    };

    fetchDataAndExecute();

    return () => {
      if (client) client.deactivate(); // 컴포넌트 언마운트 시 연결 해제
    };
  }, []);

  const sendFriendMessage = (userID, message) => {
    if (client && connected) {
      const WebSocketDTO = {
        sender: mynanme,
        receiver: userID,
        content: message,
      };
      console.log(WebSocketDTO);
      client.publish({
        destination: `/app/friend/${userID}`,
        body: JSON.stringify(WebSocketDTO),
      });
    }
  };

  let friendList = friends.length > 0 && (
    <Paper
      style={{
        margin: 16,
        height: "100%", // 상위 컨테이너에 맞춰 높이 조정
        overflowY: "auto", // 스크롤 가능
      }}
    >
      <List>
        {friends.map((friend) => (
          <Friend item={friend} map={chatMap} />
        ))}
      </List>
    </Paper>
  );

  //navigationBar
  let navigationBar = (
    <AppBar position="static">
      <Toolbar>
        <Grid justifyContent="space-between" container>
          <Grid item>
            <Typography variant="h6">{mynanme}님 안녕하세요!</Typography>
          </Grid>
          <Grid item>
            <Button color="inherit" raised="ture" onClick={signout}>
              로그아웃
            </Button>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
  /* 로딩중 아닐때 렌더링 할 부분 */
  let todoListPage = (
    <div>
      {navigationBar}
      <Container maxWidth="md">
        <AddFriend addFriend={sendFriendMessage} />

        <div className="FriendList">{friendList}</div>
      </Container>
      <Container>
        <AskFriend
          webSocketDTO={askfriend}
          sendFriendFunction={sendFriendMessage}
          acceptFunction={setFriends}
        />
      </Container>
    </div>
  );

  /* 로딩중일때 렌더링 할 부분 */
  let loadingPage = <h1> 로딩중...</h1>;
  let content = loadingPage;

  if (!loading) {
    content = todoListPage;
  }

  //
  //return <div className="App">{content}</div>;
  return <div className="App">{friendList}</div>;
};

export default App;
