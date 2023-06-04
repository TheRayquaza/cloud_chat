#!/bin/bash
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
