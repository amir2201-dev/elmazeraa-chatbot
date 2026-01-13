# El Mazraa Chatbot

Assistant virtuel pour El Mazraa - Leader de l'industrie avicole et charcutière en Tunisie.

## Déploiement sur Vercel

### Méthode 1: Via GitHub (recommandé)

1. **Créer un repository GitHub**
   - Aller sur github.com → New repository
   - Nom: `elmazraa-chatbot`
   - Cliquer "Create repository"

2. **Upload les fichiers**
   - Cliquer "uploading an existing file"
   - Glisser tous les fichiers du projet
   - Commit

3. **Déployer sur Vercel**
   - Aller sur [vercel.com](https://vercel.com)
   - "Add New Project"
   - Importer le repository GitHub
   - **IMPORTANT**: Ajouter la variable d'environnement:
     - Name: `OPENAI_API_KEY`
     - Value: `sk-votre-clé-api`
   - Cliquer "Deploy"

### Méthode 2: Via Vercel CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Dans le dossier du projet
vercel

# Suivre les instructions
# Ajouter OPENAI_API_KEY quand demandé
```

## Configuration

### Variable d'environnement requise

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | Clé API OpenAI (obtenir sur platform.openai.com) |

### Ajouter la clé sur Vercel

1. Dashboard Vercel → Votre projet
2. Settings → Environment Variables
3. Ajouter:
   - Name: `OPENAI_API_KEY`
   - Value: votre clé `sk-...`
   - Environment: Production, Preview, Development
4. Save
5. Redeploy si nécessaire

## Développement local

```bash
# Installer les dépendances
npm install

# Créer le fichier .env.local
cp .env.example .env.local
# Éditer .env.local avec votre clé OpenAI

# Lancer le serveur de développement
npm run dev

# Ouvrir http://localhost:3000
```

## Structure du projet

```
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.js    # API endpoint OpenAI
│   ├── layout.js           # Layout racine
│   └── page.js             # Interface chatbot
├── package.json
├── next.config.js
└── .env.example
```

## Coût estimé

GPT-4o-mini: ~$0.15-0.60 USD / 1000 messages

## Intégration sur elmazraa.com (optionnel)

Une fois déployé, vous pouvez intégrer le chatbot sur le site principal via iframe:

```html
<iframe 
  src="https://votre-app.vercel.app" 
  style="position: fixed; bottom: 20px; right: 20px; width: 400px; height: 600px; border: none; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.2);"
></iframe>
```

## Support

- Site: https://www.elmazraa.com
- Email: info@elmazraa.com.tn
- Tél: +216 70 020 680
