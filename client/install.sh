echo "Installing nginx"
sudo apt install nginx

echo "Adding static files to /var/www/html/loqui_chat"
sudo mkdir /var/www/html/loqui_chat
sudo cp -r dist/* /var/www/html/loqui_chat

echo ""

