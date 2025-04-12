# Backend du Projet [NéphroSuivi]

Ce dépôt contient le code backend du projet [NéphroSuivi], développé avec le framework PHP Laravel. Il gère les fonctionnalités principales de l'application, notamment la gestion des utilisateurs, l'authentification, et les interactions avec la base de données.

## Prérequis

Avant de commencer, assurez-vous d'avoir installé sur votre machine :

- **PHP** (version 8.0 ou supérieure)
- **Composer** (gestionnaire de dépendances PHP)
- **Node.js** et **npm** (pour la gestion des assets frontend)
- **Base de données** : MySQL ou PostgreSQL
- **Redis** (optionnel, pour la gestion des queues et du cache)

## Installation

### Cloner le dépôt

```bash
git clone https://github.com/mcspirou6/hackaton_mrc.git
cd hackaton_mrc
```

### Installer les dépendances PHP

```bash
composer install
```

### Installer les dépendances frontend

```bash
npm install
```

### Configurer l'environnement

Copiez le fichier `.env.example` en `.env` et ajustez les paramètres selon votre environnement :

```bash
cp .env.example .env
```

### Générer la clé d'application

```bash
php artisan key:generate
```

### Configurer la base de données

Assurez-vous que les paramètres de connexion à la base de données dans le fichier `.env` sont corrects. Ensuite, exécutez les migrations pour créer les tables nécessaires :

```bash
php artisan migrate
```

```bash
php artisan db:seed
```

### Lier le stockage public

```bash
php artisan storage:link
```



## Configuration

### Envoi d'e-mails

Configurez les paramètres d'envoi d'e-mails dans le fichier `.env` en fonction de votre fournisseur de services e-mail (par exemple, SMTP, Mailgun, etc.).


### Serveur de développement

Pour démarrer le serveur de développement intégré de Laravel :

```bash
php artisan serve
```

Le serveur sera accessible à l'adresse `http://localhost:8000`.



## Contributions

Les contributions sont les bienvenues ! Pour proposer des améliorations ou signaler des problèmes, veuillez ouvrir une issue ou soumettre une pull request.

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails. 
