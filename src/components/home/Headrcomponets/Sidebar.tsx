import React, { useEffect, forwardRef, useState, useRef } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import axios from "axios";

type SidebarProps = {
  isSidebarOpen: boolean;
  userNickname: string;
  userEmail: string;
  onLogout: () => void;
  selectedSchool: string;
  setSelectedSchool: (school: string) => void;
};

const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      isSidebarOpen,
      userNickname,
      userEmail,
      onLogout,
      selectedSchool,
      setSelectedSchool,
    }: SidebarProps,
    ref
  ) => {
    const [isSchoolModalOpen, setSchoolModalOpen] = useState(false);
    const [schools] = useState([
      "서울대학교",
      "연세대학교",
      "고려대학교",
      "oo대학교",
      "xx대학교",
      "aa대학교",
      "qq대학교",
    ]);
    const [isSidebarVisible, setIsSidebarVisible] = useState(isSidebarOpen);
    const sidebarRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      const userToken = localStorage.getItem("userToken");
      if (userToken) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
      }

      axios
        .get("http://localhost:3002/selected-school")
        .then((response) => {
          setSelectedSchool(response.data.selectedSchool);
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            console.error("401 Unauthorized 에러가 발생했습니다.");
          } else {
            console.error("학교 정보 불러오기 오류:", error);
          }
        });
    }, [setSelectedSchool]);

    const handleSchoolSelect = (school: string) => {
      axios
        .post("http://localhost:3002/select-school", { schoolName: school })
        .then(() => {
          console.log("학교 정보 업데이트 완료.");
          setSelectedSchool(school);
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            console.error("401 Unauthorized 에러가 발생했습니다.");
          } else {
            console.error("학교 정보 업데이트 오류:", error);
          }
        });
    };

    const handleOutsideClick = (e: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node)
      ) {
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
            <SidebarItem>
              {userNickname} ({userEmail})
            </SidebarItem>
            <SidebarItem onClick={onLogout}>로그아웃</SidebarItem>
          </>
        ) : (
          <SidebarItem
            onClick={() => {
              window.location.href = "/Login";
            }}
          >
            로그인
          </SidebarItem>
        )}
        <SidebarItem onClick={() => setSchoolModalOpen(!isSchoolModalOpen)}>
          학교 변경
        </SidebarItem>
        <SchoolList className={isSchoolModalOpen ? "open" : ""}>
          {schools.map((school) => (
            <SchoolItem
              key={school}
              onClick={() => handleSchoolSelect(school)}
              className={school === selectedSchool ? "selected" : ""}
            >
              {school}
            </SchoolItem>
          ))}
        </SchoolList>
        <Link to={"https://www.snu.ac.kr/"}>
          <IconContainer>
            <IconText>홈페이지</IconText>
          </IconContainer>
        </Link>
        <Link to={"https://www.snu.ac.kr/snunow/notice/genernal?sc=y"}>
          <IconContainer>
            <IconText>공지사항</IconText>
          </IconContainer>
        </Link>
        <Link to={"https://www.snu.ac.kr/academics/resources/calendar"}>
          <IconContainer>
            <IconText>학사공지</IconText>
          </IconContainer>
        </Link>
        <Link to={"https://snuco.snu.ac.kr/ko/foodmenu"}>
          <IconContainer>
            <IconText>식당메뉴</IconText>
          </IconContainer>
        </Link>
        <Link
          to={"https://www.snu.ac.kr/about/gwanak/shuttles/campus_shuttles"}
        >
          <IconContainer>
            <IconText>셔틀버스</IconText>
          </IconContainer>
        </Link>
      </SidebarContainer>
    );
  }
);

const SidebarContainer = styled.div<{
  isSidebarVisible: boolean;
  isSidebarOpen: boolean;
}>`
  width: 250px;
  background: #333;
  display: flex;
  flex-direction: column;
  padding: 20px;
  color: #fff;
  transform: translateX(
    ${(props) => (props.isSidebarVisible ? "0" : "-250px")}
  );
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
  font-style: normal;
  font-weight: 500;
  margin-top: 10px;
`;

const SchoolList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 100px;
  overflow-y: auto;
  padding-right: 10px;

  max-height: ${(props) => (props.className === "open" ? "100px" : "0")};

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
  &.selected {
    color: #ffcc00; // Change the color for the selected school
  }
`;

export default Sidebar;
