# API pentru sarcini în memorie

## Sarcina ta

Implementează rutele API pentru listarea, crearea, citirea, modificarea și ștergerea sarcinilor. Validează cererile și folosește depozitul de date furnizat.

Modifică doar `src/task-router.js`. Citește [specificația](../spec.md) pentru cerințele exacte.

## Pornire și examinare

Dacă o comandă pornește un server de dezvoltare, lasă-l să ruleze și folosește alt terminal pentru teste. Oprește serverul cu Ctrl+C când termini.

Instalează și rulează:

```bash
npm install
npm start
```

Serverul afișează URL-ul local. Deschide `/` pentru sumar sau folosește `curl` pentru `/api/tasks`.

Rulează toate verificările prin `npm test`; scripturile țintite sunt `test:baseline`, `test:objective` și `test:regression`.

## Verificări înainte și după modificări

Varianta `student/` este intenționat incompletă. Unele verificări eșuează până implementezi sarcina; consultă specificația pentru starea inițială așteptată. În varianta completă, verificările cerute trebuie să treacă. Rulează testele în alt terminal cât timp serverul de dezvoltare rulează.

Începe cu `npm run test:baseline` pentru a verifica infrastructura furnizată. `npm run test:objective` verifică implementarea ta; eșecurile inițiale sunt așteptate. După implementare, rulează `npm test` și verificările în browser/de build/de integrare cerute în specificație.
