# Portfolio PoupiCode

Portfolio personnel avec Next.js 14, TypeScript, Tailwind CSS et GSAP.

## Stack Technique

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** GSAP + ScrollTrigger
- **Déploiement:** Docker sur VPS OVH

## Développement Local

```bash
# Installer les dépendances
npm install

# Lancer le serveur de dev
npm run dev
```

Le site sera accessible sur `http://localhost:3000`

## Déploiement

Le déploiement se fait automatiquement via GitHub Actions :
1. Push sur la branche `main`
2. GitHub Actions SSH vers le VPS
3. Pull + Build Docker + Restart
4. Site en ligne sur `https://poupicode.com`

## Configuration VPS

### Nginx Proxy Manager
- Domain: `poupicode.com`
- Forward Hostname: `portfolio`
- Forward Port: `3000`
- SSL: Let's Encrypt activé

### Secrets GitHub nécessaires
- `VPS_HOST`: 51.255.195.51
- `VPS_USER`: poupi
- `VPS_SSH_KEY`: Clé SSH privée

## Modifier les Couleurs

Les couleurs sont définies dans `app/globals.css` :

```css
:root {
  --background: #0a0a0a;
  --foreground: #ffffff;
  --primary: #00f5ff;
  --secondary: #7b2cbf;
  --accent: #1a1a1a;
  --muted: #666666;
}
```

## Structure du Projet

```
portfolio-poupicode/
├── app/                    # App Next.js
│   ├── layout.tsx         # Layout racine
│   ├── page.tsx           # Page principale
│   └── globals.css        # Styles globaux
├── public/                # Assets statiques
│   └── images/           # Images du portfolio
├── .github/
│   └── workflows/
│       └── deploy.yml    # CI/CD automatique
├── Dockerfile            # Image Docker
└── docker-compose.yml    # Config Docker
```

## License

Privé - Tous droits réservés
