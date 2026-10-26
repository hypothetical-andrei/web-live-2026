# Pipeline de middleware

## Sarcina ta

Construiește o listă ordonată de middleware Express pentru cererile de rapoarte. Atribuie un ID cererii, măsoară durata, validează datele și înregistrează o singură finalizare, fără să rulezi pașii următori după respingere.

Modifică doar `src/report-pipeline.js`. Citește [specificația](../spec.md) pentru cerințele exacte.

## Pornire și examinare

Dacă o comandă pornește un server de dezvoltare, lasă-l să ruleze și folosește alt terminal pentru teste. Oprește serverul cu Ctrl+C când termini.

```bash
npm install
npm start
npm test
```

Serverul afișează un URL loopback. Trimiteți rapoarte JSON la `POST /api/reports` și inspectează `X-Request-Id`, `X-Response-Time-Ms` și logul structurat de finalizare.

## Verificări înainte și după modificări

Varianta `student/` este intenționat incompletă. Unele verificări eșuează până implementezi sarcina; consultă specificația pentru starea inițială așteptată. În varianta completă, verificările cerute trebuie să treacă. Rulează testele în alt terminal cât timp serverul de dezvoltare rulează.

Începe cu `npm run test:baseline` pentru a verifica infrastructura furnizată. `npm run test:objective` verifică implementarea ta; eșecurile inițiale sunt așteptate. După implementare, rulează `npm test` și verificările în browser/de build/de integrare cerute în specificație.
