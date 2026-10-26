# Specificația exercițiului — API pentru sarcini în memorie

## Unitate

Unitatea 05 — JavaScript pe server și API-uri REST

## Obiectiv de învățare

Implementează rutele API pentru listarea, crearea, citirea, modificarea și ștergerea sarcinilor. Validează cererile și folosește depozitul de date furnizat.

## De ce există acest exercițiu

Ai construit deja gestionari HTTP direcți. Express trebuie acum să reducă codul repetitiv fără să ascundă contractul cerere/răspuns. Repository-ul în memorie păstrează vizibile rutarea, parsarea, validarea și semantica REST înaintea persistenței.

## Cerințe preliminare

- Unitățile 1–4, în special mesaje HTTP, module JavaScript, căi asincrone de eroare și `fetch` nativ.
- Node.js LTS și npm.
- Capacitatea de a citi middleware Express și module repository mici.

## Context inițial

Ai primit un proiect ESM cu Express 5 care include:

- `src/app.js`, care creează aplicația, activează `express.json`, montează routerul la `/api/tasks` și instalează middleware not-found și de eroare;
- un repository complet injectat, cu date deterministe și metodele `list`, `findById`, `create`, `update`, `remove`;
- o pagină statică la `/` care descrie API-ul;
- teste care pornesc aplicația pe un port local efemer și folosesc `fetch`;
- `createTaskRouter({ repository })` incomplet în `src/task-router.js`.

Sarcinile au exact `id`, `title` și `completed`. ID-urile opace sunt atribuite de repository. Routerul deține parsarea și validarea HTTP; repository-ul deține starea colecției.

## Sarcina ta

Implementează rutele API pentru listarea, crearea, citirea, modificarea și ștergerea sarcinilor. Validează cererile și folosește depozitul de date furnizat.

Lucrează în proiectul `student/` furnizat. Modifică doar `src/task-router.js`. Cerințele detaliate precizează cazurile, formele datelor și restricțiile pe care trebuie să le respecți. Folosește testele și instrucțiunile de pornire furnizate pentru verificare.

## Comportament necesar

- `GET /api/tasks` întoarce `200` și `{ "data": [ ... ] }` în ordinea repository-ului.
- `GET /api/tasks/:taskId` întoarce `200` și `{ "data": task }` când este găsită.
- O sarcină absentă întoarce `404` și `{ "error": { "code": "task_not_found", "message": "Sarcina nu a fost găsită" } }`.
- `POST /api/tasks` acceptă JSON numai cu `title`; elimină spațiile, creează `{ completed: false }` și întoarce `201`, `Location: /api/tasks/<id>` și `{ "data": task }`.
- `PATCH /api/tasks/:taskId` acceptă unul sau ambele câmpuri `title` și `completed`, întoarce `200` și păstrează câmpurile nespecificate.
- `DELETE /api/tasks/:taskId` elimină sarcina și întoarce `204` fără corp sau content type.
- Un corp create/update care nu este obiect JSON simplu, conține câmpuri necunoscute, titlu gol sau `completed` non-boolean întoarce `400` cu `{ "error": { "code": "validation_failed", "message": <mesaj-stabil> } }`.
- O cerere create/update fără `application/json` întoarce `415` cu `{ "error": { "code": "json_required", "message": "Content-Type trebuie să fie application/json" } }`.
- JSON-ul incorect este tratat centralizat drept `400 invalid_json`.
- Gestionarii transmit erorile neașteptate ale repository-ului către tratarea centralizată fără stack trace-uri publice.

## Restricții

- JavaScript, ESM, Node.js LTS, Express 5, `fetch` nativ și test runner-ul Node.
- Folosește `express.json`; fără `body-parser`, Axios, pachet de validare, bază de date sau al doilea framework HTTP.
- Implementează rutele numai în `src/task-router.js`; nu schimba repository-ul, asamblarea, erorile, datele sau testele.
- Potrivește deliberat metoda și ruta; nu folosi verbe de acțiune în căile resurselor.
- Nu trimite corp cu `204`.
- Serverul de validare ascultă local și acceptă port atribuit de sistem.

## Criterii observabile de finalizare

- Comanda documentată afișează un URL local utilizabil și servește pagina statică.
- O secvență `curl`/fetch poate lista, crea, obține, actualiza și șterge respectând contractele.
- Cel puțin un corp invalid, tip media neacceptat, sarcină absentă, JSON incorect și rută necunoscută produc erorile documentate.
- `npm test` raportează trecerea tuturor categoriilor.
- Poți urmări cererea prin parsare, validare, repository și tratarea erorilor.

## Plan de validare (pentru autorii cursului)

### Verificări de bază

- Aplicația pornește/oprește pe un port local efemer și servește `/`.
- Parsarea JSON, not-found, erorile și resetarea deterministă funcționează independent de router.
- Proiectul folosește ESM, lockfile-ul și doar dependențe justificate.

### Verificări de obiectiv

- Căile list/fetch/create/update/delete respectă metodele, stările, `Location`, anvelopele și lipsa corpului.
- Validarea respinge tipurile și câmpurile documentate fără să modifice starea.
- Resursa absentă și tipul media neacceptat folosesc forma standard.
- O eroare injectată ajunge la `500 internal_error` fără scurgerea mesajului sau stivei.

### Verificări de regresie

- JSON-ul incorect rămâne `400 invalid_json` și nu creează o sarcină.
- Rutele API necunoscute rămân `404 not_found`.
- O cerere eșuată nu împiedică o cerere health/list ulterioară.
- Obiectele repository-ului sunt reprezentate fără câmpuri de transport sau mutație.

## Notă pentru autor — pregătirea variantei inițiale

După validarea referinței, copiaz-o și înlocuiește numai înregistrarea rutelor, validarea și logica repository-răspuns din `src/task-router.js` cu scheletul exportat și un TODO. Păstrează toate celelalte fișiere și dependențe.

Aplicația derivată pornește și servește baza statică/not-found. Regresiile independente trec; verificările rutelor cad la `404` până la implementare. Nu trebuie să existe un router complet duplicat în teste, date, documentație sau ieșire.

## Sarcină pentru Codex

> Implementează rutele API pentru listarea, crearea, citirea, modificarea și ștergerea sarcinilor. Validează cererile și folosește depozitul de date furnizat. Modifică doar `src/task-router.js`. Citește această specificație și codul furnizat înainte să editezi. Respectă comportamentul cerut, intrările/ieșirile exacte și restricțiile de aici. Păstrează testele și infrastructura furnizată. Rulează verificările documentate și spune ce trece, ce eșuează și de ce. Explică modificările ca să le pot inspecta.

## Sarcină de depanare/extindere

- Elimină deliberat un `return` după un răspuns de validare. Reproduce trimiterea dublă sau apelul nedorit, diagnostichează fluxul și repară minimal înaintea unei cereri health ulterioare.

## În afara domeniului exercițiului

- Persistență, Sequelize, relații, autentificare, paginare, filtrare, CORS, șabloane, deployment și concurență de producție.
- Abstracții generale pentru router/validare sau un client frontend complet.
