import Header from "../components/home/Header";
import Main from "../components/home/Main";
import Aside from "../components/home/Aside";
import Footer from "../components/home/Footer";
import styled from "styled-components";

function HomePage() {
  return (
    <Container>
      <Header />
      <Main />
      <Aside />
      <Footer />
    </Container>
  );
}

export default HomePage;

const Container = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto auto;
  width: 100%;
  height: 100%;
  background: f9f9f9;
`;
