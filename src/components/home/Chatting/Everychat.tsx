import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import io from 'socket.io-client';

const socket = io('http://localhost:3004', {
  transports: ['websocket'],
  path: '/socket.io',
  secure: true,
  rejectUnauthorized: false,
  withCredentials: true,
  extraHeaders: {
    'Access-Control-Allow-Origin': 'http://localhost:3000',
  },
});

const ChatClient: React.FC = () => {
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState<string[]>([]);
  const [clientName, setClientName] = useState<string>(''); 
  const chatLogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch('http://localhost:3004/getClientName')
      .then((response) => response.json())
      .then((data) => {
        setClientName(data.clientName);
      })
      .catch((error) => {
        console.error('익명 번호 가져오기 오류:', error);
      });

    fetch('http://localhost:3004/getInitialMessages')
      .then((response) => response.json())
      .then((data) => {
        setChatLog(data.messages);
        scrollToBottom();
      })
      .catch((error) => {
        console.error('초기 채팅 내용 가져오기 오류:', error);
      });

    const messageHandler = (message: string) => {
      console.log(`Received message: ${message}`);
      setChatLog((prevLog) => [...prevLog, message]);
      scrollToBottom();
    };

    socket.on('message', messageHandler);

    return () => {
      socket.off('message', messageHandler);
    };
  }, []);

  const sendMessage = () => {
    if (message) {
      const data = {
        username: clientName,
        message: message,
      };
      socket.emit('message', data);
      setMessage('');
    }
  };

  const scrollToBottom = () => {
    if (chatLogRef.current) { 
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  };

  return (
    <Container>
      <h2>내 익명 번호: {clientName}</h2>
      <InputContainer>
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && message && sendMessage()}
          placeholder="메시지 입력"
        />
        <Button onClick={sendMessage}>전송</Button>
      </InputContainer>
      <ChatLogContainer>
        <ChatLog ref={chatLogRef}>
          {chatLog.map((msg, index) => (
            <p key={index}>{`${msg}`}</p>
          ))}
        </ChatLog>
      </ChatLogContainer>
    </Container>
  );
};

const Container = styled.div`
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #0074E4; 
  align-items: center;
  flex-direction: column;
`;

const ChatLogContainer = styled.div`
  max-height: 250px;
  overflow-y: auto;
  padding: 10px; 
`;

const ChatLog = styled.div`
  max-height: 200px;
  overflow-y: auto;
  padding: 10px; 
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  input {
    flex: 1;
    padding: 10px;
  }
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  margin-left: 10px;
  padding: 10px 20px;
  background-color: #0074E4;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

export default ChatClient;