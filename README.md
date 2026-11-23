# Specman Web

Portierung von [Specman](https://github.com/j-specman/specman) (Java/Swing-Editor für Use-Case-Abläufe als
Nassi-Shneiderman-Diagramme) nach TypeScript. Stand: Phase 1 (Bearbeiten ohne Änderungsverfolgung) abgeschlossen, siehe `PLAN-phase1.md`. Phase 2 (Änderungsverfolgung) läuft, siehe `PLAN-phase2.md`.

## Befehle

    npm run dev          # Vorschau, Port 5180 (5173 = EvoSim, 5174 = evosim-qwen)
    npm test             # Parser-, Reader- und Roundtrip-Tests über test/fixtures
    npm run gen:parser   # Parser aus grammar/SpecmanModel_V002.g4 neu erzeugen (antlr-ng)
    node scripts/shot.cjs <beispiel.nsd> <zoom|Datei> <out.png>   # Screenshot zum Vergleich mit doc/*.png
    node scripts/e2e-edit.cjs   # Browser-Prüfungen fürs Bearbeiten gegen den laufenden Dev-Server
    node scripts/e2e-changes.cjs   # Browser-Prüfungen der Änderungsverfolgung

## Aufbau

- `src/core` – ohne DOM: generierter Parser, Modell (`model.ts`, entspricht `specman.model.v002`),
  Reader (`ModelParser_V002`), Writer (`ModelSerializer_V002`), Change-Set-Farben, Edit-Kern mit Undo/Redo
  (`editor.ts`), Schrittnummern (`numbering.ts`) und -verweise (`steplinks.ts`), Pfade zu Areas (`paths.ts`),
  Operationen auf Areas (`areas.ts`) und Schritten (`steps.ts`), Übernehmen/Verwerfen/Zusammenführen/Review
  (`tracking.ts`), Aufzeichnen beim Anlegen und Löschen (`recording.ts`). Die Text-Markups bearbeitet dabei `ui/texttrack.ts` über das DOM (Tests unter jsdom).
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
- Beim Löschen eines Break-Schritts verschwinden die Catch-Sequenzen und Co-Catches mit, die ihn fangen.
- Übernehmen und Verwerfen laufen über das Modell. Gelöschte Areas behalten ihren aktuellen Text, die Anzeige verwirft
  dafür die Änderungen des Lösch-Sets (im Original: `deletionBackup`). Den zweiten Durchlauf nach dem Zusammenführen
  von Texten (`EditContainer.aenderungenVerwerfen`) gibt es auch beim Übernehmen, sonst blieben Markierungen stehen.
- Die erste Text-Area eines Inhalts wird beim Verwerfen nicht entfernt, sondern geleert. Ebenso bleibt sie beim
  Markieren als gelöscht stehen, auch wenn sie im selben Change Set hinzugefügt wurde (das Original entfernt sie).
- Ob aufgezeichnet wird, steht im Diagramm (`changeModeEnabled`, `changeSetName`), die Operationen fragen es selbst ab.
- Fehlermeldungen (z. B. „Der letzte Schritt kann nicht entfernt werden.“) erscheinen als Dialog, das Original
  gibt manche nur auf der Konsole aus (Sonst-Zweig, mindestens zwei Fälle).
- Bilder: Rastergrafiken werden wie im Original als PNG gespeichert (Umwandlung über ein Canvas), SVG-Dateien als
  Vektorgrafik. Kopieren und Ausschneiden von Bildern fehlt noch (Zwischenablage kommt später).
- Reader: Die Zusatz-Areas eines Listenpunkts behalten ihre Reihenfolge (Java sortiert nach Text/Tabelle/Bild).
- Writer: schreibt standardmäßig Version 1.4.0 ins Envelope, beim Roundtrip die Version der gelesenen Datei.
- Nicht in Phase 0: Bearbeiten, PDF-Export, PlantUML-Rendering (Platzhalter mit Quelltext), JSON-Format v1.

## Lizenzen

Code des Originals: BSD-3-Clause, siehe `LICENSE-specman.txt`. Die Schriften in `public/fonts` stammen aus dem
Original-Repo, ebenso die Icons in `public/icons` (Material Symbols unter Apache 2.0, siehe
`public/icons/material/LICENSE`, und die Schritt-Icons von Jan Leßner). Roboto und Courier Prime stehen unter offenen Lizenzen, **Sitka ist eine Microsoft-Schrift**
(„All Rights Reserved“). Vor einer Veröffentlichung klären oder ersetzen. Für Browser wurden die Tabellen der
Sitka-Dateien mit `scripts/fix-fonts.cjs` repariert.
