#!/bin/bash
npm run build
rsync -av --delete ./build/ /var/www/xcvr-frontend/build/
chown -R www-data:www-data /var/www/xcvr-frontend/build/
systemctl restart nginx
