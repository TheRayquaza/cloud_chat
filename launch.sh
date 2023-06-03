#!/bin/sh
echo "1. API"
cd server/
npm build
npm start &
echo "2. WS"
cd ../ws
npm build
npm start &
echo "3. Nginx"
sudo service nginx start
