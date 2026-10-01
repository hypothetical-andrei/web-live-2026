# Exemplu de curs — Limitele URL-ului

## Ce veți învăța

Un URL are componente observabile separat, iar fragmentul său este un detaliu de navigare al browserului, nu o parte a țintei cererii HTTP.

## Cum vă ajută acest exemplu

Afișarea câmpurilor parsate înlocuiește ideea vagă de „URL” cu o structură de date inspectabilă.

## Ce să observați

- `pathname` și `searchParams` selectează și parametrizează o resursă de pe server.
- `hash` este disponibil codului clientului, dar este omis din ținta derivată a cererii.
- Decodificarea query-ului transformă `%20` în spațiu fără să schimbe șirul URL original.

## Rulare și inspectare

```bash
node example.js
```

## Explicație

Clasa `URL` inclusă parsează adresa fără dependențe. Exemplul construiește apoi numai din cale și query partea trimisă de clientul HTTP.

## Variante

- Adăugați un al doilea parametru `tag` și inspectați `searchParams.getAll("tag")`.
- Eliminați query-ul sau fragmentul și observați câmpurile care devin șiruri goale.

## Validare

Validat cu `node example.js`; aserțiunile trec, iar ținta afișată exclude `#details`.
