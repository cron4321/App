#!/bin/sh

npm start &
node src/server/server.js &
node src/server/crawlserver.js
