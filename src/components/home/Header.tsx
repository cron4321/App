import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom"; // 추가
import Sidebar from "./Headrcomponets/Sidebar";
import Alarm from "./Headrcomponets/Alram";
import MenuIcon from "@mui/icons-material/Menu";

function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userNickname, setUserNickname] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const sidebarRef = useRef<HTMLDivElement | null>(null);

  const exit = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    setUserEmail("");
    setUserNickname("");
    alert("로그아웃 되었습니다");
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsSidebarOpen(false);
      }
    }

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || '{}');
    if (loggedInUser.email && loggedInUser.username) {
      setIsLoggedIn(true);
      setUserEmail(loggedInUser.email);
      setUserNickname(loggedInUser.username);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <HeaderContainer>
      <MenuButton onClick={exit}><MenuIcon/></MenuButton>
      <Link to="/" style={{ textDecoration: "none", color: "#fff" }}>
        <HeaderText>우리 학교 알리미</HeaderText>
      </Link>
      <Alarm isSidebarOpen={isSidebarOpen} onLogout={handleLogout} />
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        ref={sidebarRef}
        userNickname={userNickname}
        userEmail={userEmail}
        onLogout={handleLogout}
        exit={exit}
      />
    </HeaderContainer>
  );
}

const HeaderContainer = styled.header`
  display: flex;
  width: 100%;
  height: 56px;
  background: #0074e4;
  align-items: center;
  justify-content: space-between;
`;

const MenuButton = styled.div`
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 24px;
  cursor: pointer;
`;

const HeaderText = styled.h1`
  color: #fff;
  text-decoration: none;
`;

export default Header;
