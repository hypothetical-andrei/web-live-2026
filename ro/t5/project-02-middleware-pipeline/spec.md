# Specificația exercițiului — Pipeline de middleware

## Unitate

Unitatea 05 — JavaScript pe server și API-uri REST

## Obiectiv de învățare

Construiește o listă ordonată de middleware Express pentru cererile de rapoarte. Atribuie un ID cererii, măsoară durata, validează datele și înregistrează o singură finalizare, fără să rulezi pașii următori după respingere.

## De ce există acest exercițiu

Middleware-ul este un protocol de control al fluxului, nu o listă de callback-uri independente. Trebuie să vadă ce rulează înaintea handlerului, ce activitate se reia după acesta, cum oprește respingerea pipeline-ul și cine răspunde de observabilitatea răspunsului.

## Cerințe preliminare

- API-ul de sarcini în memorie finalizat sau experiență echivalentă cu rutarea Express.
- Closure-uri JavaScript, `try`/`catch`/`finally` și cunoștințe despre antete și stări HTTP.

## Context inițial

Ai primit o aplicație Express 5 ESM mică, având:

- un handler complet `POST /api/reports`, care presupune un body validat și răspunde cu `201` și reprezentarea în memorie a raportului;
- asamblarea aplicației, parsarea JSON, tratarea rutelor negăsite și a erorilor, pornirea serverului și teste deterministe;
- dependențele injectate `clock.now()`, `createRequestId()` și `logger.info(entry)`;
- o funcție incompletă `createReportPipeline(dependencies)` în `src/report-pipeline.js`, care trebuie să întoarcă un tablou ordonat de middleware Express montat înaintea handlerului.

Un body valid este un obiect JSON simplu cu exact câmpurile `summary` și `severity`; `summary` este un șir care nu rămâne gol după eliminarea spațiilor, iar `severity` este `low`, `medium` sau `high`.

## Sarcina ta

Construiește o listă ordonată de middleware Express pentru cererile de rapoarte. Atribuie un ID cererii, măsoară durata, validează datele și înregistrează o singură finalizare, fără să rulezi pașii următori după respingere.

Lucrează în proiectul `student/` furnizat. Modifică doar `src/report-pipeline.js`. Cerințele detaliate precizează cazurile, formele datelor și restricțiile pe care trebuie să le respecți. Folosește testele și instrucțiunile de pornire furnizate pentru verificare.

## Comportament obligatoriu

- Pipeline-ul folosește antetul `X-Request-Id` primit dacă nu este gol; altfel apelează factory-ul de ID injectat exact o dată.
- Expune ID-ul ales drept `request.requestId`, îl întoarce în `X-Request-Id` și îl include în fiecare eroare și log de finalizare produse de pipeline.
- Măsurarea începe înaintea validării și handlerului și este capturată imediat înainte de trimiterea antetelor răspunsului.
- `X-Response-Time-Ms` este stabilit la acea limită folosind diferența nenegativă dintre citirile ceasului injectat; logul de finalizare reutilizează durata capturată.
- Se emite exact un log `{ requestId, method, path, status, durationMs, outcome }` per cerere; `outcome` este `completed` pentru `finish` și `aborted` pentru `close` înainte de finalizare.
- O cerere fără `application/json` se oprește cu `415` și eroarea standard `json_required`.
- Câmpurile invalide se opresc cu `400` și `{ "error": { "code": "validation_failed", "message": <mesaj stabil>, "requestId": <id> } }`.
- Validarea înlocuiește `request.body` cu un obiect normalizat și înghețat, care conține `summary` curățat și `severity` acceptat, înainte de handler.
- O cerere respinsă nu invocă handlerul, dar primește identitate, timp și un singur log.
- Erorile sincrone neașteptate din middleware sau dependențe sunt delegate tratării centralizate furnizate.

## Constrângeri

- JavaScript ESM, Express 5, Node.js LTS, `fetch` nativ și runnerul de teste Node.
- Implementează numai `src/report-pipeline.js`; păstrează ruta, asamblarea aplicației, fake-urile logger/factory, testele și middleware-ul de eroare.
- Nu adăuga pachete pentru logare, ID-uri, validare sau măsurarea timpului.
- Nu modifica `response.end`, nu logați de două ori și nu te bazezi pe întârzieri reale în teste.
- Înregistrează listenerele ciclului de viață al răspunsului înainte de `next`.
- Păstrează responsabilitățile middleware separate și întoarce-le într-o ordine explicită.

## Criterii observabile de finalizare

- Crearea validă întoarce `201`, date normalizate, `X-Request-Id` și un antet nenegativ pentru timpul de răspuns.
- Tipurile și datele invalide întorc erorile documentate fără a crea un raport.
- Logurile capturate conțin exact o înregistrare pentru cereri reușite, respinse, cu eroare și întrerupte.
- Testele focalizate demonstrează ordinea pipeline-ului și durata deterministă din dependențele injectate.
- Poți desena traseul descendent al cererii și traseul de finalizare al răspunsului.

## Plan de validare (pentru autorii cursului)

### Verificări de bază

- Pornirea aplicației/serverului, parsarea JSON, handlerul furnizat și fallback-ul centralizat funcționează cu un pipeline passthrough cunoscut.
- Injectarea dependențelor înregistrează determinist apelurile factory-ului de ID, ceasului, loggerului și handlerului.

### Verificările obiectivului

- Identitatea primită sau generată, propagarea și numărul apelurilor respectă contractul.
- Datele valide sunt curățate, înghețate și ajung o singură dată la handler.
- Validarea tipului media și a câmpurilor oprește fluxul înaintea handlerului, cu erorile exacte.
- Antetul de timp și logul structurat conțin durata injectată, starea finală, metoda/calea, ID-ul și rezultatul corect.
- O închidere simulată înainte de finalizare înregistrează `aborted` o singură dată.

### Verificări de regresie

- JSON-ul incorect rămâne responsabilitatea parserului și a middleware-ului centralizat, cu tratarea standard independentă de pipeline.
- Rutele necunoscute și comportamentul de sănătate rămân neschimbate.
- Dependențele pentru ID și ceas sunt apelate numai la limitele documentate; finalizarea nu generează un al doilea ID sau o a doua durată.
- Niciun listener nu rămâne activ după evenimentul său de finalizare reciproc exclusiv.

## Notă pentru autor — pregătirea variantei inițiale

După validarea referinței, copiați-o și înlocuiți numai construcția middleware din `src/report-pipeline.js` cu o funcție exportată care întoarce un tablou gol și un TODO focalizat. Păstrează dependențele și restul arborilor.

Aplicația studentului rămâne rulabilă, iar handlerul poate crea un raport, deci verificările de bază trec. Verificările pentru identitate, validare, timp și logare eșuează în modul documentat. Comportamentul ruterului și al erorilor fără legătură cu pipeline-ul lipsă rămâne funcțional.

## Sarcină pentru Codex

> Construiește o listă ordonată de middleware Express pentru cererile de rapoarte. Atribuie un ID cererii, măsoară durata, validează datele și înregistrează o singură finalizare, fără să rulezi pașii următori după respingere. Modifică doar `src/report-pipeline.js`. Citește această specificație și codul furnizat înainte să editezi. Respectă comportamentul cerut, intrările/ieșirile exacte și restricțiile de aici. Păstrează testele și infrastructura furnizată. Rulează verificările documentate și spune ce trece, ce eșuează și de ce. Explică modificările ca să le pot inspecta.

## Sarcină de depanare/extensie

- Mută înregistrarea listenerului după `next()` și folosește un handler care finalizează sincron. Observă evenimentul pierdut, explică cursa de ordonare, apoi restaurați înregistrarea înainte de delegare.

## În afara scopului

Standarde de tracing distribuit, transporturi externe de loguri, autentificare, limitarea ratei, persistență, configurarea proxy-urilor de producție sau benchmark-uri de performanță.
