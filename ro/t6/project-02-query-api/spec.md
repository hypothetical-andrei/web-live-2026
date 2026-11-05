# Specificația exercițiului — API de interogare

## Unitate

Unitatea 06 — Persistență cu Sequelize și SQLite

## Obiectiv de învățare

Validează parametrii interogării API și transformă valorile acceptate în opțiuni Sequelize. Asigură filtrarea, căutarea, sortarea, selecția câmpurilor și limitele de rezultate specificate.

## De ce există acest exercițiu

CRUD ascunde o mare parte din activitatea de persistență. Parametrii devin utili numai când tipurile, valorile permise, operatorii ORM, proiecția și ordinea stabilă sunt explicite. Un translator dedicat păstrează contractul inspectabil și testabil independent de Express și SQLite.

## Cerințe preliminare

- API-ul de notițe persistente și elementele de bază ale modelelor și interogărilor Sequelize.
- Parametri URL, validare strictă, transformări de tablouri/obiecte și anvelope API.

## Context inițial

Ai primit o aplicație Express/Sequelize completă, cu bază deterministă în memorie, model `Note` populat, ciclu de viață, serializator, pagină statică și ruta `GET /api/notes`. Ruta transmite `request.query` funcției incomplete `buildNoteQuery(query)` din `src/note-query.js`, apoi apelează `Note.findAll(options)` și întoarce `{ data }`.

Parametrii acceptați sunt `owner`, `archived`, `search`, `sort` și `fields`. Fiecare poate apărea cel mult o dată. Parametrii necunoscuți sau repetați sunt respinși înainte de execuția Sequelize.

## Sarcina ta

Validează parametrii interogării API și transformă valorile acceptate în opțiuni Sequelize. Asigură filtrarea, căutarea, sortarea, selecția câmpurilor și limitele de rezultate specificate.

Lucrează în proiectul `student/` furnizat. Modifică doar `src/note-query.js`. Cerințele detaliate precizează cazurile, formele datelor și restricțiile pe care trebuie să le respecți. Folosește testele și instrucțiunile de pornire furnizate pentru verificare.

## Comportament obligatoriu

- Fără parametri, returnează toate notițele după `updatedAt` descendent și `id` ascendent drept departajare deterministă.
- `owner=<nonblank>` filtrează proprietarul exact după trim.
- `archived=true|false` filtrează booleanul exact; nicio altă formă sau coerciție nu este acceptată.
- `search=<nonblank>` caută în titlu un subșir fără diferențierea literelor mari și mici folosind expresia Sequelize portabilă pentru SQLite; wildcard-urile sunt text literal, nu SQL brut.
- `sort=updated_desc|updated_asc|title_asc` se mapează numai la perechile documentate și adaugă mereu `id` ascendent drept criteriu final.
- `fields` este o submulțime separată prin virgulă din `title`, `owner`, `archived` și `updatedAt`; curăță intrările, respinge numele goale, necunoscute sau duplicate și include mereu `id`.
- Combină filtrele cu semantică AND într-o singură opțiune `where`.
- Omite `where` sau `attributes` când nu există constrângerea corespunzătoare.
- Returnează un obiect nou de opțiuni și nu modifică `query`.
- Datele invalide aruncă `QueryValidationError` cu `code: 'invalid_query'` și un mesaj care numește numai parametrul invalid, fără SQL generat.
- Middleware-ul furnizat mapează eroarea la `400` cu structura standard de eroare; celelalte erori ale bazei sunt răspunsuri `500` igienizate.

## Constrângeri

- JavaScript ESM, Sequelize stabil 6.x, SQLite, cod Express 5 furnizat, `fetch` nativ și runnerul Node.
- Implementează numai `src/note-query.js`; nu edita ruta, modelul, datele inițiale, middleware-ul sau testele.
- Folosește operatori și funcții Sequelize, nu SQL brut ori filtrare, sortare sau proiecție ulterioară în memorie.
- Nu accepta coloane sau direcții arbitrare din cerere.
- Păstrează limbajul deliberat mic; fără paginare sau asocieri.

## Criterii observabile de finalizare

- Verificările translatorului și integrării trec.
- Cererile demonstrează un filtru combinat, fiecare sortare și o proiecție.
- Parametrii invalizi, repetați sau necunoscuți întorc `400 invalid_query` fără interogarea modelului.
- Valorile primare egale întorc mereu ID-uri ascendente.
- SQL-ul generat poate fi inspectat în depanare, dar nu apare în erorile publice.
- Se modifică numai `src/note-query.js`.

## Plan de validare (pentru autorii cursului)

### Verificări de bază

- Conexiunea, modelul, datele inițiale, ruta, serializatorul și erorile furnizate funcționează cu un obiect fix de opțiuni.
- Datele inițiale fac determinist fiecare rezultat.

### Verificările obiectivului

- Testele unitare inspectează structura exactă `where`, `order` și `attributes` pentru fiecare parametru și combinație.
- Integrarea demonstrează rândurile, sortările, departajarea și proiecțiile.
- Booleanii, spațiile, sortările, câmpurile, duplicatele, repetările și parametrii necunoscuți invalizi eșuează înainte de `findAll`.
- Datele de intrare înghețate rămân neschimbate.

### Verificări de regresie

- Listarea implicită și comportamentul furnizat pentru sănătate, pagina statică și erori rămân funcționale.
- Valorile nu pot injecta atribute, direcții, fragmente SQL sau detalii interne.
- După o interogare eșuată, una validă reușește.
- Instanțele bazei sunt închise după fiecare test.

## Notă pentru autor — pregătirea variantei inițiale

După validarea referinței, copiaz-o și înlocuiește numai validarea și traducerea din `src/note-query.js` cu shell-ul exportat `QueryValidationError` și un translator TODO care întoarce ordinea implicită deterministă. Păstrează toate celelalte fișiere.

Aplicația rămâne rulabilă și listarea nefiltrată funcționează. Verificările pentru filtre, sortări, proiecții și date invalide eșuează documentat. Valoarea implicită nu dezvăluie maparea parametrilor accepta.

## Sarcină pentru Codex

> Validează parametrii interogării API și transformă valorile acceptate în opțiuni Sequelize. Asigură filtrarea, căutarea, sortarea, selecția câmpurilor și limitele de rezultate specificate. Modifică doar `src/note-query.js`. Citește această specificație și codul furnizat înainte să editezi. Respectă comportamentul cerut, intrările/ieșirile exacte și restricțiile de aici. Păstrează testele și infrastructura furnizată. Rulează verificările documentate și spune ce trece, ce eșuează și de ce. Explică modificările ca să le pot inspecta.

## Sarcină de depanare/extensie

- Elimină departajarea prin ID dintr-o sortare și folosește valori egale. Reproduce ordinea incompletă, apoi restabilește ordinea deterministă explicită.

## În afara scopului

Paginare, căutare full-text, ranking, asocieri, tranzacții, SQL brut, căutare de producție specifică bazei sau controale UI.
