---
# Read by the hooks, the review, the evals. Schema: @lernapps/tooling/guidance/plan-front-matter.v1.schema.json
# Written by `lernapps plan` and the hooks. Never change a key or a value by hand.
# Archetype, null until chosen in Explore. Allowed values: explainer, interactive, quiz.
archetype: explainer
# Current phase. Allowed values: explore, plan, code, commit.
phase: code
# prePushFailures: failed pre-push runs, written by the hook.
prePushFailures: 0
# failedChecks: failed rules and runs, written by lernapps check and the hooks.
failedChecks: {}
---

# Plan: informatik-datenstrukturen, first version

<!--
For you, the assistant. The process is in AGENTS.md; this plan holds the method.
- `npx --no -- lernapps plan next` prints the task to do now, `plan done` ticks it and prints the next one.
- You write only below Goal, Key decisions, Notes, Answers, Entry draft, Content method and Retrospective, in the
  creator's language. Delete the comment of a section once the section is filled.
- Work on the branch `work`, locally: push nothing before Commit.
-->

*Started 2026-11-26. Explore, Plan, Code, Commit.*

## Goal

Lernende der Klassen 7 und 8 legen Netze erst mit Fäden und Karten und bauen sie dann am Rechner. Sie stellen vernetzte
Daten als Graph aus Knoten und Kanten dar und beschreiben und bauen einen kleinen Hypertext aus Seiten und Verweisen.
Leitfrage der Galerie der Datenstrukturen: Wie finde ich ein Element?

## Key decisions

- Archetyp `explainer`: Auftrag lernapps/apps#496 verlangt einen Explainer im Format 2 (Seiten mit Erklärung, Bild und
  Übungen).
- Welle 2 baut nur Kapitel 1 (`netze`, 7-8). Kapitel 2 (`reihen`, Feld, 9-10) ist geplant, kommt später mit der Welt
  „Feld“ in `coding`.
- Sammel-Wiederholung `recap: informatik/baum` am Kapitelanfang, weil `graph` `baum` (#491) braucht.
- Urheberrecht (#505) ist kein `requires` von `hypertext`: keine Wiederholungsseite, nur Link zur Karte und ein Satz
  mit den vier Teilen (Orchestrator: „richtig nach der Karte“).
- Zwei Übungskomponenten `Netzbauer` und `Hypertextbaukasten` mit gemeinsamer Logik `Netz.ts`: kein Block lässt
  Kanten oder Verweise anlegen; Hypertext als eigene Komponente, kein HTML (#504).
- Geschichte als Klassenchat 7b in einer `note`-Box, Zeilen „**Selin:** …“, keine Chat-Komponente.
- `tasks: { start: first }` (guess): die Klasse bespricht dieselbe Aufgabe Nr. 1.
- Ted Nelson 1965 weggelassen: Volltext nicht prüfbar (Orchestrator).
- Kein `scope`: die App hat kein `open-task` und folgt keinem Material des Auftraggebers.

## Notes

### Strang und Bausteine

- Strang `informatik/daten` (explainerFocus strand). Karte gelesen am 2026-11-26.
- Kapitel 1 `netze` (7-8):
  - `graph` „Graph als Datenstruktur“: „Ich kann vernetzte Informationen, zum Beispiel verlinkte Webseiten, als Graph
    aus Knoten und Kanten darstellen.“ requires `baum`. Seiten `graph`, `pfeile`.
  - `hypertext` „Hypertext“: „Ich kann den Aufbau eines Hypertexts aus Seiten und Verweisen beschreiben und einen
    einfachen Hypertext erstellen.“ requires `graph`. Seiten `hypertext`, `stadtfuehrer`.
  - Wiederholung `das-brauchst-du`: `informatik/baum` (geübt in informatik-daten-codieren, /information/baum/).
- Kapitel 2 `reihen` (9-10, später): `feld-array` requires `variable` (Strang algorithmen) → Wiederholung `variable`.

### Seiten und Voraussetzungen

| Kapitel | Seite | Baustein | Voraussetzung, die die App nicht übt |
|---|---|---|---|
| netze | das-brauchst-du | recap informatik/baum | – |
| netze | graph | graph | baum (Wiederholung davor) |
| netze | pfeile | graph | – |
| netze | hypertext | hypertext | – |
| netze | stadtfuehrer | hypertext | urheberrecht (kein requires; Link zur Karte) |
| reihen (später) | das-brauchst-du, feld | recap informatik/variable, feld-array | variable |

### Quellen (selbst geöffnet)

- GI Bildungsstandards Sek I 2025, §4.3 SV-4: „netzartige Strukturen“ (kein Wort Graph, Hypertext).
  https://www.mnu.de/images/fachbereiche/Informatik/Bildungsstandards_Sek_I_2025__pdf-A_.pdf
- BY LehrplanPLUS Gymnasium NT 7, 2.1 „Vernetzte Informationsstrukturen“: Fachbegriffe Hypertext, Verweis, Graph;
  „Graph, bestehend aus Knoten und Kanten“. https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/7/nt_gym
- HE KC Informatik Sek I 2021, S. 16: „stellen Hypertextstrukturen grafisch dar“.
  https://www.fortbildung.kultus.hessen.de/sites/kultus.hessen.de/files/2021-08/kch_informatik.pdf
- NRW KLP Informatik 5/6 (2021) und WP Gymnasium (2023): nichts zu Graph oder Hypertext.
- England KS3 computing: kein graph, node, hypertext. Englische Begriffe daher wie Berners-Lee.
- Berners-Lee 1989, „Information Management: A Proposal“: „We can call the circles nodes, and the arrows links.“;
  Abschnitt „The problem with trees“. https://www.w3.org/History/1989/proposal.html
- Ungeprüft und weggelassen: Nelson 1965 als Erfinder des Wortes (DOI 10.1145/800197.806036, Volltext 403).

### Didaktik

- Galerie der Datenstrukturen wächst: Stand 1 Baum (Recap), Stand 2 Graph (Ende `graph`), Stand 3 Hypertext
  (Ende `stadtfuehrer`), Stand 4 Feld (Kapitel 2). Leitfrage je Struktur: Wie finde ich ein Element?
- Erst unplugged (Namenskarten und Fäden), dann am Rechner (Netzbauer, Hypertextbaukasten).
- Klasse 7b, Jona, Selin, Mia (alle 12), Tom, Ben, Ali, Lea, Frau Berg; Geschichte im Klassenchat: Busnetz,
  Freundesnetz, Verweise, Stadtführer für die neuen Fünfer.

### Wie Lernende hinkommen, welcher Fehler abgefangen wird

- `graph`: Sie prüfen am Busnetz, ob es ein Baum ist, finden den Kreis und leiten ab: ein Baum ist ein Graph ohne
  Kreis. Fehler: Knoten statt Kanten zählen; Umweg statt kürzestem Weg; „Graph = Diagramm mit Achsen“.
- `pfeile`: Aus einer Verweistabelle zeichnen sie Pfeile. Fehler: Pfeil falsch herum; Verweis gilt in beide Richtungen.
- `hypertext`: Sie lesen den Stadtführer als Graph, zählen Klicks. Fehler: Hypertext wie ein Buch nur in einer
  Reihenfolge lesen; Startseite = einzige Seite mit Verweisen.
- `stadtfuehrer`: Sie bauen ihn selbst nach Bedingungen. Fehler: Seite nicht erreichbar, Sackgasse ohne Rückweg,
  Quellenangabe unvollständig („Internet“ als Quelle).

### Umfang

- Drin: ungerichteter und gerichteter Graph, Weg, Länge eines Weges (Anzahl Kanten), Kreis, Hypertext, Verweis (Link),
  Startseite, Linktext, Quellenangabe fremder Inhalte (kompakt).
- Nicht drin: Baum selbst (#491), HTML (#504), Datenbanktabellen (#498), gewichtete Graphen, Suchalgorithmen.
- Graphen mit 4 bis 6 Knoten; Hypertext mit 5 Seiten. Sprachen de und en.

## Explore

<!--
- Find out what the app teaches, for whom, how much and how it looks. Ask; write no code, run no `create`.
- An answer counts only in the creator's words under "Answers". At most 2 questions per message, one topic each.
-->

### Tasks

- [x] Check the start: the folder `.agents/skills/lernapps-app` exists (else stop and tell the creator that the folder
      was not started with `init`), and `git branch --show-current` prints `work` (else `git switch -c work`).
- [x] Load skill `lernapps-app`. Tell the creator in two sentences what a lernapps app is and where it will live: at
      their own address, free and public, and once listed as a copy on lernapps.net. Say that the technical part
      (GitHub) comes at the end and that you do it.
- [x] Interview: ask the topics "Goal" and "Learners" of "Answers".
- [x] Load skill `lernapps-map-assignment` and read the learning map of the subject as it says. The creator brings
      the content themselves (material, a word list, the pages): note under "Notes" which competencies of the map it
      covers. Else write the skill's assignment, with its story; the creator's yes answers the topics Content and
      Amount. A subject without a map: skip this task and say so.
- [x] Load skill `lernapps-exercise-patterns` and read its reference for the subject. Note under "Notes" how learners
      will practise what the goal names.
- [x] Choose the archetype as skill `lernapps-app` says: read the README of each archetype in question, then tell the
      creator in plain words what the chosen one can and cannot do. Write the archetype and its reason under "Key
      decisions".
- [x] Run `npx --no -- lernapps skills --archetype <name>` with the chosen archetype. It installs the archetype's
      skills and adds the archetype's tasks to this plan.
- [x] Load skill `lernapps-explainer-design`. An explainer has the look of the runtime: write "fixed by the
      archetype" under the topic "Look and feel" of "Answers".
- [x] Interview: ask every other topic of "Answers", in order. Leave out only a topic that an answer of the creator
      already covers, and note which answer. A topic nobody answered is asked once before you write an assumption
      with "(guess)".
- [x] Load skill `lernapps-content-research` and research as it says. Write under "Notes": the strand or subject, the
      competencies by chapter with their ids, the sources you opened.
- [x] Write under "Notes" which competency goes on which page and which pages form a chapter, as "Map the content" of
      skill `lernapps-explainer-design` says. Per page, name the prerequisites the app does not practise.
- [x] Write under "Notes", one line per competency: how learners get there (they derive it, they do not only read it
      off), and which misconception the feedback catches.
- [x] Write under "Notes" the scope: what is in, what is out and why, the data range (for example "all main-group
      elements", never a silent "1–20"), the languages.
- [x] **Checkpoint:** research. Show in plain words: the strand or why none, the competencies by chapter, the didactic
      approach, the scope, every "(guess)", the sources and what is unchecked, the archetype and its reason. Stop and
      wait. Changes: change them, then ask again.
      Creator: Einverstanden, weiter mit dem Plan. Galerie auf der Recap-Seite: ja. „link“ für Verweis: ja. Nelson 1965: weglassen. Urheberrecht als Link zur Karte statt Recap: ja, richtig nach der Karte.

### Answers

Auftraggeber ist der Orchestrator des Epics lernapps/apps#509 (Auftrag lernapps/apps#496); seine Worte:

- Goal: „Ich kann Daten als Graph aus Knoten und Kanten darstellen und einen Hypertext aus Seiten und Verweisen
  beschreiben und erstellen.“
- Learners: „Welle 2 (Stufe 7-8)“; Klasse 7b, alle 12; Vorwissen Baum aus #491.
- Model and focus: „Eine Galerie der Datenstrukturen, die wächst … Jede Struktur wird zuerst mit Fäden und Karten
  gelegt (unplugged) und dann am Rechner gebaut. Die Leitfrage bleibt: Wie finde ich ein Element?“
- Hurdles: „Kürzester Weg: Nenne ‚Weg‘ und ‚Länge eines Weges‘ (Anzahl der Kanten) klar, bevor du danach fragst.“;
  „bei ungerichtet zählt A–B gleich B–A“.
- Content: von mir aus Karte und Quellen; Figuren aus informatik-computer, Baum aus #491.
- Amount: „Kapitel 1 mit 2 Bausteinen. Kapitel 2 (Feld, 9-10) kommt später … Plane es mit, baue es aber nicht.“
- Languages: „Jede App in Deutsch und Englisch“.
- Look and feel: fixed by the archetype.
- Terms: „Verweis (Link)“ auf Deutsch, „link“ auf Englisch; Graph, Knoten, Kante; graph, node, edge, hypertext.
- Finding the app: Graph, Hypertext, Datenstrukturen, Klasse 7/8 (guess, Katalogeintrag macht der Orchestrator).

## Plan

<!--
- Map the confirmed content onto the archetype. No new content questions: a gap in the content goes back to Explore.
- The creator confirms the plan in one read. After the yes you work on your own.
-->

### Tasks

- [x] Map the content as "Map the content" of skill `lernapps-explainer-design` says, and write the result under
      "Content method".
- [x] Choose a pattern per competency as skill `lernapps-exercise-patterns` says, and add it to "Content method".
- [x] Add to "Content method" one line per page, as "Engagement" of skill `lernapps-explainer-design` says: the
      opening task, the change of activity, the reward, the story.
- [x] Add the tasks of Code, each one a piece of work that ends in a commit. First the pattern: one complete page or
      screen, `npx --no -- lernapps plan add --at pattern "<task>"`. Then the others, one call each:
      `npx --no -- lernapps plan add --at pages "<task>"`. Each task says what it builds and what it shows.
- [x] Draw a sketch of each screen, component or interactive exercise: a static SVG or image, or the steps with what
      learners see after each. Keep the files in `.vibe/sketches/`.
- [x] Show the creator, short: goal, competencies by chapter, the Code tasks, the sketches, and the content method in
      plain words (what learners see and do, what the app cannot do). At most 2 questions.
- [x] **Checkpoint:** confirm the plan and the content method. Stop and wait for an explicit yes. Changes: change
      them, then ask again.
      Creator: Ja, so bauen. Die Musterseite graph kommt zuerst. pfeile als zweite Graph-Seite: ja. Freundesliste eindeutig, A–B gleich B–A. Weg und Länge eines Weges klar nennen. Hypertextbaukasten: erste verletzte Bedingung mit betroffener Seite.

### Content method

#### Seiten (Kapitel 1 `netze`)

- `das-brauchst-du` (recap informatik/baum): Chat – Jona findet den Zimmerbaum vom Seeberg (6b). Selbstcheck mit dem
  iCan-Satz von `baum`, Baum kompakt (Kopie `baum-zimmer.svg` aus #491 mit Herkunft), Galerie Stand 1. 1 single-choice.
- `graph`: Busnetz (6 Haltestellen, ein Ring), Freundesnetz mit Namenskarten und Fäden (Anleitung), Graph, Weg, Länge
  eines Weges, Kreis, Merke „Baum = Graph ohne Kreis“, Galerie Stand 2. Übungen: true-false, number Kanten, number
  kürzester Weg, Netzbauer ungerichtet, single-choice „welches ist kein Baum“.
- `pfeile`: Verweise zeigen in eine Richtung → gerichteter Graph, Pfeil; Berners-Lee 1989. Übungen: matching,
  Netzbauer gerichtet, single-choice Erreichbarkeit, multiple-choice Rückweg.
- `hypertext`: Stadtführer als Hypertext: Seite, Verweis (Link), Linktext, Startseite; nichtlinear lesen. Übungen:
  matching, number Klicks, ordering Klickweg, single-choice Buch, true-false Richtung.
- `stadtfuehrer`: Hypertextbaukasten, Quellenangabe (Titel, Urheber, Quelle, Lizenz; Link Karte urheberrecht),
  Galerie Stand 3 + Tabelle „Wie finde ich ein Element?“, Rückblick, Ausblick Feld. Übungen: Baukasten, single-choice
  Quellenangabe, matching Teile, single-choice Sackgasse.

#### Engagement je Seite (Einstieg · Wechsel · Belohnung · Geschichte)

- `das-brauchst-du`: Frage zum alten Zimmerbaum · Bild, Selbstcheck, Frage · „du kennst den Baum noch“ · Chat 7b, Ausblick Busnetz.
- `graph`: „Ist das Busnetz ein Baum?“ · Bild, Fäden legen, rechnen, bauen · eigenes Freundesnetz gebaut, Galerie wächst · Selin plant den Weg zum Schwimmbad.
- `pfeile`: „Kommt Mia von Selins Seite zurück?“ · Tabelle, Pfeile zeichnen, Wege prüfen · Verweisnetz gezeichnet · Mia, Selin, Jona verlinken ihre Seiten.
- `hypertext`: „Wie viele Klicks bis zum Schwimmbad?“ · Graph lesen, Teile zuordnen, Klickweg ordnen · Stadtführer verstanden · Frau Berg stellt das Projekt vor.
- `stadtfuehrer`: „Welche Seite ist eine Sackgasse?“ · bauen, durchklicken, Quelle angeben · eigener Stadtführer, Galerie Stand 3, Rückblick · die 7b gibt ihn den Fünfern.

#### Muster

- Zählen am Bild (number + mistakes: Knoten statt Kanten, Umweg), Zuordnen (matching), Urteilen (true-false mit
  Begründung), Ordnen (ordering Klickweg), Bauen (Komponenten).

#### Bilder (eigene Zeichnung, CC-BY-4.0, Stil #491: Knoten abgerundete Rechtecke, Rand #333 2 px, weiß; Start
hellblau #e8f0fb)

- `baum-zimmer.svg` (Kopie #491): Wiederholung von Wurzel, Knoten, Kante, Blatt als `labelled-figure` mit Legende.
- `busnetz-de.svg`/`-en.svg`: Haltestellen als Knoten, Busstrecken als Kanten, ein Ring. Lernende suchen den Kreis und
  zählen Kanten eines Weges; die Bildunterschrift sagt: Knoten = Haltestelle, Kante = direkte Busfahrt ohne Halt.
- `freunde.svg`: nur Namen; Muster für die Fäden-Aktivität.
- `pfeile.svg`: drei Seiten mit Pfeilen; die Pfeilspitze zeigt zur Zielseite.
- `stadtfuehrer-de.svg`/`-en.svg`: Graph des Stadtführers, Startseite hellblau.
- `galerie-1/2/3.svg`: Bilderrahmen nebeneinander, ohne Text; die Tabelle daneben nennt Struktur und „Wie finde ich ein
  Element?“.

#### Komponenten (Logik `Netz.ts`)

- `Netzbauer`: Knoten als Knöpfe im Kreis; A, dann B antippen legt die Kante A–B (gerichtet A→B) an oder entfernt sie;
  Kantenliste als Text mit „entfernen“. Aufgabe je seed: 5 Namen, 4–6 Kanten, jede Kante genau einmal genannt. check:
  gleiche Kantenmenge (ungerichtet A–B = B–A). reason: erste fehlende Kante, erste zu viele Kante, Pfeil falsch herum.
  Kann nicht: Lage der Knoten bewerten.
- `Hypertextbaukasten`: 5 Seitenkarten (Start, Schule, Bus, Schwimmbad, Bücherei); je Karte Verweise mit Auswahl „Verweis
  auf …“ und Knopf; Vorschau zum Durchklicken ab der Startseite. Aufgabe je seed: Bedingungen (alle Seiten in ≤ k
  Klicks erreichbar, Rückverweis auf die Startseite, ein Pflichtverweis X→Y). check: nur Eigenschaften. reason: erste
  verletzte Bedingung mit der betroffenen Seite. Kann nicht: Inhalte der Seiten schreiben lassen.
- Beide: Tastatur, 44 px, Farben nur `--page-*`, Text ohne JS über `describe`, Tutor-Tabelle, Budget 20 kB.

#### Neues Kapitel

- Kapitel 2 `reihen`: `das-brauchst-du` (recap informatik/variable) und `feld` (feld-array); Schließfächer unplugged,
  Index als Hausnummer, Galerie Stand 4; ordne `chapters: [netze, reihen]`.

## Code

<!--
- Build the app, locally on `work`, on your own. After each task: `plan done`, then one commit with the work and this
  plan. The hooks check each commit; a failing check is fixed from its message, as skill `lernapps-cli` says.
- What you cannot decide: choose, write it under "Key decisions" with "(guess)", go on.
- The creator asks for a change: say your reading in one sentence first, then change every place it holds for
  (`feedback-applied-everywhere`).
-->

### Tasks

- [x] Load skill `lernapps-cli`. Create the app as its section "Create" says:
      `npx --no -- lernapps create --archetype explainer`.
- [x] Fill the content guide `.agents/skills/app-content/SKILL.md` from "Notes" and "Content method": every heading,
      no "FILL IN" left. Commit it before any content.
- [x] Load skill `lernapps-explainer`.
- [x] Load skill `lernapps-content-questions`. Read whole, with your file tool:
      `.agents/skills/lernapps-explainer/references/blocks.md` and
      `.agents/skills/lernapps-explainer/references/exercises.md`. A foreign language: also
      `references/language-tasks.md` in the same folder. A component in the plan: also `references/components.md`.
- [x] Decide whether the app needs `scope`, as "`scope`" in
      `.agents/skills/lernapps-explainer/references/structure.md` says. Write the choice under "Key decisions".
- [x] Musterseite netze/graph in de und en: Klassenchat, Busnetz-Bild, Fäden-Anleitung, Graph/Weg/Kreis, Galerie Stand 2, Komponente Netzbauer (ungerichtet) mit Netz.ts und Test, alle Übungen
<!-- tasks: pattern (1 added): the one page or screen that is the pattern for the others -->
- [x] **Checkpoint:** the pattern page. Load skill `lernapps-learner-check` and do its learner check on the page. Fix
      what it finds. Then show the creator the page and ask whether the others may follow it. Stop and wait. A
      change: change the pattern first.
      Creator: Ja, die übrigen Seiten folgen diesem Muster. Gut, dass der Netzbauer jetzt mehr verlangt als Abschreiben.
- [x] Wiederholung netze/das-brauchst-du: Chat, Selbstcheck baum, baum-zimmer.svg (Kopie #491), Galerie Stand 1, eine Prüffrage
- [x] Seite netze/pfeile: gerichteter Graph, Pfeil, Berners-Lee 1989, Netzbauer gerichtet aus Verweistabelle, Übungen
- [x] Seite netze/hypertext: Stadtführer als Hypertext aus Seiten und Verweisen, Klickwege, Unterschied zum Buch, Übungen
- [x] Seite netze/stadtfuehrer: Komponente Hypertextbaukasten mit Test, Quellenangabe, Galerie Stand 3 mit Tabelle, Rückblick, Übungen
<!-- tasks: pages (4 added): the other pages or screens, after the pattern -->
- [x] Update the content guide so that it describes the app as built (`app-content-matches`).
- [x] Run `npx --no -- lernapps check` until it passes.
- [x] Look at every screen and state, at 360 px and on a desktop, as "Look at the app" of skill `lernapps-cli` says.
      Compare each with its sketch.
- [ ] Do the whole-app check of skill `lernapps-learner-check`. Fix what it finds and write under "Notes" what you
      fixed.

## Commit

<!--
- Put the app on GitHub, publish it with the creator's yes, then list it. A push to `main` publishes.
- Open the pull requests (to `main`, to the catalog) without asking: they publish nothing.
- The creator asked to stop before publishing (a trial): stop here and say so.
-->

### Tasks

- [ ] Load skill `lernapps-explainer-self-assessment`. Add the self-assessment as it says, or write under "Key
      decisions" why the app has none. Commit.
- [ ] Load skill `lernapps-github`. Set up the repository and Pages as it says. Ask for the repository's name and
      every click only the creator can make, in one message.
- [ ] Push `work`, open the preview pull request and see its checks to green, as skill `lernapps-github` says.
- [ ] **Checkpoint:** publish. Show what the app does and the preview link from the comment "Vorschau der App". Ask
      whether it may go online. Stop and wait for the yes.
- [ ] Load skill `lernapps-commit`. Publish as skill `lernapps-github` says: `work` into `main` as one squash commit,
      the run of `Pages` watched to its end.
- [ ] Open the address the job `deploy` printed and confirm that the app shows. Never use a derived address.
- [ ] Load skill `lernapps-listing`. Write the entry under "Entry draft" as it says, with the creator's answer to
      "Finding the app".
- [ ] Fill the retrospective.
- [ ] Commit this plan on `main` and push it: the listing check and the review read it there.
- [ ] **Checkpoint:** list. Open the listing pull request as skill `lernapps-listing` says, without asking first: the
      pull request is the review. See it to "bestanden", then show the creator the pull request and its result.
- [ ] If the plan changed since its last push, commit it on `main` and push again.

### Entry draft

<!-- YAML valid against the entry schema the listing skill names. Only known values, never invented. -->

```yaml
```

## Retrospective

<!-- At the end of Commit, before the listing pull request. Facts, short, no names. Read by review and evals. -->

### Phases reached

<!-- Last phase completed, checkpoints passed. E.g. "commit; confirmed, published". -->

### Creator turns after the plan

<!-- Number of creator messages after the confirmation, topic of each. Target: at most 3. -->

### Where I had to guess

<!-- Each gap in plan, skills, messages or answers, and your choice. "None" if none. -->
