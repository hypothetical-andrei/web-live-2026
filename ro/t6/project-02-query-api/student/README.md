# API de interogare

## Sarcina ta

Validează parametrii interogării API și transformă valorile acceptate în opțiuni Sequelize. Asigură filtrarea, căutarea, sortarea, selecția câmpurilor și limitele de rezultate specificate.

Modifică doar `src/note-query.js`. Citește [specificația](../spec.md) pentru cerințele exacte.

## Pornire și examinare

Dacă o comandă pornește un server de dezvoltare, lasă-l să ruleze și folosește alt terminal pentru teste. Oprește serverul cu Ctrl+C când termini.

```bash
npm install
npm start
npm test
```

Încercați `/api/notes?archived=false&sort=title_asc&fields=title,owner`. Serverul de dezvoltare folosește o bază de date deterministă în memorie.

## Verificări înainte și după modificări

Varianta `student/` este intenționat incompletă. Unele verificări eșuează până implementezi sarcina; consultă specificația pentru starea inițială așteptată. În varianta completă, verificările cerute trebuie să treacă. Rulează testele în alt terminal cât timp serverul de dezvoltare rulează.

Începe cu `npm run test:baseline` pentru a verifica infrastructura furnizată. `npm run test:objective` verifică implementarea ta; eșecurile inițiale sunt așteptate. După implementare, rulează `npm test` și verificările în browser/de build/de integrare cerute în specificație.
