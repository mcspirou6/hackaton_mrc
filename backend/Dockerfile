FROM php:8.2-apache

# Installer les dépendances système
RUN apt-get update && apt-get install -y \
    libzip-dev unzip git curl \
    && docker-php-ext-install zip pdo pdo_mysql

# Installer Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copier ton app Laravel dans le conteneur
COPY . /var/www/html/

# Définir le répertoire de travail
WORKDIR /var/www/html/backend

# Installer les dépendances Laravel
RUN composer install --no-dev --optimize-autoloader \
    && php artisan config:cache \
    && php artisan route:cache

# Exposer le port
EXPOSE 80

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=80"]
