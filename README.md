# 🎮 TerminalQuest - L'Aventure des Commandes CLI

TerminalQuest est une plateforme d'apprentissage ludique pour maîtriser les commandes CLI et Linux. Avec des jeux interactifs, quiz adaptatifs et documentation complète, apprenez le terminal de manière amusante et progressive.

![TerminalQuest Banner](https://img.shields.io/badge/TerminalQuest-CLI%20Learning%20Platform-brightgreen?style=for-the-badge&logo=terminal)

## 🎯 Objectif

Apprendre les commandes de base du terminal (Linux) de manière ludique et interactive. Durée estimée d'une partie : **20 minutes**.

## 🧠 Concepts Pédagogiques

- **Apprentissage progressif** : Chaque commande est débloquée dans un coffre mystérieux
- **Navigation immersive** : Chaque dossier est un lieu à explorer
- **Pratique réelle** : Le joueur utilise de vraies commandes CLI
- **Objectif final** : Atteindre le château en maîtrisant toutes les commandes

## 🗡️ Commandes Enseignées

| Commande | Description | Niveau |
|----------|-------------|---------|
| `ls` | Liste le contenu du répertoire | Débutant |
| `cd` | Change de répertoire | Débutant |
| `cat` | Affiche le contenu d'un fichier | Débutant |
| `mkdir` | Crée un nouveau répertoire | Intermédiaire |
| `touch` | Crée un nouveau fichier | Intermédiaire |
| `cp` | Copie un fichier ou répertoire | Avancé |
| `mv` | Déplace/renomme un fichier | Avancé |
| `rm` | Supprime un fichier | Expert |

## 🗺️ Structure du Jeu

### 1. Introduction (1 min)
- Contexte narratif
- Première commande : `ls`
- Découverte de l'interface

### 2. Exploration (15 min)
- **🏘️ Village de Départ** : Apprentissage de `ls` et `cd`
- **🌲 Forêt Mystique** : Découverte de `mkdir` et navigation
- **🏰 Donjon des Commandes** : Maîtrise de `cat` et lecture de fichiers
- **👑 Château Final** : Commandes avancées et défi final

### 3. Boss Final (2-3 min)
- Challenge combiné de toutes les commandes
- Validation des compétences acquises

### 4. Victoire (1 min)
- Félicitations et score final
- Récapitulatif des apprentissages

## 🧩 Fonctionnalités

### Interface de Jeu
- **Carte visuelle** façon Zelda 2D avec navigation interactive
- **Terminal intégré** avec simulation complète des commandes
- **Animations fluides** avec Framer Motion
- **Design responsive** adapté à tous les écrans

### Système de Progression
- **Sauvegarde automatique** avec localStorage
- **Système de score** basé sur la vitesse et la précision
- **Inventaire des commandes** avec statut de déverrouillage
- **Guide NPC** avec conseils contextuels

### Feedback Pédagogique
- **Messages d'erreur explicites** avec suggestions
- **Indices visuels** pour guider l'apprentissage
- **Validation en temps réel** des commandes
- **Progression visuelle** avec barres de statut

## 🚀 Installation et Lancement

### Prérequis
- Node.js 18+ 
- npm ou pnpm

### Installation
```bash
# Cloner le projet
git clone <repository-url>
cd cliearn

# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev
```

### Production
```bash
# Build pour la production
npm run build

# Lancer en production
npm start
```

## 🛠️ Technologies Utilisées

### Frontend
- **Next.js 15** - Framework React avec App Router
- **TypeScript** - Typage statique pour une meilleure robustesse
- **Tailwind CSS** - Framework CSS utilitaire
- **Framer Motion** - Animations fluides et interactives

### État et Logique
- **Zustand** - Gestion d'état globale simple et performante
- **React Hook Form** - Gestion des formulaires optimisée
- **Lucide React** - Icônes modernes et cohérentes

### Fonctionnalités Avancées
- **Persistance locale** avec localStorage
- **Moteur de terminal** simulé en TypeScript
- **Système de progression** avec sauvegarde automatique

## 🎮 Guide de Jeu

### Démarrage Rapide
1. **Lancez le jeu** et cliquez sur "Commencer l'Aventure"
2. **Explorez** votre environnement avec `ls`
3. **Lisez les fichiers** avec `cat nom_fichier.txt`
4. **Naviguez** entre les lieux avec `cd nom_lieu`
5. **Déverrouillez** les coffres en utilisant les bonnes commandes

### Conseils de Pro
- 💡 Commencez toujours par `ls` dans un nouveau lieu
- 📖 Lisez tous les fichiers pour découvrir des indices
- 🗝️ Chaque coffre nécessite une commande spécifique
- 🆘 Tapez `help` pour voir vos commandes disponibles
- 🗺️ Utilisez la carte pour naviguer entre les lieux

### Système de Score
- **+10 points** par commande utilisée
- **+100 points** par commande débloquée
- **Bonus de temps** pour finir rapidement
- **Malus** pour les erreurs répétées

## 🎨 Captures d'Écran

### Écran d'Accueil
Interface d'accueil avec présentation du jeu et bouton de démarrage.

### Interface de Jeu
- **Panneau gauche** : Carte du monde et guide NPC
- **Panneau central** : Terminal interactif
- **Panneau droit** : Inventaire des commandes

### Écran de Victoire
Félicitations avec score final et option de rejouer.

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- **Next.js Team** pour le framework extraordinaire
- **Framer Motion** pour les animations fluides
- **Tailwind CSS** pour le système de design
- **Lucide** pour les icônes magnifiques
- **Zustand** pour la gestion d'état simple

## 📞 Support

Pour toute question ou suggestion :
- 📧 Email : support@cliearn.dev
- 🐛 Issues : [GitHub Issues](https://github.com/username/cliearn/issues)
- 💬 Discussions : [GitHub Discussions](https://github.com/username/cliearn/discussions)

---

**Fait avec ❤️ pour démocratiser l'apprentissage du terminal**
