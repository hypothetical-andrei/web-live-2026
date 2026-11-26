# Exemplu de curs — Identitatea cheilor stabile

## Concept demonstrat

Cheile React identifică elementele surori între randări; indexurile tabloului descriu poziții și identifică greșit rândurile după inserare.

## De ce apare exemplul în curs

Rândurile editabile randate dețin stare locală, astfel încât păstrarea identității este direct observabilă după inserare.

## Ce să observați

- Inserarea la indexul zero deplasează fiecare identitate pozițională.
- ID-urile stabile păstrează identitatea elementelor existente.
- Înregistrarea nouă nu are, corect, o identitate anterioară când se folosesc chei ID.

## Rulare/inspectare

```bash
npm install
npm run dev
npm run build
```

## Explicație

Cheile sunt consumate de React în timpul reconcilierii elementelor surori și nu sunt transmise automat ca proprietăți. Folosiți o identitate stabilă din domeniu când listele se pot schimba.

## Variații

- Eliminați primul element în loc să inserați unul.
- Modelați starea locală a inputului atașată fiecărei identități anterioare.

## Validare

Validat prin instalare curată și `npm run build`; editați o ciornă și adăugați un element la început pentru a inspecta identitatea stabilă.
