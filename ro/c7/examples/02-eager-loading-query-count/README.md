# Numărul interogărilor eager

## Concept demonstrat

Comparați instrucțiunile SQL reale pentru parcurgere lazy și încărcare eager.

## Ce trebuie să observați

Trei conferințe au câte o sesiune. După ștergerea din jurnal a instrucțiunilor folosite la pregătirea bazei, încărcarea lazy execută patru instrucțiuni SQL, iar încărcarea eager execută una. Ambele citesc date legate din SQLite.

## Rulare / examinare

```bash
npm ci
npm test
```

## Explicație și limite

Exemplul are puține date, astfel încât rezultatul poate fi urmărit ușor. Interogarea nu demonstrează paginarea unei colecții mari. O instrucțiune nu este automat optimă dacă mai multe colecții multiplică rândurile. Jurnalul arată numărul de instrucțiuni SQL; exemplul nu măsoară timpul de execuție.

## Variații

Măriți numărul părinților și anticipați creșterea N+1. Discutați cum o a doua colecție schimbă numărul rândurilor intermediare.

## Validare

La 2026-10-26, instalarea curată npm ci și npm test trec pe Node 24.5.0 cu Sequelize 6.37.8 și sqlite3 6.0.1 fixate. Aserțiunile execută SQLite real; exemplele HTTP trimit cereri locale reale. Închiderea bazei/serverului rulează în finally.
