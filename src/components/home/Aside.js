import styled from "styled-components";
import HomeIcon from "@mui/icons-material/Home";
import CampaignIcon from "@mui/icons-material/Campaign";
import SchoolIcon from "@mui/icons-material/School";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";

function Aside() {
  return (
    <AsideContainer>
      <AsideForm>
        <IconTextContainer>
          <HomeIcon sx={{ width: 48, height: 48 }} />
          <IconText>홈페이지</IconText>
        </IconTextContainer>
        <IconTextContainer>
          <CampaignIcon sx={{ width: 48, height: 48 }} />
          <IconText>공지사항</IconText>
        </IconTextContainer>
        <IconTextContainer>
          <SchoolIcon sx={{ width: 48, height: 48 }} />
          <IconText>학사공지</IconText>
        </IconTextContainer>
        <IconTextContainer>
          <LocalDiningIcon sx={{ width: 48, height: 48 }} />
          <IconText>식당메뉴</IconText>
        </IconTextContainer>
        <IconTextContainer>
          <DirectionsBusIcon sx={{ width: 48, height: 48 }} />
          <IconText>셔틀버스</IconText>
        </IconTextContainer>
      </AsideForm>
    </AsideContainer>
  );
}

export default Aside;

const AsideContainer = styled.aside`
  display: flex;
  width: 100%;
  height: 92px;
  justify-content: center;
  align-items: center;
  background: #f9f9f9;
`;

const AsideForm = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 12px 26px;
  gap: 23px;
`;

const IconTextContainer = styled.div`
  display: flex;
  min-width: 54px;
  align-items: center;
  flex-direction: column;
`;

const IconText = styled.p`
  color: #000;
  text-align: center;
  font-family: "Inter", sans-serif;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: -0.5px;
  margin: 0;
`;
