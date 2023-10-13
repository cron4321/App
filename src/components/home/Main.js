import styled from "styled-components";
import AddIcon from "@mui/icons-material/Add";

function Main() {
  return (
    <MainContainer>
      <MainContent>
        <MainHeader>
          <MainTitle>공지사항</MainTitle>
          <AddIcon sx={{ width: 30, height: 30, marginRight: "16px" }} />
        </MainHeader>
        <Line />
        <SectionContents>Content 1</SectionContents>
        <Line />
        <SectionContents>Content 2</SectionContents>
        <Line />
        <SectionContents>Content 3</SectionContents>
        <Line />
        <SectionContents>Content 4</SectionContents>
        <Line />
        <SectionContents>Content 5</SectionContents>
        <Line />
        <SectionContents>Content 6</SectionContents>
      </MainContent>
    </MainContainer>
  );
}

export default Main;

const MainContainer = styled.div`
  display: flex;
  width: 100%;
  height: auto;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  background: #f9f9f9;
`;

const MainContent = styled.div`
  display: flex;
  width: 100%;
  height: auto;
  background: #ffffff;
  margin: 24px 24px 9px 24px;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border: 1px solid #0074e4;
  border-radius: 12px;
  background: f9f9f9;
`;

const MainHeader = styled.div`
  display: flex;
  width: 100%;
  min-height: 46px;
  align-items: center;
  justify-content: space-between;
`;

const MainTitle = styled.div`
  color: #000;
  margin-left: 16px;
  text-align: center;
  font-family: Inter;
  font-size: 15px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px;
  letter-spacing: -0.5px;
`;

const SectionContents = styled.div`
  width: 100%;
  height: auto;
  min-height: 49px;
  flex-shrink: 0;
  background: #ffffff;
  color: #000000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Line = styled.div`
  width: 100%;
  border-bottom: 1px solid #d7d7d7;
`;
