# Specificația exercițiului — Rezervare tranzacțională

## Unitate

Unitatea 07 — Relații, tranzacții și proiectarea API-urilor

## Obiectiv de învățare

Rezervă locuri într-o singură tranzacție a bazei de date. Actualizează disponibilitatea, creează rezervarea și înregistrează auditul împreună; anulează toate cele trei operații dacă un pas eșuează.

## De ce există acest exercițiu

Așteptarea a trei instrucțiuni ale bazei nu le face atomice. O rezervare este validă numai când decrementarea capacității, rezervarea unică și evenimentul de audit reușesc împreună. Ai nevoie de comportament commit/rollback observabil, nu doar de sintaxa tranzacției.

## Cerințe preliminare

- Asocierile din cursul 07 și persistarea/tratarea erorilor din Unitatea 06. Modelele sunt furnizate; finalizarea Proiectului 1 nu este necesară.
- Respingerea promisiunilor, erori centralizate și unicitate relațională.

## Context inițial

Ai primit modele Sequelize/SQLite și un endpoint Express de rezervare:

- `Event` are întregii nenuli `capacity` și `availableSeats`;
- `Booking` are unicitate pe `(eventId, attendeeId)` și `seats` pozitiv;
- `BookingAudit` înregistrează `bookingId`, `eventId`, `attendeeId`, `seats` și acțiunea `created`;
- cheile, asocierile, ciclul schemei, parsarea rutei, serializatoarele, erorile și testele sunt complete.

Fișierul incomplet `src/book-seats.js` exportă `bookSeats({ sequelize, Event, Booking, BookingAudit }, { eventId, attendeeId, seats, afterBookingCreated })`. Callback-ul opțional este implicit no-op și servește numai injectării deterministe a unui eșec după crearea rezervării.

## Sarcina ta

Rezervă locuri într-o singură tranzacție a bazei de date. Actualizează disponibilitatea, creează rezervarea și înregistrează auditul împreună; anulează toate cele trei operații dacă un pas eșuează.

Lucrează în proiectul `student/` furnizat. Modifică doar `src/book-seats.js`. Cerințele detaliate precizează cazurile, formele datelor și restricțiile pe care trebuie să le respecți. Folosește testele și instrucțiunile de pornire furnizate pentru verificare.

## Comportament obligatoriu

- Respinge `seats` neîntreg sau nepozitiv cu `BookingValidationError` înaintea tranzacției.
- Execută toate citirile și scrierile într-un singur callback gestionat `sequelize.transaction(async transaction => ...)` și transmite opțiunea tranzacției fiecărui apel.
- Încarcă evenimentul în tranzacție; absența produce `EventNotFoundError`.
- Dacă `availableSeats < seats`, aruncați `SoldOutError` fără modificări.
- Detectează rezervarea existentă `(eventId, attendeeId)` și aruncați `BookingExistsError`.
- Scade exact `seats` din `availableSeats` și așteaptă persistența.
- Creează un `Booking`, apelează și așteaptă `afterBookingCreated({ booking, transaction })`, apoi creează un `BookingAudit` corespunzător în aceeași tranzacție.
- Întoarce `{ booking, event }` detașat numai după commit-ul tranzacției gestionate.
- Curse de unicitate devin `BookingExistsError`; erorile de domeniu își păstrează identitatea, iar cele neașteptate se propagă neschimbate după rollback.
- Orice eșec lasă locurile disponibile și numerele Booking și BookingAudit exact ca înaintea apelului.
- O a doua rezervare reușită observă numărul de locuri confirmat de prima.

## Constrângeri

- JavaScript ESM, Sequelize 6.37.8, sqlite3 6.0.1, cod Express 5 furnizat, `fetch` nativ și runnerul Node; păstrează dependențele auditate.
- Implementează numai `src/book-seats.js`; nu edita modelele, rutele, middleware-ul, testele sau dependențele.
- Folosește o singură tranzacție gestionată; fără SQL manual `BEGIN/COMMIT`, tranzacții imbricate, scrieri compensatorii sau mutex local.
- Nu prinde și înlocuiți erorile neașteptate.
- Testele SQLite demonstrează rollback atomic; diferențele de blocare la concurență ridicată sunt în afara scopului.

## Criterii observabile de finalizare

- Rezervarea HTTP reușită întoarce `201`, datele rezervării/evenimentului și disponibilitatea redusă numai după commit.
- Cazurile absent, epuizat, duplicat și invalid întorc erori stabile și nu modifică rânduri.
- Eșecul injectat după creare demonstrează rollback-ul locurilor și rezervării și absența auditului.
- Eșecul creării auditului demonstrează același rollback și păstrează identitatea erorii.
- Opțiunile capturate arată aceeași tranzacție pe fiecare operație.
- Toate verificările și auditul trec și numai `src/book-seats.js` se modifică.

