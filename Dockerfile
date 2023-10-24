FROM node:14

# 앱의 소스 코드를 컨테이너 내부의 /app 디렉토리로 복사합니다.
WORKDIR /app
COPY . /app

# 앱의 종속성을 설치합니다.
RUN npm install

# 앱을 빌드합니다.
RUN npm run build

# 앱을 실행합니다.
CMD [ "npm", "start" ]