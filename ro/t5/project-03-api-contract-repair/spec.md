# Specificația exercițiului — Repararea API-ului pentru întâlniri

## Obiectiv de învățare

Repară API-ul întâlnirilor astfel încât fiecare cerere să primească răspunsul documentat. Corectează codurile de stare, corpurile răspunsurilor, validarea și tratarea erorilor fără să modifici depozitul de date.

## Context inițial

Ai primit un mic API Express 5 pentru invitații la întâlniri, cu stocare în memorie, pornirea serverului, tratarea erorilor și teste HTTP. Trei handlere din `src/meeting-router.js` rulează, dar conțin patru defecte. Nu există adaptor sau fallback pentru cod vechi. Întâlnirile au `id`, `title` și booleanul `accepted`.

## Sarcina ta

Repară API-ul întâlnirilor astfel încât fiecare cerere să primească răspunsul documentat. Corectează codurile de stare, corpurile răspunsurilor, validarea și tratarea erorilor fără să modifici depozitul de date.

Lucrează în proiectul `student/` furnizat. Modifică doar `src/meeting-router.js`. Cerințele detaliate precizează cazurile, formele datelor și restricțiile pe care trebuie să le respecți. Folosește testele și instrucțiunile de pornire furnizate pentru verificare.

## Comportament necesar

- `GET /api/meetings` returnează `200` cu `{ data: meetings }`.
- Lista acceptă `?sort=title&order=asc` și `?sort=title&order=desc`. Valorile implicite sunt `sort=title` și `order=asc`. Compară titlurile lexicografic folosind comparația șirurilor JavaScript; inversează comparația pentru ordine descrescătoare. Titlurile egale păstrează ordinea stocată. Sortează o copie, niciodată colecția stocată.
- Parametrii `sort`/`order` neacceptați, repetați sau structurați returnează `400` cu `{ error: { code: 'invalid_sort', message: 'Use sort=title and order=asc or desc' } }`.
- `GET /api/meetings/:meetingId` returnează `200` cu `{ data: meeting }` dacă întâlnirea există sau `404` cu `{ error: { code: 'meeting_not_found', message: 'Meeting not found' } }` dacă lipsește. Nicio ramură nu poate lăsa cererea în așteptare.
- `POST /api/meetings/:meetingId/accept` acceptă o invitație în așteptare și returnează `200` cu `{ data: meeting }`. Întâlnirile lipsă produc aceeași eroare `404` ca la citire. O invitație deja acceptată returnează `409` cu `{ error: { code: 'already_accepted', message: 'Invitation already accepted' } }`, fără modificarea datelor. Distincția importantă este eșecul `4xx` față de succesul `2xx`; `409` este răspunsul specificat pentru acest conflict.
- Răspunsurile de succes încadrează valoarea în `data`; erorile folosesc `{ error: { code, message } }`. Răspunsurile JSON declară tipul media JSON.
- Erorile neașteptate ale stocării ajung la middleware-ul furnizat, care returnează un `500` fără detalii interne. Rutele necunoscute folosesc răspunsul `404` furnizat.

## Cele patru defecte inițiale

1. Citirea unei întâlniri lipsă nu trimite răspuns și nu transmite o eroare, deci cererea rămâne în așteptare.
2. Acceptarea unei invitații deja acceptate returnează o clasă de status de succes, deși corpul conține o eroare.
3. Citirea unei întâlniri existente returnează obiectul direct, în loc de `{ data: meeting }`.
4. Lista validează `order`, dar nu îl aplică: cererile descrescătoare primesc tot ordine crescătoare.

## Restricții

Folosește JavaScript ESM, Express 5, Node LTS, fetch nativ și dependențele existente. Nu adăuga endpointuri, adaptoare, fallbackuri, frameworkuri sau baze de date. Păstrează sortarea și răspunsurile HTTP vizibile în handlerele obișnuite. Modifică doar `src/meeting-router.js`.

## Verificare

- Bază: pornirea, pagina inițială, health, stocarea furnizată și citirea/acceptarea obișnuită funcționează.
- Obiectiv: citirea unei întâlniri lipsă se termină într-un timeout limitat; răspunsul pentru invitația deja acceptată este `4xx`; formele de succes ale listei/citirii/acceptării sunt consecvente; cererile crescătoare și descrescătoare produc ordinea specificată. Fiecare defect are un test HTTP separat.
- Regresie: valorile de query neacceptate eșuează înainte de listare, ordinea stocată nu se modifică, acceptarea unei întâlniri lipsă răspunde, rutele necunoscute funcționează, erorile neașteptate nu expun detalii interne, iar serverul rămâne utilizabil după anularea unei cereri blocate.
- Funcțiile de test anulează cererile limitate în timp și închid forțat conexiunile rămase, astfel încât endpointul intenționat blocat să nu blocheze suita. Timeoutul este dovada defectului, nu o reparație pe server.
- Referință: toate verificările trec. Student: baza și regresiile trec, toate cele patru teste de obiectiv eșuează independent.

## Sarcină pentru Codex

> Repară API-ul întâlnirilor astfel încât fiecare cerere să primească răspunsul documentat. Corectează codurile de stare, corpurile răspunsurilor, validarea și tratarea erorilor fără să modifici depozitul de date. Modifică doar `src/meeting-router.js`. Citește această specificație și codul furnizat înainte să editezi. Respectă comportamentul cerut, intrările/ieșirile exacte și restricțiile de aici. Păstrează testele și infrastructura furnizată. Rulează verificările documentate și spune ce trece, ce eșuează și de ce. Explică modificările ca să le pot inspecta.

## Depanare / extindere

După reparație, solicită o ordonare neacceptată și verifică eroarea de intrare. Compară ordinea stocată înainte și după cereri crescătoare și descrescătoare pentru a confirma că sortarea reprezentării nu modifică stocarea.

## Notă pentru autor — pregătirea variantei inițiale

Validează mai întâi referința completă, apoi copiaz-o. Elimină doar răspunsul pentru întâlnirea lipsă, alegerea statusului conflictului, încadrarea citirii în data și alegerea ordinii solicitate, numai în meeting-router.js. Păstrează identice testele și fișierele auxiliare. Documentează cele patru diferențe în derivation.md. Nu include un router complet alternativ în arborele studentului.

## În afara domeniului

Creare/ștergere, persistență, autentificare, abstracții generale de sortare, migrare de cod vechi și termene de răspuns pentru producție.
