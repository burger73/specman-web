#!/bin/sh
# Referenz aus dem Original: SHEF-Aktionen auf einem kopflosen JEditorPane ausführen, Body ausgeben (siehe Oracle.java).
# Braucht ein JDK (JAVA_HOME oder ~/tools/jdk-*) und den Klon des Originals in ~/specman-orig.
# Beispiel: scripts/swing-oracle/oracle.sh '<div>Hallo Welt</div>' 'Welt' align:1
set -e
DIR=$(cd "$(dirname "$0")" && pwd)
JDK=${JAVA_HOME:-$(ls -d "$HOME"/tools/jdk-* 2>/dev/null | head -1)}
R=${SPECMAN_ORIG:-$HOME/specman-orig}/local-maven-repository/net/attlanticbb
CP="$R/shef/0.5.0/shef-0.5.0.jar:$R/sam/0.5.0/sam-0.5.0.jar:$R/novaworx-syntax/0.0.7/novaworx-syntax-0.0.7.jar:$R/jtidy/8.0/jtidy-8.0.jar"
OUT=${TMPDIR:-/tmp}/specman-swing-oracle
if [ ! -f "$OUT/Oracle.class" ] || [ "$DIR/Oracle.java" -nt "$OUT/Oracle.class" ]; then
  mkdir -p "$OUT"
  "$JDK/bin/javac" -nowarn -d "$OUT" -cp "$CP" "$DIR/Oracle.java" "$DIR/net/atlanticbb/tantlinger/ui/text/CompoundUndoManager.java" 2>&1 | grep -v '^Note' || true
fi
exec "$JDK/bin/java" -Djava.awt.headless=true -cp "$OUT:$CP" Oracle "$@"
