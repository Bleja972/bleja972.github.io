# Bannières automatiques pour les nouveaux jeux

Cette automatisation prépare **une proposition de bannière**, mais ne publie
aucune image sur le blog sans fusion manuelle d'une pull request GitHub.

## État initial

L'inventaire `assets/images/bannieres/jeux-deja-publies.json` protège tous
les jeux existant lors de l'installation (112 fiches). Le script ne modifie
aucune de leurs captures, même si elles ne ressemblent pas à leur titre.

## Activation (une seule fois)

1. Créer une clé d'API sur https://platform.openai.com/api-keys et vérifier
   que le projet API dispose d'un moyen de paiement / crédits adaptés.
   **L'API est facturée séparément de ChatGPT.**
2. Dans GitHub, aller au dépôt, puis **Settings > Secrets and variables >
   Actions > New repository secret**. Nom : `OPENAI_API_KEY`.
   Coller la clé directement dans GitHub. **Ne jamais l'écrire dans le code,
   dans un chat ou dans un fichier du dépôt.**
3. Dans **Settings > Actions > General**, vérifier la permission de créer
   des pull requests par GitHub Actions et les permissions du GITHUB_TOKEN.
   Le workflow demande `contents: write` et `pull-requests: write`.

Sans clé API, la GitHub Action ignore poliment la génération et n'affecte
pas le site.

## Ajouter une bannière à un nouveau jeu

Lors de l'ajout d'une nouvelle fiche dans
`assets/catalogue-v2/catalogue.json`, deux comportements :

- **Pas de propriété `thumb`** : une bannière peut être proposée
  automatiquement.
- **Une propriété `thumb` déjà renseignée** : elle est protégée.
  Pour demander explicitement une bannière à la place, ajouter
  `"autoBanner": true` à **ce nouveau jeu seulement**.

Exemple de propriétés dans la fiche d'un *nouveau* jeu :

```json
{
  "id": "jeu-exemple",
  "title": "Mission corail — Calcul mental",
  "subject": "Mathématiques",
  "groupName": "Calcul mental",
  "autoBanner": true
}
```

Conserver bien sûr les autres propriétés (url, niveaux, etc.) du vrai jeu.

Le déclenchement automatique se produit lors des modifications du catalogue
sur la branche `main`. À chaque exécution, **une seule image au maximum**
est générée, pour limiter les dépenses. Cette première version n'effectue
pas de génération rétroactive pour les anciens jeux.

## Essai manuel sur « Les poissons des nombres » (jeu-61)

Une exception **uniquement manuelle** autorise la génération d'un aperçu
`jeu-61-apercu.webp` pour ce jeu déjà présent.

1. Ouvrir **Actions > Proposer une bannière pour un nouveau jeu > Run workflow**.
2. Choisir la branche `main`.
3. Renseigner **game_id = jeu-61**.
4. Pour une simulation gratuite, laisser **dry_run = true**.
5. Pour générer UNE image avec l'API payante, choisir **dry_run = false**.
6. Examiner la pull request créée avant de décider de publier une image.

**Important :** même en fusionnant cette PR, l'aperçu de jeu-61
ne remplace pas la capture existante : seul le nouveau fichier WebP est proposé.
Le fichier `catalogue.json` reste inchangé pour ce test.
La génération via l'API peut être facturée séparément.

## Essai gratuit de la logique (sans génération d'image)

Aller dans **Actions > Proposer une bannière pour un nouveau jeu >
Run workflow** et garder **Simulation sans appel payant à l'API** cochée.
La simulation affiche les nouvelles fiches admissibles sans appeler l'API.
Si aucune nouvelle fiche n'est ajoutée, le nombre doit être zéro.

## Validation

Si une bannière est générée :
- image WebP 1200 x 630 dans `assets/images/bannieres/` ;
- sa propriété `thumb` dans le catalogue est mise à jour **dans une PR** ;
- le blog public ne change que si cette PR est examinée puis fusionnée.

Le script ne modifie pas les pages HTML des jeux.
La bannière est une **illustration générée**, pas une capture fidèle de partie.

## Fichiers

- `.github/workflows/proposer-banniere-jeu.yml` : déclenchement GitHub Actions ;
- `scripts/generer-banniere-jeu.py` : sélection, appel API, optimisation WebP ;
- `assets/images/bannieres/jeux-deja-publies.json` : liste des jeux protégés.

Modèle API : `gpt-image-2.5-flare`, qualité medium ; vérifier les tarifs
actuels avant d'activer des générations payantes.
