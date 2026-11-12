# API de înscriere la conferință

## Sarcina ta

Definește în Sequelize relațiile dintre conferințe, sesiuni, participanți și înscrieri. Implementează citirile cerute păstrând cheile străine, câmpurile înscrierii și numărul de interogări cerut.

Modifică doar `src/conference-model.js`. Citește [specificația](../spec.md) pentru cerințele exacte.

## Pornire și examinare

Dacă o comandă pornește un server de dezvoltare, lasă-l să ruleze și folosește alt terminal pentru teste. Oprește serverul cu Ctrl+C când termini.

```bash
npm install
npm start
npm test
```

Serverul de dezvoltare populează o bază de conferință în memorie. Inspectează `/api/conferences/1/sessions` și creează înscrieri sub `/api/sessions/:sessionId/registrations`.

## Verificări înainte și după modificări

Varianta `student/` este intenționat incompletă. Unele verificări eșuează până implementezi sarcina; consultă specificația pentru starea inițială așteptată. În varianta completă, verificările cerute trebuie să treacă. Rulează testele în alt terminal cât timp serverul de dezvoltare rulează.

Începe cu `npm run test:baseline` pentru a verifica infrastructura furnizată. `npm run test:objective` verifică implementarea ta; eșecurile inițiale sunt așteptate. După implementare, rulează `npm test` și verificările în browser/de build/de integrare cerute în specificație.
