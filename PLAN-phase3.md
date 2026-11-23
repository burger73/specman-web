# Phase 3: Lücken aus Phase 1 und 2

Abgestimmt mit Markus am 23.11.2026. Grundlage ist Phase 2 (Commits 2.1–2.6 auf main).
Auf Markus' Wunsch kommen die Lücken vor PDF/PlantUML. Die Phasen verschieben sich dadurch:

| Phase | Inhalt |
|---|---|
| 1 | Bearbeiten ohne Änderungsverfolgung (Tag `phase-1`) |
| 2 | Änderungsverfolgung, Catch-Sequenzen |
| **3** | **Lücken aus Phase 1 und 2, Schrittpalette in der Breite ziehbar** |
| 4 | PDF-Export, PlantUML (rendern und bearbeiten) |
| später | Drag & Drop, Morphing, Metatags konfigurieren und per Ziehen umsortieren, Suchen/Ersetzen |

Vorgehen wie bisher: Java gezielt lesen, Bedienung nach dem *Code* des Originals. Kleine Commits 3.1, 3.2, … mit
Vitest-Tests und Browser-Prüfungen (`scripts/e2e-*.cjs`). Abweichungen kommen ins README.

## Inhalt

### 3.1 Schrittpalette links: Breite ziehen (neu)

- **Neu, nicht im Original:** Der rechte Rand der Palette lässt sich mit der Maus ziehen. Ist sie schmaler als die
  Beschriftungen, werden diese abgeschnitten, bis schließlich nur noch die Icons bleiben. Mindestbreite: Icons
  (ca. 34 px), Höchstbreite ca. 300 px. Das kommt als Abweichung ins README.
- Nicht dabei (Markus, 23.11.2026): der Original-Knopf zum Ein-/Ausblenden der Beschriftungen
  (`StepButtonBar.toggleShowText`) und das Merken der Breite.

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

**Umgesetzt (3.2):** alle oben genannten Grenzen, dazu zwei weitere `SpaltenResizer` des Originals, die im Plan noch
fehlten: die Diagrammbreite (rechter Rand der Hauptsequenz, `Specman.breitenAnpasser`) und die Gesamtbreite einer
Tabelle (rechter Tabellenrand, `tableWidthPercent`). Beim Ziehen steht wie im Original eine gestrichelte Linie,
übernommen wird beim Loslassen, Escape bricht ab. Nebenbei korrigiert: Pixelwerte (Balken, If-Spalte,
Co-Catch-Balken) wurden bisher ohne Umrechnung vom gespeicherten Zoom gezeichnet, und neue Schleifen/If-Schritte
bekommen ihre Pixelwerte jetzt wie in `Specman.newStepPostInit` beim gespeicherten Zoom.

### 3.3 Pfeiltasten zwischen den Textbereichen (`editarea/focusmover`)

- Pfeil hoch/runter/links/rechts am Rand eines Texts springt in den benachbarten Textbereich (`EditAreaNeighbourFinder`,
  `CrossEditAreaFocusMoverFromText`, `…FromImage`), auch über Bilder und Tabellenzellen hinweg.
- Links/Rechts überspringen einen Schrittverweis als Ganzes (`Left/RightKeyPressedHandler`, `skipToStepnumberLink*`).

**Umgesetzt (3.3):** `ui/focusmove.ts`. Laut Java-Code springen nur Hoch/Runter über Bereichsgrenzen, Links/Rechts
am Textrand nicht (anders als oben im Plan notiert); Links/Rechts überspringen nur Schrittverweise (normal und
geändert), wie im Original auch mit Umschalt (die Auswahl fällt dabei weg). Die Nachbarsuche ist ein direkter Port
von `EditAreaNeighbourFinder` (`findNeighbour`, getestet ohne DOM): Kandidaten sind bearbeitbare Texte und nicht
gelöschte Bilder, die sichtbar sind, also nicht in zugeklappten Schritten. Überlappende Bereiche haben Vorrang, deshalb
führt Runter aus dem Bedingungstext eines If-Else immer in den Nein-Zweig. Die gewünschte Spalte (Swings magic caret
position) bleibt nach einem Sprung gemerkt, solange die Schreibmarke dort steht, wo der Sprung sie abgesetzt hat;
Bilder merken sich die x-Position in `data-navigation-x`. Ob die Schreibmarke in der ersten bzw. letzten Zeile steht,
ergibt sich aus den Zeilenrechtecken des Texts.

### 3.4 Schrittverweise anlegen (`StepnumberLinkAction`, `StepnumberLinkPanel`/`-Dialog`)

- Knopf in der Einfüge-Gruppe, Dialog mit den Schritten zur Auswahl, der Verweis entsteht am Cursor.
- Bei eingeschalteter Verfolgung als `ChangedSteplink` des Sets.
- Klick auf einen Verweis springt zum Schritt (`TextEditArea.scrollToStepnumber`), ein defekter Verweis meldet sich.
  Das fehlt bisher ganz.

**Umgesetzt (3.4):** `ui/steplinkdialog.ts`, Hilfen im Kern in `core/steplinks.ts` (`stepChoices`, `filterStepChoices`,
`stepIdByNumber`). Die Klassen stehen im Original im SHEF-Paket `net.atlanticbb.tantlinger.ui.text.actions`. Knopf
„Link auf Schrittnummer...“ (Icon `jump_to_element`) hinter Tabelle und Bild. Der Dialog listet wie
`Specman.listAllSteps` alle Schritte samt Catch-Sequenzen, nach Nummer sortiert (`StepNumber.compareTo`), als
„Nummer - Text“ gekürzt auf 60 Zeichen. Der Filter sucht im ganzen Text ohne Rücksicht auf Groß-/Kleinschreibung.
Ein Klick fügt ein, Schließen oder Enter brechen ab. Eingefügt wird an der Schreibmarke mit dem Format davor, steht
dort schon ein Verweis, kommt ein Leerzeichen dazwischen; mit Verfolgung als `ChangedSteplink` des Sets. Das ist ein
Undo-Schritt. Strg+Klick auf einen Verweis setzt die Schreibmarke an den Anfang des Zielschritts
(`EditContainer.scrollTo`), ein defekter Verweis („?“) meldet „Springen nicht möglich“. Mit gedrückter Strg-Taste
zeigt der Mauszeiger über Verweisen eine Hand, der Tooltip lautet „STRG+Klicken, um dem Link zu folgen“.

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

**Umgesetzt (3.5):** `ui/textformat.ts`, Übernahme ins Modell über `applyFormat` in `ui/textinput.ts` (ein Undo-Schritt
je Formatierung). Die Gruppe Text folgt der Reihenfolge von `createToolbarComponents`: Absatzformat (Combo, 120 px),
Schriftart (Combo, 150 px), Schriftgröße (Knopf mit Menü), Farbe..., fett, kursiv, unterstrichen, die vier
Ausrichtungen, dazu Styles löschen. Die Listen stehen jetzt wie im Original vorn in der Gruppe Einfügen. Die
SHEF-Aktionen liegen nur kompiliert vor; sie wurden mit CFR dekompiliert und zusätzlich auf einem kopflosen JEditorPane
ausgeführt (`scripts/swing-oracle/oracle.sh`). Daraus: Absatzformat setzt das Tag je berührtem Absatz und behält
dessen Attribute, Text ohne Block wird eingepackt, Vorformatiert fasst den Leerraum zusammen. Ausrichtung setzt
`align` am Absatz, Text direkt im Body bleibt dabei unverändert (Swings `p-implied` unter `body`). Schriftgröße
„Mittel“ schreibt `<font size="4">` (Eintrag i ergibt size i+1), Sitka entfernt `face`. Styles löschen
(Strg+Umschalt+Y) entfernt alle Zeichenformate einschließlich Links. Für fontName, fontSize und foreColor
erzeugt Chromes `execCommand` dasselbe HTML wie Swing. formatBlock, justify* und removeFormat passen nicht (CSS statt
`align`, Attribute gehen verloren, Links bleiben), sie sind selbst geschrieben. Tastenkürzel wie im Menü Format:
Alt+D, Alt+Enter, Alt+1–6, Alt+R, Alt+Q. Die Absatz-Combo und die Knöpfe für Ausrichtung, fett, kursiv und
unterstrichen folgen der Schreibmarke, das Größenmenü markiert die Größe an der Schreibmarke. Die Schrift-Combo
zeigt wie im Original die zuletzt gewählte Schrift. Nicht Teil von 3.5: das Menü Format (Schrift-Dialog, Stil-Untermenü,
Tabellen-Menü), weil Specman Web keine Menüleiste hat.

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
- Kopieren, Ausschneiden, Einfügen von Schritten (`CopyStepOp`, `CutStepOp`, `PasteStepsOp`): eingefügt wird hinter dem
  Schritt. Neue IDs, Schrittverweise und Nummern werden nachgezogen. Beim Ausschneiden eines Schritts, dessen
  Break-Schritte außerhalb gefangen werden, kommt die Rückfrage `msg.cut.external.catches`. Mit Verfolgung ist
  Ausschneiden ein Markieren und Eingefügtes hinzugefügt (`InternalPasteChangemarksAdjuster`, gemeinsam mit 3.7).
  Kopiert wird auch als Text bzw. HTML für andere Programme (Original prüfen).
- Tags: Untermenü mit den konfigurierten Tags zum Zuweisen (schon vorhandene gesperrt). Dazu am Tag selbst den
  Freitext per Klick bearbeiten (`GenericMetaTag`, `NoteEditorPopup`) und das Tag-Kontextmenü
  (`MetaTagContextMenu`: Bearbeiten, links/rechts, Löschen). Nicht dabei: „Tags konfigurieren…“ (Konfigurationsdialog)
  und Umsortieren per Ziehen, beides kommt mit der Metatag-Verwaltung später. Der Menüpunkt fehlt solange.

### 3.9 Rest aus Phase 2

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
8. 3.8 Kontextmenü: Löschen, Verschieben, flache Nummerierung, Link kopieren
9. 3.8 Kontextmenü: Schritte kopieren, ausschneiden, einfügen
10. 3.8 Kontextmenü: Tags zuweisen, Freitext, Tag-Kontextmenü

## Entschieden (Markus, 23.11.2026)

1. Text-Werkzeuge (3.5) vollständig wie im Original, also auch Schriftart und Schriftfarbe.
2. Schritte kopieren, ausschneiden und einfügen kommt mit in Phase 3 (3.8).
3. Tags im Kontextmenü: Die Entscheidung hat Markus mir überlassen. Zuweisen, Freitext und Tag-Kontextmenü kommen in
   Phase 3, das Konfigurieren später (siehe 3.8).
4. Altes Dateiformat v1 wird nicht portiert.
5. Palette: nur das Ziehen der Breite, ohne den Original-Knopf für die Beschriftungen und ohne Merken der Breite.

## Weitere Funktionen des Originals, keiner Phase zugeordnet

Zur Vollständigkeit, beim Durchsehen des Java-Codes aufgefallen:
- Vogelperspektive (`BirdsViewSpecmanOpButton`)
- zuletzt geöffnete Dateien (`RecentFiles`), automatisches Speichern und Arbeitskopie (`AutoSaveOp`, `AutoLoadOp`,
  `WorkingCopyWatcher`)
- Specman-Links und Aliase (`specman/link`: `SpecmanLink`, `LinkAliases`, Alias-Dialoge, Folgen von Links zwischen
  Diagrammen)
- Graphviz-Export (`ExportGraphvizSpecmanOp`)
