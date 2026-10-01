# Specificatia exercitiului — Server HTTP minimal

## Unitate

Unitatea 01 — Web-ul ca sistem si dezvoltarea asistata de AI

## Obiectiv de invatare

Urmarirea modului in care un server HTTP Node foarte mic serveste fisiere si
endpointuri de procesare, apoi implementarea unei singure rute lipsa bazate pe
cale, care transforma datele cererii intr-un raspuns JSON deliberat.

## De ce exista exercitiul

Detectiv HTTP a aratat protocolul din exterior. Acest proiect expune structura
serverului din spatele traficului: unele cereri citesc fisiere, altele
calculeaza un raspuns din query sau corp, iar o ruta lipsa ii cere studentului
sa adauge procesare pe baza de pathname fara abstractii de framework.

## Cerinte preliminare

- Detectiv HTTP finalizat sau experienta echivalenta de inspectare
  cerere/raspuns.
- Functii, conditii, siruri, obiecte si citirea `async`/`await` in JavaScript.
- Node.js LTS, `curl` si un browser sau un client HTTP precum Thunder Client.

## Context initial

Proiectul este o aplicatie ESM fara dependente. Studentii primesc:

- un shell functional cu port loopback efemer;
- rutele furnizate `GET /health`, `GET /` si `GET /assets/site.css`;
- o ruta functionala de procesare pe baza de query la
  `GET /api/greetings?name=<value>`;
- o ruta functionala de procesare pe baza de corp la `POST /api/echo`;
- fallbackuri centralizate `404` si `500`, scripturi si teste.

In varianta pentru student este eliminata numai ramura bazata pe cale din
`handleApplicationRequest(request, response, url)`. Studentul studiaza
exemplele functionale pentru fisier/query/corp si adauga comportamentul lipsa
pentru `GET /api/greetings/<name>`.

## Comportament obligatoriu

Proiectul complet ofera exact aceste rute observabile:

- `GET /` citeste `public/index.html` de pe disc si il returneaza cu `200` si
  un tip de continut HTML.
- `GET /assets/site.css` citeste `public/site.css` de pe disc si il
  returneaza cu `200` si un tip de continut CSS.
- `GET /api/greetings?name=<value>` returneaza `200`, declara
  `application/json` si returneaza
  `{ "message": "Hello, <value>!", "source": "query" }`.
- Daca valoarea query `name` lipseste sau devine goala dupa `trim`,
  `GET /api/greetings` returneaza `400` cu `{ "error": "name_required" }`.
- `GET /api/greetings/<name>` returneaza `200`, declara `application/json` si
  returneaza `{ "message": "Hello, <value>!", "source": "path" }`, unde
  `<value>` este ultimul segment de cale decodat si apoi trecut prin `trim`.
- Daca segmentul de cale decodat este gol dupa `trim`,
  `GET /api/greetings/<name>` returneaza `400` cu
  `{ "error": "name_required" }`.
- `POST /api/echo` accepta un corp JSON, returneaza `201`, declara
  `application/json`, adauga `X-Echoed-Method: POST` si returneaza valoarea
  trimisa neschimbata.
- Daca tipul pentru `POST /api/echo` nu este `application/json`, returneaza
  `415` cu `{ "error": "json_required" }` fara sa parseze corpul.
- JSON-ul incorect produce `400` cu `{ "error": "invalid_json" }`.
- Handlerul returneaza un boolean care indica tratarea cererii; shell-ul
  furnizat detine fallbackul.

## Constrangeri

- JavaScript ESM, Node.js LTS si numai API-uri incluse.
- `node:http`, fara Express sau dependenta de rutare.
- Cititi fisierele direct de pe disc pentru rutele statice furnizate.
- Cititi asincron corpul cererii pentru ruta JSON de echo.
- Ascultati numai pe loopback; testele folosesc un port atribuit de sistem.
- Setati explicit starea si tipul de continut.
- Studentul nu modifica shell-ul, fisierele statice, ruta de baza,
  fallbackurile sau testele.

## Criterii observabile de finalizare

- Comanda documentata afiseaza un URL loopback utilizabil.
- O cerere din browser catre `/` incarca pagina si stylesheetul furnizate de pe
  disc.
- `curl` sau Thunder Client demonstreaza un raspuns de fisier, un raspuns bazat
  pe query, un raspuns bazat pe cale si un raspuns bazat pe corp.
- Starea, headerele relevante si corpurile JSON respecta contractul.
- `npm test` trece verificarile de baza, obiectiv si regresie.
- Studentul poate explica ce cereri citesc un fisier, ce cereri proceseaza
  query, ce cereri proceseaza un segment de cale si ce cereri proceseaza corpul.

## Plan de validare

### Verificari de baza

- Serverul porneste si se opreste curat pe un port loopback efemer.
- `GET /health` returneaza `200` si `{ "status": "ok" }` independent de
  handlerul obiectivului.
- `GET /` si `GET /assets/site.css` servesc text de pe disc cu tipurile de
  continut asteptate.

### Verificarile obiectivului

- Ruta lipsa bazata pe cale returneaza payloadul de succes documentat si tip de
  continut JSON.
- Ruta bazata pe cale decodeaza spatiile escape-uite ca `%20`, taie rezultatul
  cu `trim` si returneaza numele obtinut.
- Un segment de cale decodat gol produce eroarea `400` specificata.

### Verificari de regresie

- Ruta bazata pe query inca valideaza si foloseste valoarea din query.
- Ruta de echo inca returneaza `201`, valoarea JSON trimisa, tip JSON si
  `X-Echoed-Method`.
- Tipul neacceptat si JSON-ul incorect inca produc erorile specificate.
- Caile necunoscute si metodele neacceptate inca returneaza raspunsul JSON
  `404` furnizat.
- O cerere esuata nu impiedica o cerere ulterioara de sanatate.

## Munca destinata studentului

Dupa validarea referintei, copiati referinta validata si eliminati numai
ramura din `handleApplicationRequest` care trateaza
`GET /api/greetings/<name>`. Pastrati functionale ruta de salut bazata pe
query, ruta de echo bazata pe corp, comportamentul de servire a fisierelor,
testele si restul infrastructurii.

Responsabilitatea specifica a studentului este sa reintroduca ruta lipsa
bazata pe cale in `student/src/application-handler.js`. Verificarile de baza si
regresie trebuie sa treaca. Verificarile obiectivului trebuie sa esueze deoarece
ruta lipsa bazata pe cale ajunge la fallbackul `404` furnizat.

## Sarcina Codex

> Inspectati `src/server.js`, `src/application-handler.js` si testele
> obiectivului. Implementati numai ramura lipsa `GET /api/greetings/<name>` din
> `handleApplicationRequest`; nu schimbati shell-ul serverului, fisierele
> statice, testele sau dependentele. Decodati ultimul segment de cale,
> aplicati `trim`, returnati exact contractul JSON documentat si pastrati
> rutele existente bazate pe query/corp. Sarcina este finalizata cand trec
> toate verificarile npm si diff-ul ramane in fisierul permis. Aratati-mi
> diff-ul si indicati locul in care ruta bazata pe cale devine raspuns tratat in
> loc sa ajunga la `404`.

Studentul trebuie sa inspecteze diff-ul propus, sa respinga schimbarile din
afara fisierului numit, sa ruleze fiecare categorie de teste, sa inspecteze
manual un raspuns de fisier plus cate o cerere bazata pe query, cale si corp cu
`curl` sau Thunder Client si sa explice contractul boolean al handlerului.

## Sarcina de depanare/extensie

- Eliminati intentionat `return`-ul de dupa un raspuns de eroare pentru salut.
  Reproduceti esecul de raspuns dublu, cereti Codex diagnosticul cauzei minime
  din stack trace, reparati si verificati atat eroarea, cat si cererea
  ulterioara de sanatate.

## In afara domeniului

- Express, persistenta, autentificare, CORS, template-uri dincolo de fisierul
  static furnizat sau deployment de productie.
- Un framework general de rutare sau strat de abstractizare.
- Tratarea limitelor de dimensiune pentru corp, streaming pentru corpuri mari
  sau alte tipuri media decat JSON pentru endpointurile de procesare.
