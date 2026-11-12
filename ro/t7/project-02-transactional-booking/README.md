# Proiectul 02 — Rezervare tranzacțională

## Ce ai de făcut

Rezervă locuri într-o singură tranzacție a bazei de date. Actualizează disponibilitatea, creează rezervarea și înregistrează auditul împreună; anulează toate cele trei operații dacă un pas eșuează.

Lucrează în `student/`. Modifică doar `src/book-seats.js`.

## Cum lucrezi

Rulează dovada de bază și înregistrează starea nesigură după eșecul târziu injectat. Formulează invarianta, marcați fiecare citire și scriere participantă și separă validarea anterioară tranzacției de activitatea tranzacțională.

Dă-i lui Codex sarcina din `spec.md`. Respinge SQL-ul manual, scrierile compensatorii, tranzacțiile imbricate, opțiunile de tranzacție lipsă, înlocuirea generală a erorilor sau editarea altui fișier.

## Verifică rezultatul

- Toate verificările referinței și auditul trec.
- Traseele invalid, absent, epuizat, duplicat și erorile callback/audit păstrează starea exactă.
- Fiecare operație primește aceeași tranzacție gestionată.
- Succesul întoarce date detașate numai după commit, iar apelurile ulterioare văd disponibilitatea confirmată.
- Numai cursele de unicitate sunt traduse; erorile neașteptate își păstrează identitatea.

## Sarcină de depanare

Elimină opțiunea tranzacției din crearea auditului și injectați un eșec. Compară starea cu invarianta, identifică operația scăpată și restabilește limita comună.

## Ce ar trebui să poți explica

- De ce operațiile `await` secvențiale nu sunt atomicitate.
- Ce aparține în interiorul și în afara limitei de consistență.
- Cum commit-ul și rollback-ul gestionate urmează soluționarea callback-ului.
- De ce cursele constrângerilor și erorile neașteptate necesită tratare diferită.
