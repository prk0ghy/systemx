FROM composer:1.9.0
FROM php:7.3-apache-stretch

# Update OS and install deps
RUN apt-get -qq update && apt-get -qq upgrade -y
RUN apt-get -qq install -y \ 
    zlib1g-dev libicu-dev g++ \
    libmagickwand-dev libzip-dev \
    sudo mysql-client unzip iputils-ping\
    && docker-php-ext-configure intl \
    && docker-php-ext-install intl \
    && docker-php-ext-install zip \
    && pecl install imagick \
    && docker-php-ext-enable imagick \
    && docker-php-ext-install pdo pdo_mysql

# copy compose to instance
COPY --from=composer /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

RUN chmod g+s /var/www/html/
RUN chown -R www-data:www-data /var/www/html/

USER www-data

RUN composer create-project craftcms/craft /var/www/html
RUN ./craft setup/security-key
RUN composer require craftcms/redactor
RUN composer require verbb/super-table
RUN composer require supercool/tablemaker
RUN composer require craftcms/aws-s3
RUN composer require vaersaagod/matrixmate
RUN composer require verbb/smith
RUN composer require wrav/oembed


USER root
ADD ./.docker/start.sh /var/www/html/
RUN chmod +x ./start.sh
ADD ./.docker/config/ /var/www/html/_config/
ADD ./.docker/routes.php /var/www/html/config/routes.php

USER www-data