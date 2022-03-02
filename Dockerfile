FROM composer:1.9.0
# required for easy yaml file manipulation during the installation
FROM mikefarah/yq as yq
FROM php:7.3-apache-stretch

# Update OS and install deps
RUN apt-get -qq update && apt-get -qq upgrade -y
RUN apt-get -qq install -y \ 
    zlib1g-dev libicu-dev g++ \
    libmagickwand-dev libzip-dev \
    nano \
    sudo mysql-client unzip iputils-ping\
    && docker-php-ext-configure intl \
    && docker-php-ext-install intl \
    && docker-php-ext-install zip \
    && pecl install imagick \
    && docker-php-ext-enable imagick \
    && docker-php-ext-install pdo pdo_mysql

# copy required binaries from other stages to current stage
COPY --from=composer /usr/bin/composer /usr/bin/composer
COPY --from=yq /usr/bin/yq /usr/bin/yq

WORKDIR /var/www/html


# CraftCMS should run under 'www-data'
RUN chmod g+s /var/www/html/
RUN chown -R www-data:www-data /var/www/html/

USER www-data

RUN php -v && composer -V
RUN composer create-project craftcms/craft=1.1.1 /var/www/html
RUN rm composer.lock
RUN composer require "craftcms/cms:3.5.19.1"
RUN php craft setup/security-key
RUN composer require "craftcms/redactor:2.8.2" \
    "verbb/super-table:2.6.7" \
    "supercool/tablemaker:dev-master" \
    "craftcms/aws-s3:1.2.11" \
    "vaersaagod/matrixmate:^1.3" \
    "verbb/smith:1.1.9" \
    "wrav/oembed:1.3.4"

# copy files to be seeded to temporary location
USER root
ADD ./.docker/start.sh /var/www/html/
RUN chmod +x ./start.sh
ADD ./.docker/config/ /var/www/html/_config/
ADD ./.docker/routes.php /var/www/html/config/routes.php

USER www-data