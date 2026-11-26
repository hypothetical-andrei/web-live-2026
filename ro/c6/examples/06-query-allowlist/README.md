# Exemplu de curs — Raport SQL raw parametrizat

Un raport agregat este un caz rezonabil pentru folosirea directă a SQL-ului. Ruta Express validează parametrul boolean public, apoi `sequelize.query()` execută o instrucțiune fixă cu o înlocuire denumită și `QueryTypes.SELECT`. Datele utilizatorului nu sunt interpolate niciodată în SQL.

```bash
npm install
npm test
npm start
curl -i 'http://localhost:3000/api/reports/note-summary?archived=false'
curl -i 'http://localhost:3000/api/reports/note-summary?archived=false%20OR%201%3D1'
```

SQL direct nu execută validatorii modelului Sequelize. Constrângerile SQL se aplică în continuare. În acest raport, ruta validează separat parametrul HTTP; aplicația trebuie în continuare să inițializeze și să închidă baza și să trateze erorile.

Revalidat la 2026-10-26: instalarea curată npm ci și npm test trec pe Node 24.5.0 cu operații Sequelize/SQLite reale; exemplele HTTP folosesc și cereri locale reale.

### Pornire directă și consola

Rulează `npm start` după `npm ci`. Consola explică pașii și rezultatele observate. Exemplele de server acceptă `PORT` (implicit 3000); mesajul de pornire enumeră cererile pe care le poți încerca. SQLite este în memorie și se resetează la repornire.

Ruta apelează direct SQL-ul pentru a păstra vizibile validarea și parametrizarea într-un singur exemplu mic. Într-o aplicație mai mare, mută interogarea într-o funcție de persistență, așa cum explică secțiunea 30.
