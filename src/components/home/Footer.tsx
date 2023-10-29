import React, { useEffect, useState } from "react";
import styled from "styled-components";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import Axios from "axios";
import EveryChat from "./Chatting/Everychat";

const axios = Axios.create({
  baseURL: "http://localhost:5000",
});

interface Memo {
  title: string;
  content: string;
}

function Footer() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [memosToShow, setMemosToShow] = useState(2); 
  const [showMemoModal, setShowMemoModal] = useState(false); 
  const [selectedMemo, setSelectedMemo] = useState<Memo | null>(null); 

  useEffect(() => {
    axios
      .get("/api/memos")
      .then((response) => {
        setMemos(response.data);
      })
      .catch((error) => {
        console.error("메모 데이터 불러오기 오류:", error);
      });
  }, []);

  useEffect(() => {
    function handleResize() {
      const numMemosToShow = Math.floor(window.innerWidth / 130); 
      setMemosToShow(numMemosToShow);
    }
    window.addEventListener("resize", handleResize);
    handleResize(); 

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const openMemoModal = (memo: Memo) => {
    setSelectedMemo(memo);
    setShowMemoModal(true);
  };
  
  const closeMemoModal = () => {
    setSelectedMemo(null);
    setShowMemoModal(false);
  };
  

  const createFooterContent = (index: number, memo: Memo) => (
    <FooterContent
      key={index}
      memoBoxWidth={130}
      onClick={() => openMemoModal(memo)} 
    >
      <MemoTitle>{truncateText(memo.title, 2)}</MemoTitle>
      <MemoContent>{truncateText(memo.content, 8)}</MemoContent>
    </FooterContent>
  );

  const truncateText = (text: string, maxLines: number) => {
    const lines = text.split('\n');
    if (lines.length > maxLines) {
      return lines.slice(0, maxLines).join('\n') + '...';
    }
    return text;
  }

  return (
    <FooterContainer>
      <FooterForm>
        <FooterHeader>
          <FooterTitle>메모</FooterTitle>
          <Link to="/memo">
            <AddButton>
              <AddIcon sx={{ width: 30, height: 30 }} />
            </AddButton>
          </Link>
        </FooterHeader>
        <FooterBody memosToShow={memosToShow}>
          {memos.map((memo, index) =>
            createFooterContent(index, memo)
          )}
        </FooterBody>
      </FooterForm>
      <ChatContainer>
        <EveryChat />
      </ChatContainer>
      <MemoModal show={showMemoModal}>
        {selectedMemo && (
          <Div>
            <H2>{truncateText(selectedMemo.title, 2)}</H2>
            <P>{truncateText(selectedMemo.content, 8)}</P>
            <Button onClick={closeMemoModal}>닫기</Button>
          </Div>
        )}
      </MemoModal>
    </FooterContainer>
  );
}

const Div = styled.div``;
const H2 = styled.h2``;
const P = styled.p``;

const Button = styled.button`
  border-radius: 12px;
  background-color: #0074e4;
  border: none;
  width: 63px;
  height: 35px;
`;
const MemoTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 10px;
  overflow: hidden; 
  text-overflow: ellipsis; 
  white-space: nowrap;
`;

const MemoContent = styled.div`
  font-size: 16px;
  color: #555;
  margin: 10px;
  overflow: hidden; 
  text-overflow: ellipsis; 
  white-space: pre-wrap;
  max-height: 4.8em; 
`;

const MemoModal = styled.div<{ show: boolean }>`
  display: ${props => (props.show ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  align-items: center;
  justify-content: center;

  div {
    background-color: #ffffff;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0px 0px 5px 0px #000;
    max-width: 80%;
    max-height: 80%;
    overflow-y: auto;
    white-space: pre-line;
    overflow-wrap: break-word;
  }

  button {
    display: block;
    margin-top: 10px;
    cursor: pointer;
  }
`;


const FooterContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f9f9f9;
  padding: 16px 24px 36px 24px;
`;

const FooterForm = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 191px;
  border: 1px solid #0074e4;
  border-radius: 12px;
  background: #f9f9f9;
`;

const FooterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center; 
`;

const FooterTitle = styled.div`
  margin: 16px 0 10px 16px;
  color: #000;
  text-align: center;
  font-family: Inter;
  font-size: 15px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px;
  letter-spacing: -0.5px;
`;

const AddButton = styled.div`
  width: 30px;
  height: 30px;
  margin: 8px 16px 8px 0;
  flex-shrink: 0;
`;

const FooterBody = styled.div<{ memosToShow: number }>`
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  padding-bottom: 10px;
  ${props => `
    & > div:nth-child(n + ${props.memosToShow + 1}) {
      display: none;
    }
  `}
`;

const FooterContent = styled.div<{ memoBoxWidth: number }>`
  width: ${props => `${props.memoBoxWidth}px`};
  min-height: 129px;
  margin-left: 10px;
  margin-right: 10px;
  border: 1px solid #0074e4;
  border-radius: 12px;
  background: #ffffff;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
`;

const ChatContainer = styled.div`
  margin-top: 25px;
`;

export default Footer;
