#!/usr/bin/env python3
"""Tests sans accès réseau du classement GoatCounter."""
import datetime as dt
import unittest
import actualiser_top10_goatcounter as top


class Top10Tests(unittest.TestCase):
    def setUp(self):
        self.games = [
            {"id": "jeu-1", "title": "Jeu 1", "url": "/a", "path": "/fiche-a/", "playClicks": 7},
            {"id": "jeu-2", "title": "Jeu 2", "url": "/b", "path": "/fiche-b/", "playClicks": 5},
            {"id": "jeu-3", "title": "Jeu 3", "url": "/c", "path": "/fiche-c/", "playClicks": 5},
        ]

    def test_liens_et_evenements(self):
        page = (
            '<article class="game-card" data-game="jeu-1"><a data-goatcounter-click="jouer-un" href="/a">Jouer</a></article>'
            '<article class="game-card" data-game="jeu-2"><a href="/b" data-goatcounter-click="jouer-deux">Jouer</a></article>'
            '<article class="game-card" data-game="jeu-3"><a data-goatcounter-click="jouer-trois">Jouer</a></article>'
        )
        mapping = top.event_mapping(page, self.games)
        self.assertEqual(mapping["jouer-un"], "jeu-1")
        self.assertEqual(mapping["jouer-top10-jeu-3"], "jeu-3")
        values = top.get_counts([
            {"event": True, "path": "jouer-un", "count": 13},
            {"event": True, "path": "jouer-deux", "count": 8},
            {"event": True, "path": "jouer-trois", "count": 6},
            {"event": True, "path": "/visite", "count": 10000},
        ], mapping)
        self.assertEqual(dict(values), {"jeu-1": 13, "jeu-2": 8, "jeu-3": 6})

    def test_aucune_donnee_ne_remplace_le_classement(self):
        mapping = {"jouer-un": "jeu-1"}
        with self.assertRaises(RuntimeError):
            top.get_counts([], mapping)

    def test_classement_et_exaequo(self):
        page = top.build_section(self.games, dt.datetime(2026, 11, 16, 6, 15))
        self.assertIn("N° 2 ex æquo", page)
        self.assertIn("jeu-3", page)
        self.assertIn("16/11/2026", page)


if __name__ == "__main__":
    unittest.main()
