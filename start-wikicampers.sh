#!/bin/bash

# Lancer le back-end
cd backend
symfony server:start &

# Lancer le front-end
cd ../frontend
npm run dev
