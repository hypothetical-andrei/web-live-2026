# Proiectul 03 — Repararea API-ului pentru întâlniri

## Ce ai de făcut

Repară API-ul întâlnirilor astfel încât fiecare cerere să primească răspunsul documentat. Corectează codurile de stare, corpurile răspunsurilor, validarea și tratarea erorilor fără să modifici depozitul de date.

Lucrează în `student/`. Modifică doar `src/meeting-router.js`.

## Scop

Repară patru defecte observabile în handlere Express obișnuite. Ai primit un API rulabil, nu un router gol. Modifică doar `student/src/meeting-router.js`.

## Inspectează comportamentul inițial

Pornește proiectul studentului cu `npm start` și folosește URL-ul afișat. Stocarea în memorie se resetează la repornire. `m1` este în așteptare; `m2` este deja acceptată.

| Cerere | Ce inspectezi |
| --- | --- |
| `GET /api/meetings/absent` | Fiecare ramură finalizează răspunsul? Folosește `curl --max-time 2` pentru a nu aștepta nelimitat. |
| `POST /api/meetings/m2/accept` | Clasa statusului corespunde eșecului sau îi spune clientului că operația a reușit? |
| `GET /api/meetings/m1` | Compară structura exterioară JSON cu listarea și acceptarea reușită. |
| `GET /api/meetings?sort=title&order=desc` | Compară direcția solicitată cu titlurile returnate, apoi repetă cu `order=asc`. |

Pune între ghilimele URL-urile care conțin `&` în comenzile shell. Inspectează statusul și corpul, folosind `curl -i` sau fetch nativ. Un timeout nu dovedește că API-ul a returnat o eroare HTTP: înseamnă că clientul a încetat să aștepte.

## Diagnostichează, apoi repară

Construiește un tabel cu cererea, comportamentul așteptat, comportamentul observat și calea de execuție responsabilă. Citește stocarea și aplicația furnizate pentru a înțelege ce fac deja. Dă-i lui Codex sarcina precisă din `spec.md`, împreună cu dovezile HTTP. Examinează diff-ul; păstrează modificările în router și nu modifica testele.

Rulează verificările de bază, regresie și obiectiv. Varianta inițială are patru teste de obiectiv eșuate; fiecare trebuie să treacă după repararea defectului său. Verifică și tu endpointurile. Acceptarea lui `m1` modifică starea, deci repornește înainte de repetarea experimentului.

## Finalizat când

- O întâlnire lipsă produce un răspuns, fără cerere rămasă în așteptare.
- O invitație deja acceptată returnează clasa de eroare a clientului.
- Lista, citirea și acceptarea reușită folosesc consecvent `data`.
- Cererile crescătoare și descrescătoare produc ordinea specificată fără modificarea ordinii stocate.
- Toate verificările trec și doar `src/meeting-router.js` diferă față de proiectul inițial.

## Explică la final

Urmărește ramura întâlnirii lipsă, explică de ce un corp de eroare cu status de succes induce clientul în eroare, descrie forma răspunsului așteptată de apelanți și arată unde parametrii query afectează reprezentarea returnată.
