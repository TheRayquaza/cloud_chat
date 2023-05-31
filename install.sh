echo "-> Updating packages"
sudo apt -y update
sudo apt -y full-upgrade
echo "-> Installing mariadb"
sudo apt -y install mariadb-server
echo "-> Installing last version of node"
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
nvm install v19.9.0
nvm use v19.9.0
echo -> "Installing last version of npm"
sudo apt install npm
echo "-> Setting up Websocket server"
cd ws
chmod +x install.sh
./install.sh
echo "Setting up API server"
cd ../server
chmod +x install.sh
./install.sh
echo "Setting up client server"
cd ../client
chmod +x install.sh
./install.sh

echo "Finished !"
