import React, { useState } from "react";
import Modal from "react-modal";
import styled from "styled-components";
import Header from "../home/Header";
import AddIcon from "@mui/icons-material/Add";
Modal.setAppElement("#root");

function MemoApp() {
  const [memos, setMemos] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const addMemo = () => {
    if (title || content) {
      setMemos([...memos, { title, content }]);
      setTitle("");
      setContent("");
    }
    closeModal();
  };

  return (
    <AppContainer>
      <Header />
      <MemoHeader>
        <Title>메모</Title>
        <AddButton onClick={openModal}>
          <AddIcon sx={{ width: 30, height: 30 }} />
        </AddButton>
      </MemoHeader>
      <Main>
        {memos.map((memo, index) => (
          <Memo key={index} onClick={openModal}>
            <h3>{memo.title}</h3>
            <p>{memo.content}</p>
          </Memo>
        ))}
      </Main>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Memo Modal"
      >
        <ModalContainer>
          <Modaltitle
            type="text"
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <ModalContent
            type="text"
            placeholder="내용"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button onClick={addMemo}>저장</button>
          <button onClick={closeModal}>닫기</button>
        </ModalContainer>
      </Modal>
    </AppContainer>
  );
}

export default MemoApp;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MemoHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: #ffffff;
  color: #ffffff;
`;
const Title = styled.h1`
  margin: 0;
  padding: 23px 0px 18px 35px;
  color: #000000;
  text-align: center;
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px;
  letter-spacing: -0.5px;
`;

const AddButton = styled.div`
  padding: 15px 40px 16px 0;
  color: #000000;
`;

const Main = styled.main`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

const Memo = styled.div`
  width: 159px;
  height: 225px;
  border-radius: 12px;
  border: 1px solid #0074e4;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  padding: 10px;
`;

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Modaltitle = styled.input`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #0074e4;
  border-radius: 5px;
  width: 80%;
`;

const ModalContent = styled.input`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #0074e4;
  border-radius: 5px;
  width: 80%;
  height
`;
