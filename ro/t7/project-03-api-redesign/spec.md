# Specificația exercițiului — Reproiectarea API-ului de înscriere

## Unitate

Unitatea 07 — Relații, tranzacții și proiectarea API-urilor

## Obiectiv de învățare

Înlocuiește rutele de înscriere bazate pe acțiuni cu URL-urile de resurse specificate. Validează filtrele și paginarea și asigură rezultatul cerut pentru cererile repetate asupra aceleiași înscrieri.

## De ce există acest exercițiu

O asociere ORM nu produce automat un API public bun. Codul generat expune adesea `/register`, `/unregister` sau operații după forma bazei. Trebuie să evaluezi identitatea resursei, semantica metodei, starea URL și observabilitatea clientului, nu să accepți o refactorizare doar pentru că pare mai RESTful.

## Cerințe preliminare

- Conceptele de relații și tabel de legătură din cursul 07. Serviciul este furnizat; finalizarea Proiectului 1 nu este necesară.
- Contractele de rutare, stare și eroare din Unitatea 05 și validarea query-ului închis din Unitatea 06.

## Context inițial

Ai primit o aplicație Express 5 ESM cu:

- un `registrationService` în memorie cu metodele `list({ sessionId, ticketType, limit, offset })`, `put({ sessionId, attendeeId, ticketType })` și `remove({ sessionId, attendeeId })`;
- rezultate și erori fixe, pagină comparativă, asamblarea aplicației, middleware, teste și `naive-action-router.js` păstrat doar pentru audit;
- un `createRegistrationRouter({ service })` incomplet în `src/registration-router.js`, montat la `/api/sessions/:sessionId/registrations` cu `mergeParams: true`.

Identitatea înscrierii este perechea `(sessionId, attendeeId)`. Reprezentările publice conțin `sessionId`, `attendeeId`, `ticketType` și `registeredAt`.

## Sarcina ta

Înlocuiește rutele de înscriere bazate pe acțiuni cu URL-urile de resurse specificate. Validează filtrele și paginarea și asigură rezultatul cerut pentru cererile repetate asupra aceleiași înscrieri.

Lucrează în proiectul `student/` furnizat. Modifică doar `src/registration-router.js`. Cerințele detaliate precizează cazurile, formele datelor și restricțiile pe care trebuie să le respecți. Folosește testele și instrucțiunile de pornire furnizate pentru verificare.

## Comportament obligatoriu

- Căile de mai jos sunt relative la `/api/sessions/:sessionId/registrations`. `GET /` listează înscrierile acelei sesiuni și returnează `{ data, page: { limit, offset, count } }`. `count` este numărul total de înscrieri potrivite înainte de paginare, nu doar dimensiunea paginii returnate.
- `ticketType=standard|student|speaker` opțional filtrează exact.
- `limit` este un întreg zecimal `1..50`, implicit `20`; `offset` este un întreg zecimal `>=0`, implicit `0`.
- Parametrii necunoscuți, repetați, goi, convertiți sau în afara intervalului produc `400 invalid_query` înaintea serviciului.
- `PUT /:attendeeId` acceptă JSON exact `{ ticketType }`; rezultatul `created` returnează `201`, `Location` pentru înscrierea imbricată și `{ data }`, iar `existing` sau `updated` întoarce `200` cu `{ data }`.
- `DELETE /:attendeeId` întoarce `204` fără body atât când elimină înscrierea, cât și când aceasta era absentă.
- Sesiunea sau participantul lipsă devin erori stabile `404`; corpul și tipul media invalid devin `400`/`415` prin clasele furnizate.
- Ruterul nu expune rute-acțiune, nume ORM sau câmpuri interne ale rezultatelor serviciului.
- Fiecare apel folosește ID-urile din cale; body-ul și query-ul nu pot suprascrie identitatea.
- Erorile neașteptate sunt propagate tratării centralizate `500` igienizate.


Idempotent înseamnă că repetarea aceleiași cereri are același efect intenționat asupra stării resursei ca o singură cerere. Răspunsurile pot diferi: primul PUT poate returna 201, iar repetarea 200. DELETE pentru o înscriere absentă presupune că sesiunea și participantul există; părinții lipsă produc tot 404. `mergeParams: true` face sessionId din routerul părinte disponibil routerului imbricat.

## Constrângeri

- JavaScript ESM, Express 5.1.0, `fetch` nativ și runnerul Node; nu este necesară o bază de date.
- Implementează numai `src/registration-router.js`; păstrează dovada naivă, serviciul, aplicația, testele și dependențele.
- Folosește `Router({ mergeParams: true })`; nu remonta aplicația, nu modifica rezultate, nu adăuga aliasuri `/register|/unregister` și nu muta identitatea în body.
- Parsează explicit limbajul închis; nu adăuga pachet de validare.
- Păstrează paginarea cu offset; cursorul poate fi discutat drept variație.

## Criterii observabile de finalizare

- Urmele demonstrează listare, filtrare, paginare, creare `201` cu `Location`, repetare/actualizare `200` și ștergere repetată `204`.
- Query-urile, tipurile media și body-urile invalide nu apelează serviciul și întorc erorile exacte.
- Inventarul rutelor conține numai căile imbricate și metodele deliberate.
- Proza comparativă explică îmbunătățirea identității și idempotență fără a declara universal superioare URL-urile imbricate.
- Toate verificările trec și numai `src/registration-router.js` se modifică.

