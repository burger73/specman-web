# Specman Web

Portierung von [Specman](https://github.com/j-specman/specman) (Java/Swing-Editor für Use-Case-Abläufe als
Nassi-Shneiderman-Diagramme) nach TypeScript. Stand: Phase 1 (Bearbeiten) in Arbeit, siehe `PLAN-phase1.md`.

## Befehle

    npm run dev          # Vorschau, Port 5180 (5173 = EvoSim, 5174 = evosim-qwen)
    npm test             # Parser-, Reader- und Roundtrip-Tests über test/fixtures
    npm run gen:parser   # Parser aus grammar/SpecmanModel_V002.g4 neu erzeugen (antlr-ng)
    node scripts/shot.cjs <beispiel.nsd> <zoom|Datei> <out.png>   # Screenshot zum Vergleich mit doc/*.png

## Aufbau

- `src/core` – ohne DOM: generierter Parser, Modell (`model.ts`, entspricht `specman.model.v002`),
  Reader (`ModelParser_V002`), Writer (`ModelSerializer_V002`), Change-Set-Farben, Edit-Kern mit Undo/Redo
  (`editor.ts`), Schrittnummern (`numbering.ts`), Pfade zu Areas (`paths.ts`)
- `src/ui` – Darstellung nach den Swing-Views, Markups, HTML-Bereinigung
- `test/fixtures` – die V2-Beispieldateien aus dem Original-Repo

## Bewusste Abweichungen vom Original

- Bearbeiten: Das Modell ist die Wahrheit. Jede Operation ändert das TS-Modell, danach wird neu gezeichnet. Im
  Original halten die Swing-Views den Zustand und das Modell entsteht erst beim Speichern. Die Bedienung folgt
  trotzdem dem Original.
- Undo/Redo über Schnappschüsse des ganzen Diagramms statt über die Undoable*-Klassen. Auf- und Zuklappen ist wie
  im Original kein Undo-Schritt und bleibt bei Undo/Redo erhalten.
- Nach dem Speichern bleibt die Undo-Historie erhalten (das Original verwirft sie).
- Ein leeres Diagramm (ohne Schritt) lässt sich nicht speichern, weil die Grammatik mindestens einen Schritt verlangt.
- Speichern schreibt mit der File System Access API in die geöffnete Datei zurück. Das gibt es nur in Chrome/Edge
  und nur im sicheren Kontext (https oder localhost). Sonst wird die Datei heruntergeladen.
- Reader: Die Zusatz-Areas eines Listenpunkts behalten ihre Reihenfolge (Java sortiert nach Text/Tabelle/Bild).
- Writer: schreibt standardmäßig Version 1.4.0 ins Envelope, beim Roundtrip die Version der gelesenen Datei.
- Nicht in Phase 0: Bearbeiten, PDF-Export, PlantUML-Rendering (Platzhalter mit Quelltext), JSON-Format v1.

## Lizenzen

Code des Originals: BSD-3-Clause, siehe `LICENSE-specman.txt`. Die Schriften in `public/fonts` stammen aus dem
Original-Repo, ebenso die Icons in `public/icons` (Material Symbols unter Apache 2.0, siehe
`public/icons/material/LICENSE`, und die Schritt-Icons von Jan Leßner). Roboto und Courier Prime stehen unter offenen Lizenzen, **Sitka ist eine Microsoft-Schrift**
(„All Rights Reserved“). Vor einer Veröffentlichung klären oder ersetzen. Für Browser wurden die Tabellen der
Sitka-Dateien mit `scripts/fix-fonts.cjs` repariert.
