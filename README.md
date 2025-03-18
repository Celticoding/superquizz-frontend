# SuperQuiz Frontend

Une application de quiz interactive construite avec React, TypeScript et Tailwind CSS.

## Fonctionnalités

- Authentification (inscription/connexion)
- Création de quiz personnalisés
- Passage de quiz
- Tableau de bord avec statistiques
- Interface utilisateur moderne et responsive

## Prérequis

- Node.js (v14 ou supérieur)
- npm (v6 ou supérieur)
- Backend Spring Boot (voir le dépôt backend pour plus d'informations)

## Installation

1. Clonez le dépôt :
```bash
git clone https://github.com/votre-username/superquizz-frontend.git
cd superquizz-frontend
```

2. Installez les dépendances :
```bash
npm install
```

3. Créez un fichier `.env` à la racine du projet avec les variables d'environnement suivantes :
```env
VITE_API_URL=http://localhost:8080
```

## Démarrage

Pour lancer l'application en mode développement :

```bash
npm run dev
```

L'application sera accessible à l'adresse `http://localhost:5173`

## Structure du projet

```
src/
├── components/     # Composants réutilisables
├── pages/         # Pages de l'application
├── hooks/         # Hooks personnalisés
├── types/         # Types TypeScript
└── App.tsx        # Composant principal
```

## Technologies utilisées

- React 18
- TypeScript
- Tailwind CSS
- React Router
- React Query
- Axios
- React Hook Form
- JWT pour l'authentification

## API Endpoints

L'application communique avec un backend Spring Boot via les endpoints suivants :

- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Informations utilisateur
- `GET /api/quizzes` - Liste des quiz
- `GET /api/quizzes/:id` - Détails d'un quiz
- `POST /api/quizzes` - Création d'un quiz
- `POST /api/quizzes/:id/submit` - Soumission d'un quiz
- `GET /api/dashboard` - Statistiques du tableau de bord

## Contribution

1. Fork le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.
