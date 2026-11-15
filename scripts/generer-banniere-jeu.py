#!/usr/bin/env python3
"""Génération d'une bannière pour un NOUVEAU jeu du catalogue GitHub Pages.

La génération courante ne modifie jamais les images de jeux existants.
Un aperçu manuel ciblé sur jeu-61 peut être généré sans modifier le catalogue.
Aucune publication directe : les fichiers produits doivent être examinés dans une PR.
"""
from __future__ import annotations

import argparse
import base64
import io
import json
import os
from pathlib import Path
import re
import sys
import urllib.error
import urllib.request

from PIL import Image, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[1]
CATALOGUE = ROOT / "assets/catalogue-v2/catalogue.json"
BASELINE = ROOT / "assets/images/bannieres/jeux-deja-publies.json"
IMAGES_DIR = ROOT / "assets/images/bannieres"
MODEL = "gpt-image-2.5-flare"
MAX_IMAGES_PER_RUN = 1


def load(path: Path):
    with path.open(encoding="utf-8") as f:
        return json.load(f)


def save(path: Path, obj):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(obj, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def safe_slug(value: str) -> str:
    # Les noms de fichier ne dépendent que de l'identifiant du catalogue.
    value = re.sub(r"[^a-z0-9-]+", "-", value.lower()).strip("-")
    if not value or len(value) > 100:
        raise ValueError("Identifiant de jeu invalide")
    return value


def candidates(games, existing, requested_id=""):
    for game in games:
        game_id = game.get("id")
        if not isinstance(game_id, str) or game_id in existing:
            continue  # Jamais de modification des jeux existants.
        if requested_id and game_id != requested_id:
            continue
        if game.get("autoBanner") is False:
            continue
        if game.get("thumb") and game.get("autoBanner") is not True:
            continue  # Capture actuelle conservée, sauf choix explicite.
        if not game.get("title"):
            continue
        yield game


def generate(prompt: str, api_key: str) -> bytes:
    payload = {
        "model": MODEL,
        "prompt": prompt,
        "size": "1536x1024",
        "quality": "medium",
        "output_format": "webp",
        "output_compression": 82,
        "n": 1,
    }
    request = urllib.request.Request(
        "https://api.openai.com/v1/images/generations",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": "Bearer " + api_key,
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=240) as response:
            result = json.load(response)
    except urllib.error.HTTPError as error:
        # Ne jamais afficher le jeton API ou des données de requête sensibles.
        detail = error.read(1000).decode("utf-8", errors="replace")
        raise RuntimeError(f"Échec de génération (HTTP {error.code}) : {detail}") from error
    data = result.get("data") or []
    if not data or not data[0].get("b64_json"):
        raise RuntimeError("L'API n'a pas renvoyé de fichier image b64_json.")
    return base64.b64decode(data[0]["b64_json"], validate=True)


def optimize(image_bytes: bytes, destination: Path) -> None:
    with Image.open(io.BytesIO(image_bytes)) as im:
        im = ImageOps.exif_transpose(im).convert("RGB")
        # Préserve l'image entière pour éviter les titres coupés.
        # Le fond flouté remplit les marges latérales du format 1200 x 630.
        size = (1200, 630)
        background = ImageOps.fit(
            im, size, method=Image.Resampling.LANCZOS,
            centering=(0.5, 0.5)
        ).filter(ImageFilter.GaussianBlur(radius=26))
        foreground = ImageOps.contain(im, size, method=Image.Resampling.LANCZOS)
        x = (size[0] - foreground.width) // 2
        y = (size[1] - foreground.height) // 2
        background.paste(foreground, (x, y))
        destination.parent.mkdir(parents=True, exist_ok=True)
        background.save(destination, format="WEBP", quality=83, method=6)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--game-id", default="", help="ID d'un jeu ajouté depuis l'inventaire initial")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--preview-existing", action="store_true", help="Aperçu exceptionnel et non publié du jeu-61")
    args = parser.parse_args()

    games = load(CATALOGUE)
    if not isinstance(games, list):
        raise RuntimeError("Le catalogue doit être une liste JSON.")
    baseline = load(BASELINE)
    existing = set(baseline["existingGameIds"])
    # Une seule exception autorisée : jeu-61, demandé manuellement et hors catalogue.
    preview = args.preview_existing
    if preview:
        if args.game_id != "jeu-61":
            raise ValueError("L'aperçu d'un jeu existant est uniquement autorisé pour jeu-61.")
        found = [g for g in games if g.get("id") == "jeu-61"]
        if len(found) != 1:
            raise ValueError("La fiche jeu-61 est introuvable ou dupliquée.")
    else:
        found = list(candidates(games, existing, args.game_id))
    print(f"Jeux admissibles : {len(found)}")
    for game in found[:10]:
        print(" -", game["id"], "|", game["title"])
    if args.game_id and not found:
        print("Aucun nouveau jeu admissible avec cet ID (ou vignette déjà protégée).")
    if not found or args.dry_run:
        return 0

    key = os.environ.get("OPENAI_API_KEY", "").strip()
    if not key:
        print("OPENAI_API_KEY non configurée : génération ignorée sans modifier le site.")
        return 0

    game = found[0]  # Au maximum une génération payante par exécution.
    game_id = game["id"]
    file_name = safe_slug(game_id) + ("-apercu.webp" if preview else ".webp")
    target = IMAGES_DIR / file_name
    if target.exists():
        print("Une bannière existe déjà : aucune nouvelle génération.", file_name)
        return 0

    title = game["title"]
    category = str(game.get("groupName") or game.get("category") or game.get("subject") or "éducation")
    brief = (
        f"Bannière immersive et photoréaliste pour un jeu éducatif français de primaire. "
        f"Titre : {title}. Thème pédagogique : {category}. "
        "Créer une scène forte, vivante, très détaillée et adaptée à l'univers du titre. "
        "Composition cinématographique panoramique, sujet principal lisible même en miniature, "
        "garder les éléments importants dans les 75 pour cent centraux de l'image, "
        "éclairage soigné et couleurs lumineuses, esthétique haut de gamme pour enfant. "
        "Ne mettre aucun mot, chiffre, logo, bouton, interface, filigrane ou texte dans l'image. "
        "Ne pas imiter une capture d'écran. Pas d'identité personnelle."
    )
    if preview:
        brief = (
            "Bannière ultra réaliste et spectaculaire pour un jeu pédagogique de calcul mental intitulé "
            "'Les poissons des nombres'. Récif de corail tropical très détaillé, mer turquoise, "
            "rayons de soleil sous-marins, six magnifiques poissons tropicaux réalistes alignés, "
            "titre exact 'Les poissons des nombres' en lettres 3D bleu et doré dans un bandeau élégant, "
            "entièrement visible avec une marge de sécurité de 15 pour cent sur les quatre côtés. "
            "Des chiffres simples dans quelques bulles, composition vive et lisible en miniature, "
            "aucun logo, aucune identité personnelle, sans fausse capture de fonctionnement du jeu."
        )
    optimize(generate(brief, key), target)
    if preview:
        print("Aperçu créé : ", target.relative_to(ROOT))
        print("La capture et le catalogue du jeu-61 restent inchangés.")
        output_file = os.environ.get("GITHUB_OUTPUT")
        if output_file:
            with open(output_file, "a", encoding="utf-8") as output:
                output.write("generated=true\n")
                output.write("game_id=jeu-61\n")
                output.write("preview_only=true\n")
        return 0
    game["thumb"] = "/assets/images/bannieres/" + file_name
    game["imageAlt"] = f"Illustration de couverture générée pour {title}."
    game["bannerSource"] = "auto-generated"
    game.pop("autoBanner", None)
    existing.add(game_id)
    baseline["existingGameIds"] = sorted(existing)
    save(CATALOGUE, games)
    save(BASELINE, baseline)
    output_file = os.environ.get("GITHUB_OUTPUT")
    if output_file:
        with open(output_file, "a", encoding="utf-8") as output:
            output.write(f"generated=true\n")
            output.write(f"game_id={game_id}\n")
    print("Proposition prête : ", target.relative_to(ROOT), "et catalogue mis à jour.")
    print("Publication uniquement après validation et fusion de la pull request.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
