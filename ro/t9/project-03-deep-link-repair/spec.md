# Specificația exercițiului — Repararea eșecului legăturilor profunde

## Unitate

Unitatea 09 — Rutare, formulare și React full-stack

## Obiectiv de învățare

Repară serverul de producție astfel încât deschiderea directă a unei rute React să încarce aplicația. Păstrează erorile API și răspunsurile pentru fișiere lipsă, fără să întorci HTML pentru orice cerere.

## De ce există acest exercițiu

Navigarea în partea clientului poate părea corectă în timpul dezvoltării cu Vite, dar poate eșua după reîmprospătare sau navigare directă în producție. O rută universală care trimite mereu `index.html` poate ascunde resurse lipsă și erori API. Trebuie să raționeze împreună despre cererea browserului, ordinea rutării pe server, fișierele statice și rezolvarea rutelor pe client.

## Cunoștințe preliminare

- Rutele clientului din Proiectul 1, compilările Vite, ordinea middleware-urilor Express, fișierele statice și stările HTTP.
- Capacitatea de a inspecta tipurile de conținut ale cererilor/răspunsurilor și urmele rutelor.

## Context inițial

Ai primit:

- un fixture complet al clientului React Router compilat, cu `/notes`, `/notes/:noteId` și interfață universală, plus fișiere de resurse cu hash și pictograme;
- un ruter API Express furnizat la `/api`, un endpoint de sănătate, erori API/fallback centralizate, jurnalul cererilor, infrastructura server/ascultare și verificări;
- `evidence/broken-server.js`, care păstrează două eșecuri comune: 404 pentru legături profunde în modul numai-static și un fallback HTML universal care maschează `/api`/resursele lipsă;
- `server/create-production-app.js` incomplet, care exportă `createProductionApp({ clientDirectory, apiRouter, requestLog })`.

## Sarcina ta

Repară serverul de producție astfel încât deschiderea directă a unei rute React să încarce aplicația. Păstrează erorile API și răspunsurile pentru fișiere lipsă, fără să întorci HTML pentru orice cerere.

Lucrează în proiectul `student/` furnizat. Modifică doar `server/create-production-app.js`. Cerințele detaliate precizează cazurile, formele datelor și restricțiile pe care trebuie să le respecți. Folosește testele și instrucțiunile de pornire furnizate pentru verificare.

## Comportament necesar

- Creează o aplicație Express a cărei ordine este: limita sănătate/API, middleware-ul fișierelor statice, fallback-ul navigării SPA, gestionarea finală a erorilor/404 pentru non-navigare.
- Livrați resursele/pictogramele existente cu hash, păstrând exact tipul de conținut, corpul fișierului și comportamentul cache furnizat de middleware-ul static.
- Pentru cererile `GET`/`HEAD` care acceptă HTML și sunt în afara `/api`, trimiteți `index.html` compilat, astfel încât accesarea directă a `/notes/42` să poată porni ruterul clientului.
- Nu aplică fallback-ul SPA metodelor diferite de GET/HEAD, rutelor `/api` sau `/api/*`, căilor lipsă asemănătoare resurselor care conțin o extensie de fișier ori cererilor care nu acceptă HTML.
- Păstrează stările/învelișurile ruterului API; rutele API necunoscute returnează JSON `404`, niciodată HTML `200`.
- Resursele lipsă/căile de non-navigare returnează un `404` stabil, text simplu/JSON, cu starea corectă, și niciodată corpul indexului.
- Lipsa `index.html` sau erorile citirii statice ajung la gestionarea centralizată și neutralizată `500`, fără a divulga căi/stive.
- Așteaptă/redirecționați erorile asincrone de trimitere conform comportamentului Express 5 și evită răspunsurile duble.
- Adaugă intrările furnizate în jurnalul cererilor în ordinea reală a middleware-urilor pentru verificările de diagnostic.

## Constrângeri

- JavaScript ESM, Express 5.1.0, clientul compilat/API-ul/testele furnizate, `fetch` nativ și fișier lock fixat.
- Implementează numai `server/create-production-app.js`; păstrează dovada defectă, fixture-ul clientului compilat, ruterul API, infrastructura, testele și dependențele.
- Folosește primitivele Express pentru static/sendFile/rutare; fără server de dezvoltare, proxy, pachet de rescriere cu wildcard, expresii regulate care capturează accidental API-ul/resursele sau recompilarea rezultatului clientului.
- Fallback-ul este o politică de livrare a serverului, nu un înlocuitor pentru interfața universală a clientului.

## Criterii observabile de finalizare

- Urmele live demonstrează că `/`, `/notes/42` și o altă rută a clientului fără extensie returnează indexul HTML și pornesc starea rutei.
- Resursele existente returnează conținutul exact; o resursă lipsă returnează `404` non-HTML.
- API-ul necunoscut rămâne JSON `404`; calea clientului accesată cu POST și navigarea care acceptă JSON nu primesc indexul.
- Ordinea jurnalului cererilor explică limita care a gestionat fiecare cerere reprezentativă.
- Verificările/auditul trec și numai `server/create-production-app.js` se modifică.

## Plan de validare (pentru autorii cursului)

### Verificări de bază

- Fixture-ul compilării clientului/marcajul ruterului, ruterul API, infrastructura server/ascultare, jurnalul cererilor și ambele moduri defecte furnizate reproduc independent eșecurile lor distincte.

### Verificările obiectivului

- Inventarul/ordinea middleware-urilor și urmele exacte înregistrate.
- Cereri GET/HEAD către rădăcină/căi imbricate directe ale clientului, cu acceptare HTML.
- Resurse existente/lipsă, căi asemănătoare extensiilor și tipurile de conținut/corpurile.
- Rezultatele API cunoscute/necunoscute și excluderile non-HTML/non-idempotente.
- Neutralizarea și redirecționarea erorilor pentru indexul lipsă/fișierele statice, fără trimitere dublă.
- Cererile respinse nu compromit o navigare eligibilă ulterioară.
- Sursa obiectivului nu conține proxy de dezvoltare, fallback universal `200`, divulgarea căilor, modificarea importului API sau scurtături de citire brută a fișierelor.

### Verificări de regresie

- Serverul pornește/se oprește curat, iar sănătatea rămâne independentă.
- Marcajul universal al clientului rămâne prezent, iar artefactele compilate rămân identice la nivel de octet.
- Cererile respinse către legături profunde nu compromit cererile ulterioare de sănătate/API/resurse.
- Ruterul API, sursa/compilarea clientului, dovada defectă și infrastructura serverului rămân cele furnizate și pot fi executate.

## Notă pentru autori — pregătirea proiectului inițial

După validarea referinței, copiați referința și înlocuiți numai `server/create-production-app.js` cu adaptorul-dovadă defect furnizat, numai-static, plus TODO-uri focalizate. Serverul pornește, sănătatea/API-ul/resursele funcționează, iar eșecul de bază este observabil; legăturile profunde directe ale clientului returnează `404` până la reparare.

Contraexemplul fallback-ului universal rămâne o dovadă nemontată. Niciun predicat/nicio ordine corectă a fallback-ului nu este duplicată în comentarii, teste, fixture-uri sau fișiere generate.

## Sarcină Codex

> Repară serverul de producție astfel încât deschiderea directă a unei rute React să încarce aplicația. Păstrează erorile API și răspunsurile pentru fișiere lipsă, fără să întorci HTML pentru orice cerere. Modifică doar `server/create-production-app.js`. Citește această specificație și codul furnizat înainte să editezi. Respectă comportamentul cerut, intrările/ieșirile exacte și restricțiile de aici. Păstrează testele și infrastructura furnizată. Rulează verificările documentate și spune ce trece, ce eșuează și de ce. Explică modificările ca să le pot inspecta.

## Sarcină de depanare/extindere

- Elimină excluderea extensiei de fișier și cere `/assets/missing.js` cu `Accept: text/html`. Explică de ce un răspuns `200` cu indexul compromite semantica resurselor/depanării/cache-ului, apoi restaurați fallback-ul restrâns.

## În afara scopului

- SSR, adaptoare de găzduire pentru framework-uri, configurarea CDN, autentificare, service workers, hărți ale surselor, compresie sau reglarea cache-ului de producție dincolo de comportamentul static furnizat.
