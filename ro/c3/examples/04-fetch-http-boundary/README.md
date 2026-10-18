# Exemplu de curs — Limita HTTP a fetch

## Concept demonstrat

`fetch` se îndeplinește când sosește un răspuns HTTP, inclusiv pentru `404`; codul aplicației trebuie să clasifice explicit starea răspunsului.

## De ce folosim exemplul

Un fetch determinist injectat separă stabilirea la nivel de rețea de rezultatul HTTP fără dependență de server sau de timpul internetului.

## Ce trebuie observat

- Răspunsul `404` simulat este livrat de o promisiune îndeplinită.
- `loadJson` transformă un răspuns HTTP fără succes într-o eroare a aplicației.
- Parsarea JSON are loc numai după ce politica de stare acceptă răspunsul.

## Rulare și inspectare

```bash
node example.js
```

## Explicație

Îndeplinirea promisiunii înseamnă că a fost obținut un răspuns, nu că starea lui reprezintă succes. Verificarea `response.ok` creează limita cerută de contractul aplicației.

## Variante

- Faceți ca `fakeFetch` să respingă promisiunea pentru a modela o eroare de rețea și comparați traseul.
- Returnați JSON incorect dintr-un răspuns reușit și identificați limita eșecului de parsare.

## Validare

Validat cu `node example.js`; sunt verificate parsarea reușită, respingerea răspunsului `404` de către politică și îndeplinirea promisiunii de bază.
