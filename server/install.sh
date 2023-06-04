#!/bin/bash
sudo mv default.env .env

sudo mysql -p -e "CREATE DATABASE loqui_chat;"
sudo mysql -p -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'default_password';"

npm i
