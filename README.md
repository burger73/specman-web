# Specman Web

Portierung von [Specman](https://github.com/j-specman/specman) (Java/Swing-Editor für Use-Case-Abläufe als
Nassi-Shneiderman-Diagramme) nach TypeScript. Stand: Phase 0, nur lesend.

## Befehle

    npm run dev          # Vorschau, Port 5180 (5173 = EvoSim, 5174 = evosim-qwen)
    npm test             # Parser-, Reader- und Roundtrip-Tests über test/fixtures
    npm run gen:parser   # Parser aus grammar/SpecmanModel_V002.g4 neu erzeugen (antlr-ng)
    node scripts/shot.cjs <beispiel.nsd> <zoom|Datei> <out.png>   # Screenshot zum Vergleich mit doc/*.png

## Aufbau

- `src/core` – ohne DOM: generierter Parser, Modell (`model.ts`, entspricht `specman.model.v002`),
  Reader (`ModelParser_V002`), Writer (`ModelSerializer_V002`), Change-Set-Farben
- `src/ui` – Darstellung nach den Swing-Views, Markups, HTML-Bereinigung
- `test/fixtures` – die V2-Beispieldateien aus dem Original-Repo

## Bewusste Abweichungen vom Original

- Reader: Die Zusatz-Areas eines Listenpunkts behalten ihre Reihenfolge (Java sortiert nach Text/Tabelle/Bild).
- Writer: schreibt standardmäßig Version 1.4.0 ins Envelope, beim Roundtrip die Version der gelesenen Datei.
- Nicht in Phase 0: Bearbeiten, PDF-Export, PlantUML-Rendering (Platzhalter mit Quelltext), JSON-Format v1.

## Lizenzen

Code des Originals: BSD-3-Clause, siehe `LICENSE-specman.txt`. Die Schriften in `public/fonts` stammen aus dem
Original-Repo. Roboto und Courier Prime stehen unter offenen Lizenzen, **Sitka ist eine Microsoft-Schrift**
(„All Rights Reserved“). Vor einer Veröffentlichung klären oder ersetzen. Für Browser wurden die Tabellen der
Sitka-Dateien mit `scripts/fix-fonts.cjs` repariert.
