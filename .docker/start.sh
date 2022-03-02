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
./craft plugin/install redactor
./craft plugin/install super-table
./craft plugin/install tablemaker
./craft plugin/install aws-s3
./craft plugin/install matrixmate
./craft plugin/install smith
./craft plugin/install oembed

echo "applying project config"

cp -r /var/www/html/_config/* /var/www/html/config/project/

./craft project-config/apply

echo "upgrading to pro trial"

# for some reason the 'undefined offset: 1' error isn't critical
# and rebuilding the config fixes it?

./craft project-config/rebuild

yq -i '.system.edition = "pro"' /var/www/html/config/project/project.yaml

./craft project-config/apply

echo "letting craft do some repair magic"

./craft utils/repair/project-config
./craft project-config/apply 

echo "running webserver on :8080"

php -S 0.0.0.0:8080 -t ./web