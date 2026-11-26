# Exemplu de curs — Definirea schemei și modelului

Acest exemplu definește un model Sequelize, creează tabelul în SQLite și compară definiția modelului cu schema rezultată în baza de date.

`Note.getAttributes()` expune API-ul public actual pentru metadatele modelului, iar `describeTable()` inspectează ce a primit efectiv SQLite. Validarea modelului respinge un titlu gol înaintea inserării, iar tabelul înregistrează independent nulabilitatea, valorile implicite, unicitatea și cheia primară.

```bash
npm install
npm test
```

Încearcă să modifici o constrângere, sincronizează o bază de date nouă și inspectează din nou ambele perspective asupra metadatelor.

Revalidat la 2026-10-26: instalarea curată npm ci și npm test trec pe Node 24.5.0 cu operații Sequelize/SQLite reale; exemplele HTTP folosesc și cereri locale reale.

### Pornire directă și consola

Rulează `npm start` după `npm ci`. Consola explică pașii și rezultatele observate. Scriptul se încheie după verificări și închide baza de date.
