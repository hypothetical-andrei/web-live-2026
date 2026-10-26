# Proiectul 02 — Pipeline de middleware

## Ce ai de făcut

Construiește o listă ordonată de middleware Express pentru cererile de rapoarte. Atribuie un ID cererii, măsoară durata, validează datele și înregistrează o singură finalizare, fără să rulezi pașii următori după respingere.

Lucrează în `student/`. Modifică doar `src/report-pipeline.js`.

## Cum lucrezi

Rulează aplicația inițială și desenează secvența furnizată parser → pipeline → handler de raport → middleware de eroare. Marcați momentul în care antetele sunt trimise și momentul în care apare `finish` sau `close`.

Dați-i lui Codex sarcina din `spec.md`. Verifică înregistrarea listenerelor înainte de `next`, numărul exact de apeluri ale dependențelor, garanția unui singur log, opririle prin return și dacă cererile invalide pot ajunge la handler.

## Verifică rezultatul

- Toate verificările pe categorii trec.
- Identitatea furnizată sau generată ajunge în răspuns și într-un singur log.
- Antetul timpului de răspuns folosește durata injectată la limita de trimitere.
- Datele valide sunt curățate și înghețate; tipurile media și câmpurile invalide nu ajung la handler.
- Finalizarea și închiderea prematură produc exact un log clasificat.
- Se modifică numai `src/report-pipeline.js`.

## Sarcină de depanare

Mută înregistrarea listenerului de finalizare după delegare și folosește verificarea cu handler sincron. Explică cursa care pierde evenimentul, apoi restaurați asumarea responsabilității pentru listener înainte de `next()`.

## Ce ar trebui să puteți explica

- Fluxul descendent prin `next()` și evenimentele ulterioare din ciclul de viață al răspunsului.
- Oprirea pipeline-ului și responsabilitatea pentru finalizarea răspunsului.
- Injectarea deterministă a ceasurilor, ID-urilor și logurilor.
- De ce un antet al timpului de răspuns nu poate cunoaște un moment viitor de finalizare.
