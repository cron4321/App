FROM node:14

WORKDIR /app
COPY . /app

EXPOSE 3000

RUN npm install

RUN npm run build

CMD ["sh", "-c", "npm start & node src/server/server.js & node src/server/crawlserver.js"]
