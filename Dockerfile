FROM node:18

WORKDIR /app
COPY . /app

EXPOSE 3000

RUN npm install

RUN npm run build

RUN npm run start

CMD ["node","app/src/server/server.js"]
