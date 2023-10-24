import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Chat from "@mui/icons-material/Chat";
import { Link } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import SearchResultsModal from "./Chatsearchmodal";

type User = {
  id: string;
  email: string;
  username: string;
};

const ChatButton: React.FC = () => {
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [chatRooms, setChatRooms] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<User[] | null>(null);
  const [error, setError] = useState("");
  const [showSearchResultsModal, setShowSearchResultsModal] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string>("");

  const handleSearchResultClick = (email: any) => {
    window.location.href = `/chatroom/${email}`;
  };

  const socket = io("http://localhost:3001", {
    path: '/socket.io',
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  useEffect(() => {
    socket.on("chat-rooms", (rooms) => {
      setChatRooms(rooms);
    });
    socket.emit("get-chat-rooms");

    const getChatRoomsForCurrentUser = () => {
      const currentUserId = "yeow_1@naver.com"; 

      getChatRoomsForUser(currentUserId, chatRoomIds => {
        setChatRooms(chatRoomIds.map(id => ({ id, email: '', username: '' })));
      });
    };


    getChatRoomsForCurrentUser(); 

    return () => {
      socket.off("chat-rooms");
    };
  }, []);

  const openChatModal = () => {
    setIsChatModalOpen(true);
  };

  const closeChatModal = () => {
    setIsChatModalOpen(false);
  };

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      axios.get(`http://localhost:3001/search?email=${searchTerm}`)
        .then((response) => {
          const results = response.data.searchResults;
          if (results) {
            setError(results.length === 0 ? "존재하지 않는 닉네임입니다." : "");
            setSearchResults(
              Array.isArray(results)
                ? results.filter((user: User) => user.email.includes(searchTerm))
                : null
            );
            setIsChatModalOpen(results.length > 0);
            setCurrentUserEmail(response.data.currentUserEmail);
          } else {
            setSearchResults([]);
            setError("검색 결과가 없습니다.");
          }
        })
        .catch((error) => {
          console.error("검색 요청 오류:", error);
          setError("검색 오류가 발생했습니다.");
          setSearchResults(null);
        });
    } else {
      setError("검색어를 입력하세요.");
      setSearchResults(null);
    }
  };


  const getChatRoomsForUser = (userId: string, callback: (chatRooms: string[]) => void) => {
    // 현재 사용자의 ID 또는 이메일을 사용해 채팅방 목록을 가져오는 로직을 구현 (예: 서버 요청)

    // 임시로 빈 배열을 반환하는 예시
    callback([]);
  };

  const handleChatRoomClick = (userId: string, roomId: string) => {
    getChatRoomsForUser(userId, chatRooms => {
      const existingChatRoom = chatRooms.find(id => id === roomId);

      if (!existingChatRoom) {
      }

    });
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
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="사용자 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchButton onClick={handleSearch}>검색</SearchButton>
          </SearchContainer>
          {error && <ErrorText>{error}</ErrorText>}
          {searchResults !== null && (
            <SearchResults>
              {searchResults.map((user) => (
                <SearchResultItem
                  key={user.id}
                  onClick={() => handleSearchResultClick(user.email)}
                >
                  {user.username}
                </SearchResultItem>
              ))}
            </SearchResults>
          )}
          {currentUserEmail && (
      <ChatRoomItem
        onClick={() => handleSearchResultClick(currentUserEmail)}
      >
        내 채팅방
      </ChatRoomItem>
    )}
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

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 10px;
  font-size: 16px;
  border: none;
  outline: none;
`;

const SearchButton = styled.button`
  background: #0074e4;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
`;

const SearchResults = styled.div`
  max-height: 200px;
  overflow-y: auto;
`;

const SearchResultItem = styled.div`
  cursor: pointer;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  &:hover {
    background: #f4f4f4;
  }
`;

const ChatRoomList = styled.div`
  padding: 10px;
`;

const ChatRoomItem = styled.div`
  cursor: pointer;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  &:hover {
    background: #f4f4f4;
  }
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

const ErrorText = styled.div`
  color: red;
`;

export default ChatButton;
