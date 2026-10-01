# Sarcină HTTP de remediere cu Codex

Rulați `npm install`, apoi folosiți scripturile de test separate pentru a
distinge infrastructura funcțională de eșecurile specifice remedierii. Porniți
serviciul cu `npm start` și inspectați răspunsurile cu `curl -i`.

Inspectați aceste trei cazuri:

- `GET /api/clues` întoarce în prezent datele corecte despre indicii, dar
  `Content-Type` greșit;
- `POST /api/clues` cu `{"text":"   "}` comite în prezent un răspuns `422` și
  apoi prăbușește conexiunea pentru că execuția continuă;
- `GET /api/clues/missing` întoarce în prezent contractul public greșit.

Suprafața de remediere delimitată este `src/server.js` plus
`src/normalize-contract.js`. Nu rescrieți producătorul legacy intenționat
naiv.
