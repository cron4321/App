FROM node:18

WORKDIR /App
COPY . /App

EXPOSE 3000

RUN npm install

RUN npm run build

CMD ["sh", "-c", "node src/server/server.js & npm start"]
