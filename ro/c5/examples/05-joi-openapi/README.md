# Exemplu de curs — Validare Joi și o operație OpenAPI

## Concept demonstrat

Poți exprima aceleași reguli prin verificări manuale, o schemă Joi și o descriere OpenAPI. Fiecare are alt scop: verificările în execuție acceptă sau resping valoarea; descrierea arată instrumentelor externe cum funcționează operația HTTP.

## De ce apare acest exemplu în curs

Compară cei doi validatori mici înainte să introduci biblioteca într-un API mai mare. Un singur titlu păstrează vizibile tipul, normalizarea și politica pentru câmpuri necunoscute. Ruta întoarce o sarcină demonstrativă cu ID fix; nu o stochează și nu oferă un GET ulterior. Pentru secvența creare/citire/ștergere folosește exemplul 03.

## Ce trebuie să observi

- `convert: false` împiedică conversia automată. Normalizarea are loc explicit după verificarea tipului.
- `required()` se aplică obiectului și titlului. `unknown(false)` respinge câmpurile suplimentare.
- Un șir format numai din spații cere o verificare explicită după eliminarea lor; verificarea tipului Joi nu ajunge.
- `openapi.json` descrie POST, schema de intrare, răspunsul reușit, Location și erorile posibile. Publicarea nu instalează validarea.
- OpenAPI documentează caracterul diferit de spațiu și eliminarea spațiilor de la capete. Nu face automat un client generat să aplice normalizarea.

## Rulare / examinare

Din directorul exemplului:

```bash
npm ci
npm test
npm start
```

Lasă serverul pornit. În alt terminal:

```bash
curl -i -X POST http://127.0.0.1:3000/api/tasks -H 'Content-Type: application/json' -d '{"title":"  Review notes  "}'
curl -i -X POST http://127.0.0.1:3000/api/tasks -H 'Content-Type: application/json' -d '{"title":12}'
curl http://127.0.0.1:3000/openapi.json
```

Deschide fișierul local `openapi.json` într-un editor compatibil OpenAPI sau importă-l într-un client REST. Găsește `operationId`, titlul obligatoriu, politica pentru câmpuri necunoscute și răspunsul 201. Dacă schimbi PORT, actualizează URL-ul serverului din descriere când trimiți cereri prin instrumentul extern. Oprește serverul cu Ctrl+C.

## Explicație

Verificarea tipului media precedă parserul JSON. Parserul distinge JSON invalid și dimensiunea excesivă. Ruta verifică rezultatul Joi și construiește o valoare nouă pentru aplicație. Doar valorile acceptate ajung la construirea răspunsului. Validatorul manual servește comparației, nu este o a doua verificare în execuție.

## Variații

Prezice ce s-ar întâmpla dacă ai schimba `unknown(false)` în `unknown(true)` sau ai normaliza înainte să verifici tipul. Schimbă o regulă și identifică descrierea OpenAPI și testul care trebuie schimbate împreună cu ea.

## Validare

La 2026-10-26, instalarea curată `npm ci --offline --no-audit --no-fund` și `npm test` au trecut pe Node 24.5.0. Testele compară validatorii, verifică nemodificarea intrării, apoi trimit cereri HTTP reale pentru succes, JSON invalid, câmpuri invalide, tip media neacceptat și dimensiune excesivă. Citesc și descrierea publicată și verifică rezultatele documentate relevante. Sunt verificări punctuale de consistență, nu o suită generală de conformitate OpenAPI.

Pentru documentație și artefacte de interfață generate, continuă cu [exemplul opțional 5b](../05b-generated-openapi/).
