# Proiectul 03 — Depanarea stării și efectelor

## Ce ai de făcut

Repară panoul de căutare React. Folosește textul curent pentru căutare, împiedică răspunsurile vechi să înlocuiască rezultatele noi și oprește cererile când componenta nu mai are nevoie de ele.

Lucrează în `student/`. Modifică doar `src/SearchPanel.jsx`.

## Cum lucrezi

Rulează baza fragilă și desenează cronologia cererilor veche/nouă. Inspectează substitutul amânat, controalele timerului, callback-ul de eroare, stările accesibile și verificările sursei înainte de a solicita o reparație.

Dă Codex sarcina din `spec.md`. Respinge editările dovezilor/testelor, starea oglindită a rezultatelor, opțiunile instabile, dependențele omise, suprimarea lintingului, curățarea lipsă, presupunerile că abandonarea rezolvă singură cursele, afișarea erorilor brute sau bibliotecile suplimentare.

## Verifică rezultatul

- Toate verificările de referință clasificate, compilarea, auditul și testul minimal în browser trec.
- Introducerea rapidă pornește numai cererea finală eligibilă cu debounce.
- Schimbarea/scurtarea interogării sau demontarea curăță ori abandonează activitatea deținută.
- Încheierile vechi rezolvate după abandonare nu pot publica.
- Stările inactiv/încărcare/gol/rezultate/eroare neutralizată și identitatea callback-ului de eroare sunt exacte.

## Sarcină de depanare

Elimină verificarea identității celei mai recente cereri, dar păstrează abandonarea. Rezolvă un substitut abandonat după cererea mai nouă, observă publicarea învechită și restabilește ambele protecții independente.

## Ce ar trebui să poți explica

- Starea randării comparativ cu sincronizarea efectului.
- Proprietatea dependenței, configurării, curățării și încheierii.
- De ce abandonarea nu demonstrează singură că interfața afișează numai rezultatul recent.
- Cum fac timerele deterministe/promisiunile amânate cursele testabile.
