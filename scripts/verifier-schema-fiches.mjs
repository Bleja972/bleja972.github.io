#!/usr/bin/env node
/**
 * Contrôle les données structurées des fiches répertoriées dans sitemap.xml.
 * Usage : node scripts/verifier-schema-fiches.mjs
 * Aucune dépendance npm, aucun accès réseau.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const sitemap = readFileSync(join(root, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>\s*(https:\/\/bleja972\.github\.io\/fiches\/[^<]+\/)\s*<\/loc>/g)]
  .map(match => match[1]);
const uniqueUrls = [...new Set(urls)];
const failures = [];
let checked = 0;

const report = (page, error) => failures.push(page + ' : ' + error);
const validLevels = new Set(['CP', 'CE1', 'CE2', 'CM1']);
const asArray = value => Array.isArray(value) ? value : [value];

for (const url of uniqueUrls) {
  const pathname = new URL(url).pathname;
  const localPath = join(root, pathname, 'index.html');
  if (!existsSync(localPath)) {
    report(pathname, 'index.html introuvable');
    continue;
  }
  let html;
  try {
    html = readFileSync(localPath, 'utf8');
  } catch (error) {
    report(pathname, 'lecture impossible : ' + error.message);
    continue;
  }
  const nodes = [];
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (!/\btype\s*=\s*["']application\/ld\+json["']/i.test(match[1])) continue;
    try {
      nodes.push(...asArray(JSON.parse(match[2])));
    } catch (error) {
      report(pathname, 'JSON-LD invalide : ' + error.message);
    }
  }
  const resources = nodes.filter(node => node && node['@type'] === 'LearningResource');
  if (resources.length !== 1) {
    report(pathname, 'LearningResource attendu une fois, trouvé ' + resources.length);
    continue;
  }
  const lr = resources[0];
  const levels = asArray(lr.educationalLevel).filter(Boolean);
  if (!levels.length || levels.some(level => !validLevels.has(level))) {
    report(pathname, 'educationalLevel manquant ou incorrect');
  }
  if (lr.isAccessibleForFree !== true) {
    report(pathname, 'isAccessibleForFree doit valoir true');
  }
  const subjects = asArray(lr.about)
    .filter(Boolean)
    .map(value => typeof value === 'string' ? value : value?.name || '')
    .join(' ');
  if (!/\b(Mathématiques|Français)\b/i.test(subjects)) {
    report(pathname, 'about doit préciser Mathématiques ou Français');
  }
  if (!lr.name || !lr.url || !lr.learningResourceType) {
    report(pathname, 'name, url ou learningResourceType manquant');
  }
  if (lr.url !== url) {
    report(pathname, 'url du schéma différente du sitemap');
  }
  checked++;
}

console.log('Fiches référencées : ' + uniqueUrls.length);
console.log('LearningResource contrôlés : ' + checked);
if (failures.length) {
  console.error('\n' + failures.length + ' erreur(s) :\n' + failures.map(x => '- ' + x).join('\n'));
  process.exitCode = 1;
} else if (!checked) {
  console.error('Aucune fiche trouvée dans le sitemap.');
  process.exitCode = 1;
} else {
  console.log('OK : données structurées cohérentes sur les fiches référencées.');
}
