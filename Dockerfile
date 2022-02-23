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

RUN composer create-project craftcms/craft /var/www/html
RUN ./craft setup/security-key
RUN composer require craftcms/redactor \
    verbb/super-table \
    supercool/tablemaker \
    craftcms/aws-s3 \ 
    vaersaagod/matrixmate \
    verbb/smith \
    wrav/oembed

# copy files to be seeded to temporary location
USER root
ADD ./.docker/start.sh /var/www/html/
RUN chmod +x ./start.sh
ADD ./.docker/config/ /var/www/html/_config/
ADD ./.docker/routes.php /var/www/html/config/routes.php

USER www-data