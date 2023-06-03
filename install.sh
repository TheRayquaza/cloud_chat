#!/bin/sh
echo "1. Updating packages"
sudo apt -y update
sudo apt -y full-upgrade

echo "2. Installing mariadb"
sudo apt -y install mariadb-server

echo "3. Installing last version of node"
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
nvm install v19.9.0
nvm use v19.9.0

echo "4. Installing last version of npm"
sudo apt install npm

echo "5. Setting up client server"
cd client
chmod +x install.sh
./install.sh

echo "6. Setting up Websocket server"
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
