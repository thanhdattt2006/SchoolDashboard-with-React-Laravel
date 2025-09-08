FROM php:8.2-cli

# Cài extension Laravel cần
RUN docker-php-ext-install pdo pdo_mysql

# Cài Composer vào container PHP
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
