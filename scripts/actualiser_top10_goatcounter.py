#!/usr/bin/env python3
"""Actualisation quotidienne du Top 10 du blog depuis les clics GoatCounter.

Variables d'environnement:
  GOATCOUNTER_TOKEN : clé API stockée dans les secrets GitHub (obligatoire)
  GOATCOUNTER_HOST  : domaine du compteur (configuré dans le workflow)

La liste est basée sur les événements data-goatcounter-click du catalogue.
On ne confond pas clics vers un jeu et visites directes sur GitHub Pages.
En cas d'erreur API ou de données incohérentes, aucun fichier n'est modifié.
"""
from __future__ import annotations

import datetime as dt
import html
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from collections import defaultdict
from pathlib import Path
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "assets/catalogue-v2/catalogue.json"
HOME = ROOT / "index.html"
HOST = os.getenv("GOATCOUNTER_HOST", "lesjeuxdemathsetdefrancais.goatcounter.com").strip()
TOKEN = os.getenv("GOATCOUNTER_TOKEN", "").strip()
START = "2020-01-01T00:00:00Z"
URL = "https://" + HOST + "/api/v0/stats/hits"
LIMIT = 100


def api_hits() -> list[dict]:
    if not TOKEN:
        raise RuntimeError("Secret GOATCOUNTER_TOKEN absent. Le classement existant est conservé.")
    if HOST != "lesjeuxdemathsetdefrancais.goatcounter.com":
        raise RuntimeError("GOATCOUNTER_HOST inattendu, arrêt de sécurité.")
    end = dt.datetime.now(dt.timezone.utc).replace(minute=0, second=0, microsecond=0)
    all_hits = []
    offset = 0
    for page in range(100):  # 10 000 chemins / événements au maximum
        query = urllib.parse.urlencode({
            "start": START,
            "end": end.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "group": "day",
            "limit": LIMIT,
            "offset": offset,
        })
        request = urllib.request.Request(
            URL + "?" + query,
            headers={
                "Authorization": "Bearer " + TOKEN,
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
        )
        try:
            with urllib.request.urlopen(request, timeout=35) as response:
                data = json.load(response)
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
            raise RuntimeError("La requête GoatCounter a échoué. Aucun changement.") from exc
        if not isinstance(data, dict) or not isinstance(data.get("hits"), list):
            raise RuntimeError("Réponse GoatCounter inattendue. Aucun changement.")
        batch = data["hits"]
        all_hits.extend(batch)
        if not data.get("more"):
            return all_hits
        if not batch:
            raise RuntimeError("Pagination GoatCounter incohérente.")
        offset += len(batch)
        time.sleep(0.32)  # Limite GoatCounter: environ 4 requêtes/s
    raise RuntimeError("Trop de pages de statistiques : arrêter sans écrire.")


def attrs(tag: str) -> dict[str, str]:
    return {name.lower(): html.unescape(value) for name, value in re.findall(
        r'([\w-]+)\s*=\s*"([^"]*)"', tag
    )}


def event_mapping(homepage: str, games: list[dict]) -> dict[str, str]:
    mapping = {}
    # Chaque carte identifie explicitement le jeu concerné.
    pattern = r'<article\b[^>]*\b(?:data-game|data-ranked-game)="([^"]+)"[^>]*>.*?</article>'
    for match in re.finditer(pattern, homepage, flags=re.DOTALL):
        game_id, card = match.group(1), match.group(0)
        if game_id not in {g["id"] for g in games}:
            continue
        for anchor in re.finditer(r'<a\b[^>]*>', card, flags=re.DOTALL):
            tag = attrs(anchor.group(0))
            event = tag.get("data-goatcounter-click", "")
            if event.startswith("jouer-"):
                prev = mapping.get(event)
                if prev and prev != game_id:
                    raise RuntimeError("Événement utilisé par plusieurs jeux: " + event)
                mapping[event] = game_id
    # Les événements introduits par la section Top10 sont stables même si la
    # composition du classement change d'un jour à l'autre.
    for game in games:
        mapping["jouer-top10-" + game["id"]] = game["id"]
    return mapping


def get_counts(hits: list[dict], mapping: dict[str, str]) -> dict[str, int]:
    result = defaultdict(int)
    found = set()
    for item in hits:
        if not isinstance(item, dict):
            continue
        path = urllib.parse.unquote(str(item.get("path", ""))).strip()
        if path.startswith("event:"):
            path = path[6:]
        if path.startswith("/"):
            path = path[1:]
        game_id = mapping.get(path)
        if not game_id:
            continue
        # Seuls les événements de clic, et non les pages vues.
        if item.get("event") is False:
            continue
        count = item.get("count", 0)
        if isinstance(count, bool) or not isinstance(count, int) or count < 0:
            raise RuntimeError("Compteur GoatCounter invalide pour " + path)
        result[game_id] += count
        found.add(game_id)
    if len(found) < 3 or sum(result.values()) < 5:
        raise RuntimeError(
            "Trop peu de clics reconnus; vérifie les événements GoatCounter. "
            "Ancien classement conservé."
        )
    print(f"{len(found)} jeux suivis, {sum(result.values())} clics reconnus.")
    return result


def escape(value: object) -> str:
    return html.escape(str(value), quote=True)


def build_section(games: list[dict], now: dt.datetime) -> str:
    ranked = sorted(
        games, key=lambda g: (-g.get("playClicks", 0), g["title"].casefold())
    )[:10]
    label = now.strftime("%d/%m/%Y à %H:%M")
    cards = []
    for game in ranked:
        rank = 1 + sum(g["playClicks"] > game["playClicks"] for g in games)
        tied = sum(g["playClicks"] == game["playClicks"] for g in games) > 1
        badge = f"N° {rank}" + (" ex æquo" if tied else "")
        title = escape(game["title"])
        url = escape(game.get("url") or game.get("path") or "/")
        detail = escape(game.get("path") or game.get("url") or "/")
        screenshot = escape(game.get("thumb") or game.get("image") or "")
        alt = escape(game.get("imageAlt") or ("Aperçu de " + game["title"]))
        levels = " · ".join(game.get("levels") or [game.get("level", "")])
        skill = game.get("groupName") or game.get("skillName") or game.get("subject") or ""
        meta = escape(levels + " · " + skill)
        count = game["playClicks"]
        event = escape("jouer-top10-" + game["id"])
        cards.append(
            f'<article class="week-card" data-ranked-game="{escape(game["id"])}" data-play-clicks="{count}">'
            f'<a class="week-image" href="{detail}" aria-label="Découvrir {title}">'
            f'<img src="{screenshot}" alt="{alt}" width="400" height="225" loading="lazy"/>'
            f'<span class="week-number">{escape(badge)}</span></a>'
            f'<div class="week-body"><span class="mini-subject">{meta}</span>'
            f'<h3><a href="{detail}">{title}</a></h3>'
            f'<div class="week-bottom"><span><strong>{count}</strong> clics sur « Jouer »</span>'
            f'<a href="{url}" target="_blank" rel="noopener" data-goatcounter-click="{event}"'
            f' data-goatcounter-title="Classement : {title}">Jouer <span aria-hidden="true">↗</span></a>'
            '</div></div></article>'
        )
    return (
        '<section aria-labelledby="popular-title" class="weekly-section" id="jeux-les-plus-joues">'
        '<div class="section-head"><div><h2 id="popular-title"><span aria-hidden="true">★</span>'
        ' Top 10 des jeux les plus joués</h2>'
        '<p>Classement des clics sur « Jouer » depuis le blog, actualisé automatiquement '
        f'le <strong>{escape(label)} (Martinique)</strong> avec GoatCounter. '
        'Les accès directs ne sont pas comptés. Les ex æquo sont conservés.</p>'
        '</div><a class="text-link" href="/?niveau=tous&amp;tri=popularite#catalogue">'
        'Voir tout le classement <span aria-hidden="true">→</span></a></div>'
        '<div class="weekly-grid">' + ''.join(cards) + '</div></section>'
    )


def main() -> None:
    old_home = HOME.read_text(encoding="utf-8")
    games = json.loads(CATALOG.read_text(encoding="utf-8"))
    if not isinstance(games, list) or len(games) < 50:
        raise RuntimeError("Catalogue incomplet; abandon.")
    mapping = event_mapping(old_home, games)
    counts = get_counts(api_hits(), mapping)
    for g in games:
        # Un événement absent représente 0 clic pour ce jeu sur la période.
        g["playClicks"] = counts.get(g["id"], 0)
    today = dt.datetime.now(ZoneInfo("America/Martinique"))
    section = build_section(games, today)
    pattern = re.compile(r'<section\b[^>]*\baria-labelledby="popular-title"[^>]*>.*?</section>', re.DOTALL)
    if len(pattern.findall(old_home)) != 1:
        raise RuntimeError("Bloc Top10 introuvable ou dupliqué; abandon.")
    new_home = pattern.sub(lambda _: section, old_home)
    updated_catalog = json.dumps(games, indent=2, ensure_ascii=False) + "\n"
    # Écrire seulement si toutes les étapes ont réussi.
    HOME.write_text(new_home, encoding="utf-8")
    CATALOG.write_text(updated_catalog, encoding="utf-8")
    print("Top10 actualisé :", today.strftime("%Y-%m-%d %H:%M"), "America/Martinique")
    print("Top3 :", [(g["title"], g["playClicks"]) for g in sorted(
        games, key=lambda x: -x["playClicks"]
    )[:3]])


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print("ÉCHEC : " + str(exc), file=sys.stderr)
        raise SystemExit(1) from exc
