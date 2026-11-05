# Serviciul de rezervări

## Sarcina ta

Găsește și repară greșelile modelului și salvării rezervărilor. Aplică restricțiile cerute, așteaptă operațiile bazei de date și întoarce rezultatele cerute fără să înlocuiești rutele HTTP.

Modifică doar `src/models/reservation.js`, `src/reservation-store.js`. Citește [specificația](../spec.md) pentru cerințele exacte.

## Pornire și examinare

Dacă o comandă pornește un server de dezvoltare, lasă-l să ruleze și folosește alt terminal pentru teste. Oprește serverul cu Ctrl+C când termini.

Rulează `npm ci` și `npm start`; deschide URL-ul loopback afișat. Baza SQLite de dezvoltare este în memorie și se resetează la repornire. Folosește `/api/reservations` pentru listare sau trimite JSON cu `code`, `guestName` și `seats`.

Rulează `npm run test:baseline`, `npm run test:regression` și `npm run test:objective`. Baza și regresiile trec în varianta inițială; testele de obiectiv expun comportamentul incorect al persistării. Toate verificările trec în referință.

Investighează folosind spec.md și propriile cereri. Repară doar `src/models/reservation.js` și `src/reservation-store.js`; păstrează codul HTTP, testele, erorile comune și conexiunea furnizate.

## Verificări înainte și după modificări

Varianta `student/` este intenționat incompletă. Unele verificări eșuează până implementezi sarcina; consultă specificația pentru starea inițială așteptată. În varianta completă, verificările cerute trebuie să treacă. Rulează testele în alt terminal cât timp serverul de dezvoltare rulează.

Începe cu `npm run test:baseline` pentru a verifica infrastructura furnizată. `npm run test:objective` verifică implementarea ta; eșecurile inițiale sunt așteptate. După implementare, rulează `npm test` și verificările în browser/de build/de integrare cerute în specificație.
