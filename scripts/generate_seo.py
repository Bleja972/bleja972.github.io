#!/usr/bin/env python3
"""Generate missing French game sheets and update sitemap safely.
Usage: python scripts/generate_seo.py [--check]
Existing sheets are preserved. No guessed translations or PDF links.
"""
import argparse
import html
import json
from pathlib import Path
from urllib.parse import urljoin, urlsplit, unquote
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://bleja972.github.io/"
NS = "http://www.sitemaps.org/schemas/sitemap/0.9"
ET.register_namespace("", NS)
def esc(value):
    return html.escape(str(value or ""), quote=True)

def local_path(url):
    u = urlsplit(urljoin(BASE, url))
    if u.netloc != urlsplit(BASE).netloc or u.scheme != "https":
        return None
    p = (ROOT / unquote(u.path).lstrip("/")).resolve()
    if not p.is_relative_to(ROOT):
        return None
    return p / "index.html" if u.path.endswith("/") else p

def render(g, route, pdf):
    title = g["title"]
    levels = g.get("levels") or [g.get("level", "")]
    objective = g.get("objective") or g.get("skillName") or g.get("description", "")
    description = g.get("description") or objective
    image = g.get("thumb") or g.get("image")
    if image and (not local_path(image) or not local_path(image).is_file()):
        image = None
    canonical = urljoin(BASE, route)
    play = urljoin(BASE, g["url"])
    crumbs = [{"@type":"ListItem","position":1,"name":"Accueil","item":BASE},
              {"@type":"ListItem","position":2,"name":title,"item":canonical}]
    data = {"@context":"https://schema.org","@graph":[
        {"@type":"LearningResource","@id":canonical+"#resource","name":title,
         "url":canonical,"description":description,"inLanguage":"fr",
         "educationalLevel":levels,"teaches":objective,"learningResourceType":"Jeu éducatif",
         "isAccessibleForFree":True,"about":{"@id":canonical+"#game"}},
        {"@type":"VideoGame","@id":canonical+"#game","name":title,
         "url":play,"applicationCategory":"EducationalApplication","inLanguage":"fr"},
        {"@type":"BreadcrumbList","itemListElement":crumbs}]}
    if image:
        data["@graph"][0]["image"] = urljoin(BASE,image)
    ld = json.dumps(data,ensure_ascii=False).replace("<","\\u003c")
    image_tag = f'<img src="{esc(image)}" alt="{esc(g.get("imageAlt") or title)}" loading="lazy">' if image else ""
    og_image = f'<meta property="og:image" content="{esc(urljoin(BASE,image))}">' if image else ""
    pdf_tag = f'<a class="action" href="{esc(pdf)}" aria-label="{esc("PDF de "+title)}">PDF</a>' if pdf else ""
    nav = " · ".join(f'<a href="/niveau/{esc(l.lower())}/">{esc(l)}</a>' for l in levels if l in {"CP","CE1","CE2","CM1"})
    return f"""<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(title)} | La Ludothèque</title><meta name="description" content="{esc(description)}">
<meta name="robots" content="index,follow"><link rel="canonical" href="{esc(canonical)}">
<meta property="og:type" content="website"><meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(description)}"><meta property="og:url" content="{esc(canonical)}">{og_image}
<script type="application/ld+json">{ld}</script>
<style>body{{margin:0;background:#05070e;color:#edf4ff;font:17px/1.6 Arial,sans-serif}}main{{max-width:950px;margin:auto;padding:24px}}h1,h2{{color:#ffe263}}a{{color:#9edbff}}img{{max-width:100%;height:auto;border-radius:12px}}.actions{{display:flex;flex-wrap:wrap;gap:12px;margin:20px 0}}.action{{padding:12px 20px;background:#193b70;border:1px solid #78baff;border-radius:10px;color:white;font-weight:bold;text-decoration:none;box-shadow:0 4px #071a37}}</style>
</head><body><main><nav aria-label="Fil d’Ariane"><a href="/">Accueil</a> · {nav}</nav><article>
<h1>{esc(title)}</h1><p>{esc(" · ".join(levels))} — {esc(g.get("groupName"))}</p><p>{esc(description)}</p>
<div class="actions"><a class="action" href="{esc(play)}" target="_blank" rel="noopener" aria-label="{esc("Jouer à "+title)}">Jouer ↗</a>{pdf_tag}</div>{image_tag}
<h2>Objectifs pédagogiques</h2><p>{esc(objective)}</p>
<h2>Conseils aux enseignants et aux parents</h2><p>Présenter la consigne, accompagner un premier exemple, puis laisser l’élève s’entraîner. Lui demander d’expliquer sa démarche et reprendre les erreurs ensemble.</p>
<p><a href="/#catalogue">Retour au catalogue</a> · <a href="/ressources-a-imprimer/">Ressources à imprimer</a></p></article></main></body></html>
"""

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="Report changes without writing")
    args = parser.parse_args()
    source = ROOT / "assets/catalogue-v2/catalogue.json"
    games = json.loads(source.read_text(encoding="utf-8"))
    sitemap = ROOT / "sitemap.xml"
    tree = ET.parse(sitemap)
    root = tree.getroot()
    locs = set()
    for entry in list(root):
        loc = entry.findtext(f"{{{NS}}}loc")
        if loc in locs:
            root.remove(entry)
        elif loc:
            locs.add(loc)
    created = 0
    added = 0
    changed = False
    routes = set()
    def register(route):
        nonlocal added
        url = urljoin(BASE,route)
        if url not in locs:
            ET.SubElement(ET.SubElement(root,f"{{{NS}}}url"),f"{{{NS}}}loc").text = url
            locs.add(url)
            added += 1
    for g in games:
        route = g.get("ficheUrl") or "/fiches/"+g["slug"]+"/"
        target = local_path(route)
        if not route.startswith("/fiches/") or not route.endswith("/") or not target or not target.is_relative_to(ROOT/"fiches"):
            raise ValueError(f"Invalid sheet route: {route}")
        if route in routes:
            raise ValueError(f"Duplicate sheet route: {route}")
        routes.add(route)
        if g.get("ficheUrl") != route:
            g["ficheUrl"] = route
            changed = True
        if not target.is_file():
            play = local_path(g["url"])
            if not play or not play.is_file():
                raise FileNotFoundError(f"Game target absent: {g['url']}")
            pdf = g.get("pdfUrl")
            if pdf and (not local_path(pdf) or not local_path(pdf).is_file()):
                pdf = None
            if not args.check:
                target.parent.mkdir(parents=True,exist_ok=True)
                target.write_text(render(g,route,pdf),encoding="utf-8")
            created += 1
        register(route)
    for route in ["/","/en/","/es/","/zh/","/ressources-a-imprimer/","/en/printables/","/es/printables/","/zh/printables/"]:
        if local_path(route).is_file():
            register(route)
    for folder in ("niveau","parcours","competences"):
        for p in (ROOT/folder).rglob("index.html"):
            register("/"+p.parent.relative_to(ROOT).as_posix()+"/")
    if not args.check:
        if changed:
            source.write_text(json.dumps(games,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
        if added or len(root) != len(ET.parse(sitemap).getroot()):
            ET.indent(tree,space="  ")
            tree.write(sitemap,encoding="utf-8",xml_declaration=True)
    print(f"{len(games)} jeux, {created} fiches à créer, {added} URL à ajouter, {len(locs)} URL uniques")
if __name__ == "__main__":
    main()
