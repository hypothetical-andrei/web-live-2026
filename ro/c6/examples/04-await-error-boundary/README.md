# Exemplu de curs — CRUD Sequelize prin Express

Acest API de notițe efectuează creare, citire ordonată, actualizare parțială și ștergere în SQLite. Fiecare promise de persistență este așteptat înainte de finalizarea răspunsului. Middleware-ul Express central mapează validarea Sequelize la `400`, conflictele de unicitate la `409` și ascunde detaliile neașteptate.

```bash
npm install
npm test
npm start
```

```bash
curl -i -X POST http://localhost:3000/api/notes -H 'content-type: application/json' -d '{"title":"Notiță stocată"}'
curl -i http://localhost:3000/api/notes
curl -i -X PATCH http://localhost:3000/api/notes/1 -H 'content-type: application/json' -d '{"archived":true}'
curl -i -X DELETE http://localhost:3000/api/notes/1
```

Exemplul izolează așteptarea operațiilor modelului și clasificarea erorilor. Folosește baza în memorie; stocarea în fișier și politica de pornire sunt discutate în secțiunile 7 și 15–17 ale cursului. Listarea/crearea serializează automat instanțele pentru a păstra CRUD vizibil; exemplul 05 le înlocuiește cu câmpuri publice explicite. JSON invalid primește 400, nu 500 de persistență. Nu este o implementare completă a validării HTTP.

Revalidat la 2026-10-26: instalarea curată npm ci și npm test trec pe Node 24.5.0 cu operații Sequelize/SQLite reale; exemplele HTTP folosesc și cereri locale reale.

### Pornire directă și consola

Rulează `npm start` după `npm ci`. Consola explică pașii și rezultatele observate. Exemplele de server acceptă `PORT` (implicit 3000); mesajul de pornire enumeră cererile pe care le poți încerca. SQLite este în memorie și se resetează la repornire.
