import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    socket.emit('requestClientName');

    const messageHandler = (message: string) => {
      console.log(`Received message: ${message}`);
      setChatLog((prevLog) => [...prevLog, message]);
    };

    const clientNameHandler = (name: string) => {
      setClientName(name); 
    };

    socket.on('message', messageHandler);
    socket.on('clientName', clientNameHandler);

    return () => {
      socket.off('message', messageHandler);
      socket.off('clientName', clientNameHandler);
    };
  }, []);

  const sendMessage = () => {
    if (message) {
      socket.emit('message', message);
      setMessage('');
    }
  };

  return (
    <Container>
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
      <ChatLog>
        {chatLog.map((msg, index) => (
          <p key={index}>{`${msg}`}</p>
        ))}
      </ChatLog>
    </Container>
  );
};

const Container = styled.div`
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

const ChatLog = styled.div`
  max-height: 300px;
  overflow-y: auto;
  p {
    margin: 5px 0;
    border-left: 3px solid #007bff;
    padding-left: 10px;
  }
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
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

export default ChatClient;
