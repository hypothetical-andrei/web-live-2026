# Exemplu de curs — Operatori și interogări compuse

Construiești condiții Sequelize și urmărești SQL-ul și rândurile rezultate.

## Rulare

```bash
npm ci
npm start
npm test
```

## Ce trebuie să observi

- `Op.gt` este un simbol JavaScript. `[Op.gt]` este o cheie calculată, nu șirul `"Op.gt"`.
- `Object.keys` și `JSON.stringify` omit cheile simbol. `Reflect.ownKeys` și `console.dir` permit inspectarea lor. Nu trimite obiectul `where` prin JSON.
- `Op.and` și `Op.or` grupează condițiile; `Op.between`, `Op.like`, `Op.in` și `Op.gt` exprimă comparații.
- Prima interogare cere note active, cu prioritate între 2 și 5 inclusiv, și cu categoria work sau titlul care conține notes. ID-urile sunt 1, 2, 6.
- `attributes` selectează coloanele; `raw: true` cere obiecte simple. `order` sortează după prioritate descrescătoare, apoi ID crescător pentru egalități.
- `offset: 1, limit: 2` întoarce ID-urile 2 și 6; `findAndCountAll` întoarce și totalul 3 înainte de paginare, printr-o interogare COUNT separată.
- A doua interogare combină implicit cu AND trei condiții și întoarce ID-urile 4, 5, 6.

Titlurile și categoriile din date sunt identice în ambele ediții pentru ca tiparul `%notes%` să aibă același sens. `%` înseamnă oricâte caractere, iar `_` un caracter în LIKE; aici tiparul este ales de aplicație. Nu trata un obiect JSON arbitrar al clientului ca opțiuni Sequelize. Tradu parametrii validați în câmpuri și operatori aleși de aplicație.

Baza SQLite este în memorie și se închide în `finally`. Exemplul nu include relații sau tranzacții; acestea urmează în Cursul 07.

[Sequelize 6: model querying](https://sequelize.org/docs/v6/core-concepts/model-querying-basics/).

Validat la 2026-11-04: npm start și npm test trec pe Node 24.5.0 cu SQLite real; aserțiunile verifică exact ID-urile, coloanele și totalul.
