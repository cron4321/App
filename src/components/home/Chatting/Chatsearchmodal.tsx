import React from 'react';
import styled from 'styled-components';

type User = {
  id: string;
  email: string;
  username: string;
};

type SearchResultsModalProps = {
    results: User[];
    onResultClick: (email: any) => void;
    currentUserEmail: string; 
  };

  const SearchResultsModal: React.FC<SearchResultsModalProps> = ({ results, onResultClick, currentUserEmail }) => (
    <ModalContainer>
      <ModalContent>
        <h2>Search Results</h2>
        <ResultsList>
          {results.map((user) => (
            <ResultItem key={user.id} onClick={() => onResultClick(user.email)}>
              {user.email}
              {user.email === currentUserEmail ? <span> (You)</span> : null}
            </ResultItem>
          ))}
        </ResultsList>
      </ModalContent>
    </ModalContainer>
  );
  

const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  background: #fff;
  border: 1px solid #ccc;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 101;
  border-radius: 10px;
`;

const ModalContent = styled.div`
  padding: 20px;
`;

const ResultsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ResultItem = styled.li`
  padding: 10px;
  cursor: pointer;
  &:hover {
    background: #f4f4f4;
  }
`;

export default SearchResultsModal;
