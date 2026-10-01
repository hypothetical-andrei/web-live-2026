# Specificația exercițiului — Sarcină de remediere cu Codex

## Unitate

Unitatea 01 — Web-ul ca sistem + dezvoltare asistată de IA

## Obiectiv de învățare

Diagnosticarea a trei defecte HTTP delimitate pe baza verificărilor eșuate din
execuție și repararea lor fără rescrierea codului funcțional fără legătură cu
problema: un răspuns are datele corecte, dar tipul de conținut greșit, o
ramură de validare comite un răspuns de eroare și apoi se prăbușește pentru
că execuția continuă după trimiterea headerelor, iar un răspuns vechi trebuie
normalizat la contractul public.

## De ce există acest exercițiu

Dezvoltarea asistată de IA este mai utilă când studenții pot delimita o
remediere, îi pot examina aria și îi pot demonstra comportamentul. Exercițiul
pornește de la un serviciu mic cu trei buguri distincte, dar realiste.
Studentul trebuie să separe cazurile, să păstreze remedierea locală și să
verifice fiecare corecție cu teste și dovezi HTTP reale.

## Cerințe preliminare

- Vocabularul cerere/răspuns HTTP din Proiectele 1 și 2.
- Capacitatea de a citi module JavaScript mici și erori de test.
- Familiaritate cu rularea scripturilor npm țintite, inspectarea diff-urilor și
  verificarea răspunsurilor cu `curl`.

## Context inițial

Proiectul este un serviciu Node ESM fără dependențe, pentru un set fix de
indicii. Sunt furnizate shell-ul serverului, parsarea URL-ului și a corpului,
ruta de stare, comportamentul fallback și `legacy-result.js`. Studenții nu
trebuie să rescrie producătorul vechi. Suprafața de remediere delimitată în
varianta pentru student este `src/server.js` plus
`src/normalize-contract.js`, unde se află controlul fluxului de validare și
adaptarea dintre descriptorii vechi și contractul public.

Operațiile acceptate sunt:

- listarea indiciilor prin `GET /api/clues`;
- crearea unui indiciu prin `POST /api/clues`, cu un corp JSON
  `{ "text": "..." }`;
- solicitarea unui indiciu inexistent prin `GET /api/clues/missing`.

## Comportament necesar

- Listarea întoarce `200`, tip de conținut JSON și
  `{ "data": [{ "id": "clue-1", "text": "crumbs" }] }`.
- Datele listării sunt deja corecte, dar răspunsul public nu trebuie să
  expună antetul vechi `text/plain`.
- Crearea reușită întoarce `201`, tip de conținut JSON,
  `Location: /api/clues/clue-2` și
  `{ "data": { "id": "clue-2", "text": <valoarea-trimisă> } }`.
- Eșecul validării la creare pentru un câmp `text` lipsă sau gol întoarce
  `422`, tip de conținut JSON și
  `{ "error": { "code": "text_required", "message": "Textul este obligatoriu" } }`.
- Ramura de validare a creării trebuie să finalizeze exact un răspuns; nu are
  voie să continue spre un crash de tip headers-sent după comiterea
  răspunsului de eroare.
- Resursa inexistentă întoarce `404`, tip de conținut JSON și
  `{ "error": { "code": "clue_not_found", "message": "Indiciul nu a fost găsit" } }`.
- `normalizeContract` mapează doar operațiile vechi cunoscute la acești
  descriptori publici și nu modifică rezultatul vechi.
- JSON-ul invalid continuă să întoarcă eroarea furnizată `400 invalid_json`,
  iar rutele necunoscute continuă să întoarcă fallback-ul furnizat
  `404 not_found`.

## Restricții

- JavaScript ESM, Node.js LTS și doar API-uri încorporate.
- Nu modificați `legacy-result.js`, testele, dependențele sau setul de rute ca
  parte a lucrului studentului.
- Păstrați remedierea limitată la `src/server.js` și
  `src/normalize-contract.js`.
- Nu rescrieți arhitectura serviciului și nu înlocuiți producătorul vechi.
- Păstrați forma de eroare JSON a cursului
  `{ "error": { "code", "message" } }` pentru eșecurile reparate.
- Ascultați pe interfața locală și acceptați porturi efemere.

## Criterii observabile de finalizare

- Verificările inițiale de obiectiv demonstrează tipul de conținut greșit
  pentru listare, eroarea de dublu send la creare invalidă și răspunsul
  nenormalizat pentru resursa lipsă, în timp ce verificările de bază și de
  regresie rămân verzi.
- Diff-ul final este limitat la `src/server.js` și
  `src/normalize-contract.js`.
- Toate verificările automate trec după remediere.
- `curl -i` arată tip de conținut JSON pentru listare, `422` pentru creare cu
  text lipsă și `404` plus eroarea structurată pentru indiciul inexistent.
- Studentul poate explica ce bug era o problemă de headere, ce bug era o
  problemă de control al fluxului și ce bug era o problemă de normalizare.

## Plan de validare

### Verificări de bază

- Pornirea serverului și `GET /health` funcționează independent de remediere.
- Producătorul vechi rămâne intenționat neschimbat și continuă să expună
  valorile naive documentate:
  listarea are tipul de conținut greșit, iar resursa lipsă raportează în
  continuare rezultatul greșit.

### Verificări de obiectiv

- Listarea păstrează datele corecte despre indicii, iar răspunsul public
  folosește tip de conținut JSON.
- Eșecul validării la creare întoarce contractul `422 text_required` și nu
  strică o cerere ulterioară de stare.
- Resursa lipsă folosește `404` și eroarea structurată standard.
- Normalizarea nu modifică o intrare veche înghețată.

### Verificări de regresie

- Crearea reușită folosește în continuare `201`, antetul `Location` cerut și
  anvelopa `data`.
- JSON-ul invalid la creare întoarce eroarea furnizată `400 invalid_json`.
- Rutele necunoscute întorc eroarea furnizată `404 not_found`.
- O cerere eșuată spre o rută necunoscută nu împiedică o cerere ulterioară de
  stare.

## Lucrul prevăzut pentru student

După validarea referinței, aceasta este copiată și se elimină doar
implementarea delimitată din `src/server.js` și `src/normalize-contract.js`.
Logica reală de normalizare pentru listare și resursa lipsă este înlocuită cu
un TODO care întoarce rezultatul vechi nemodificat, iar finalizarea sigură a
ramurii `422` de validare este eliminată astfel încât execuția să continue după
trimiterea headerelor.

Serviciul incomplet rămâne executabil: testele de bază și de regresie trec, în
timp ce verificările de obiectiv expun defectul de tip de conținut, defectul de
dublu send la creare invalidă și defectul de normalizare pentru resursa lipsă.

## Sarcină pentru Codex

> Diagnostichează verificările de obiectiv eșuate și examinează
> `src/legacy-result.js`, `src/server.js`, `src/normalize-contract.js` și
> traseul de send al serverului. Repară doar `src/server.js` și
> `src/normalize-contract.js`; nu modifica producătorul vechi, testele sau
> setul de rute. Păstrează datele listării, dar corectează tipul de conținut
> public, oprește ramura de creare invalidă după comiterea răspunsului `422` și
> normalizează răspunsul pentru indiciul lipsă la contractul de eroare
> documentat. Sarcina este finalizată când verificările țintite de obiectiv și
> întreaga suită trec, iar diff-ul atinge doar aceste două fișiere. Explică
> fiecare corecție de headere, control al fluxului și formă a corpului înainte
> să modifici codul.

Studenții își scriu mai întâi propriul diagnostic pe baza testelor și a
dovezilor obținute prin `curl`, îl compară cu diagnosticul Codex, inspectează
diff-ul propus și rerulează independent atât căile de succes, cât și pe cele
de eșec.

## Sarcină de depanare/extindere

- Adăugați un test nou care eșuează și cere un răspuns de ștergere
  `204 No Content`, apoi cereți-i lui Codex cea mai mică extensie a
  contractelor serverului și normalizării. Respingeți orice propunere care
  trimite un corp JSON împreună cu `204` și explicați de ce.

## În afara domeniului exercițiului

- Persistență, identificatori furnizați de utilizator, un API CRUD complet,
  Express, autentificare sau middleware generalizat.
- Rescrierea producătorului vechi intenționat naiv.
- Refactorizare amplă sau regenerarea serviciului.
