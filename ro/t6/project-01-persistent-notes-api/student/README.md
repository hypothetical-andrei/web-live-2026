# API de notițe persistente

## Sarcina ta

Implementează interfața furnizată pentru notițe folosind Sequelize și SQLite. Salvează modificările înainte să raportezi succesul, păstrează notițele între reporniri și închide baza de date la final.

Modifică doar `src/note-store.js`. Citește [specificația](../spec.md) pentru cerințele exacte.

## Pornire și examinare

Dacă o comandă pornește un server de dezvoltare, lasă-l să ruleze și folosește alt terminal pentru teste. Oprește serverul cu Ctrl+C când termini.

În varianta inițială pentru student, `npm start` se oprește la inițializarea incompletă a depozitului. Rulează întâi verificările de bază; pornește API-ul real după implementarea depozitului.

```bash
npm install
npm start
npm test
```

Implicit, serverul folosește `notes.sqlite` în directorul proiectului. Setează `NOTES_STORAGE` la alt fișier și `RESET_DB=true` numai când este necesară o resetare intenționată. Testele folosesc baze temporare izolate sau în memorie.

## Verificări înainte și după modificări

Varianta `student/` este intenționat incompletă. Unele verificări eșuează până implementezi sarcina; consultă specificația pentru starea inițială așteptată. În varianta completă, verificările cerute trebuie să treacă. Rulează testele în alt terminal cât timp serverul de dezvoltare rulează.

Începe cu `npm run test:baseline` pentru a verifica infrastructura furnizată. `npm run test:objective` verifică implementarea ta; eșecurile inițiale sunt așteptate. După implementare, rulează `npm test` și verificările în browser/de build/de integrare cerute în specificație.
