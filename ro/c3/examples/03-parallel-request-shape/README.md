# Exemplu de curs — Forma cererilor paralele

## Concept demonstrat

Operațiile asincrone independente trebuie pornite înainte de a aștepta vreun rezultat.

## De ce folosim exemplul

Ordinea pornire/finalizare din jurnal demonstrează concurența fără a depinde de timpii variabili ai internetului.

## Ce trebuie observat

- Toate cele trei operații pornesc înainte ca prima să se încheie.
- `Promise.all` păstrează ordinea intrărilor chiar dacă ordinea finalizării diferă.
- Coordonarea paralelă ține de structura codului, nu doar de un rezultat cronometrat.

## Rulare și inspectare

```bash
node example.js
```

## Explicație

Apelul `map` creează imediat toate cele trei promisiuni. `Promise.all` așteaptă stabilirea lor combinată și returnează rezultatele în ordinea array-ului de promisiuni.

## Variante

- Înlocuiți `map` cu trei expresii `await` secvențiale și comparați ordinea evenimentelor.
- Respingeți o operație și tratați explicit eșecul combinat.

## Validare

Validat cu `node example.js`; aserțiunile demonstrează că toate pornirile preced toate finalizările, iar ordinea rezultatului rămâne `profile, tasks, notices`.
