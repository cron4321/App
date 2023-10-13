import styled from "styled-components";

function MemoHeader() {
  return <Header />;
}

export default MemoHeader;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px 20px;
  background-color: #0074e4;
  color: #fff;
`;
