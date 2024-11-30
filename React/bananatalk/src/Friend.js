import React from "react";
import Chat from "./Chat";
import { useState } from "react";
import { Grid, Typography, Button, ListItem } from "@mui/material";

function Friend({ item, map }) {
  const hasNewMessage = true;

  // 채팅버튼 눌렀는지 여부
  const [chating, setChating] = useState(false);

  const toggleChating = () => {
    setChating((prev) => !prev);
  };
  return (
    <ListItem>
      <Grid
        container
        spacing={2}
        alignItems="center"
        style={{
          padding: "10px",
          borderBottom: "1px solid #ddd",
        }}
      >
        {/* 친구 이름 */}
        <Grid item xs={6}>
          <Typography variant="h6">{item.username}</Typography>
        </Grid>

        {/* 새로운 메시지 확인 (전구) */}
        <Grid item xs={3} style={{ textAlign: "center" }}>
          <div
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%", // 원형
              backgroundColor: hasNewMessage ? "yellow" : "gray", // 메시지 상태
              boxShadow: hasNewMessage
                ? "0 0 10px 2px rgba(255, 255, 0, 0.8)" // 빛나는 효과
                : "none",
              margin: "0 auto",
            }}
          ></div>
        </Grid>

        {/* 채팅 버튼 */}
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={toggleChating} // 상태 변경 함수 호출
          >
            {chating ? "닫기" : "채팅"} {/* 버튼 텍스트 변경 */}
          </Button>
        </Grid>
      </Grid>
      {/* 채팅 컴포넌트 조건부 렌더링 */}
      {chating && (
        <div style={{ marginTop: "10px" }}>
          <Chat />
        </div>
      )}
    </ListItem>
  );
}

export default Friend;
