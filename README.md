# Folioga-tech
Plateforme internationale (FR/EN) de mise en relation clients/techniciens, réparation, reconditionnement et boutique.

## Stack
Next.js 15 + TypeScript + Tailwind + Supabase + Stripe + next-intl.

## Installation
```bash
npm install
cp .env.example .env.local
npm run dev
```

## Variables
Configure Supabase et Stripe dans `.env.local`.

## Base de données
Exécute `supabase/schema.sql` dans l'éditeur SQL Supabase.

## Paiements
- Boutique: Stripe Checkout
- Prestations marketplace: prévoir Stripe Connect + vérification/KYC des techniciens.
Ne jamais mettre les clés secrètes Stripe côté navigateur.

## Important
Avant production: CGU, confidentialité/RGPD, cookies, taxes/VAT, vérification des vendeurs, politique de remboursement et sécurité doivent être validées par des professionnels.
