# Übergabe: weiter mit Phase 3, Schritt 3.5 (Text-Werkzeuge)

Stand 23.11.2026. Diese Datei ist der Einstieg für eine frische Session. Ist 3.5 erledigt, die Datei für den nächsten
Schritt fortschreiben oder löschen.

## Wo wir stehen

- Phase 0–2 fertig (Tags `phase-1`, `phase-2`). Phase 3 läuft nach `PLAN-phase3.md`, der Plan ist mit Markus
  abgestimmt.
- Erledigt und gepusht: 3.1 Palette ziehbar, 3.2 Spaltenbreiten, 3.3 Pfeiltasten, 3.4 Schrittverweise anlegen und
  folgen (`b8df866`). 3.1–3.4 hat Markus in der Vorschau abgenommen (3.4 nach dem Fix „Sprungziel nicht unter der Leiste“).
- Strg+Alt+Links/Rechts (Bearbeitungsverlauf) bleibt laut Markus weg.
- Umschalt+Links/Rechts neben einem Schrittverweis hebt die Auswahl auf: bleibt wie im Original (Markus).
- SHEF-Code für 3.5: Markus will JRE (openjdk-headless per apt) + CFR-Decompiler.

## Arbeitsweise (gilt für jeden Schritt 3.x)

- Port nach dem **Java-Code**, nicht nach Kommentaren oder dem Plantext. Weicht der Code vom Plan ab, gilt der Code;
  im PLAN vermerken. Rückfragen an Markus nur bei echten Abweichungen vom Original, keine neue Design-Runde.
- Pro Schritt: ein Commit „3.x: …“, im PLAN beim Abschnitt ein Absatz „**Umgesetzt (3.x):**“, Abweichungen ins
  README (Abschnitt „Bewusste Abweichungen“), Checks in `scripts/e2e-phase3.cjs` anhängen (vor den Schlusschecks).
- Danach `git push origin main` (GitHub burger73/specman-web, Pages baut automatisch).
- Commit-Ende: `Co-Authored-By: Claude …`-Zeile wie in den bisherigen Commits.

## Prüfstand

- `npm test` (Vitest, 142 Tests), `npx tsc --noEmit -p .`
- gegen den Dev-Server (systemd-User-Service `specman-web-dev`, nur auf `http://100.101.105.4:5180/`):
  `node scripts/e2e-edit.cjs` (17), `node scripts/e2e-changes.cjs` (32), `node scripts/e2e-phase3.cjs` (68)
- `scripts/probe-areas.cjs [datei.nsd]` listet die Bereiche mit Lage, `scripts/shot*.cjs` machen Screenshots.
- Testdatei mit allen Elementen: `test/fixtures/specman-reference-v1.4-model-v2.nsd` (Vorschau:
  `?sample=specman-reference-v1.4-model-v2.nsd`). Sie enthält Überschriften, Schriftgrößen, Schriftarten,
  Vorformatiertes und Hyperlinks (Schritte 24–28), also gut für 3.5.
- Playwright-Skripte per Write-Tool anlegen, nicht per Heredoc (die Sicherheitsprüfung schlägt sonst manchmal an).
- `dialog.close()` feuert `close` asynchron: im e2e auf `state: 'detached'` warten.

## 3.5 Text-Werkzeuge: was zu tun ist

Aus dem PLAN: Absatzformat (Absatz, Überschrift 1–6 …), Schriftart, Schriftgröße, Schriftfarbe, Ausrichtung
(links, zentriert, rechts, Blocksatz), Formatierung entfernen. Bisher portiert: fett, kursiv, unterstrichen, Listen
(`ui/textinput.ts`: `format`, `toggleList`). Vollständig wie im Original, also auch Schriftart und -farbe (Markus).

**Java-Quellen:**
- Toolbar-Aufbau: `~/specman-orig/src/main/java/net/atlanticbb/tantlinger/shef/HTMLEditorPane.java`,
  `createToolbarComponents` (ab Zeile 280): Absatz-Combo (`paraActions`, `ParagraphComboRenderer`), Schriftart-Combo
  (`FontFamily.ALL_FONTS`), Schriftgrößen-Knopf mit Popup, `HTMLFontColorAction`, B/I/U, die Ausrichtungen aus
  `HTMLEditorActionFactory.createAlignActionList()`; die Reihenfolge der Knöpfe dort ablesen.
- Im Repo als Quelltext: `…/ui/text/actions/SpecmanHTMLFontAction.java`, `SpecmanFontSizeAction(Factory).java`,
  `HTMLBlockActionWithMarkupRecovery.java`; `FontFamily` steht in `…/ui/text/dialogs/SpecmanHTMLFontDialog.java`.
- **Nur kompiliert:** `HTMLFontColorAction`, `HTMLAlignAction`, `HTMLBlockAction`, `HTMLInlineAction`,
  `ClearStylesAction` stecken in der SHEF-Bibliothek
  `~/specman-orig/local-maven-repository/net/attlanticbb/shef/0.5.0/shef-0.5.0.jar` (nur `.class`). Auf dem NUC ist
  kein JDK installiert. Möglichkeiten: JDK installieren und `javap -c` bzw. einen Decompiler nutzen, oder den
  SHEF-Quelltext (Open Source, Bob Tantlinger) im Netz lesen. Vorher kurz mit Markus klären, was ihm lieber ist.

**Worauf achten:**
- Alles bleibt auf das HTML beschränkt, das Swing schreibt und liest (HTML 3.2: `<font face size color>`,
  `<h1>`–`<h6>`, `<p align=…>`, `<div align=…>`, `<pre>`). Neue Tags/Attribute mit dem Writer und einem Roundtrip
  prüfen; `ui/sanitize.ts` muss sie durchlassen.
- `document.execCommand` mit `styleWithCSS=false` erzeugt `<font>` und `align`; das passt zu Swing, aber die
  Ergebnisse je Browser prüfen. `execCommand` löst kein `beforeinput` aus (siehe Phase 2).
- Markups (Änderungs-Spans `sm-markup`) dürfen durch Formatieren nicht verloren gehen
  (`HTMLBlockActionWithMarkupRecovery` zeigt, wie das Original das löst).
- Formatieren ist ein eigener Undo-Schritt (`editor.endMerge()` davor und danach, wie bei `format`).
- Der Zustand der Knöpfe (aktuelles Absatzformat, Schrift) folgt im Original der Schreibmarke (`updateContextState`).

## Danach

3.6 Einfüge-Werkzeuge, 3.7 Zwischenablage Bilder/Tabellen, 3.8 Kontextmenü an der Schrittnummer (mehrere Commits),
3.9 Rest Phase 2 (IME). Details in `PLAN-phase3.md`.
