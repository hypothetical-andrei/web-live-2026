# Reproiectarea API-ului de înscriere

## Sarcina ta

Înlocuiește rutele de înscriere bazate pe acțiuni cu URL-urile de resurse specificate. Validează filtrele și paginarea și asigură rezultatul cerut pentru cererile repetate asupra aceleiași înscrieri.

Modifică doar `src/registration-router.js`. Citește [specificația](../spec.md) pentru cerințele exacte.

## Pornire și examinare

Dacă o comandă pornește un server de dezvoltare, lasă-l să ruleze și folosește alt terminal pentru teste. Oprește serverul cu Ctrl+C când termini.

Rulează `npm install`, `npm test`, apoi `npm start` (port implicit `3000`). API-ul canonic este montat la `/api/sessions/:sessionId/registrations`; `public/index.html` compară contractul resursei cu ruterul naiv intenționat nemontat.

## Verificări înainte și după modificări

Varianta `student/` este intenționat incompletă. Unele verificări eșuează până implementezi sarcina; consultă specificația pentru starea inițială așteptată. În varianta completă, verificările cerute trebuie să treacă. Rulează testele în alt terminal cât timp serverul de dezvoltare rulează.

Începe cu `npm run test:baseline` pentru a verifica infrastructura furnizată. `npm run test:objective` verifică implementarea ta; eșecurile inițiale sunt așteptate. După implementare, rulează `npm test` și verificările în browser/de build/de integrare cerute în specificație.
