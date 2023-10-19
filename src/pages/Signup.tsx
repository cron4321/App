import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import UserForm from '../components/Signup/User';
import VerificationCodeForm from '../components/Signup/Verification';
import { Container, Header, SuccessMessage, Button, LoginBack } from '../styles/Signupstyled';
import axios from 'axios';

type User = {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
};

function Signup() {
  const [user, setUser] = useState<User>({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
  });

  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isPasswordsMatching, setIsPasswordsMatching] = useState(true);
  const [isSignUpSuccessful, setIsSignUpSuccessful] = useState(false);

  const [verificationCode, setVerificationCode] = useState('');
  const [isVerificationCodeValid, setIsVerificationCodeValid] = useState(false);
  const [verificationRequested, setVerificationRequested] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });

    if (name === 'email') {
      setIsEmailValid(validateEmail(value));
    }
    if (name === 'password') {
      setIsPasswordValid(validatePassword(value));
      if (user.confirmPassword) {
        setIsPasswordsMatching(user.confirmPassword === value);
      }
    }
    if (name === 'confirmPassword') {
      if (user.password) {
        setIsPasswordsMatching(user.password === value);
      }
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  const sendVerificationCode = async () => {
    try {
      const response = await axios.post('http://localhost:3001/send-verification-email', { email: user.email });
      if (response.status === 200) {
        setVerificationRequested(true);
      }
    } catch (error) {
      console.error('이메일 전송 오류:', error);
    }
  };

  const handleSignUp = async () => {
    if (isEmailValid && isPasswordValid && isPasswordsMatching && user.email && user.password) {
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const isEmailDuplicate = storedUsers.some((u: { email: string; }) => u.email === user.email);

      if (isEmailDuplicate) {
        alert('이미 같은 이메일이 존재합니다.');
      } else {
        if (isSignUpSuccessful) {
          alert('회원가입이 완료되었습니다.');
          saveUserDataLocally(user.email, user.password, user.username);
        } else if (isVerificationCodeValid && verificationCode) {
          try {
            const response = await axios.post('http://localhost:3001/verify-verification-code', {
              email: user.email,
              code: verificationCode,
            });

            if (response.status === 200) {
              saveUserDataLocally(user.email, user.password, user.username);
              setIsSignUpSuccessful(true);
              alert('회원가입이 완료되었습니다.');
            } else {
              console.error('인증 코드가 틀렸습니다.');
              alert('인증 코드가 틀렸습니다.');
            }
          } catch (error) {
            console.error('인증 코드가 틀렸습니다.', error);
            alert('인증 코드가 틀렸습니다.');
          }
        } else {
          alert('양식을 올바르게 작성해주세요.');
        }
      }
    } else {
      alert('양식을 올바르게 작성해주세요.');
    }
  };


  const handleVerificationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value;
    setVerificationCode(code);
    setIsVerificationCodeValid(true); 
  };
  
  const saveUserDataLocally = (email: string, password: string, username: string) => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    storedUsers.push({ email, password, username });
    localStorage.setItem('users', JSON.stringify(storedUsers));
  };

  return (
    <Container>
      <Header>
        우리 학교 알리미
        <br />회원가입
      </Header>
      {isSignUpSuccessful ? (
        <SuccessMessage>회원가입 완료<br/><Link to="/login">로그인 창으로</Link></SuccessMessage>
      ) : (
        <div>
          <UserForm
            user={user}
            handleInputChange={handleInputChange}
            isEmailValid={isEmailValid}
            isPasswordValid={isPasswordValid}
            isPasswordsMatching={isPasswordsMatching}
          />
          {verificationRequested ? (
            <VerificationCodeForm
              verificationRequested={verificationRequested}
              verificationCode={verificationCode}
              handleVerificationCodeChange={handleVerificationCodeChange}
              isVerificationCodeValid={isVerificationCodeValid}
            />
          ) : (
            <VerificationCodeForm
              verificationRequested={verificationRequested}
              verificationCode={verificationCode}
              handleVerificationCodeChange={handleVerificationCodeChange}
              isVerificationCodeValid={isVerificationCodeValid}
            />
          )}
           <Button onClick={sendVerificationCode}>
    인증번호 요청
    </Button>
          <Button onClick={handleSignUp}>
  회원가입
</Button>


          <LoginBack>
            <br />
            이미 계정이 있으신가요? <Link to="/Login">로그인</Link>
          </LoginBack>
        </div>
      )}
    </Container>
  );
}

export default Signup;
