# Exemplu de curs — Limita modulului și instanța comună

## Concept demonstrat

Modulele ES exportă funcții și valori selectate; importatorii aceluiași modul partajează starea sa.

## De ce folosim exemplul

Trei module mici arată importuri, exporturi, stare încapsulată și proiecție defensivă fără un framework pentru browser.

## Ce trebuie observat

- `summary.js` importă comportament în loc să acceseze starea privată.
- Schimbările făcute prin `addTask` sunt vizibile prin aceeași instanță.
- Array-urile și înregistrările returnate sunt proiecții; apelanții nu pot modifica accidental starea modulului.

## Rulare și inspectare

```bash
node example.js
```

## Explicație

Evaluarea modulului creează o singură dată legătura privată `tasks`. Funcțiile exportate formează limita publică; legătura brută nu este exportată.

## Variante

- Exportați direct array-ul și demonstrați suprafața de mutație mai mare.
- Importați `taskCount` dintr-un al doilea modul și confirmați că observă aceeași stare.

## Validare

Validat cu `node example.js`; sunt verificate starea inițială, actualizările comune și izolarea proiecției.
