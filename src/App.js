import React from "react";
import "./App.css";
import styled from "styled-components";
import AddIcon from "@mui/icons-material/Add";
import VolumeDownIcon from "@mui/icons-material/VolumeDown";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import SchoolIcon from "@mui/icons-material/School";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import HomeIcon from "@mui/icons-material/Home";

function App() {
  return (
    <Form>
      <Header></Header>
      <Body>
        <Post>
          <PostHeader>
            <Title>공지사항</Title>
            <AddIcon style={{ marginRight: 16 }} />
          </PostHeader>
        </Post>
        <Nav>
          <HomeIcon />
          <VolumeDownIcon />
          <SchoolIcon />
          <LocalDiningIcon />
          <DirectionsBusIcon />
        </Nav>
      </Body>
    </Form>
  );
}

export default App;
const Form = styled.div`
  heigh: 100%;
  display: flex;
  flex-direction: column;
  background-color: f9f9f9;
`;
const Header = styled.div`
  width: 100%;
  height: 56px;
  flex-shrink: 0;
  background: #0074e4;
`;
const Body = styled.div`
  display: flex;
  min-width: 390px;
  min-height: 372px;
  padding: 16px 24px;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;
const Post = styled.div`
  display: flex;
  width: 100%;
  height: 404px;
  border-radius: 12px;
  border: 1px solid #0074e4;
  background: #f9f9f9;
`;
const PostHeader = styled.div`
  display: flex;
  width: 100%;
  height: 46px;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
`;
const Nav = styled.div`
  display: flex;
  width: 100%;
  height: 92px;
  padding: 12px 26px;
  justify-content: center;
  align-items: center;
  background: #f9f9f9;
`;
const HomeBtn = styled.button``;
const AnnouncementBtn = styled.button``;
const AcademicCalendarBtn = styled.button``;
const MenuBtn = styled.button``;
const SchoolBusBtn = styled.button``;

const PostFont = styled.text`
  color: #000;
  text-align: center;
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px; /* 166.667% */
  letter-spacing: -0.5px;
`;
const Title = styled.text`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  color: #000;
  text-align: center;
  font-family: Inter;
  font-size: 15px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px; /* 133.333% */
  letter-spacing: -0.5px;
  margin: 3px 0px 0px 16px;
`;
