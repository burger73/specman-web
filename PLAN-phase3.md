# Phase 3: Lücken aus Phase 1 und 2

**Entwurf vom 23.11.2026, noch nicht mit Markus abgestimmt.** Grundlage ist Phase 2 (Commits 2.1–2.6 auf main).
Auf Markus' Wunsch kommen die Lücken vor PDF/PlantUML. Die Phasen verschieben sich dadurch:

| Phase | Inhalt |
|---|---|
| 1 | Bearbeiten ohne Änderungsverfolgung (Tag `phase-1`) |
| 2 | Änderungsverfolgung, Catch-Sequenzen |
| **3** | **Lücken aus Phase 1 und 2, Schrittpalette in der Breite ziehbar** |
| 4 | PDF-Export, PlantUML (rendern und bearbeiten) |
| später | Drag & Drop, Morphing, Metatag-Verwaltung, Suchen/Ersetzen (falls nicht in Phase 3 vorgezogen, siehe Fragen) |

Vorgehen wie bisher: Java gezielt lesen, Bedienung nach dem *Code* des Originals. Kleine Commits 3.1, 3.2, … mit
Vitest-Tests und Browser-Prüfungen (`scripts/e2e-*.cjs`). Abweichungen kommen ins README.

## Inhalt

### 3.1 Schrittpalette links: Breite ziehen (neu) und Beschriftung ein/aus (Original)

- **Neu, nicht im Original:** Der rechte Rand der Palette lässt sich mit der Maus ziehen. Ist sie schmaler als die
  Beschriftungen, werden diese abgeschnitten, bis schließlich nur noch die Icons bleiben. Mindestbreite: Icons
  (ca. 34 px), Höchstbreite ca. 300 px. Die Breite merkt sich der Browser (`localStorage`). Das kommt als Abweichung
  ins README.
- **Original (`StepButtonBar.toggleShowText`):** Unten in der Palette sitzt ein Knopf, der die Beschriftungen ein- und
  ausblendet (Preference `stepButtonBarShowText`). Ohne Beschriftung steht der Text als Tooltip da.
- Doppelklick auf den Ziehrand stellt die Standardbreite wieder her (neu).

### 3.2 Spaltenbreiten ziehen (`SpaltenResizer`, `UndoableSpaltenbreiteAngepasst`)

Im Original lassen sich alle Trennlinien zwischen Spalten mit der Maus verschieben, jede Änderung ist ein Undo-Schritt:
- If-Else: Grenze zwischen Ja- und Nein-Zweig (`ifWidthRatio`)
- Case: Grenzen zwischen allen Zweigen (`columnWidthRatios`)
- While / While-While: Breite des Schleifenbalkens (`barWidth`)
- If: Breite der leeren linken Spalte (`emptyWidth`)
- Catch-Bereich: Grenzen zwischen den Catch-Sequenzen (`sequencesWidthPercent`) und der rechte Balken neben den
  Co-Catch-Überschriften (`headingRightBarWidth`, `CatchSchrittSequenzView.spaltenbreitenAnpassenNachMausDragging`)
- Tabellen: Spaltengrenzen (`columnsWidthPercent`)

Grenzen und Rundung je Element nach dem Java-Code (Mindestbreiten, Prozent vs. Pixel beim gespeicherten Zoom).

### 3.3 Pfeiltasten zwischen den Textbereichen (`editarea/focusmover`)

- Pfeil hoch/runter/links/rechts am Rand eines Texts springt in den benachbarten Textbereich (`EditAreaNeighbourFinder`,
  `CrossEditAreaFocusMoverFromText`, `…FromImage`), auch über Bilder und Tabellenzellen hinweg.
- Links/Rechts überspringen einen Schrittverweis als Ganzes (`Left/RightKeyPressedHandler`, `skipToStepnumberLink*`).

### 3.4 Schrittverweise anlegen (`StepnumberLinkAction`, `StepnumberLinkPanel`/`-Dialog`)

- Knopf in der Einfüge-Gruppe, Dialog mit den Schritten zur Auswahl, der Verweis entsteht am Cursor.
- Bei eingeschalteter Verfolgung als `ChangedSteplink` des Sets.
- Klick auf einen Verweis springt zum Schritt (`TextEditArea.scrollToStepnumber`), ein defekter Verweis meldet sich.
  Das fehlt bisher ganz.

### 3.5 Text-Werkzeuge der Toolbar (SHEF `HTMLEditorPane.createToolbarComponents`)

Bisher portiert: fett, kursiv, unterstrichen, Listen. Im Original stehen außerdem:
- Absatzformat (Auswahl: Absatz, Überschrift 1–6 usw.)
- Schriftart (`SpecmanHTMLFontAction`, Auswahl aus den eingebauten Schriften)
- Schriftgröße (`SpecmanFontSizeAction`)
- Schriftfarbe (`HTMLFontColorAction`)
- Ausrichtung links, zentriert, rechts, Blocksatz
- Formatierung entfernen (`ClearStylesAction`)

Alles bleibt auf das HTML beschränkt, das Swing schreibt und liest. Neue Tags und Attribute daher mit dem Writer und einem
Roundtrip prüfen.

### 3.6 Einfüge-Werkzeuge (SHEF Insert-Gruppe)

Bisher portiert: Bild, Tabelle. Im Original stehen außerdem:
- Hyperlink (`HTMLLinkAction`, Dialog mit Text und Adresse)
- Zeilenumbruch (`HTMLLineBreakAction`)
- horizontale Linie (`HTMLHorizontalRuleAction`)
- Sonderzeichen (`SpecialCharAction`)
- Schrittverweis, siehe 3.4
- PlantUML-Diagramm einfügen kommt mit Phase 4.

### 3.7 Zwischenablage für Bilder und Tabellen (`CopyTableOp`, `CutTableOp`, `PasteTableOp`, `ImageClipboardSelection`)

- Kopieren, Ausschneiden und Einfügen eines ausgewählten Bilds bzw. einer ausgewählten Tabelle. Auch Bilder aus anderen
  Programmen einfügen (geht schon) und in andere Programme kopieren.
- Bei eingeschalteter Verfolgung: Ausschneiden markiert, Einfügen ist hinzugefügt. Mitkopierte Änderungsmarkierungen
  passt `Internal/ExternalPasteChangemarksAdjuster` an.

### 3.8 Kontextmenü an der Schrittnummer (`StepnumberContextMenu`)

Das Original hat am Schrittnummern-Label ein Kontextmenü, das bisher ganz fehlt:
- Löschen (wie der Toolbar-Knopf)
- Zweig bzw. Catch-Sequenz nach links/rechts verschieben (`MoveBranchSequenceLeft/RightADBLOp`)
- Co-Catch nach oben/unten (`CatchBereich.moveCoCatchUp/DownUDBL`)
- flache Nummerierung einer Subsequenz an/aus (`flatNumbering`)
- Link auf den Schritt kopieren (`CopyStepLinkMenuItem`, Specman-URL mit Schritt-ID)
- Kopieren, Ausschneiden, Einfügen von Schritten → siehe Frage 2
- Tags zuweisen und konfigurieren → siehe Frage 3

### 3.9 Altes Dateiformat v1 lesen (`model/v001`, `ModelConverterV001V002`)

Dateien mit `modelType … v001` (JSON) beim Öffnen nach V2 umwandeln, gespeichert wird immer V2. Testmaterial im
Original-Repo: `specman-reference-v1.2-model-v1.nsd`, Schema `specman-schema-v1.2-model-v1.json`.

### 3.10 Rest aus Phase 2

- Komposition (Tottasten, IME) robuster markieren, soweit am Desktop machbar
- Tag `phase-2` setzen, sobald Markus Phase 2 abgenommen hat

## Vorschlag für die Reihenfolge

1. 3.1 Palette (klein, sofort spürbar)
2. 3.2 Spaltenbreiten
3. 3.3 Pfeiltasten
4. 3.4 Schrittverweise anlegen und folgen
5. 3.5 Text-Werkzeuge
6. 3.6 Einfüge-Werkzeuge
7. 3.7 Zwischenablage Bilder/Tabellen
8. 3.8 Kontextmenü (ohne bzw. mit Schritt-Zwischenablage, je nach Frage 2)
9. 3.9 Format v1

## Offene Fragen an Markus

1. **Text-Werkzeuge (3.5):** alle wie im Original (auch Schriftart und Schriftfarbe), oder nur Absatzformat, Größe und
   Ausrichtung?
2. **Schritte kopieren/ausschneiden/einfügen:** Das steht im Kontextmenü (3.8) und war bisher für „später“ geplant. Gleich
   in Phase 3 mitnehmen? Die Änderungsmarkierungen beim Einfügen teilt es sich mit 3.7.
3. **Tags im Kontextmenü:** Zuweisen und konfigurieren ist die Metatag-Verwaltung („später“). In Phase 3 nur zuweisen,
   alles oder gar nicht?
4. **Format v1 (3.9):** Gibt es bei dir noch v1-Dateien? Sonst würde ich es streichen bzw. ans Ende schieben.
5. **Palette (3.1):** Passt Ziehen plus der Original-Knopf für die Beschriftung, und soll die Breite pro Browser
   gespeichert werden?

## Weitere Funktionen des Originals, keiner Phase zugeordnet

Zur Vollständigkeit, beim Durchsehen des Java-Codes aufgefallen:
- Vogelperspektive (`BirdsViewSpecmanOpButton`)
- zuletzt geöffnete Dateien (`RecentFiles`), automatisches Speichern und Arbeitskopie (`AutoSaveOp`, `AutoLoadOp`,
  `WorkingCopyWatcher`)
- Specman-Links und Aliase (`specman/link`: `SpecmanLink`, `LinkAliases`, Alias-Dialoge, Folgen von Links zwischen
  Diagrammen)
- Graphviz-Export (`ExportGraphvizSpecmanOp`)
