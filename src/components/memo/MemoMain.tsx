import styled from "styled-components";
import { Itemprops } from "../../types";
import React from "react";

function MemoMain(props: Itemprops) {
  const { memos, openEditModal } = props;

  return (
    <MainContainer>
      {memos.map((memo, index) => (
        <Memo key={index} onClick={() => openEditModal(index)}>
          <MemoTitle>{memo.title}</MemoTitle>
          <MemoContent>{memo.content}</MemoContent>
        </Memo>
      ))}
    </MainContainer>
  );
}

const MainContainer = styled.main`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
`;

const Memo = styled.div`
  display: flex;
  width: 159px;
  height: 225px;
  border-radius: 8px;
  border: 2px solid #0074E4; 
  cursor: pointer;
  flex-direction: column;
  padding: 10px;
  position: relative;
`;

const MemoTitle = styled.h3``;

const MemoContent = styled.p``;

export default MemoMain;
