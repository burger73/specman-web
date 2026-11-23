// Repariert die Sitka-TTFs aus dem Specman-Repo für Browser (Chrome/Firefox-Font-Sanitizer OTS):
// 1. Tabellenverzeichnis nach Tag sortieren (ASCII, Großbuchstaben zuerst)
// 2. OS/2-Tabelle: gibt Version 5 an, ist aber nur so lang wie Version 4 → Version 4 eintragen
// Aufruf: node scripts/fix-fonts.cjs public/fonts/Sitka*.ttf
const fs = require('fs');
for (const file of process.argv.slice(2)) {
  const b = Buffer.from(fs.readFileSync(file));
  const n = b.readUInt16BE(4);
  const entries = [];
  for (let i = 0; i < n; i++) entries.push(Buffer.from(b.subarray(12 + i * 16, 28 + i * 16)));
  entries.sort((x, y) => Buffer.compare(x.subarray(0, 4), y.subarray(0, 4)));
  entries.forEach((e, i) => e.copy(b, 12 + i * 16));
  for (const e of entries) {
    if (e.toString('latin1', 0, 4) !== 'OS/2') continue;
    const offset = e.readUInt32BE(8);
    const length = e.readUInt32BE(12);
    const version = b.readUInt16BE(offset);
    if (version >= 5 && length < 100) b.writeUInt16BE(4, offset);
    console.log(file, `OS/2 v${version}, ${length} Bytes → v${b.readUInt16BE(offset)}`);
  }
  fs.writeFileSync(file, b);
}
