# Depanarea stării și efectelor

## Sarcina ta

Repară panoul de căutare React. Folosește textul curent pentru căutare, împiedică răspunsurile vechi să înlocuiască rezultatele noi și oprește cererile când componenta nu mai are nevoie de ele.

Modifică doar `src/SearchPanel.jsx`. Citește [specificația](../spec.md) pentru cerințele exacte.

## Pornire și examinare

Dacă o comandă pornește un server de dezvoltare, lasă-l să ruleze și folosește alt terminal pentru teste. Oprește serverul cu Ctrl+C când termini.

Rulează `npm install`, `npm test` și `npm run build`; folosește `npm run dev` pentru panoul de căutare. Dovada fragilă generată rămâne în `evidence/` pentru compararea deterministă a răspunsurilor învechite.

## Verificări înainte și după modificări

Varianta `student/` este intenționat incompletă. Unele verificări eșuează până implementezi sarcina; consultă specificația pentru starea inițială așteptată. În varianta completă, verificările cerute trebuie să treacă. Rulează testele în alt terminal cât timp serverul de dezvoltare rulează.

Începe cu `npm run test:baseline` pentru a verifica infrastructura furnizată. `npm run test:objective` verifică implementarea ta; eșecurile inițiale sunt așteptate. După implementare, rulează `npm test` și verificările în browser/de build/de integrare cerute în specificație.
