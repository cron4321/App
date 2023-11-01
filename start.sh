#!/bin/sh

npm client &
node src/server/server.js &
node src/server/crawlserver.js
