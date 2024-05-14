#!/bin/bash

# Installer les dépendances du backend
cd backend
composer install

# Installer les dépendances du frontend
cd ../frontend
npm install

# Lancer le back-end
symfony server:start &

# Lancer le front-end
npm run dev
