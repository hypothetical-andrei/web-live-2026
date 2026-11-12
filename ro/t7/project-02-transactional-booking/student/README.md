# Rezervare tranzacțională

## Sarcina ta

Rezervă locuri într-o singură tranzacție a bazei de date. Actualizează disponibilitatea, creează rezervarea și înregistrează auditul împreună; anulează toate cele trei operații dacă un pas eșuează.

Modifică doar `src/book-seats.js`. Citește [specificația](../spec.md) pentru cerințele exacte.

## Pornire și examinare

Dacă o comandă pornește un server de dezvoltare, lasă-l să ruleze și folosește alt terminal pentru teste. Oprește serverul cu Ctrl+C când termini.

Instalează cu `npm install`, rulează verificările cu `npm test` și pornește API-ul populat cu `npm start` (port implicit `3000`). `POST /api/events/1/bookings` acceptă `{ "attendeeId": 42, "seats": 2 }`.

`src/book-seats.js` este modulul de rezervare pe care îl completezi. `src/unsafe-book-seats.js` este o comparație intenționat nesigură care face observabile scrierile parțiale; nu este recomandare de producție.

## Verificări înainte și după modificări

Varianta `student/` este intenționat incompletă. Unele verificări eșuează până implementezi sarcina; consultă specificația pentru starea inițială așteptată. În varianta completă, verificările cerute trebuie să treacă. Rulează testele în alt terminal cât timp serverul de dezvoltare rulează.

Începe cu `npm run test:baseline` pentru a verifica infrastructura furnizată. `npm run test:objective` verifică implementarea ta; eșecurile inițiale sunt așteptate. După implementare, rulează `npm test` și verificările în browser/de build/de integrare cerute în specificație.
