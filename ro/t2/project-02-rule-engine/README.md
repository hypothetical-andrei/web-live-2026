# Proiectul 02 — Rule Engine

## Scop

Accentul cade pe funcții și închideri. O descriere a regulii este compilată într-un predicat reutilizabil, iar shell-ul furnizat citește un fișier-scenariu și scrie fișierul-rezultat, astfel încât studenții să se poată concentra pe valorile capturate și compunere.

## Obiectiv

Compilează reguli declarative în închideri-predicat reutilizabile, apoi partiționează înregistrările fără să modifici intrările.

## Model mental

O regulă-frunză capturează un câmp, un operator și o valoare de comparație. O regulă compusă capturează predicate-fiu deja compilate:

```text
arbore de definiții → compilare o dată → arbore de predicate → evaluarea mai multor înregistrări
```

Lucrează în `student/`. Desenează arborele scenariului furnizat înainte să scrii cod. Marchează datele capturate de fiecare funcție-frunză și compusă. Identifică unde `every`, `some` și negația logică oferă agregare și scurtcircuitare.

Urmează cele două TODO-uri etapizate. Cere-i lui Codex mai întâi o analiză fără editare asupra arborelui, valorilor capturate și scurtcircuitării. După ce o verifici, permite schimbări doar în `src/rule-engine.js`. Respinge formele ambigue, recompilarea repetată a copiilor, conversia, mutația sau editarea testelor.

Rulează `npm run evaluate`. Runnerul furnizat citește `data/scenario.json` și scrie `data/result.json`; studenții nu configurează căi și nu parsează argumente CLI.

## Criterii de succes

- Toate verificările țintite și agregate trec.
- Rezultatul scris pentru scenariu selectează doar `T-1`.
- Definițiile invalide eșuează în timpul compilării.
- Diferența finală este limitată la modulul motorului.
- Poți explica ce capturează fiecare închidere întoarsă.

## Sarcină de depanare

Înlocuiește temporar `every` cu `forEach`. Diagnostichează de ce simpla iterare nu produce booleanul compus și de ce nu poate scurtcircuita în modul cerut. Cere-i lui Codex o remediere țintită și inspectează schimbarea semantică de o linie.

## Ce ar trebui să poți explica

- Funcțiile ca valori întoarse.
- Captura închiderilor și reutilizarea după compilare.
- Compunerea recursivă.
- Evaluarea cu scurtcircuitare.
- Comparația strictă versus conversia.
