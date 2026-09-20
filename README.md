# Dashboard Artiste — Drawiful

Interface React/Next.js connectée au backend NestJS. Déployable sur Vercel.

## Pages incluses
- `/login` — connexion
- `/overview` — vue d'ensemble (stats, CA, essai, œuvres récentes)
- `/artworks` — gestion des œuvres (upload image + fichier 3D/RA avec aperçu interactif, génération de certificat)
- `/gallery` — profil de galerie
- `/orders` — historique des ventes, chiffre d'affaires
- `/subscription` — statut abonnement + Customer Portal Stripe
- `/settings` — connexion Stripe Connect, changement email/mot de passe
- `/certificate/[serialNumber]` — page publique de vérification d'authenticité (QR code)

## Nouveautés de cette version
- **Aperçu 3D interactif** : après upload d'un fichier `.glb`, le modèle s'affiche directement dans le formulaire (rotation/zoom via le web component `<model-viewer>` de Google, chargé depuis unpkg).
- **Certificats générés automatiquement** : bouton "Générer un certificat" sur chaque œuvre publiée. Le backend crée un numéro de série, une empreinte unique, et une page de vérification publique — plus besoin du générateur Bubble.

## Configuration nécessaire

### 1. Cloudinary
1. [cloudinary.com](https://cloudinary.com) → compte gratuit
2. Récupère ton **Cloud name**
3. Settings → Upload → Add upload preset → mode **Unsigned**

### 2. Variables d'environnement
```bash
cp .env.local.example .env.local
```
Remplis les 3 valeurs.

### 3. Installation locale
```bash
npm install
npm run dev
```

## Déploiement sur Vercel
1. Pousse ce projet sur GitHub
2. [vercel.com](https://vercel.com) → Add New → Project → sélectionne le repo
3. Ajoute les 3 variables d'environnement
4. Deploy

## Backend : variables à vérifier sur Railway
- `ALLOWED_ORIGINS` doit inclure l'URL de ce dashboard
- `FRONTEND_URL` doit pointer vers ce dashboard (redirections Stripe)
- `PUBLIC_CERTIFICATE_BASE_URL` doit pointer vers ce dashboard (liens de certificats/QR codes)
