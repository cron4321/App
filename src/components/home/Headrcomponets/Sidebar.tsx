import React, { useEffect, forwardRef, Ref, RefObject, MutableRefObject } from "react";
import styled from "styled-components";

type SidebarProps = {
  isSidebarOpen: boolean;
  userNickname: string;
  userEmail: string;
  onLogout: () => void;
  exit: () => void;
};

const Sidebar = forwardRef(function Sidebar({ isSidebarOpen, userNickname, userEmail, onLogout, exit }: SidebarProps, ref: Ref<HTMLDivElement>) {
  useEffect(() => {
  }, []);

  return (
    <SidebarContainer ref={ref as RefObject<HTMLDivElement>} isSidebarOpen={isSidebarOpen}>
      {userEmail && userNickname ? (
        <>
          <SidebarItem>{userNickname} ({userEmail})</SidebarItem>
          <SidebarItem onClick={onLogout}>로그아웃</SidebarItem>
        </>
      ) : (
        <SidebarItem onClick={() => { window.location.href = "/Login"; }}>로그인</SidebarItem>
      )}
      <SidebarItem>학교 변경</SidebarItem>
    </SidebarContainer>
  );
});

const SidebarContainer = styled.div<{ isSidebarOpen: boolean }>`
  width: 250px;
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
  border-radius: 12px;
`;

const SidebarItem = styled.div`
  margin-bottom: 20px;
  cursor: pointer;
`;

export default Sidebar;