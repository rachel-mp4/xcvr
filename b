#!/bin/bash
pnpm run build
rsync -av --delete --compress --partial ./build/ /var/www/xcvr-frontend/build/
chown -R www-data:www-data /var/www/xcvr-frontend/build/
systemctl reload nginx
