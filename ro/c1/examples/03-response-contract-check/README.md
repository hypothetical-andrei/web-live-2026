# Exemplu de curs — Verificarea contractului răspunsului

## Ce veți învăța

Verificările din timpul execuției transformă afirmațiile despre contractul HTTP în dovezi: crearea, validarea eșuată și eroarea neașteptată cer stări și forme diferite.

## Cum vă ajută acest exemplu

Modelează verificarea făcută după ce un agent AI propune descriptori de răspuns, fără a construi încă un server HTTP.

## Ce să observați

- Crearea folosește `201` și identifică resursa creată.
- Eroarea clientului folosește o stare 4xx și un cod stabil, citibil de program.
- O verificare poate respinge un răspuns `200` plauzibil vizual, dar incorect semantic.

## Rulare și inspectare

```bash
node check.js
```

## Explicație

`responses.js` conține descriptori mici. `check.js` verifică independent contractul lor public. Separarea reflectă revizuirea comportamentului în locul încrederii în implementarea care l-a produs.

## Variante

- Schimbați starea creării în `200` și inspectați eșecul focalizat.
- Adăugați un descriptor `500` fără să expuneți un stack trace intern.

## Validare

Validat cu `node check.js`; toate aserțiunile trec, iar scriptul afișează confirmarea celor trei contracte.
