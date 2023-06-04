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
nvm install v19.9.0
nvm use v19.9.0

echo "---------------------------------"
echo "4. Installing last version of npm"
echo "---------------------------------"
sudo apt install npm

echo "---------------------------"
echo "5. Setting up client server"
echo "---------------------------"
cd client
chmod +x install.sh
./install.sh

echo "-------------------------------"
echo "6. Setting up Websocket server"
echo "-------------------------------"
cd ../ws
chmod +x install.sh
./install.sh

echo "7. Setting up API server"
cd ../server
chmod +x install.sh
./install.sh

cd ..
chmod +x launch.sh
echo "Finished !"
