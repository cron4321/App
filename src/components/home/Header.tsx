import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";

function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userNickname, setUserNickname] = useState("");
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleSidebar = () => {
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
      <MenuButton onClick={toggleSidebar}>
        <MenuIcon sx={{ width: 30, height: 30 }} />
      </MenuButton>
      <AlarmButton>
        <NotificationsIcon sx={{ width: 30, height: 30 }} />
      </AlarmButton>
      <Sidebar isSidebarOpen={isSidebarOpen} ref={sidebarRef}>
        {isLoggedIn ? (
          <>
            <SidebarItem>{userNickname} ({userEmail})</SidebarItem>
            <SidebarItem onClick={handleLogout}>로그아웃</SidebarItem>
          </>
        ) : (
          <SidebarItem onClick={() => { window.location.href = "/Login"; }}>로그인</SidebarItem>
        )}
        <SidebarItem>학교 변경</SidebarItem>
      </Sidebar>
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

const AlarmButton = styled.div`
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 24px;
`;

const MenuButton = styled.div`
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 24px;
`;

const Sidebar = styled.div<{ isSidebarOpen: boolean }>`
  width: 250px;
  height: 100%;
  background: #333;
  display: flex;
  flex-direction: column;
  padding: 20px;
  color: #fff;
  transform: translateX(${(props) => (props.isSidebarOpen ? "0" : "-250px")});
  transition: transform 0.3s ease-in-out;
  z-index: 1;
  position: absolute;
  top: 0;
  left: 0;
  opacity: ${(props) => (props.isSidebarOpen ? 1 : 0)};
  visibility: ${(props) => (props.isSidebarOpen ? "visible" : "hidden")};
  overflow: hidden;
`;

const SidebarItem = styled.div`
  margin-bottom: 20px;
  cursor: pointer;
`;

export default Header;
