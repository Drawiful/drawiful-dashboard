# Dashboard Artiste — Drawiful

Interface React/Next.js connectée au backend NestJS existant. Déployable sur Vercel.

## Pages incluses
- `/login` — connexion
- `/overview` — vue d'ensemble (stats, essai, œuvres récentes)
- `/artworks` — gestion des œuvres (création, édition, suppression, upload image + fichier 3D/RA)
- `/gallery` — profil de galerie (nom, URL, bio, avatar)
- `/subscription` — statut abonnement + bouton vers le Customer Portal Stripe

## Configuration nécessaire

### 1. Créer un compte Cloudinary
1. [cloudinary.com](https://cloudinary.com) → crée un compte gratuit
2. Récupère ton **Cloud name** (visible en haut du dashboard)
3. Va dans **Settings → Upload** → **Add upload preset**
   - Mode : **Unsigned** (permet l'upload direct depuis le navigateur sans passer par ton backend)
   - Note le nom du preset créé

### 2. Variables d'environnement
```bash
cp .env.local.example .env.local
```
Remplis les 3 valeurs (URL backend, cloud name, upload preset).

### 3. Installation locale
```bash
npm install
npm run dev
```

## Déploiement sur Vercel

1. Pousse ce projet sur un nouveau repo GitHub (même procédure que pour le backend)
2. Va sur [vercel.com](https://vercel.com) → connecte-toi avec GitHub
3. "Add New" → "Project" → sélectionne ce repo
4. Vercel détecte automatiquement Next.js
5. Dans "Environment Variables", ajoute les 3 mêmes variables que `.env.local`
6. Déploie
7. Une fois en ligne, configure ton sous-domaine `dashboard.drawiful.app` dans les Settings du projet Vercel → Domains

## Backend : deux ajustements nécessaires

### 1. Autoriser ce nouveau domaine (CORS)
Sur Railway, variable `ALLOWED_ORIGINS`, ajoute (séparé par une virgule) :
```
https://dashboard.drawiful.app
```

### 2. Rediriger vers le dashboard après paiement
Sur Railway, variable `FRONTEND_URL`, remplace par :
```
https://dashboard.drawiful.app
```
(C'est cette variable qui définit où Stripe redirige après un paiement réussi/annulé, et où le Customer Portal renvoie l'artiste.)

## Ce qui n'est pas encore inclus
- Gestion des certificats depuis le dashboard (le générateur reste externe pour l'instant, comme convenu)
- Historique des ventes / chiffre d'affaires (nécessite le module Stripe Connect qu'on a évoqué, pas encore construit)
- Changement de mot de passe / paramètres de compte
