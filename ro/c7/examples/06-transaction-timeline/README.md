# Cronologia tranzacției gestionate

## Concept demonstrat

Verificați commit și rollback pentru stoc, rezervare și audit.

## Ce trebuie să observați

Inițial sunt trei locuri disponibile, nicio rezervare și nicio înregistrare de audit. O eroare introdusă intenționat după crearea rezervării duce la revenirea la starea inițială. Când operația reușește, rămân două locuri disponibile și se păstrează o rezervare și o înregistrare de audit. Un număr invalid de locuri sau lipsa locurilor disponibile duce la respingerea operației, fără modificări păstrate.

## Rulare / examinare

```bash
npm ci
npm test
```

## Explicație și limite

Fiecare citire/scriere primește aceeași tranzacție. Apelul await sequelize.transaction(...) se încheie cu rezultatul callback-ului numai după commit. Starea este recitită după rollback, nu dedusă din instanța JavaScript schimbată. Sunt verificări secvențiale de atomicitate, nu politică de alocare concurentă, protocol de unicitate sau test de durabilitate în fișier.

## Variații

Explicați de ce tratarea erorii fără a o arunca din nou în callback ar putea confirma pașii anteriori. Identificați de ce un e-mail sau mesaj în terminal nu poate fi anulat cu baza.

## Validare

La 2026-10-26, instalarea curată npm ci și npm test trec pe Node 24.5.0 cu Sequelize 6.37.8 și sqlite3 6.0.1 fixate. Aserțiunile execută SQLite real; exemplele HTTP trimit cereri locale reale. Închiderea bazei/serverului rulează în finally.
