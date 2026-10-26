# Repararea API-ului pentru întâlniri — proiect rulabil

## Sarcina ta

Repară API-ul întâlnirilor astfel încât fiecare cerere să primească răspunsul documentat. Corectează codurile de stare, corpurile răspunsurilor, validarea și tratarea erorilor fără să modifici depozitul de date.

Modifică doar `src/meeting-router.js`. Citește [specificația](../spec.md) pentru cerințele exacte.

## Pornire și examinare

Dacă o comandă pornește un server de dezvoltare, lasă-l să ruleze și folosește alt terminal pentru teste. Oprește serverul cu Ctrl+C când termini.

Rulează `npm ci`, `npm start` și deschide URL-ul loopback afișat. Stocarea se resetează la repornire. Întâlnirea `m2` este deja acceptată; `m1` este în așteptare.

Rulează `npm run test:baseline`, `npm run test:regression` și `npm run test:objective`. Toate verificările trec în referință. În varianta inițială, patru teste de obiectiv eșuează; baza și regresiile trec. Cererea pentru întâlnirea lipsă rămâne intenționat nefinalizată până la reparație. Folosește un timeout pentru cererile manuale, precum `curl --max-time 2`.

Modifică doar `src/meeting-router.js`. Nu modifica testele, stocarea, aplicația sau dependențele.

## Verificări înainte și după modificări

Varianta `student/` este intenționat incompletă. Unele verificări eșuează până implementezi sarcina; consultă specificația pentru starea inițială așteptată. În varianta completă, verificările cerute trebuie să treacă. Rulează testele în alt terminal cât timp serverul de dezvoltare rulează.

Începe cu `npm run test:baseline` pentru a verifica infrastructura furnizată. `npm run test:objective` verifică implementarea ta; eșecurile inițiale sunt așteptate. După implementare, rulează `npm test` și verificările în browser/de build/de integrare cerute în specificație.
