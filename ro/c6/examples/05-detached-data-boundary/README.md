# Exemplu de curs — Serializarea la limita REST

Modelul bazei de date stochează marcaje temporale și un câmp intern de revizuire, dar reprezentarea REST publică expune deliberat numai `id`, `title`, `archived` și o legătură către resursă. Serializatorul pornește de la `instance.get({ plain: true })` și construiește un contract API explicit, în loc să întoarcă instanța activă a modelului.

```bash
npm install
npm test
npm start
curl -i http://localhost:3000/api/notes/1
```

Modificarea tabelului nu modifică automat API-ul. Actualizează serializatorul numai când trebuie schimbată reprezentarea publică.

Revalidat la 2026-10-26: instalarea curată npm ci și npm test trec pe Node 24.5.0 cu operații Sequelize/SQLite reale; exemplele HTTP folosesc și cereri locale reale.

### Pornire directă și consola

Rulează `npm start` după `npm ci`. Consola explică pașii și rezultatele observate. Exemplele de server acceptă `PORT` (implicit 3000); mesajul de pornire enumeră cererile pe care le poți încerca. SQLite este în memorie și se resetează la repornire.
