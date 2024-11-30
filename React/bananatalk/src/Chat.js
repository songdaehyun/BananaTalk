import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
} from "@mui/material";

const Chat = (item) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "me" }]);
      setInput("");
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: 400,
        height: 600,
        margin: "auto",
        padding: 2,
      }}
    >
      {/* Chat messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          marginBottom: 2,
          padding: 1,
          border: "1px solid #ccc",
          borderRadius: 1,
        }}
      >
        {messages.map((message, index) => (
          <Stack
            key={index}
            alignItems={message.sender === "me" ? "flex-end" : "flex-start"}
            sx={{ marginBottom: 1 }}
          >
            <Box
              sx={{
                backgroundColor:
                  message.sender === "me" ? "#1976d2" : "#f1f1f1",
                color: message.sender === "me" ? "#fff" : "#000",
                padding: 1,
                borderRadius: 1,
                maxWidth: "70%",
              }}
            >
              <Typography variant="body2">{message.text}</Typography>
            </Box>
          </Stack>
        ))}
      </Box>

      {/* Input area */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
        }}
      >
        <TextField
          variant="outlined"
          size="small"
          placeholder="Type a message..."
          fullWidth
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <Button
          variant="contained"
          onClick={handleSend}
          sx={{ height: "40px", alignSelf: "center" }}
        >
          Send
        </Button>
      </Box>
    </Paper>
  );
};

export default Chat;
