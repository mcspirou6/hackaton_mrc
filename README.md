# NéphroSuivi — Suivi des Maladies Rénale Chroniques (MRC)

Plateforme web de gestion et de suivi des patients atteints de **Maladie Rénale Chronique (MRC/CKD)**, développée dans le cadre du **Hackathon AI4CKD (IFRI/UAC – Bénin)**. Destinée aux **néphrologues et professionnels de santé**.

---

## Démo en ligne

| Environnement | URL |
|---------------|-----|
| **Frontend (Next.js)** | https://papaya-gingersnap-16f8ec.netlify.app/ |
| **Backend API (Laravel)** | https://hackatonmrc-production.up.railway.app |

**Compte de démo (admin)**  
- Email : `admin@mrc-app.com`  
- Mot de passe : `12345678`

---

## Objectifs du projet

- **Centraliser les dossiers MRC** : données administratives, cliniques et historiques.
- **Assister les praticiens** dans le suivi longitudinal (consultations, examens, traitements).
- **Automatiser** certaines tâches : rapports, rappels RDV, notifications.
- **Proposer une UX claire** pour des médecins non techniques (desktop / tablette).

---

## Fonctionnalités principales

### Gestion des utilisateurs et authentification

- Connexion sécurisée des médecins (email + mot de passe).
- Authentification **Laravel Sanctum** (tokens / cookies).
- Gestion du profil et changement de mot de passe.

### Patients et dossiers médicaux

- **Création / modification / suppression** de patients.
- Données enregistrées : identité, contacts, personne d’urgence, données cliniques (stade MRC, tension, créatinine, GFR, albuminurie…), antécédents.
- **Dossiers médicaux structurés** : dossier longitudinal par patient, historique des consultations et examens, dernier dossier accessible en un clic.

### Consultations et rendez-vous

- **Rendez-vous** : planification (médecin, patient, date/heure, statut), filtres (médecin, statut, date).
- **Consultations** : motifs, examens, compte-rendu, historique par patient.

### Suivi des stades MRC et aide au diagnostic

- Table de référence des **stades de maladie rénale** (seedée en base).
- Endpoints pour récupérer les stades et **déterminer le stade à partir du GFR**.
- Intégration dans l’interface pour afficher l’état rénal du patient.

### Rapports et documents

- **Génération de rapports PDF** (bilan de consultation / dossier).
- Liste des rapports par patient et téléchargement.

### Tableau de bord et statistiques

- **Dashboard médecin** : nombre de patients suivis, rendez-vous planifiés, patients critiques / à risque.
- Graphiques et indicateurs (Recharts).

### Alertes et notifications

- Module **Alertes** : alertes critiques (valeurs biologiques, symptômes), importantes et informationnelles.
- Statuts : Nouveau, En cours, Résolu, Ignoré.
- Possibilité d’assigner une alerte à un médecin.

---

## Architecture

### Vue d’ensemble

- **Monorepo** : `backend/` (API Laravel) et `frontend/` (Next.js).
- **Frontend** : Next.js 15 (App Router), React 19, Tailwind CSS v4, Recharts, React-Toastify, Radix UI, Lucide Icons.
- **Backend** : Laravel 12, PHP 8.2, MySQL (Railway).
- **Déploiement** : Netlify (frontend), Railway (backend + MySQL).
- **Auth** : Sanctum + CORS pour le domaine Netlify.

### Structure du dépôt

```
hackaton_mrc/
├── backend/          # API Laravel (PHP 8.2, MySQL)
│   ├── app/Http/Controllers/API/
│   ├── database/migrations
│   ├── database/seeders
│   ├── routes/api.php
│   └── Procfile      # migrate + seed + serve (Railway)
├── frontend/         # Next.js 15 (App Router)
│   ├── src/app/      # pages (dashboard, patients, appointments, reports, alerts, admin…)
│   ├── src/api/      # appels API (api.js)
│   └── netlify.toml  # build + env (Netlify)
└── README.md
```

### Flux d’authentification

1. Le frontend appelle `sanctum/csrf-cookie` sur le backend.
2. Ensuite `POST /api/login` (email, mot de passe).
3. Le backend renvoie un token / session (Sanctum).
4. Les requêtes protégées envoient ce token (cookie ou header).

---

## Stack technique

| Couche | Technologies |
|--------|----------------|
| **Frontend** | Next.js 15.2.8, React 19, Tailwind CSS v4, Recharts, React-Toastify, Radix UI, Lucide Icons |
| **Backend** | PHP 8.2, Laravel 12, Sanctum |
| **Base de données** | MySQL (Railway) |
| **Déploiement** | Netlify (frontend), Railway (backend + MySQL) |

---

## Installation locale

### Prérequis

- **Node.js** ≥ 20, **npm** ≥ 10
- **PHP** ≥ 8.2, **Composer**
- **MySQL** (ou MariaDB) en local

### 1. Cloner le dépôt

```bash
git clone https://github.com/mcspirou6/hackaton_mrc.git
cd hackaton_mrc
```

### 2. Backend (Laravel)

```bash
cd backend

composer install
cp .env.example .env
# Configurer DB_* dans .env (DB_DATABASE, DB_USERNAME, DB_PASSWORD)

php artisan key:generate
php artisan migrate --force
php artisan db:seed --force

php artisan serve
# → http://127.0.0.1:8000
```

### 3. Frontend (Next.js)

```bash
cd ../frontend

npm install
# Optionnel : .env.local avec NEXT_PUBLIC_API_URL=http://localhost:8000/api

npm run dev
# → http://localhost:3000
```

---

## Contexte hackathon

- **Événement** : Hackathon AI4CKD (IFRI/UAC – Bénin), étudiants L3 Génie Logiciel.
- **Période** : 27/03 → 04/04/2025, présentation le 05/04/2025.
- **Livrables** : application web en ligne, code sur GitHub, démo, rapport technique, présentation jury.
- **Critères** : originalité, qualité technique, UX/UI, sécurité des données, clarté de la présentation.

---

## Licence

Projet réalisé dans un cadre pédagogique (hackathon). Usage des données médicales à des fins de démonstration uniquement.
