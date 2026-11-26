# Resursa înscrierii

## Concept demonstrat

Repetați PUT și DELETE la URL-ul care identifică perechea sesiune/participant.

## Ce trebuie să observați

Primul PUT întoarce 201, repetarea 200, și există tot o singură înscriere cu biletul cerut. Două DELETE întorc 204 și nu lasă înscriere. Rândurile părinte nu sunt ținta ștergerii.

## Rulare / examinare

```bash
npm ci
npm test
```

## Explicație și limite

Scriptul pornește server HTTP temporar, trimite fetch, verifică SQLite și se încheie. Serverul nu rămâne pornit pentru cereri curl după încheierea scriptului. Demonstrează repetări secvențiale cu date fixe valide, nu validare, autorizare sau upsert concurent complete.

## Variații

Comparați perechea cu ID-ul public al unei înscrieri la nivel superior. Explicați de ce alt tip de bilet este altă cerere, iar repetarea identică testează idempotența.

## Validare

La 2026-10-26, instalarea curată npm ci și npm test trec pe Node 24.5.0 cu Sequelize 6.37.8 și sqlite3 6.0.1 fixate. Aserțiunile execută SQLite real; exemplele HTTP trimit cereri locale reale. Închiderea bazei/serverului rulează în finally.
