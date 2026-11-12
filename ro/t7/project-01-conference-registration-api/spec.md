# Specificația exercițiului — API de înscriere la conferință

## Unitate

Unitatea 07 — Relații, tranzacții și proiectarea API-urilor

## Obiectiv de învățare

Definește în Sequelize relațiile dintre conferințe, sesiuni, participanți și înscrieri. Implementează citirile cerute păstrând cheile străine, câmpurile înscrierii și numărul de interogări cerut.

## De ce există acest exercițiu

Tabelele independente nu explică reprezentarea relațiilor de domeniu într-un ORM. Trebuie să vadă împreună cheile externe, direcția asocierilor, identitatea tabelului de legătură și forma rezultatului eager, păstrând suficientă înțelegere SQL pentru a verifica rezultatul ORM-ului.

## Cerințe preliminare

- Modele, constrângeri, interogări, ciclu de viață și erori Sequelize/SQLite din Unitatea 06.
- API-uri Express orientate pe resurse din Unitatea 05.
- Vocabular de bază pentru chei primare și externe.

## Context inițial

Ai primit un API Express 5 ESM pentru conferințe, cu dependențe Sequelize 6 și SQLite blocate și auditate, harness determinist, middleware, serializatoare, rute, fixture-uri și teste. Toată activitatea obiectivului este în `src/conference-model.js`, care exportă:

- `defineConferenceModel(sequelize)`, întorcând `{ Conference, Session, Attendee, Registration }`;
- `listSessionsWithRegistrations(models, { conferenceId })`;
- `registerAttendee(models, { sessionId, attendeeId, ticketType })`.

Rutele furnizate expun:

- `GET /api/conferences/:conferenceId/sessions`;
- `POST /api/sessions/:sessionId/registrations` cu `{ attendeeId, ticketType }`.

Harness-ul bazei gestionează `sync`, resetarea, popularea și închiderea. Serializatoarele gestionează JSON-ul public; modulul obiectivului gestionează numai metadatele relaționale și operațiile ORM.

## Sarcina ta

Definește în Sequelize relațiile dintre conferințe, sesiuni, participanți și înscrieri. Implementează citirile cerute păstrând cheile străine, câmpurile înscrierii și numărul de interogări cerut.

Lucrează în proiectul `student/` furnizat. Modifică doar `src/conference-model.js`. Cerințele detaliate precizează cazurile, formele datelor și restricțiile pe care trebuie să le respecți. Folosește testele și instrucțiunile de pornire furnizate pentru verificare.

## Comportament obligatoriu

- `Conference`: cheie primară întreagă și `slug` nenul și unic.
- `Session`: cheie primară întreagă, `title`, `startsAt` și cheia externă `conferenceId` nenule, cu ștergere cascade.
- `Attendee`: cheie primară întreagă și `email` nenul și unic.
- `Registration`: model explicit de legătură cu unicitate compusă pe `sessionId` și `attendeeId`, `ticketType` nenul restricționat la `standard|student|speaker` și `registeredAt` implicit la timpul curent.
- Configurează `Conference.hasMany(Session)` / `Session.belongsTo(Conference)` cu aliasurile `sessions` / `conference`.
- Configurează `Session.belongsToMany(Attendee)` / `Attendee.belongsToMany(Session)` prin `Registration`, cu aliasurile `attendees` / `sessions` și chei corespunzătoare.
- Configurează asocierile directe `Session.hasMany(Registration)` și `Attendee.hasMany(Registration)` pentru interogarea explicită a legăturii.
- `listSessionsWithRegistrations` filtrează după `conferenceId`, ordonează sesiunile după `startsAt ASC, id ASC` și încarcă eager participanții ordonați după ID prin înscrieri.
- Fiecare participant încărcat expune `ticketType` și `registeredAt`; interogarea nu selectează atribute fără legătură.
- `registerAttendee` verifică existența ambilor părinți, creează exact un rând, întoarce înscrierea detașată și clasifică sesiunea/participantul lipsă și duplicatul prin clasele furnizate.
- Toate interogările sunt așteptate, iar erorile neașteptate se propagă neschimbate.

## Constrângeri

- JavaScript ESM, Sequelize 6.37.8, sqlite3 6.0.1, cod Express 5 furnizat, `fetch` nativ și runnerul Node; păstrează override-ul `uuid` auditat.
- Implementează numai `src/conference-model.js`; păstrează aplicația, rutele, serializatoarele, fixture-urile, testele și pachetele.
- Folosește asocieri și încărcare eager Sequelize, nu join-uri manuale în memorie, interogări N+1, SQL brut sau tablouri denormalizate duplicate.
- Nu adăuga tranzacții; activitatea atomică este Proiectul 2.
- Testele folosesc baze izolate în memorie și închid fiecare conexiune.

## Criterii observabile de finalizare

- Metadatele demonstrează cheile, aliasurile, modelul through, unicitatea, ștergerea și validatorii.
- Rezultatul populat conține sesiuni cu participanți și date de legătură deterministe, fără N+1.
- Crearea întoarce `201` și `Location` imbricat; repetarea întoarce `409 registration_exists`.
- Părinții lipsă întorc erorile stabile `404`.
- Ștergerea cascade elimină sesiunile și înscrierile dependente.
- Numai `src/conference-model.js` se modifică, iar verificările și auditul trec.

