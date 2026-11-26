# Exemplu de curs — Tranziția unui formular controlat

## Concept demonstrat

Un input controlat se randează din stare, actualizează starea la schimbare și normalizează deliberat la trimitere.

## De ce apare exemplul în curs

Tranzițiile pure expun proprietatea formularului fără zgomot DOM sau JSX și se mapează direct la handlerele de evenimente React.

## Ce să observați

- Tastarea păstrează exact textul curent al utilizatorului.
- Trimiterea elimină spațiile numai la limita contractului.
- Trimiterile goale nu creează nimic.
- Trimiterea reușită creează un element și golește starea inputului.

## Rulare/inspectare

```bash
npm install
npm run dev
npm run build
```

## Explicație

În React, `value={title}` reflectă starea, iar `onChange` aplică prima tranziție. Un handler de trimitere împiedică navigarea și aplică a doua tranziție.

## Variații

- Adăugați o valoare de eroare fără să duplicați informația dacă inputul este gol.
- Mutați eliminarea spațiilor în fiecare schimbare și discutați experiența tastării.

## Validare

Validat prin instalare curată și `npm run build`; inspectați tastarea, trimiterea, golirea și respingerea valorii goale în aplicația Vite.
