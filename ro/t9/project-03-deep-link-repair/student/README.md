# Repararea eșecului legăturilor profunde

## Sarcina ta

Repară serverul de producție astfel încât deschiderea directă a unei rute React să încarce aplicația. Păstrează erorile API și răspunsurile pentru fișiere lipsă, fără să întorci HTML pentru orice cerere.

Modifică doar `server/create-production-app.js`. Citește [specificația](../spec.md) pentru cerințele exacte.

## Pornire și examinare

Dacă o comandă pornește un server de dezvoltare, lasă-l să ruleze și folosește alt terminal pentru teste. Oprește serverul cu Ctrl+C când termini.

Acest fixture de producție separă fișierele reale, rutele API și navigările SPA eligibile. Clientul este deja compilat; exercițiul privește politica de livrare Express.

```sh
npm install
npm test
npm start
```

Cu serverul pornit, compară `/notes/42`, `/assets/app-a1b2c3.js`, `/assets/missing.js` și `/api/missing` folosind antete `Accept` explicite. Setează `CLIENT_DIRECTORY` pentru a testa alt director compilat; valoarea implicită este `client-dist`.

## Verificări înainte și după modificări

Varianta `student/` este intenționat incompletă. Unele verificări eșuează până implementezi sarcina; consultă specificația pentru starea inițială așteptată. În varianta completă, verificările cerute trebuie să treacă. Rulează testele în alt terminal cât timp serverul de dezvoltare rulează.

Începe cu `npm run test:baseline` pentru a verifica infrastructura furnizată. `npm run test:objective` verifică implementarea ta; eșecurile inițiale sunt așteptate. După implementare, rulează `npm test` și verificările în browser/de build/de integrare cerute în specificație.
