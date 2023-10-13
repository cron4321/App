import styled from "styled-components";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";

function Header() {
  return (
    <HeaderContainer>
      <MenuButton>
        <MenuIcon sx={{ width: 30, height: 30 }} />
      </MenuButton>
      <AlarmButton>
        <NotificationsIcon sx={{ width: 30, height: 30 }} />
      </AlarmButton>
    </HeaderContainer>
  );
}

export default Header;

const HeaderContainer = styled.header`
  width: 100%;
  height: 56px;
  background: #0074e4;
  display: flex;
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
