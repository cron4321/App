import React, { useState } from "react";
import styled from "styled-components";
import Chat from "@mui/icons-material/Chat";
import { Link } from "react-router-dom";

const ChatButton: React.FC = () => {
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [chatRooms] = useState([
    {
      id: 1,
      profile: "A",
      lastMessage: "안녕하세요dd!",
    },
    {
      id: 2,
      profile: "B",
      lastMessage: "안녕하세요!",
    },
    {
      id: 3,
      profile: "C",
      lastMessage: "안녕하세요!",
    },
  ]);

  const openChatModal = () => {
    setIsChatModalOpen(true);
  };

  const closeChatModal = () => {
    setIsChatModalOpen(false);
  };

  return (
    <>
      <ChatButtonContainer>
        <ChatButtonIcon onClick={openChatModal}>
          <Chat />
        </ChatButtonIcon>
      </ChatButtonContainer>
      {isChatModalOpen && (
        <ChatModalContainer>
          {chatRooms.map((room) => (
            <NoUnderlineLink to={`./ChatRoom/${room.id}`} key={room.id}>
              <ChatRoom>
                <ChatRoomProfile>{room.profile}</ChatRoomProfile>
                <ChatRoomContent>
                  <ChatRoomLastMessage>{room.lastMessage}</ChatRoomLastMessage>
                </ChatRoomContent>
              </ChatRoom>
              <ChatRoomDivider />
            </NoUnderlineLink>
          ))}
          <ChatModalCloseButton onClick={closeChatModal}>닫기</ChatModalCloseButton>
        </ChatModalContainer>
      )}
    </>
  );
};

const NoUnderlineLink = styled(Link)`
  text-decoration: none;
  color: #000;
`;

const ChatButtonContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 100;
`;

const ChatButtonIcon = styled.button`
  background: #0074e4;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  cursor: pointer;
`;

const ChatModalContainer = styled.div`
  position: fixed;
  bottom: 50px;
  right: 30px;
  width: 300px;
  background: #fff;
  border: 1px solid #ccc;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 101;
  border-radius: 10px;
`;

const ChatRoom = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
`;

const ChatRoomProfile = styled.div`
  background: #0074e4;
  color: #000;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  margin-right: 10px;
`;

const ChatRoomLastMessage = styled.div`
  font-weight: bold;
  color: #000;
`;

const ChatRoomContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ChatRoomDivider = styled.div`
  border-bottom: 1px solid #ccc;
`;

const ChatModalCloseButton = styled.button`
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  background: #0074e4;
  color: #fff;
  border-radius: 5px;
  margin-left: auto;
`;

export default ChatButton;
