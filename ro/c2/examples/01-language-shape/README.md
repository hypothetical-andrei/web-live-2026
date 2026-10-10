# Exemplu de curs — Structura limbajului JavaScript

## Concept demonstrat

JavaScript combină sintaxa de suprafață din familia C cu valori dinamice, un sistem de obiecte și funcții de ordin întâi.

## De ce este inclus acest exemplu

Stabilește modelul limbajului înainte de introducerea riscurilor precum conversia implicită sau mutația.

## Ce trebuie observat

- JavaScript modern are șapte tipuri primitive și o categorie largă de obiecte.
- Tablourile sunt obiecte specializate; funcțiile apelabile participă și ele la sistemul de obiecte.
- Funcțiile pot fi stocate, transmise și apelate ca valori.
- Acoladele, condițiile, buclele, apelurile și revenirile seamănă cu limbajele din familia C, dar modelul tipurilor în execuție diferă.

## Rulare și examinare

```bash
node example.js
```

## Explicație

Tabelul folosește `typeof`, o verificare exactă pentru `null`, `Array.isArray` și o verificare a apelabilității, deoarece niciun operator nu oferă singur clasificarea completă. Exemplul este complet sincron; lucrul planificat începe în Cursul 3.

## Variante

- Adaugă o expresie regulată și o dată, apoi stabilește categoriile lor.
- Compară `typeof null`, `typeof []` și `typeof (() => {})` cu categoriile utile în execuție.

## Validare

Validat cu `node example.js`; sunt verificate toate cele șapte primitive, cazurile tablou/obiect și apelul funcției transmise.
