#!/bin/sh
echo "1. API"
cd server/
npm build
sudo node dist/app.js &
echo "2. WS"
cd ../ws
npm build
sudo node dist/ws.js &
echo "3. Nginx"
sudo service nginx start
