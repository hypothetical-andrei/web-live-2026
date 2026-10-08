# Specificația exercițiului — Dataset Transformer

## Unitate

Unitatea 02 — JavaScript pentru citirea și modificarea programelor

## Obiectiv de învățare

Implementează și explică o aplicație JavaScript mică, în memorie, care folosește funcții și operații de ordin superior pentru tablouri ca să transforme o listă de sarcini într-un sumar determinist fără să schimbe lista-sursă.

## De ce există acest exercițiu

Începutul arată felul obișnuit în care se simte JavaScript: valorile au tipuri diferite, funcțiile pot fi transmise metodelor de tablou, iar un flux lizibil poate remodela un set mic de date. Este o aplicație simplă în memorie, astfel încât fișierele și opțiunile din linia de comandă să nu distragă atenția de la expresii, callback-uri, `filter`, `map`, `sort` și `reduce`.

## Cerințe preliminare

- Experiența din Unitatea 1 cu linia de comandă și JSON.
- Capacitatea de a citi expresii și funcții JavaScript de bază.

## Context inițial

Studenții primesc o aplicație Node ESM fără dependențe, cu un tablou mic de sarcini în memorie, formatarea ieșirii, teste și funcția incompletă `transformTasks(tasks, options)` din `src/transform-tasks.js`.

Fiecare sarcină are `id`, `title`, `owner`, `status` și valoarea numerică `estimate`. Opțiunile conțin `owner` (șir sau `null`) și `minimumEstimate` (număr).

## Comportament necesar

- Respinge un set de date care nu este tablou cu `TypeError('tasks trebuie să fie un tablou')`.
- Selectează doar sarcinile cu starea `open`, estimarea cel puțin egală cu `minimumEstimate` și proprietarul corespunzător când este furnizat filtrul.
- Întoarce un obiect nou care conține:
  - `tasks`: obiecte noi doar cu `id`, `title` fără spații marginale, `owner` și `estimate`, sortate descrescător după estimare și apoi crescător după id;
  - `count`: numărul sarcinilor selectate;
  - `totalEstimate`: suma estimărilor selectate;
  - `owners`: proprietarii unici selectați în ordine alfabetică ascendentă.
- Nu modifica tabloul de intrare sau obiectele-sarcină.
- Aplicația afișează sumarul întors ca JSON formatat.

## Restricții

- JavaScript ESM și Node.js LTS, fără dependențe.
- Aplicația nu primește argumente în linia de comandă și nu citește fișiere; proiectele următoare adaugă deliberat aceste interfețe.
- Folosește operații de tablou (`filter`, `map`, `sort`, `reduce`) acolo unde fac fluxul lizibil.
- Folosește forma de sarcină furnizată; verificările detaliate de tip și limita prototipurilor aparțin proiectului final de audit.
- Lucrul studentului este limitat la `src/transform-tasks.js`.

## Criterii observabile de finalizare

- `npm start` afișează sumarul specificat pentru eșantionul din memorie.
- Selecția goală produce `tasks`/`owners` goale, `count: 0` și `totalEstimate: 0`.
- Toate verificările trec, iar intrarea înghețată rămâne neschimbată.
- Studentul poate descrie valoarea și tipul la fiecare etapă a fluxului.

## Plan de validare

### Verificări de bază

- Aplicația pornește și afișează JSON valid independent de transformarea incompletă.

### Verificări de obiectiv

- Sumarele implicit și filtrat corespund exact ieșirii așteptate.
- Departajarea, eliminarea spațiilor din titlu, proiecția, unicitatea și selecția goală funcționează.
- Intrările care nu sunt tablouri produc eroarea documentată.

### Verificări de regresie

- Intrarea înghețată în profunzime nu este modificată.
- Obiectele-opțiune ale apelantului rămân neschimbate.
- Aplicația emite JSON valid la succes.

## Lucrul prevăzut pentru student

Copiază referința validată, apoi înlocuiește doar `transformTasks` din `src/transform-tasks.js` cu un TODO care întoarce un sumar gol. Păstrează exportul și toate celelalte fișiere. Verificările de bază și regresie rămân valide deoarece substitutul nu modifică intrarea și emite JSON valid; verificările de obiectiv eșuează până la implementarea transformării.

## Sarcină pentru Codex

> Examinează mai întâi eșantionul din memorie, aplicația, eșecurile țintite și `src/transform-tasks.js` fără să editezi. Explică felul în care valorile trec prin fluxul `filter`/`map`/`sort`/`reduce și identifică formele intrării/ieșirii și riscurile de mutație. Apoi implementează doar modulul transformării. Nu adăuga dependențe și nu modifica testele sau aplicația. Sarcina este finalizată când toate verificările trec, sumarul corespunde unui calcul manual, iar diferența schimbă un singur fișier. Arată diferența și explică rolul fiecărui callback.

Studentul verifică diferența pentru mutații, ordonare instabilă și schimbări în afara domeniului înainte să ruleze verificările și să compare manual ieșirea aplicației.

## Sarcină de depanare/extindere

- Introdu o sortare în loc a obiectelor de intrare selectate, observă eșecul intrării înghețate și cere-i lui Codex cea mai mică remediere. Explică de ce simpla clonare a tabloului exterior poate să nu protejeze obiectele imbricate.

## În afara domeniului exercițiului

- Intrare/ieșire din fișiere, parsarea argumentelor CLI, fluxuri, baze de date, date la distanță, prompturi interactive sau TypeScript.
