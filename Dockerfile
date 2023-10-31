FROM node:10

WORKDIR /app
COPY . /app

EXPOSE 3000

RUN npm install

RUN npm run build

COPY start.sh /start.sh

RUN chmod +x /start.sh

CMD ["/start.sh"]
