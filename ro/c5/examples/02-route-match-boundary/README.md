# Exemplu de curs — Potrivirea rutelor Express

## Concept demonstrat

Express selectează o rută din metoda HTTP și pathname. Parametrii căii identifică o resursă, iar parametrii query rafinează reprezentarea unei colecții.

## Ce trebuie observat

- `GET` și `POST` pe `/api/tasks` ajung la handler-e diferite.
- `GET /api/tasks?completed=true` se potrivește tot cu ruta colecției.
- `GET /api/tasks/:taskId` expune `request.params.taskId`.
- O metodă nesuportată ajunge la handler-ul final `404 route_not_found`.

## Rulare și examinare cu un client REST

```bash
npm install
npm start
curl -i 'http://127.0.0.1:3000/api/tasks?completed=true'
curl -i 'http://127.0.0.1:3000/api/tasks/t-1'
curl -i -X DELETE 'http://127.0.0.1:3000/api/tasks'
npm test
```

În VS Code, aceleași cereri pot fi salvate într-un fișier `.http` pentru REST Client. Examinați metoda, URL-ul, statusul și JSON-ul, nu numai body-ul.

## Explicație și validare

Express parsează URL-ul, alege un singur handler specific metodei și expune separat datele path și query. `npm test` pornește aplicația Express pe un port loopback efemer și verifică rutele de colecție, membru, query și ruta fără corespondent.


Revalidat la 2026-10-26: instalarea curată și verificările HTTP reale trec pe Node 24.5.0.
