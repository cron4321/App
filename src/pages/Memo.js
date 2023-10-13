import React, { useState } from "react";
import Modal from "react-modal";
import styled from "styled-components";
import Header from "../components/home/Header";
import AddIcon from "@mui/icons-material/Add";
import ReactModal from "react-modal";

Modal.setAppElement("#root");

function MemoApp() {
  const [memos, setMemos] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalEditMode, setModalEditMode] = useState(false);
  const [modalMemoIndex, setModalMemoIndex] = useState(-1);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const openModal = () => {
    setModalIsOpen(true);
    setModalEditMode(false);
    setTitle("");
    setContent("");
  };

  const openEditModal = (index) => {
    setModalIsOpen(true);
    setModalEditMode(true);
    setModalMemoIndex(index);
    setTitle(memos[index].title);
    setContent(memos[index].content);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const addMemo = () => {
    if (title || content) {
      if (modalEditMode) {
        const updatedMemos = [...memos];
        updatedMemos[modalMemoIndex] = { title, content };
        setMemos(updatedMemos);
      } else {
        setMemos([...memos, { title, content }]);
      }
      setTitle("");
      setContent("");
    }
    closeModal();
  };

  const deletMemo = () => {
    if (modalEditMode) {
      const updatedMemos = [...memos];
      updatedMemos.splice(modalMemoIndex, 1);
      setMemos(updatedMemos);
      closeModal();
    }
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
          <Memo key={index} onClick={() => openEditModal(index)}>
            <MemoTitle>{memo.title}</MemoTitle>
            <MemoContent>{memo.content}</MemoContent>
          </Memo>
        ))}
      </Main>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel={modalEditMode ? "메모 편집 모달" : "메모 추가 모달"}
      >
        <ModalContainer>
          <Modaltitle
            type="text"
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <ModalContent
            placeholder="내용"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <ModalFooter>
            <SaveButton onClick={addMemo}>
              {modalEditMode ? "수정" : "저장"}
            </SaveButton>
            <ExitButton onClick={closeModal}>닫기</ExitButton>
            <DeleteButton on onClick={deletMemo}>
              삭제
            </DeleteButton>
          </ModalFooter>
        </ModalContainer>
      </Modal>
    </AppContainer>
  );
}

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
  position: relative;
`;

const MemoTitle = styled.h3``;

const MemoContent = styled.p``;

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
`;

const Modaltitle = styled.input`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #0074e4;
  border-radius: 5px;
  width: 80%;
`;

const ModalContent = styled.textarea`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #0074e4;
  border-radius: 5px;
  width: 80%;
  height: 60%;
`;

export default MemoApp;

const ModalFooter = styled.div``;

const SaveButton = styled.button``;

const ExitButton = styled.button``;

const DeleteButton = styled.button``;
