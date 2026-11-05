# Exemplu de curs — Limita de validare a cererii Express

## Concept demonstrat

Parsarea JSON și validarea aplicației sunt pași diferiți. Un endpoint REST trebuie să verifice tipul media, forma exactă a obiectului, câmpurile permise, tipurile, valorile și normalizarea înainte de folosirea intrării.

## Rulare și examinare cu un client REST

```bash
npm install
npm start
curl -i -X POST 'http://127.0.0.1:3000/api/tasks' -H 'Content-Type: application/json' -d '{"title":"  Evaluează limita  "}'
curl -i -X POST 'http://127.0.0.1:3000/api/tasks' -H 'Content-Type: application/json' -d '{"title":"Sarcină","admin":true}'
curl -i -X POST 'http://127.0.0.1:3000/api/tasks' -H 'Content-Type: text/plain' -d '{}'
npm test
```

Comparați `415 unsupported_media_type` cu `400 validation_failed`: ambele resping cererea, dar la limite diferite.

## Validare

`npm test` trimite cereri HTTP reale și verifică tipul media, câmpurile închise, forma obiectului, normalizarea și crearea.


Revalidat la 2026-10-26: instalarea curată și verificările HTTP reale trec pe Node 24.5.0.
