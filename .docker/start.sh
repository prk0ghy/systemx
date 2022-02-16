#!/bin/bash

echo "waiting for database"

mysqladmin ping -ucraft -hmariadb -pcraft --wait

echo "running DB config"

./craft setup/db-creds --interactive=0 \
    --server=mariadb \
    --database=craft \
    --user=craft \
    --password=craft \
    --port=3306 \
    --driver=mysql \
    --table-prefix=""

echo "installing craft"

./craft install --interactive=0 \
    --email=foo@bar.com \
    --username=admin \
    --password=password \
    --site-name=systemx.test \
    --site-url=http://systemx.test

echo "installing plugins"
./craft install/plugin redactor

echo "applying project config"

cp -r /var/www/html/_config/fieldGroups /var/www/html/config/project/
./craft project-config/apply
cp -r /var/www/html/_config/fields /var/www/html/config/project/
./craft project-config/apply

echo

echo "running webserver on :8080"

php -S 0.0.0.0:8080 -t ./web