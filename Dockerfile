FROM node:14

WORKDIR /app
COPY . /app

EXPOSE 3000

RUN npm install

RUN npm run build

CMD [ "npm", "start" ]
CMD [ "node", "src/server/server.js" ]
CMD [ "node", "src/server/crawlserver.js" ]
