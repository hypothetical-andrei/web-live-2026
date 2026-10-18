# Exemplu de curs — Ordinea continuării asincrone

## Concept demonstrat

`await` suspendă funcția async curentă, în timp ce codul apelant continuă.

## De ce folosim exemplul

Cinci intrări în jurnal fac modelul de planificare observabil fără a introduce rețeaua sau interfața.

## Ce trebuie observat

- Funcția async pornește sincron.
- Codul de după `await` rulează numai după golirea stivei curente.
- În acest exemplu, promisiunea returnată este îndeplinită când funcția async se termină.

## Rulare și inspectare

```bash
node example.js
```

## Explicație

Apelarea lui `run()` înregistrează `function start`, ajunge la `await` și returnează o promisiune. Codul apelant înregistrează `script end`. După terminarea codului sincron curent, `run()` își reia execuția și înregistrează `after await`. Terminarea lui `run()` îndeplinește promisiunea sa; callback-ul `.then()` înregistrează apoi `promise fulfilled`.

## Variante

- Adăugați un al doilea `await` și anticipați poziția lui în jurnal.
- Înlocuiți promisiunea îndeplinită cu una respinsă și adăugați un `try`/`catch` bine delimitat.

## Validare

Validat cu `node example.js`; o aserțiune verifică ordinea exactă a celor cinci intrări.
