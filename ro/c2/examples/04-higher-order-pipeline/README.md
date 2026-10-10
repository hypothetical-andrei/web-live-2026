# Exemplu de curs — Flux de ordin superior și închidere lexicală

## Concept demonstrat

Nucleul funcțional JavaScript combină funcții de ordin întâi, închideri lexicale și metode de ordin superior pentru colecții.

## De ce este inclus acest exemplu

Reunește două exemple anterior separate, păstrând vizibile configurarea și execuția pentru fiecare înregistrare.

## Ce trebuie observat

- `makeTaskSelector` primește configurația și întoarce o valoare-funcție.
- Predicatul întors păstrează `owner` și `minimumEstimate` printr-o închidere lexicală.
- `filter`, `map` și `reduce` primesc funcții și expun forme distincte pentru fiecare etapă.
- Sursa înghețată rămâne neschimbată.

## Rulare și examinare

```bash
node example.js
```

## Explicație

Fluxul se citește ca `Task[] → selected Task[] → EstimateView[] → number`. Predicatul configurat este un comportament reutilizabil, nu stare globală sau validare repetată a configurației.

## Variante

- Configurează un al doilea predicat și arată că valorile capturate sunt independente.
- Înlocuiește etapele denumite cu un singur lanț dens, apoi compară ușurința depanării.

## Validare

Validat cu `node example.js`; sunt verificate selecția, proiecția, reducerea, eșecul configurării și păstrarea sursei.
