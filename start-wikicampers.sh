#!/bin/bash

# Installer les dépendances du backend
cd backend
composer install

# Installer les dépendances du frontend
cd ../frontend
npm install

# Initialiser la base de données à partir des entités
cd ../backend
php bin/console doctrine:schema:create

# Lancer le back-end
symfony server:start &

# Lancer le front-end
npm run dev
