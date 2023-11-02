FROM node:14

WORKDIR /app

COPY . /app

RUN npm install

CMD npm start && node src/server/server.js && node src/server/crawlserver.js
