#!/bin/bash
cp default.env .env
sudo cp /etc/letsencrypt/live/loqui-chat.xyz/cert.pem .
sudo cp /etc/letsencrypt/live/loqui-chat.xyz/privkey.pem key.pem
npm i
