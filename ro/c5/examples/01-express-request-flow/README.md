# Exemplu de curs — Fluxul unei cereri Express

## Concept demonstrat

O cerere Express traversează middleware-ul și o rută potrivită înaintea finalizării răspunsului, iar resursele statice și API pot aparține aceleiași aplicații.

## De ce este inclus acest exemplu

Un fișier HTML, o rută API și un observator fac vizibilă ordinea montării fără CRUD sau validare.

## Ce trebuie observat

- Observatorul rulează înaintea gestionarilor static și API.
- Doar ruta `/api/ping` creează răspunsul JSON.
- Evenimentul `finish` apare după producerea răspunsului.
- `/` și `/api/ping` sunt resurse diferite servite de aceeași aplicație.

## Rulare și examinare

```bash
npm ci
npm test
npm start
```

Lasă serverul pornit și deschide http://127.0.0.1:3000/ în browser. În alt terminal, rulează `curl http://127.0.0.1:3000/api/ping`. Urmărește evenimentele before/route/finish în terminalul serverului. Oprește cu Ctrl+C. Pentru alt port, folosește `PORT=3001 npm start`.

## Explicație

`app.js` înregistrează o pereche înainte/finish în jurul procesării din aval. `express.static` deține pagina, iar ruta explicită deține JSON-ul API. Verificarea pornește un server local pe port efemer și verifică resursele și ordinea evenimentelor.

## Variante

- Mută `express.static` după middleware-ul not-found și examinează eșecul paginii.
- Adaugă un al doilea observator după montarea statică și compară cererile care ajung la el.

## Validare

Validat cu `npm install` și `npm test`; ambele resurse și secvențele middleware/finish exacte trec.

Revalidat la 2026-10-26: instalarea curată și verificările HTTP reale trec pe Node 24.5.0.
