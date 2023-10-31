import Header from "../components/home/Header";
import Main from "../components/home/Main";
import Footer from "../components/home/Footer";
import styled from "styled-components";
import React from "react";

function HomePage() {
  return (
    <Container>
      <Header />
      <Main mynumber={7}/>
      <Footer />
    </Container>
  );
}

export default HomePage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: f9f9f9;
`;