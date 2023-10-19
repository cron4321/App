import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Header, SignupPage } from '../styles/Loginstyled';
import LoginForm from '../components/Login/LoginForm';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleLogin = () => {
    if (email && password) {
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const user = storedUsers.find((u: { email: string; password: string; }) => u.email === email && u.password === password);

      if (user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true');

        navigate('/');
      } else {
        alert('이메일 또는 비밀번호가 잘못되었습니다.');
      }
    } else {
      alert('이메일과 비밀번호를 입력해주세요.');
    }
  };

  return (
    <Container>
      <Header>우리 학교 알리미<br />로그인</Header>
      <LoginForm
        email={email}
        password={password}
        setEmail={(value) => setEmail(value)} 
        setPassword={(value) => setPassword(value)}
        handleLogin={handleLogin}
      />
      <SignupPage>아직 계정이 없으신가요? <Link to="/Signup">회원가입</Link></SignupPage>
    </Container>
  );
}

export default LoginPage;
