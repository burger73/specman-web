# Phase 2: Änderungsverfolgung und Catch-Sequenzen

Abgestimmt mit Markus am 23.11.2026. Grundlage ist Phase 1 (Tag `phase-1`, 85 Tests).

## Was das Original kann (nach dem Java-Code)

Die Werkzeuggruppe „Änderungen“ in `DiagramToolBar.java` enthält:

| Element | Java | Verhalten |
|---|---|---|
| Change Set ▾ | `ChangeSetButton` | wählt eins von 5 Change Sets (yellow, lilac, blue, orange, pink), Knopf in der Farbe des Sets |
| Verfolgen | `aenderungenVerfolgen` (Toggle) | schaltet die Aufzeichnung an oder aus. Zustand und Change Set werden in `settings` gespeichert |
| Übernehmen | `AcceptChangesADBLOpButton` | übernimmt **alle Änderungen des aktuellen Change Sets** im ganzen Diagramm (Intro, Hauptsequenz, Outro). Ohne Änderungen erscheint der Hinweis „keine Änderungen“ |
| Verwerfen | `RejectChangesADBLOpButton` | entsprechend Verwerfen, ebenfalls nur für das aktuelle Change Set |
| Zusammenführen | `MergeChangeSetsADBLOpButton`, `ChangeSetMerger` | Popup mit den anderen Sets. Die Änderungen des gewählten Sets werden dem aktuellen Set zugeschlagen (Schritte, Areas, Text-Markups) |
| Review | `ReviewOpButton`, `ReviewCollapser` | klappt alle klappbaren Schritte und Catch-Bereiche ohne Änderungsmarkierungen zu (`zusammenklappenFuerReview`). Aufgeklappt wird dabei nichts |

Übernehmen oder Verwerfen einzelner Änderungen gibt es im Original nicht.

**Aufzeichnung, wenn „Verfolgen“ an ist:**
- Neue Schritte, Case-Zweige, Catch-Sequenzen, Listenpunkte, Tabellen und Bilder bekommen `change=(added, <set>)`.
  Ihr Text bekommt ein `Changed`-Markup über die volle Länge (`TextInit.initialChangeInfo`, `initialModel`).
- **Tippen:** Neuer Text bekommt den Änderungsstil, also ein `Changed`-Markup im aktuellen Set (`aenderungsStilSetzenWennNochNichtVorhanden`).
- **Löschen von Text** (Backspace, Entf, Ausschneiden, Überschreiben einer Auswahl), `AbstractRemovalKeyPressedHandler`:
  - unmarkierter Text wird durchgestrichen und markiert (`<strike>` + `Changed`), nicht entfernt
  - schon geänderter, nicht gestrichener Text wird wirklich entfernt. Laut Code gilt das für **jedes** Change Set, nicht nur das aktuelle
  - schon gestrichener Text bleibt, nur der Cursor springt davor
  - Schrittverweise werden als Ganzes gestrichen (eigene Farbe, `ChangedSteplink`)
- **Schritt löschen** (`DeleteStepADBLOp`): Der Schritt wird samt Inhalt als gelöscht markiert. Ist er selbst hinzugefügt, wird er
  wirklich entfernt. Bilder, Tabellen, Tabellenzeilen und -spalten verhalten sich entsprechend.
- **Verschieben** (Quell-/Zielschritt) entsteht nur per Drag & Drop (`MoveStepOperation`).

**Übernehmen** (je Element, nur aktuelles Set): Hinzugefügtes wird zu normalem Inhalt. Gelöschte Schritte und Quellschritte werden
entfernt, dabei werden Verweise auf sie defekt („?“). Gestrichener Text wird entfernt.
**Verwerfen**: Hinzugefügtes wird entfernt (Verweise werden defekt), Gestrichenes wird wieder normal. Ein Zielschritt wandert zurück an
die Stelle seines Quellschritts.

**Gelöschte Text-Areas:** Die Anzeige zeigt den Originaltext, also mit verworfenen ausstehenden Änderungen. Gespeichert wird aber der
aktuelle Stand (`deletionBackup`, `viewsNachinitialisieren`).

**Datei:** Gelöschter Text ist `<strike>…</strike>` mit einem `Changed`-Markup darüber, hinzugefügter Text nur das Markup.

## Design

1. **Wie in Phase 1 ist das Modell die Wahrheit.** Übernehmen, Verwerfen, Zusammenführen und Review sind Operationen in `src/core`
   und je ein Undo-Schritt (Schnappschuss). Auf Text-Ebene brauchen sie HTML-Bearbeitung (`<strike>`-Bereiche entfernen oder
   auflösen). Dafür kommt ein kleiner Text-Baustein mit `DOMParser` dazu, getestet unter happy-dom. Die Schritt-Ebene bleibt DOM-frei.
2. **Aufzeichnen im Text über `beforeinput`**, analog zu den Java-KeyHandlern:
   - `insertText`/`insertFromPaste`: Der Text landet in einem `data-markup`-Span des aktuellen Sets. Das Zurücklesen
     (`textedit.ts`) erzeugt daraus wie bisher die Markups.
   - `deleteContent*`, `deleteByCut`, Überschreiben einer Auswahl: `preventDefault`, dann die drei Fälle oben pro Abschnitt der
     Auswahl, danach den Cursor setzen.
   - Durchgestrichen bleibt als Formatierung gesperrt, `<strike>` entsteht nur durch die Verfolgung.
   - Grenze: Tastaturen mit Komposition (IME, Android-Autokorrektur) lassen sich per `beforeinput` nicht zuverlässig abfangen.
     Ziel ist der Desktop.
3. **Strukturelle Ops** (`steps.ts`, `areas.ts`, Tabellen, Bilder) bekommen einen Parameter „Verfolgung an, Set X“. Neues
   wird als hinzugefügt angelegt, Löschen markiert statt zu entfernen, jeweils nach den Java-Regeln.
4. **Schrittverweise:** Beim Übernehmen bzw. Verwerfen werden Verweise auf entfernte Schritte defekt („?“), wie
   `markStepnumberLinksAsDefect`. Danach wird umnummeriert, wie schon vorhanden.
5. **Verschieben** gehört weiter zu Drag & Drop (später). Phase 2 zeigt Quell- und Zielschritte an und kann sie übernehmen
   oder verwerfen.
6. **Catch-Sequenzen** (früher 1.8): Knopf in der Schrittleiste, Dialog wie `CatchLinkPanel` mit den Break-Schritten der
   Sequenz, Catch und Co-Catch anlegen und entfernen, mit Verfolgung.

## Vorgehen

Kleine Commits 2.1, 2.2, … mit Vitest-Tests. Die UI wird per `scripts/e2e-edit.cjs` und Screenshots geprüft. Übernehmen und Verwerfen
kommen vor das Aufzeichnen, weil die Beispieldateien (`changetracking.nsd`, Referenzdateien) schon Änderungen enthalten und als
Testmaterial dienen.

1. 2.1 Werkzeuggruppe „Änderungen“: Change-Set-Auswahl, Verfolgen-Schalter (gespeichert in `settings`). Gelöschte Areas
   werden wie im Original angezeigt (Original anzeigen, Backup speichern).
2. 2.2 Übernehmen und Verwerfen (Text, Areas, Tabellenzeilen/-spalten, Schritte, Zweige, Quell-/Zielschritt, defekte Verweise)
3. 2.3 Change Sets zusammenführen, Review
4. 2.4 Aufzeichnen strukturell: neue Schritte, Zweige, Listenpunkte, Tabellen, Bilder und Zeilen/Spalten. Löschen markiert.
5. 2.5 Aufzeichnen im Text: tippen, löschen, Auswahl überschreiben, ausschneiden, einfügen, Enter, Schrittverweise
6. 2.6 Catch-Sequenzen mit Dialog, inkl. Verfolgung

## Entschieden (Markus, 23.11.2026)

1. Verschieben selbst kommt mit Drag & Drop später. Phase 2 zeigt vorhandene Quell- und Zielschritte an und übernimmt oder verwirft sie.
2. Das Aufzeichnen im Text muss am Desktop sauber funktionieren. Tastaturen mit Komposition (Android) dürfen eingeschränkt sein.
3. Catch-Sequenzen kommen am Ende (2.6), damit sie gleich mit Verfolgung entstehen.
4. Löschen von geändertem Text eines fremden Change Sets entfernt ihn wie im Java-Code, statt ihn zu streichen.
