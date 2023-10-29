import React, { useEffect, forwardRef, Ref, RefObject, useState, useRef } from "react";
import styled from "styled-components";
import HomeIcon from "@mui/icons-material/Home";
import CampaignIcon from "@mui/icons-material/Campaign";
import SchoolIcon from "@mui/icons-material/School";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import { Link } from "react-router-dom";

type SidebarProps = {
  isSidebarOpen: boolean;
  userNickname: string;
  userEmail: string;
  onLogout: () => void;
  setSelectedSchool: (school: string) => void;
};

const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
  ({ isSidebarOpen, userNickname, userEmail, onLogout, setSelectedSchool }: SidebarProps, ref) => {
    const [isSchoolModalOpen, setSchoolModalOpen] = useState(false);
    const [schools] = useState(["서울대학교", "연세대학교", "고려대학교", "무슨대학교", "저대학교", "완전대학교", "이런대학교"]);
    const [isSidebarVisible, setIsSidebarVisible] = useState(isSidebarOpen);
    const sidebarRef = useRef<HTMLDivElement | null>(null);

    const handleSchoolSelect = (school: string) => {
      setSelectedSchool(school);
      setSchoolModalOpen(false);
    };

    const handleOutsideClick = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        closeSidebar();
      }
    };

    const openSidebar = () => {
      setIsSidebarVisible(true);
    };

    const closeSidebar = () => {
      setIsSidebarVisible(false);
    };

    useEffect(() => {
      if (isSidebarOpen) {
        openSidebar();
      }
    }, [isSidebarOpen]);

    useEffect(() => {
      if (isSidebarVisible) {
        document.addEventListener("mousedown", handleOutsideClick);
      } else {
        document.removeEventListener("mousedown", handleOutsideClick);
      }

      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
      };
    }, [isSidebarVisible]);

    return (
      <SidebarContainer
        ref={(elem) => {
          sidebarRef.current = elem;
          if (ref) {
            if (typeof ref === "function") {
              ref(elem);
            } else {
              ref.current = elem;
            }
          }
        }}
        isSidebarVisible={isSidebarVisible}
        isSidebarOpen={isSidebarOpen}
      >
        {userEmail && userNickname ? (
          <>
            <SidebarItem>{userNickname} ({userEmail})</SidebarItem>
            <SidebarItem onClick={onLogout}>로그아웃</SidebarItem>
          </>
        ) : (
          <SidebarItem onClick={() => { window.location.href = "/Login"; }}>로그인</SidebarItem>
        )}
        <SidebarItem onClick={() => setSchoolModalOpen(!isSchoolModalOpen)}>학교 변경</SidebarItem>
        <SchoolList className={isSchoolModalOpen ? "open" : ""}>
          {schools.map((school) => (
            <SchoolItem key={school} onClick={() => handleSchoolSelect(school)}>
              {school}
            </SchoolItem>
          ))}
        </SchoolList>
        <br />
        <Link to={"https://www.kyonggi.ac.kr/www/index.do"}>
          <IconContainer>
            <HomeIcon sx={{ width: 48, height: 48 }} />
            <IconText>홈페이지</IconText>
          </IconContainer>
        </Link>
        <Link to={"https://www.kyonggi.ac.kr/www/selectBbsNttList.do?key=7520&bbsNo=1073"}>
          <IconContainer>
            <CampaignIcon sx={{ width: 48, height: 48 }} />
            <IconText>공지사항</IconText>
          </IconContainer>
        </Link>
        <Link to={"https://www.kyonggi.ac.kr/www/selectTnSchafsSchdulListUS.do?key=5695&sc1=10"}>
          <IconContainer>
            <SchoolIcon sx={{ width: 48, height: 48 }} />
            <IconText>학사공지</IconText>
          </IconContainer>
        </Link>
        <Link to={"https://www.kyonggi.ac.kr/www/selectTnRstrntMenuListU.do?key=7138&sc1=30&"}>
          <IconContainer>
            <LocalDiningIcon sx={{ width: 48, height: 48 }} />
            <IconText>식당메뉴</IconText>
          </IconContainer>
        </Link>
        <Link to={"https://www.kyonggi.ac.kr/www/contents.do?key=5749"}>
          <IconContainer>
            <DirectionsBusIcon sx={{ width: 48, height: 48 }} />
            <IconText>셔틀버스</IconText>
          </IconContainer>
        </Link>
      </SidebarContainer>
    );
  }
);


const SidebarContainer = styled.div<{ isSidebarVisible: boolean; isSidebarOpen: boolean }>`
  width: 250px;
  background: #333;
  display: flex;
  flex-direction: column;
  padding: 20px;
  color: #fff;
  transform: translateX(${(props) => (props.isSidebarVisible ? "0" : "-250px")});
  transition: transform 0.3s ease-in-out;
  z-index: 1;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  opacity: ${(props) => (props.isSidebarVisible ? 1 : 0)};
  visibility: ${(props) => (props.isSidebarVisible ? "visible" : "hidden")};
  overflow: hidden;
`;

const SidebarItem = styled.div`
  margin-bottom: 20px;
  cursor: pointer;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const IconText = styled.p`
  color: #fff;
  text-align: center;
  font-family: "Inter", sans-serif;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: -2px;
  margin: 0;
`;

const SchoolList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 100px; 
  overflow-y: auto; 
  padding-right: 10px; 

  max-height: ${(props) => (props.className === 'open' ? '100px' : '0')};

  transition: max-height 0.3s ease-in-out;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888; 
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555; 
  }
`;

const SchoolItem = styled.div`
  cursor: pointer;
`;

export default Sidebar;
