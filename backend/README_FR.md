# Documentation Backend - Application de Détection de Maladie Rénale Chronique

## Introduction
Cette application utilise Laravel et MySQL pour le backend et fournit une API RESTful pour le frontend Next.js. Ce document explique comment configurer et exécuter la partie backend de l'application.

## Prérequis
- PHP 8.1 ou supérieur
- Composer
- MySQL
- Extension PHP PDO MySQL

## Configuration initiale

1. **Installation des dépendances**
   ```bash
   composer install
   ```

2. **Configuration de l'environnement**
   - Copiez le fichier `.env.example` vers `.env`
   - Modifiez les paramètres de connexion à la base de données dans le fichier `.env`:
     ```
     DB_CONNECTION=mysql
     DB_HOST=127.0.0.1
     DB_PORT=3306
     DB_DATABASE=kidney_disease
     DB_USERNAME=root
     DB_PASSWORD=
     ```
   - Générez une clé d'application:
     ```bash
     php artisan key:generate
     ```

3. **Configuration de la base de données**
   - Créez une base de données MySQL nommée `kidney_disease`
   - Exécutez les migrations pour créer les tables:
     ```bash
     php artisan migrate
     ```
   - (Optionnel) Remplissez la base de données avec des données de test:
     ```bash
     php artisan db:seed
     ```

## Structure de l'API

L'API suit une architecture RESTful avec les points de terminaison suivants:

- `GET /api/patients` - Liste tous les patients
- `GET /api/patients/{id}` - Récupère les détails d'un patient spécifique
- `POST /api/patients` - Crée un nouveau patient
- `PUT /api/patients/{id}` - Met à jour les données d'un patient
- `DELETE /api/patients/{id}` - Supprime un patient
- `POST /api/analyze` - Analyse les données pour la détection de maladie rénale

## Configuration CORS

Pour permettre les requêtes depuis le frontend Next.js, le CORS est déjà configuré dans le fichier `config/cors.php`. Assurez-vous que l'URL du frontend est incluse dans les origines autorisées.

## Démarrage du serveur de développement
```bash
php artisan serve
```

Le serveur sera accessible à l'adresse [http://localhost:8000](http://localhost:8000).

## Tests
```bash
php artisan test
```

## Modèle de prédiction

Le modèle de prédiction pour la détection de la maladie rénale chronique sera implémenté dans le contrôleur `AnalyzeController`. Vous pouvez utiliser des bibliothèques PHP pour l'apprentissage automatique ou intégrer un modèle externe via une API.
