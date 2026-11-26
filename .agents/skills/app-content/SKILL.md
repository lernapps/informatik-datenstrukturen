---
name: app-content
description: Use for any content work in this app - researching, writing, extending, correcting or reviewing its competencies, chapters, pages, rounds, questions, exercises, figures, terms or sources. This app's own content decisions; they take precedence over the generic lernapps content skills. Load it before you change any content.
---

# Content guide of this app

Explainer „Netze und Reihen von Daten“ (lernapps/apps#496, Epic Informatik lernapps/apps#509), `strand:
informatik/daten`, format 2, Sprachen de und en. Kapitel 1 `netze` (7-8) ist gebaut; Kapitel 2 `reihen` (Feld, 9-10)
kommt später.

## Curriculum

- Keine Landesvorgabe; Reihenfolge und Bausteine aus der Lernlandkarte Informatik
  (https://lernapps.net/apps/map/informatik.json), Richtstufe 7-8.
- Orientierung:
  - GI Bildungsstandards Informatik Sek I (Januar 2025), §4.3 SV-4 „netzartige Strukturen“, S. 11.
  - Bayern LehrplanPLUS Gymnasium NT 7, Lernbereich 2.1 „Vernetzte Informationsstrukturen“: Fachbegriffe Hypertext,
    Verweis, Graph; „Graph, bestehend aus Knoten und Kanten“.
  - Hessen KC Informatik Sek I (2021), S. 16: „stellen Hypertextstrukturen grafisch dar“.
  - NRW (KLP 5/6 2021, WP 2023) und England KS3 nennen Graph und Hypertext nicht.

## Competencies

Kapitel 1 `netze` (`src/netze/`):

- Wiederholung `das-brauchst-du.yaml`: `recap: informatik/baum` – „Ich kann hierarchische Informationen als Baum mit
  Wurzel, Knoten, Kanten und Blättern darstellen.“ (geübt in informatik-daten-codieren, /information/baum/).
- `graph` – „Ich kann vernetzte Informationen, zum Beispiel verlinkte Webseiten, als Graph aus Knoten und Kanten
  darstellen.“ Seiten `graph.yaml` (ungerichtet: Busnetz, Freundesnetz, Weg, Kreis) und `pfeile.yaml` (gerichtet:
  Verweise zwischen Seiten).
- `hypertext` – „Ich kann den Aufbau eines Hypertexts aus Seiten und Verweisen beschreiben und einen einfachen
  Hypertext erstellen.“ Seiten `hypertext.yaml` (beschreiben) und `stadtfuehrer.yaml` (erstellen, mit Quellenangabe).

Kapitel 2 `reihen` (später): Wiederholung `recap: informatik/variable`, Seite `feld` (`feld-array`).

Übungs-ids stehen in den Seiten; jede id ist pro Seite eindeutig und bleibt nach der Veröffentlichung.

## Content structure

- Seite: Abschnitte `einstieg` (Chat und erste Aufgabe), `idee` (Begriffe, Merke), `unplugged` (wo es eine
  Fäden-und-Karten-Aktivität gibt), `beispiel`, `bauen` (Komponente), `uebung`, `galerie` (wo die Galerie wächst).
  Titel sagen, was der Abschnitt auf dieser Seite tut.
- Geschichte: Klassenchat der 7b als `note`-Block mit Titel „Klassenchat 7b“ / "Class 7b chat", Zeilen
  „**Selin:** …“, je Zeile ein Absatz. Figuren: Jona, Selin, Mia (alle 12), Tom, Ben, Ali, Lea, Frau Berg
  (Klassenlehrerin). Aussehen wie in informatik-computer `klasse-6b.svg` (Jona rotblond #c8642a, grüner Pulli #2e8b57;
  Selin dunkelbrauner Pferdeschwanz #3b2314, orange Jacke #e07b24; Mia schwarze Locken #222, runde Brille, lila Jacke
  #7b4fb8).
- Handlung: letztes Jahr Klassenfahrt Seeberg (6b) → Busnetz der Stadt → Freundesnetz → Seiten verweisen aufeinander →
  Projekt „Stadtführer für die neuen Fünfer“ als Hypertext.
- Galerie der Datenstrukturen: Bild `galerie-<n>.svg` plus Tabelle „Struktur | Wie finde ich ein Element?“, Stand 1
  auf der Wiederholung, Stand 2 am Ende von `graph`, Stand 3 am Ende von `stadtfuehrer`, Stand 4 (Feld) in Kapitel 2.
- Länge: höchstens 350 Wörter Text je Seite, mindestens vier Übungen je Seite (Wiederholung: eine).

## Terminology

- Anrede „du“, einfache Sprache, kurze Sätze.
- de: Graph, Knoten, Kante, Weg, Länge eines Weges (Anzahl der Kanten), Kreis, gerichteter Graph, Pfeil, Hypertext,
  Seite, Verweis (Link) – beim ersten Auftreten „Verweis (Link)“, danach „Verweis“; Linktext, Startseite.
- en: graph, node, edge, path, length of a path (number of edges), cycle, directed graph, arrow, hypertext, page, link,
  link text, home page.
- Vermeiden: „Graph“ für ein Diagramm mit Achsen (wird auf `graph` abgegrenzt); „Ecke“ statt Knoten.
- Glossar (definition-Blöcke): Graph, Weg, Kreis (`graph`); gerichteter Graph (`pfeile`); Hypertext, Verweis,
  Startseite (`hypertext`); Quellenangabe nicht als Definition (gehört zu #505), nur als Text mit Link.
- Namen und Ortsnamen (Seeberg, Lindenplatz) bleiben in allen Sprachen gleich.

## Exercise patterns

- Zählen am Bild: `number` mit `mistakes` (Knoten statt Kanten gezählt; Umweg über den Kreis), z. B.
  `graph.yaml#kanten-busnetz`.
- Erkennen: `single-choice` mit `info` je Option, z. B. `graph.yaml#kein-baum`.
- Urteilen: `true-false` mit Begründung, z. B. `graph.yaml#baum-ist-graph`.
- Zuordnen: `matching` mit Distraktor, z. B. `hypertext.yaml#teile-hypertext`.
- Ordnen: `ordering` eines Klickwegs, `hypertext.yaml#klickweg`.
- Bauen ungerichtet/gerichtet: Komponente `Netzbauer` (`graph.yaml#freundesnetz-bauen`, `pfeile.yaml#verweisnetz-bauen`).
- Hypertext bauen: Komponente `Hypertextbaukasten` (`stadtfuehrer.yaml#stadtfuehrer-bauen`).

## Figures

- Stil wie der Baum von #491 (`baum-zimmer.svg`): weißer Grund, Knoten als abgerundete Rechtecke (rx 8), Rand #333
  2 px, Kanten als gerade Linien #333 2 px, Start- oder Wurzelknoten hellblau #e8f0fb, Blätter gestrichelt (nur im
  Baum), Pfeilspitzen gefüllt #333 am Zielknoten. Schrift sans-serif 15.
- Text im Bild nur Namen. Wörter (Haltestellen, Seitennamen) → `image: { de: images/x-de.svg, en: images/x-en.svg }`.
  Begriffe nie im Bild, sondern als `labelled-figure` mit Legende.
- Bilder: `baum-zimmer.svg` (Kopie aus informatik-daten-codieren, Herkunft im Dateikopf), `busnetz-*.svg`,
  `freunde.svg`, `pfeile.svg`, `stadtfuehrer-*.svg`, `galerie-1..3.svg`. Alle eigene Zeichnung, `licence: CC-BY-4.0`,
  `source: eigene Zeichnung, Oliver Jägle`.
- Komponenten zeichnen im selben Stil, Farben der Bedienelemente nur über `--page-*`.
- `alt` sagt, was das Bild zeigt; `caption` sagt, worauf man schaut; nie die Lösung einer Aufgabe.

## Sources

- Lernlandkarte Informatik (Bausteine, iCan-Sätze), gelesen 2026-11-26.
- Berners-Lee, „Information Management: A Proposal“ (1989), https://www.w3.org/History/1989/proposal.html: „We can
  call the circles nodes, and the arrows links.“ – auf `pfeile` als Herkunft der Idee verlinkter Seiten.
- Weggelassen: Ted Nelson 1965 als Erfinder des Wortes „Hypertext“ (Volltext nicht prüfbar).
- Quellenangabe (Titel, Urheber, Quelle, Lizenz) nach informatik-digitale-welt (#505), verlinkt über
  https://lernapps.net/apps/map/informatik/c/urheberrecht/.

## Adding a chapter or round

1. Bausteine aus der Karte lesen (`requires`), Wiederholung `das-brauchst-du.yaml` für Voraussetzungen anderer Apps.
2. Ordner `src/<kapitel>/` mit `chapter.yaml` (title, summary, pages) anlegen, in `src/app.yaml` unter `chapters`
   eintragen (Kapitel 2: `reihen` nach `netze`).
3. Seiten nach „Content structure“: Chat-Einstieg, Begriff, unplugged-Anleitung, Bauen, Übung, Galerie Stand n.
4. Übungen aus den Mustern oben; jede Seite mindestens vier, jeder typische Fehler mit eigenem Hinweis.
5. Englisch vollständig mitschreiben; `npx vp build`, `npx --no -- lernapps check`, Commit.

## Rules learned from mistakes

None yet.
