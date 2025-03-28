# Documentation Frontend - Application de Détection de Maladie Rénale Chronique

## Introduction
Cette application utilise Next.js pour le frontend et communique avec une API Laravel pour la gestion des données. Ce document explique comment configurer et exécuter la partie frontend de l'application.

## Prérequis
- Node.js (version 18.0.0 ou supérieure)
- npm ou yarn

## Configuration initiale

1. **Installation des dépendances**
   ```bash
   npm install
   # ou
   yarn install
   ```

2. **Configuration de l'environnement**
   - Créez un fichier `.env.local` à la racine du projet
   - Ajoutez la variable d'environnement pour l'API backend:
     ```
     NEXT_PUBLIC_API_URL=http://localhost:8000/api
     ```

## Structure du projet
- `src/app/` - Contient les pages de l'application
- `src/components/` - Composants réutilisables
- `src/lib/` - Utilitaires et fonctions d'aide
- `src/api/` - Services pour communiquer avec l'API backend

## Communication avec le Backend
Pour communiquer avec l'API Laravel, utilisez le service API dans `src/api/api.js`. Exemple:

```javascript
// src/api/api.js
export async function fetchPatientData(patientId) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/patients/${patientId}`);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des données');
  }
  return response.json();
}
```

## Démarrage du serveur de développement
```bash
npm run dev
# ou
yarn dev
```

Le serveur sera accessible à l'adresse [http://localhost:3000](http://localhost:3000).

## Construction pour la production
```bash
npm run build
npm run start
# ou
yarn build
yarn start
```

## Tests
```bash
npm run test
# ou
yarn test
```
