# Exemplul 5b — Generează OpenAPI și artefactele interfeței

## Concept demonstrat

Folosește aceeași schemă Joi pentru validarea intrării și generarea OpenAPI. O definiție comună a operației oferă metoda, calea, identificatorul și răspunsurile. Generează din descriere specificația, pagina interactivă Swagger UI și un client JavaScript mic.

## De ce urmează după exemplul 05

Exemplul 05 întreține intenționat openapi.json manual. Varianta opțională arată ce elimină generarea și ce trebuie să declari în continuare. Este o demonstrație însoțitoare, nu încă o temă obligatorie în cursul de 100 de minute.

## Rulare / examinare

```bash
npm ci
npm run generate
npm test
npm start
```

Deschide http://127.0.0.1:3000/docs/. Extinde POST /api/tasks, alege **Try it out**, editează titlul JSON, apoi **Execute**. Observă statusul real, antetul Location și titlul fără spații la capete. Pentru alt port, folosește `PORT=3001 npm start`. Oprește cu Ctrl+C.

`npm start` și `npm test` regenerează automat artefactele prin pre-scripturi. `npm run generate` le exportă fără server.

| Artefact | Locație | Scop |
| --- | --- | --- |
| OpenAPI generat | generated/openapi.json, servit la /openapi.json | Import în instrumente externe pentru documentație sau API. |
| Pagina generată | generated/index.html, servită la /docs/ | Swagger UI construiește intrările și răspunsurile din specificație. JS/CSS sunt servite local din pachetul swagger-ui-dist fixat. |
| Client JavaScript generat | generated/client.js, servit la /client.js | Funcția createTask cu fetch nativ, generată din metodă, cale și operationId. |

Poți folosi clientul și din alt modul:

```js
import { createTask } from "./generated/client.js";
const result = await createTask({ title: "  Review notes  " }, "http://127.0.0.1:3000");
console.log(result.data.title);
```

## Urmărește generarea

1. schemas.js definește formele Joi. Regula pentru text nevid folosește o expresie regulată pe care convertorul o poate reprezenta. Eliminarea spațiilor rămâne comportament explicit al serverului, descris în textul schemei.
2. operation.js numește operația POST, statusul de succes și eșecurile cunoscute. app.js folosește aceleași valori pentru rută și statusuri.
3. openapi.js convertește formele cu joi-to-swagger, apoi asamblează metadatele HTTP. Publică OpenAPI 3.0.3 deoarece convertorul produce scheme 3.0; fișierul manual din exemplul 05 folosește 3.1.1.
4. generate.js scrie cele trei artefacte. Ruta /openapi.json construiește descrierea din aceleași definiții sursă, fără fișier întreținut manual.
5. Swagger UI citește descrierea pentru interfață. Șablonul clientului citește operația asamblată, fără repetarea manuală a URL-ului în client.

Schimbă o regulă Joi, regenerează și inspectează schema și interfața. Testele arată schimbarea lungimii titlului și adăugarea unui câmp întreg fără editarea separată a proprietăților OpenAPI. Editează definițiile sursă, nu fișierele generate.

## Limite

Generarea nu inspectează fluxul Express arbitrar, nu descoperă statusuri nedocumentate și nu înțelege funcții Joi personalizate arbitrare. Metadatele rutei și schemele răspunsurilor cer în continuare declarații explicite. Schemele descriu ieșirea; nu este instalat middleware automat pentru validarea răspunsurilor. Joi continuă să valideze intrarea la execuție.

Generatorul clientului este un șablon mic pentru această operație POST JSON, nu un generator general de SDK OpenAPI. Produce JavaScript, nu interfețe TypeScript. Pagina Swagger este un punct de intrare HTML generat cu resurse locale oferite prin npm, nu un pachet independent cu toate resursele vendor. Generarea nu implementează stocare: ca exemplul 05, API-ul întoarce o sarcină demonstrativă cu ID fix, fără GET ulterior.

## Validare

Instalarea curată, generarea și ambele teste trec pe Node 24.5.0. Verificările compară specificația generată cu cea publicată, exercită erorile, încarcă resursele locale și folosesc clientul generat prin HTTP real. Validarea în browser deschide și Swagger UI, execută POST prin Try it out și importă clientul în Chrome. Consultă auditul unității pentru înregistrarea datată.

Referințe: [joi-to-swagger](https://github.com/Twipped/joi-to-swagger), [distribuția Swagger UI](https://github.com/swagger-api/swagger-ui/tree/main/swagger-ui-dist-package).
