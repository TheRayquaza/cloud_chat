#!/bin/bash
echo "---------------------"
echo "1. Updating packages"
echo "---------------------"
sudo apt -y update
sudo apt -y full-upgrade

echo "----------------------"
echo "2. Installing mariadb"
echo "----------------------"
sudo apt -y install mariadb-server

echo "----------------------------------"
echo "3. Installing last version of node"
echo "----------------------------------"
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
nvm install lts
nvm use lts

echo "---------------------------------"
echo "4. Installing last version of npm"
echo "---------------------------------"
sudo apt install npm

echo "---------------------------"
echo "5. Setting up client server"
echo "---------------------------"
cd client
echo "Installing apache2"
sudo apt install apache2
sudo a2enmod proxy
sudo a2enmod proxy_wstunnel
sudo a2enmod proxy_http
sudo a2enmod rewrite
sudo a2enmod ssl

echo "Adding static files to /var/www/html/loqui_chat"
sudo mkdir /var/www/html/loqui-chat.xyz
sudo cp -r dist/* /var/www/html/loqui-chat.xyz/

echo "Changing apache configuration"
sudo cp loqui-chat.xyz.conf /etc/apache2/sites-available/loqui-chat.xyz.conf

echo "-------------------------------"
echo "6. Setting up Websocket server"
echo "-------------------------------"
cd ../ws
npm install

echo "-------------------------"
echo "7. Setting up API server"
echo "-------------------------"
cd ../server
npm install

echo "Finished !"
