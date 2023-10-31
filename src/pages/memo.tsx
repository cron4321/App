import { useState, useEffect } from "react";
import Modal from "react-modal";
import styled from "styled-components";
import Header from "../components/home/Header";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import Axios from "axios";
import React from "react";

Modal.setAppElement("#root");

interface Memo {
  id: number;
  title: string;
  content: string;
}

const axios = Axios.create({
  baseURL: "http://15.164.241.36:3002",
});

function MemoPage() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalEditMode, setModalEditMode] = useState(false);
  const [modalMemoIndex, setModalMemoIndex] = useState(-1);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const userToken = localStorage.getItem('userToken');
    if (userToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
    }

    axios
      .get("/api/memos")
      .then((response) => {
        setMemos(response.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          console.error("401 Unauthorized 에러가 발생했습니다.");
        } else {
          console.error("메모 데이터 불러오기 오류:", error);
        }
      });
  }, []);


  const openModal = () => {
    setModalIsOpen(true);
    setModalEditMode(false);
    setTitle("");
    setContent("");
  };

  const openEditModal = (index: number) => {
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
      const memoData = { title, content };
      if (modalEditMode) {
        axios
          .put(`/api/memos/${memos[modalMemoIndex].id}`, memoData)
          .then(() => {
            const updatedMemos = [...memos];
            updatedMemos[modalMemoIndex] = {
              ...memoData,
              id: memos[modalMemoIndex].id,
            };
            setMemos(updatedMemos);
          })
          .catch((error) => {
            if (error.response && error.response.status === 401) {
              console.error("401 Unauthorized 에러가 발생했습니다.");
            } else {
              console.error("메모 데이터 수정 오류:", error);
            }
          });
      } else {
        axios
          .post("/api/memos", memoData)
          .then((response) => {
            const newMemo = { ...memoData, id: response.data.insertId };
            setMemos([...memos, newMemo]);
          })
          .catch((error) => {
            if (error.response && error.response.status === 401) {
              console.error("401 Unauthorized 에러가 발생했습니다.");
            } else {
              console.error("메모 데이터 추가 오류:", error);
            }
          });
      }
      setTitle("");
      setContent("");
      closeModal();
    }
  };

  const deleteMemo = () => {
    if (modalEditMode) {
      const memoIdToDelete = memos[modalMemoIndex].id;
      if (memoIdToDelete === undefined || memoIdToDelete === null) {
        console.error("올바르지 않은 메모 ID:", memoIdToDelete);
        return;
      }
      axios
        .delete(`/api/memos/${memoIdToDelete}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          },
        })
        .then(() => {
          const updatedMemos = memos.filter(
            (memo, index) => index !== modalMemoIndex
          );
          setMemos(updatedMemos);
          closeModal(); 
        })
        .catch((error) => {
          console.error("메모 데이터 삭제 오류:", error);
  
          if (error.response && error.response.status === 401) {
          }
        });
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
          <Memo key={memo.id} onClick={() => openEditModal(index)}>
            <MemoTitle>{memo.title}</MemoTitle>
            <MemoContent>{memo.content}</MemoContent>
          </Memo>
        ))}
      </Main>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel={modalEditMode ? "메모 편집 모달" : "메모 추가 모달"}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            maxWidth: "70%",
            maxHeight: "70%",
            margin: "auto",
            border: "1px solid #0074e4",
            borderRadius: "12px",
          },
        }}
      >
        <ModalContainer>
          <ModalHeader>
            <Modaltitle
              type="text"
              placeholder="제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <ExitButton onClick={closeModal}>
              <CloseIcon sx={{ width: 30, height: 30 }} />
            </ExitButton>
          </ModalHeader>
          <ModalMain>
            <ModalContent
              placeholder="내용"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </ModalMain>
          <ModalFooter>
            <SaveButton onClick={addMemo}>
              {modalEditMode ? "수정" : "저장"}
            </SaveButton>
            <DeleteButton onClick={deleteMemo}>삭제</DeleteButton>
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
  background-color: #f9f9f9;
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
  cursor: pointer;
`;

const Main = styled.main`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
  place-items: center;
  background-color: #f9f9f9;
`;

const Memo = styled.div`
  width: 100%;
  max-width: 160px;
  height: 225px;
  border-radius: 12px;
  border: 1px solid #0074e4;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  padding: 10px;
  position: relative;
  background-color: #ffffff;
  overflow: hidden; /* 내용을 넘어가지 않도록 함 */
  text-overflow: ellipsis; /* 긴 텍스트를 ...으로 표시 */
  white-space: nowrap; /* 줄 바꿈 없이 텍스트 표시 */
`;


const MemoTitle = styled.h3`
  max-height: 2.4em; 
  overflow: hidden; 
  text-overflow: ellipsis; 
  white-space: normal;
  margin-bottom: 8px; 
`;

const MemoContent = styled.p`
  max-height: 7.0em;
  overflow: hidden;
  text-overflow: ellipsis; 
  white-space: pre-wrap; 
`;


const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 12px;
`;

const ExitButton = styled.div``;

const Modaltitle = styled.input`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #0074e4;
  border-radius: 12px;
  width: 100%;
`;
const ModalMain = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  margin: 10px 0;
`;
const ModalContent = styled.textarea`
  padding: 10px;
  border: 1px solid #0074e4;
  border-radius: 12px;
  width: 100%;
  height: 100%;
  text-overflow: ellipsis;
`;

const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: 30px 10px 10px 10px;
`;

const SaveButton = styled.button`
  border-radius: 12px;
  background-color: #0074e4;
  border: none;
  width: 63px;
  height: 35px;
`;

const DeleteButton = styled.button`
  border-radius: 12px;
  background-color: #0074e4;
  border: none;
  width: 63px;
  height: 35px;
`;

export default MemoPage;
