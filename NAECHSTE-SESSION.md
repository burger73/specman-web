# Übergabe: weiter mit Phase 3, Schritt 3.6 (Einfüge-Werkzeuge)

Stand 23.11.2026. Diese Datei ist der Einstieg für eine frische Session. Ist 3.6 erledigt, die Datei für den nächsten
Schritt fortschreiben oder löschen.

## Wo wir stehen

- Phase 0–2 fertig (Tags `phase-1`, `phase-2`). Phase 3 läuft nach `PLAN-phase3.md`, der Plan ist mit Markus
  abgestimmt.
- Erledigt und gepusht: 3.1 Palette ziehbar, 3.2 Spaltenbreiten, 3.3 Pfeiltasten, 3.4 Schrittverweise, 3.5
  Text-Werkzeuge. 3.1–3.4 hat Markus abgenommen (3.4 nach dem Fix „Sprungziel nicht unter der Leiste“), **3.5 noch
  nicht**: zu Beginn nachfragen.
- Offene Frage an Markus aus 3.5: Ausrichten von Text ohne Absatz-Element (Text direkt im Body, z. B. ein frisch
  getippter Schritt) tut im Original nichts, weil `HTMLAlignAction` Swings `p-implied` unter `body` auslässt. So ist es
  portiert. Falls Markus das stört: Abweichung, dann wie die Zweigköpfe mit `<div align>` einpacken.
- Umschalt+Links/Rechts neben einem Schrittverweis hebt die Auswahl auf: bleibt wie im Original (Markus).
- Strg+Alt+Links/Rechts (Bearbeitungsverlauf) bleibt weg (Markus).

## Arbeitsweise (gilt für jeden Schritt 3.x)

- Port nach dem **Java-Code**, nicht nach Kommentaren oder dem Plantext. Weicht der Code vom Plan ab, gilt der Code;
  im PLAN vermerken. Rückfragen an Markus nur bei echten Abweichungen vom Original, keine neue Design-Runde.
- Pro Schritt: ein Commit „3.x: …“, im PLAN beim Abschnitt ein Absatz „**Umgesetzt (3.x):**“, Abweichungen ins
  README (Abschnitt „Bewusste Abweichungen“), Checks in `scripts/e2e-phase3.cjs` anhängen (vor den Schlusschecks).
- Danach `git push origin main` (GitHub burger73/specman-web, Pages baut automatisch).
- Commit-Ende: `Co-Authored-By: Claude …`-Zeile wie in den bisherigen Commits.

## Werkzeuge für den Original-Code

- SHEF liegt nur kompiliert vor (`~/specman-orig/local-maven-repository/net/attlanticbb/shef/0.5.0/shef-0.5.0.jar`).
  Dekompiliert (CFR) unter `~/tools/shef-src`, JDK 21 portabel unter `~/tools/jdk-21.0.13.1+2` (kein sudo nötig),
  CFR unter `~/tools/cfr/cfr-0.152.jar`.
- **Swing-Referenz:** `scripts/swing-oracle/oracle.sh '<html>' 'auswahl' befehl…` führt SHEF-Aktionen auf einem
  kopflosen JEditorPane aus und gibt den Body aus, wie der Serializer ihn speichert. Befehle in `Oracle.java`
  (block:N, align:N, size:N, color:#rrggbb, font:Name|-, clear, bold, type:Text, state). Für 3.6 neue Befehle für die
  Einfüge-Aktionen ergänzen. Das hat sich in 3.5 bewährt: Swing verhält sich oft anders, als der Code vermuten lässt.
- Die SHEF-Texte (deutsch) stehen in der Jar unter `net/atlanticbb/tantlinger/ui/text/actions/messages_de.properties`,
  die Specman-Texte unter `~/specman-orig/src/main/resources/i18n/messages_de.properties`.

## Prüfstand

- `npm test` (Vitest, 159 Tests), `npx tsc --noEmit -p .`
- gegen den Dev-Server (systemd-User-Service `specman-web-dev`, nur auf `http://100.101.105.4:5180/`):
  `node scripts/e2e-edit.cjs` (17), `node scripts/e2e-changes.cjs` (32), `node scripts/e2e-phase3.cjs` (91)
- `scripts/probe-areas.cjs [datei.nsd]` listet die Bereiche mit Lage, `scripts/shot*.cjs` machen Screenshots
  (`shot-textformat.cjs` zeigt die Toolbar mit offenem Menü).
- Testdatei mit allen Elementen: `test/fixtures/specman-reference-v1.4-model-v2.nsd` (Vorschau:
  `?sample=specman-reference-v1.4-model-v2.nsd`), Hyperlinks in den Schritten 32 ff.
- Playwright-Skripte per Write-Tool anlegen, nicht per Heredoc (die Sicherheitsprüfung schlägt sonst manchmal an).
- `dialog.close()` feuert `close` asynchron: im e2e auf `state: 'detached'` warten. Der Farbwähler des Browsers lässt
  sich im e2e nicht bedienen (Escape, dann `change` am Feld auslösen).

## 3.6 Einfüge-Werkzeuge: was zu tun ist

Aus dem PLAN: Hyperlink (`HTMLLinkAction`, Dialog mit Text und Adresse), Zeilenumbruch (`HTMLLineBreakAction`),
horizontale Linie (`HTMLHorizontalRuleAction`), Sonderzeichen (`SpecialCharAction`). PlantUML kommt mit Phase 4.

**Quellen:** alle vier nur in SHEF, dekompiliert unter `~/tools/shef-src/net/atlanticbb/tantlinger/ui/text/actions/`
(Dialoge unter `…/ui/text/dialogs/`). Toolbar: im Original steht nur der Hyperlink in der Gruppe Einfügen (Reihenfolge
in `HTMLEditorPane.createToolbarComponents`: Listen, Link, Bild, PlantUML, Tabelle, Schrittverweis); Zeilenumbruch,
Linie und Sonderzeichen stehen nur im Menü Einfügen (`createEditorActions`). Specman Web hat keine Menüleiste; wie bei
Styles löschen in 3.5 als Knöpfe anbieten und im README vermerken.

**Worauf achten:**
- Formatieren/Einfügen läuft über `applyFormat(editor, (el, range) => …)` in `ui/textinput.ts` (ein Undo-Schritt,
  input-Ereignisse von execCommand werden dabei nicht doppelt übernommen).
- Links: der Sanitizer setzt `target`/`rel`, `cleanHtml` entfernt sie wieder. Mit Verfolgung muss eingefügter Text
  als hinzugefügt markiert werden (wie beim Schrittverweis in 3.4, `ui/steplinkdialog.ts`).
- Styles löschen entfernt Links (wie im Original).

## Danach

3.7 Zwischenablage Bilder/Tabellen, 3.8 Kontextmenü an der Schrittnummer (mehrere Commits), 3.9 Rest Phase 2 (IME).
Details in `PLAN-phase3.md`.
