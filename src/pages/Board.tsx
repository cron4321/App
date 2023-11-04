import styled from "styled-components";
import Main from "../components/home/Main";
import React from "react";
import Header from "../components/home/Header";

function BoardPage() {
  return (
    <Container>
      <Header />
      <Main mynumber={15} />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: f9f9f9;
`;

export default BoardPage;
