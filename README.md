# Gestion des disponibilités d’un véhicule en location

## Introduction

Ce projet vise à développer un système de gestion des disponibilités et des tarifs d'un véhicule à la location, en utilisant Symfony pour le backend et React pour le frontend.

## Description

L'application comprend les fonctionnalités suivantes :

- **Entités :**
  - **Véhicule :** Cette entité contient les informations d'un véhicule, telles que son identifiant, sa marque et son modèle.
  - **Disponibilité :** Une disponibilité est associée à un véhicule et comprend la date de début, la date de fin, le prix par jour et le statut (disponible ou non disponible).

- **Fonctionnalités :**
  - Création, modification et suppression de véhicules.
  - Gestion des disponibilités pour chaque véhicule.
  - Formulaire de recherche permettant de trouver les véhicules disponibles pour une période donnée, avec la possibilité de filtrer par prix maximum de la location.

## Déroulement et rendu

- Le backend est développé avec Symfony version 7.0.7.
- Le frontend utilise React et les outils associés.
- La base de données est configurée avec MySQL, nécessitant d'être créée via le terminal avec la commande `CREATE DATABASE wikicampers`.
- Le projet est ensuite facilement testable par l'équipe grâce au script d'initialisation.

## Instructions d'installation

Pour initialiser le projet, exécutez le script `start-wikicampers.sh` :

```bash
./start-wikicampers.sh
```
Ce script installe les dépendances du backend et du frontend, lance le serveur Symfony et démarre l'application frontend en mode développement.

Note : Assurez-vous de mettre à jour les fichiers .env.sample dans les dossiers backend et frontend avec les configurations appropriées avant de lancer le script.

