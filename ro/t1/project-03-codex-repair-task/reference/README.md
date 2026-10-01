# Sarcină HTTP de remediere cu Codex

Rulați `npm install`, apoi folosiți scripturile de test separate pentru a
distinge infrastructura funcțională de eșecurile specifice remedierii. Porniți
serviciul cu `npm start` și inspectați răspunsurile cu `curl -i`.

Inspectați aceste trei cazuri:

- `GET /api/clues` trebuie să păstreze datele despre indicii, dar să întoarcă
  tip de conținut JSON;
- `POST /api/clues` cu `{"text":"   "}` trebuie să întoarcă un singur răspuns
  de eroare `422` și să se oprească acolo;
- `GET /api/clues/missing` trebuie să întoarcă eroarea `404` a cursului.

Referința arată remedierea completă în `src/server.js` și
`src/normalize-contract.js`. Nu rescrieți producătorul legacy intenționat naiv.
