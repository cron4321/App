FROM node:18

WORKDIR /app
COPY . /app

EXPOSE 3000

RUN npm install

RUN npm run build

CMD ["node","src/server/server.js"]
