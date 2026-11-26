# CRUD full-stack pentru notițe

## Sarcina ta

Construiește interfața React pentru API-ul de notițe furnizat. Încarcă, creează, editează, șterge și reîmprospătează notițele; actualizează datele serverului afișate doar după confirmarea API-ului.

Modifică doar `client/src/NotesWorkspace.jsx`. Citește [specificația](../spec.md) pentru cerințele exacte.

## Pornire și examinare

Dacă o comandă pornește un server de dezvoltare, lasă-l să ruleze și folosește alt terminal pentru teste. Oprește serverul cu Ctrl+C când termini.

Rulează `npm install`, `npm test` și `npm run build`. Pornește API-ul cu `npm start` și Vite cu `npm run dev`; proxy-ul conectează `/api` la portul 3000. Obiectivul clientului este izolat în `client/src/NotesWorkspace.jsx`.

Backendul Express furnizat folosește Sequelize cu SQLite. `npm start` stochează notițele în `data/notes.sqlite`; setează `SQLITE_STORAGE` pentru alt fișier. Pornirea creează tabelele lipsă și introduce notița inițială într-o bază goală, fără resetarea notițelor existente. Oprește serverul cu Ctrl+C pentru închiderea conexiunii. Testele folosesc baze izolate; `npm run test:server` verifică persistența după redeschidere, validarea și resetarea exclusiv pentru teste. Folosește Node.js LTS (24 recomandat).

## Verificări înainte și după modificări

Varianta `student/` este intenționat incompletă. Unele verificări eșuează până implementezi sarcina; consultă specificația pentru starea inițială așteptată. În varianta completă, verificările cerute trebuie să treacă. Rulează testele în alt terminal cât timp serverul de dezvoltare rulează.

Începe cu `npm run test:baseline` pentru a verifica infrastructura furnizată. `npm run test:objective` verifică implementarea ta; eșecurile inițiale sunt așteptate. După implementare, rulează `npm test` și verificările în browser/de build/de integrare cerute în specificație.
