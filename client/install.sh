#!/bin/bash
echo "Installing nginx"
sudo apt install nginx

echo "Adding static files to /var/www/html/loqui_chat"
sudo mkdir /var/www/html/loqui_chat
sudo cp -r dist/* /var/www/html/loqui_chat
sudo mv /var/www/html/loqui_chat/assets/* /var/www/html/loqui_chat
sed -i 's/assets\/index-\(.*\.js\)/index-\1/g; s/assets\/index-\(.*\.css\)/index-\1/g' /var/www/html/index.html

echo "Changing nginx configuration"
sudo cp server_conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/server_conf /etc/nginx/sites-enabled/server_conf
