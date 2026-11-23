# Phase 1: Bearbeiten (ohne Änderungsverfolgung)

Abgestimmt mit Markus am 23.11.2026. Grundlage ist Phase 0 (main, Commit 0.7: lesende Darstellung, Reader/Writer, 46 Tests).

## Phasen-Aufteilung

| Phase | Inhalt |
|---|---|
| **1** | Bearbeiten **ohne** Änderungsverfolgung, Speichern, Undo/Redo |
| 2 | Änderungsverfolgung (aufzeichnen, übernehmen/verwerfen, Change Sets, Review) |
| 3 | PDF-Export, PlantUML-Rendering |
| später | Drag & Drop, Zwischenablage für Schritte/Tabellen, Morphing, Metatag-Verwaltung, Suchen/Ersetzen |

## Design

1. **Das Modell ist die Wahrheit.** Jede Operation ändert das TS-Modell (`src/core`), danach wird neu gezeichnet.
   Der View-zentrierte Swing-Aufbau wird bewusst nicht 1:1 portiert, die Bedienung aber schon (innere Abweichung,
   im README unter „Bewusste Abweichungen“ eintragen). Operationen liegen DOM-frei in `src/core` und sind mit Vitest testbar.
   Writer- und Roundtrip-Tests müssen grün bleiben.
2. **Undo/Redo über Schnappschüsse** (`structuredClone` des Diagramms vor jeder Operation) statt über die rund 40
   Undo-Klassen des Originals. Tippen wird pro Textbereich zu einem Undo-Schritt zusammengefasst.
3. **Text bearbeiten mit `contenteditable` pro TextEditArea.**
   - Nur die Formatierungen des Originals: fett, kursiv, unterstrichen, Listen. Durchgestrichen bleibt gesperrt
     (kollidiert im Original mit den Löschmarkierungen, siehe `todos-specman.txt`).
   - Beim Tippen wird nicht neu gezeichnet. Strukturelle Operationen zeichnen neu und stellen danach den Fokus
     wieder her (über Area- bzw. Schritt-ID).
   - Markups (Schrittverweise) nach dem Bearbeiten neu berechnen. Achtung: Markup-`to` ist inklusiv.
   - Eingaben über das vorhandene `src/ui/sanitize.ts` auf das erlaubte HTML zurückführen.
4. **Schritt-Operationen** über einen Werkzeugstreifen links (wie `StepButtonBar.java`). Die Kopfzeile wird zur
   Toolbar (wie `DiagramToolBar.java`, aber nur mit den Phase-1-Funktionen).
   - Neuen Schritt **hinter dem fokussierten** einfügen (wie `AbstractCreateStepOpButton.insertAfter`): einfach,
     While, While-While, If, If/Else, Case, Sequenz, Break
   - Case-Zweig hinzufügen, Schritt löschen, Einfärben (`ToneOpButton`), Rahmenart umschalten
     (`ToggleBorderTypeOpButton`), alle auf- und zuklappen
   - Catch-Sequenzen (Break ↔ Catch, braucht einen Dialog wie `CatchLinkDialog`) ans Ende von Phase 1, notfalls in Phase 2
   - Neue Schritte bekommen eindeutige IDs. Die IDs bestehender Schritte bleiben stabil (Specman-URLs).
5. **Speichern:** Mit der File System Access API (Chrome/Edge) in dieselbe Datei zurück, sonst als Download.
   Dazu „Neu“ mit einem leeren Diagramm. Hinweis bei ungespeicherten Änderungen (`beforeunload`).
6. **Bestehende Änderungsmarkierungen** bleiben beim Bearbeiten unangetastet, wie im Original bei ausgeschalteter
   Verfolgung.

## Vorgehen

- Kleine Commits 1.1, 1.2, … wie in Phase 0, jeweils mit Modell-Tests. Die UI per Playwright-Screenshot prüfen
  (`scripts/shot.cjs`).
- Java in `~/specman-orig` nur dort lesen, wo das Verhalten unklar ist.
- Nur lokales git (main), kein GitHub. Firmen-Dateien nicht verwenden.

Vorschlag für die Reihenfolge:
1. 1.1 Edit-Kern: Undo-Stack mit Schnappschüssen, Dirty-Flag, Neu zeichnen mit Fokus-Wiederherstellung
2. 1.2 Speichern und Neu
3. 1.3 Text bearbeiten (contenteditable, Formatierungen, Markups nachziehen)
4. 1.4 Schritte einfügen und löschen (alle Arten), Case-Zweig
5. 1.5 Einfärben, Rahmenart, alle auf- und zuklappen
6. 1.6 Tabellen (einfügen, Zeilen/Spalten einfügen und löschen)
7. 1.7 Bilder einfügen (Datei, Zwischenablage), Skalieren
8. 1.8 Catch-Sequenzen (optional, notfalls Phase 2)

## Entschieden

- Tabellen und Bilder gehören zu Phase 1 (Markus, 23.11.2026).
