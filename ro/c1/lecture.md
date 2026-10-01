# Cursul 01 — Web-ul ca sistem și dezvoltarea asistată de AI

> Durată planificată: 96 de minute  
> Format: trei blocuri conceptuale, cinci exemple rezolvate și trei intermezzo-uri de recapitulare

## Rezultatele învățării

La sfârșitul acestei sesiuni, veți putea:

- urmări o acțiune a utilizatorului prin limitele clientului, rețelei și serverului;
- descompune un URL și deosebi fragmentele folosite numai de browser de ținta cererii;
- separa informațiile cererii de informațiile răspunsului;
- interpreta metodele, stările, headerele și reprezentările ca un singur contract;
- explica modul în care headerele opționale extind un mesaj HTTP, păstrând un fallback mai simplu;
- colecta dovezi din timpul execuției cu DevTools, `curl` și verificări focalizate;
- folosi un agent AI pentru a clarifica instrumente nefamiliare și a propune un mic script de verificare;
- inspecta un repository înainte de a cere o schimbare;
- formula o sarcină Gemini delimitată și verifica independent rezultatul.

## Desfășurarea cursului

| Segment | Timp | Temă |
| --- | ---: | --- |
| Traseul inițial al sistemului | 0–7 min | Un click traversează mai multe limite |
| Bloc conceptual 1 | 7–29 min | Clienți, servere, URL-uri și mesaje |
| Intermezzo 1 | 29–33 min | Localizarea informațiilor de protocol |
| Bloc conceptual 2 | 33–56 min | Metode, stări, tipuri media și REST |
| Intermezzo 2 | 56–60 min | Interpretarea contractelor răspunsului |
| Bloc conceptual 3 | 60–82 min | Dovezi și fluxul asistat de AI |
| Intermezzo 3 | 82–86 min | Domeniu și verificare |
| Sinteză | 86–96 min | Metodă de revizuire end-to-end |

## Traseul inițial — urmăriți un click

Apăsați **Salvează**. Butonul vizibil nu salvează nimic de unul singur. Codul browserului construiește o cerere, rețeaua transferă octeți, codul serverului îi interpretează, iar browserul interpretează răspunsul.

```text
eveniment în browser
→ construirea cererii
→ schimb HTTP
→ procesare pe server
→ interpretarea răspunsului
→ stare vizibilă a interfeței
```

La fiecare săgeată, întrebați-vă ce a traversat limita, cine deține următoarea decizie și ce dovezi o pot confirma.

## Bloc conceptual 1 — clienți, servere, resurse și mesaje

### 1. O aplicație web este un sistem care comunică

Clientul și serverul sunt programe separate, cu stare și moduri de eșec separate. În timpul dezvoltării pot rula pe același calculator, dar comunicarea trece în continuare printr-o limită explicită de protocol.

### 2. Client și server sunt roluri

Browserul este de obicei client, dar `curl`, un test, alt server sau o aplicație mobilă pot fi clienți. „Client” înseamnă inițiatorul schimbului; „server” este programul care îl acceptă și răspunde.

### 3. O resursă nu este neapărat un fișier

O resursă este ceva identificat prin web: document, imagine, colecție de notițe, notiță individuală, raport generat sau rezultat al unei operații. Reprezentarea curentă poate fi calculată, nu stocată într-un fișier.

### 4. O resursă poate avea mai multe reprezentări

HTML, CSS, JavaScript, imaginile, textul simplu și JSON sunt reprezentări. Reprezentarea este formatul corpului schimbat la un moment dat, nu resursa însăși.

### 5. Un URL are componente denumite

```text
https://course.example/api/notes?owner=Ada#details
└schemă┘ └─autoritate──┘└──cale────┘└query──┘└fragment┘
```

Schema selectează familia de protocoale, autoritatea identifică endpointul de rețea, calea identifică în cadrul autorității, query-ul parametrizează selecția, iar fragmentul selectează contextul clientului.

### 6. Fragmentul nu traversează limita HTTP

Browserul păstrează `#details` pentru navigarea pe client. Serverul primește calea și query-ul drept țintă a cererii, nu fragmentul.

### 7. Exemplu rezolvat — limitele URL-ului

Rulați [limitele URL-ului](examples/01-url-boundaries/):

```bash
node lectures/01-web-system-ai-development/ro/examples/01-url-boundaries/example.js
```

Observați valorile query decodificate în timp ce adresa codificată rămâne intactă și confirmați că ținta derivată exclude fragmentul.

### 8. Query-ul și corpul cererii au poziții diferite

Query-ul face parte din URL. Corpul cererii este o secțiune opțională separată a mesajului. Ambele pot transporta date de intrare, dar nu sunt dovezi interschimbabile în DevTools sau în codul serverului.

### 9. HTTP este un schimb de două mesaje

Cererea are linia cererii, headere, o linie goală și uneori corp. Răspunsul are linia de stare, headere, o linie goală și uneori corp. Nu atribuiți cererii starea răspunsului și nici răspunsului metoda cererii.

### 10. Exemplu rezolvat — anatomia cererii și răspunsului

Citiți [anatomia cererii și răspunsului](examples/02-request-response-anatomy/) de la fiecare linie inițială spre corp. Clasificați metoda, tipul media al cererii, starea, `Location` și ambele corpuri JSON drept intrare a clientului sau ieșire a serverului.

### 11. Headerele sunt metadate direcționale

Headerele cererii descriu cererea sau preferințele clientului. Headerele răspunsului descriu răspunsul. Unele nume apar în ambele direcții, deci direcția contează la fel de mult ca ortografia.

### 12. Headerele extind mesajele fără a le schimba forma

HTTP păstrează aceeași structură cerere/răspuns, iar câmpurile adaugă metadate. Un server nou poate adăuga un câmp opțional, iar un client vechi poate folosi în continuare starea, `Content-Type` și corpul pe care le înțelege. Clientul nou poate folosi câmpul suplimentar fără alt format de mesaj.

Compatibilitatea este condiționată. Un destinatar poate ignora un câmp opțional necunoscut, dar expeditorul nu trebuie să facă interpretarea corectă dependentă de un câmp neînțeles. Câmpurile care controlează reprezentarea, autentificarea, cache-ul sau tratarea mesajului nu devin opționale doar pentru că sunt headere.

În [anatomia cererii și răspunsului](examples/02-request-response-anatomy/), ambii clienți citesc reprezentarea notiței; numai clientul nou folosește `Example-Trace-Id`. Câmpul extinde schimbul fără a redefini contractul simplu.

### 13. Dovezile au un loc

În DevTools, URL-ul și metoda apar în detaliile cererii; payload-ul arată datele de intrare; headerele răspunsului arată metadatele serverului; Response sau Preview arată reprezentarea; Timing arată când au avut loc fazele.

## Intermezzo 1 — localizați informațiile de protocol

Răspundeți în patru minute la întrebările cu prefixul `u01-i1-` din [intermezzo.gift](intermezzo.gift). Apoi schițați cele două mesaje și explicați ce informații aparțin cererii și ce informații aparțin răspunsului.

## Bloc conceptual 2 — metode, stări, reprezentări și REST

### 14. Metodele comunică intenția

Metodele exprimă intenția cererii, nu dacă aceasta va reuși.

| Intenție | Metodă tipică | Principiu |
| --- | --- | --- |
| Preluarea unei reprezentări | `GET` | Nu ar trebui să solicite schimbarea stării |
| Trimiterea datelor sau crearea unei resurse subordonate | `POST` | Resursa țintă decide procesarea |
| Înlocuirea unei resurse la o țintă cunoscută | `PUT` | Repetarea are același efect intenționat |
| Aplicarea unei schimbări parțiale | `PATCH` | Reprezentarea patch definește schimbarea |
| Eliminarea unei resurse | `DELETE` | Cere ca ținta să nu mai existe |

În unitățile următoare, veți proiecta API-uri complete. Deocamdată, folosiți metoda și calea împreună pentru a identifica operația intenționată.

### 15. Numele metodei nu garantează comportamentul

Un handler poate modifica incorect starea în timpul unui `GET` sau poate ignora corpul unui `POST`. Metoda exprimă un contract pe care implementarea și testele trebuie să îl respecte.

### 16. Codurile de stare rezumă rezultatul

- 2xx: tratare reușită;
- 3xx: este necesară altă acțiune sau locație;
- 4xx: cererea nu poate fi îndeplinită în forma trimisă;
- 5xx: serverul nu a putut îndeplini o cerere altfel validă.

Succesul transportului și succesul aplicației sunt diferite. `fetch` poate primi un răspuns HTTP normal cu starea `404`.

### 17. Stările concrete transmit sens util

| Rezultat | Stare tipică |
| --- | ---: |
| Preluare reușită cu reprezentare | `200 OK` |
| Resursă creată | `201 Created`, de regulă cu `Location` |
| Tratare reușită fără corp | `204 No Content` |
| Datele cererii sunt invalide | `400 Bad Request` |
| Resursa țintă lipsește | `404 Not Found` |
| Reprezentarea cererii nu este acceptată | `415 Unsupported Media Type` |
| Serverul a eșuat neașteptat | `500 Internal Server Error` |

Stările permit clientului să clasifice rezultatul fără să parseze mai întâi o explicație. Metoda exprimă intenția cerută; starea răspunsului raportează rezultatul observat.

### 18. Starea, headerele și corpul formează un contract

Un răspuns de creare poate folosi `201`, identifica resursa prin `Location` și returna reprezentarea ei. Un eșec de validare poate folosi `400` și un cod de eroare stabil, citibil de program. Fiecare element susține același rezultat.

### 19. Exemplu rezolvat — verificarea contractului răspunsului

Rulați [verificarea contractului răspunsului](examples/03-response-contract-check/):

```bash
node lectures/01-web-system-ai-development/ro/examples/03-response-contract-check/check.js
```

Schimbați temporar starea de creare la `200` și observați cum o aserțiune semantică focalizată respinge un rezultat aparent plauzibil.

### 20. `Content-Type` declară reprezentarea corpului

`Content-Type: application/json` declară JSON. `text/plain` declară text, chiar dacă caracterele seamănă cu JSON. Parametrii charset rafinează tipul media fără a-i schimba tipul de bază.

### 21. Declarația și octeții trebuie să corespundă

Declararea JSON nu repară JSON-ul incorect, iar octeții care seamănă cu JSON nu suprascriu o declarație text. Clientul trebuie să aleagă parserul din contract, nu din aparență.

### 22. Exemplu rezolvat — contractul reprezentării

Rulați [contractul reprezentării](examples/04-representation-contract/):

```bash
node lectures/01-web-system-ai-development/ro/examples/04-representation-contract/example.js
```

Comparați JSON valid declarat, text simplu care seamănă cu JSON și JSON incorect declarat.

### 23. JSON este sintaxă; REST este un stil de proiectare

JSON descrie formatul reprezentării. REST încurajează identificarea resurselor, semantica standard a protocolului și transferul reprezentărilor între componente. Un endpoint JSON nu este automat bine proiectat sau RESTful.

### 24. URL-urile orientate pe resurse folosesc substantive

`/api/notes` poate identifica o colecție, iar `/api/notes/n-7` un membru. Metoda plus resursa exprimă operația fără a încorpora fiecare verb în cale.

### 25. Convențiile au nevoie de contracte observabile

Echipele pot alege envelope precum `{ "data": ... }` și erori stabile precum `{ "error": { "code", "message" } }`. Consecvența contează deoarece clienții și testele depind de aceste forme.

## Intermezzo 2 — interpretați contractele răspunsului

Răspundeți în patru minute la întrebările cu prefixul `u01-i2-` din [intermezzo.gift](intermezzo.gift). Susțineți fiecare răspuns cu dovezi din stare, headere sau reprezentare.

## Bloc conceptual 3 — dovezi și dezvoltare asistată de AI

### 26. Codul sursă este o afirmație despre comportamentul din execuție

Citirea unui handler este utilă, dar programul poate folosi altă configurație, apela altă cale sau eșua la o limită. Combinați inspectarea sursei cu observația.

### 27. Inspectați un schimb cu DevTools

Folosiți o secvență repetabilă:

1. Porniți aplicația locală și deschideți URL-ul afișat.
2. Deschideți instrumentele browserului și selectați **Network** înaintea acțiunii.
3. Ștergeți intrările vechi. Activați **Preserve log** numai dacă navigarea ar elimina dovezile.
4. Declanșați exact o acțiune și selectați intrarea corespunzătoare.
5. Notați URL-ul și metoda; inspectați separat headerele, query-ul și payload-ul.
6. Notați starea și headerele răspunsului.
7. Citiți `Content-Type` înainte de a clasifica corpul, apoi inspectați **Response** sau **Preview**.
8. Inspectați **Timing** numai după confirmarea schimbului corect.
9. Repetați cererea cu `curl -i` ca client independent mai mic.

Rulați [anatomia cererii și răspunsului](examples/02-request-response-anatomy/) pentru o țintă locală concepută pentru această secvență.

### 28. `curl` este un client independent și mic

Folosiți `curl -i` pentru a include headerele răspunsului și `curl -v` când contează diagnosticul cererii. Reproducerea observației browserului cu un client mai mic ajută la izolarea interfeței de comportamentul HTTP.

### 29. Verificările automate fac afirmațiile repetabile

Verificările de bază demonstrează că mediul funcționează, verificările obiectivului disting comportamentul cerut, iar regresiile protejează comportamentul independent. Un test verde dovedește numai afirmația pe care o verifică efectiv.

### 30. Cereți clarificarea instrumentelor înaintea codului

Un agent poate localiza comanda de pornire, explica ce arată un panou DevTools sau un flag și transforma o observație într-o listă de verificare. Cereți-i să citeze fișierele ori ieșirea instrumentelor și interziceți editarea în această etapă. Clarificarea trebuie să faciliteze inspectarea independentă, nu să o înlocuiască.

### 31. Inspectați repository-ul înainte de modificare

Localizați punctele de intrare, scripturile, modulele relevante, testele, convențiile și eșecurile curente. Nu cereți regenerarea unui sistem ale cărui limite nu le-ați identificat.

### 32. Formulați o sarcină delimitată

Precizați:

- **Obiectiv:** comportamentul cerut;
- **Context:** fișierele relevante și eșecul curent;
- **Constrângeri:** domeniul permis, API-uri, dependențe și invariante;
- **Finalizat când:** comportamente și verificări observabile.

Astfel, atât schimbarea propusă, cât și criteriile de acceptare pot fi revizuite.

### 33. Cereți un singur script de verificare focalizat

Precizați comportamentul public observat, instrumentele și fișierele permise și defectul pe care scriptul trebuie să îl detecteze. Pentru verificări mici, preferați instrumentele incluse. Verificați dacă scriptul exercită limita publică, nu copiază constante sau logica implementării. Înainte de a avea încredere într-un rezultat verde, stricați temporar comportamentul și confirmați că verificarea eșuează din motivul intenționat.

### 34. Diff-ul răspunde la întrebarea „ce s-a schimbat?”

Inspectați fiecare fișier schimbat. Căutați extinderea domeniului, teste șterse, dependențe ascunse, formatare fără legătură, validare slăbită și implementări în afara limitei numite.

### 35. Dovezile din execuție răspund la „funcționează?”

Un diff mic poate fi greșit. Un test verde poate coexista cu schimbări neautorizate. Revizuirea domeniului și verificarea comportamentului sunt porți independente.

### 36. Exemplu rezolvat — fluxul de verificare asistat de AI

Urmați [fluxul de verificare asistat de AI](examples/05-bounded-change-review/) și rulați verificarea HTTP focalizată:

```bash
node lectures/01-web-system-ai-development/ro/examples/05-bounded-change-review/verify-http.mjs
```

Exemplul face explicită secvența: inspectare, clarificarea instrumentelor, formularea contractului, solicitarea și contestarea unei verificări focalizate, reparație delimitată, inspectarea diff-ului, rerularea verificărilor și verificarea independentă. Schimbarea stării de creare la `200` demonstrează sensibilitatea aserțiunii.

### 37. Reparați pornind de la diagnostic

Reproduceți eșecul, precizați contractul observat și așteptat, localizați limita responsabilă, solicitați cea mai mică reparație, inspectați diff-ul, rerulați verificările focalizate și de regresie și explicați rezultatul.

### 38. Agenții accelerează munca; nu dețin corectitudinea

Agentul poate explora, propune teste, implementa și explica. Nu oferă dovezi independente doar afirmând că propriul rezultat este corect. Voi rămâneți responsabili pentru decizia de a accepta rezultatul, pe baza dovezilor pe care le-ați verificat.

## Intermezzo 3 — domeniu și verificare

Răspundeți în patru minute la întrebările cu prefixul `u01-i3-` din [intermezzo.gift](intermezzo.gift). Apoi explicați de ce un „diff mic” și un „comportament verificat” oferă tipuri diferite de dovezi.

## Sinteză — o investigație end-to-end

```text
acțiunea utilizatorului
→ identificați URL-ul, metoda, headerele și corpul cererii
→ identificați starea, headerele și corpul răspunsului
→ comparați schimbul cu contractul resursei
→ localizați limita responsabilă din cod
→ solicitați o schimbare delimitată
→ inspectați diff-ul
→ verificați cu DevTools, curl și verificări focalizate
→ explicați traseul important
```

## Erori frecvente

- Amestecarea informațiilor cererii și răspunsului.
- Trimiterea fragmentelor ca și cum serverul le-ar primi.
- Tratarea query-ului și corpului ca interschimbabile.
- Deducerea tipului media din aspectul corpului.
- Tratarea fiecărui răspuns non-200 ca eroare de rețea.
- Presupunerea că orice header necunoscut este fatal sau sigur opțional fără analiza semanticii.
- Numirea oricărui endpoint JSON drept RESTful.
- Citirea exclusivă a sursei și presupunerea că execuția corespunde.
- Cererea unei editări înainte de clarificarea instrumentelor și dovezilor disponibile.
- Cererea unei rescrieri largi înainte de reproducerea erorii.
- Încrederea într-un diff mic fără verificări.
- Încrederea în teste verzi ignorând schimbări fără legătură.

## Relația cu tutorialul

În HTTP Detective, veți colecta dovezi din browser și linia de comandă. În Tiny HTTP Server, veți examina deciziile serverului din spatele acestor dovezi. În Gemini Repair Task, veți aplica secvența diagnostic–domeniu–reparație–diff–verificare unui contract incorect. Folosiți exemplele mai mici din curs pentru a vă pregăti pentru aceste investigații.

## Listă de verificare pentru dezvoltarea asistată de AI

Înaintea schimbării: inspectați, reproduceți, clarificați instrumentele, formulați contractul public și definiți „finalizat”. Cereți cea mai mică verificare care observă contractul, inspectați-o și demonstrați că detectează defectul. În timpul schimbării: limitați fișierele și invariantele. După schimbare: inspectați diff-ul, rulați verificări focalizate și de regresie, exercitați o cale de eșec, verificați independent și explicați de ce metoda, starea, headerele și corpul sunt coerente.

## Referințe

- Harta de migrare a cursului, Unitatea 01.
- `webtech-2025-course/c6/`.
- `tehnologii-web/http/`, `path-parameter/`, `query-string/` și `forwarder-proxy/`.
- MDN: prezentare HTTP, mesaje, metode, coduri de stare și tipuri media.
- Documentația Node.js pentru HTTP și `fetch` nativ.
- Documentația instrumentelor Network din browser.
