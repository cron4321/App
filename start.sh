#!/bin/sh

npm run client &
node src/server/server.js &
node src/server/crawlserver.js
