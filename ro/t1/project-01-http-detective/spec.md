# Specificația exercițiului — Detectiv HTTP

## Unitate

Unitatea 01 — Web-ul ca sistem și dezvoltarea asistată de AI

## Obiectiv de învățare

Inspectarea traficului HTTP real din browser și linia de comandă și realizarea unui raport bazat pe dovezi care identifică metoda cererii, componentele URL-ului resursei, starea răspunsului, tipul de conținut și reprezentarea corpului fiecărui schimb.

## De ce există exercițiul

Studenții au nevoie de un model concret cerere/răspuns înainte de a construi un server HTTP sau de a folosi un framework. O țintă locală mică face traficul determinist și sigur, dar cere verificarea afirmațiilor în DevTools și cu `curl`, nu acceptarea explicațiilor generate.

## Cerințe preliminare

- Capacitatea de a rula scripturi npm documentate într-un terminal.
- Familiaritate de bază cu obiecte și array-uri JSON.
- Un browser cu instrumente de rețea pentru dezvoltatori.
- `curl` disponibil în linia de comandă.
- Nu sunt necesare cunoștințe anterioare de JavaScript pe server sau Express.

## Context inițial

Proiectul de referință este un proiect ESM Node.js intenționat mic, fără dependențe la runtime. El furnizează:

- un server local de investigație care pornește pe un port loopback disponibil și afișează URL-ul de bază exact;
- o pagină la `/` cu controlul **Rulează investigația**;
- cod de browser care trimite cele trei cereri de mai jos și le afișează corpurile, fără a explica schimburile;
- fișierul de raport `case-report.json`;
- un validator de raport accesibil prin `npm test`;
- un README scurt cu comenzile de pornire, inspectare, `curl` și testare, fără observațiile completate.

Serverul și codul cererilor sunt infrastructură de bază. Studenții le inspectează și observă traficul; nu le implementează și nu le modifică în acest exercițiu.

Investigația folosește următoarele schimburi, relative la URL-ul local afișat:

1. `GET /assets/detective.css` returnează CSS cu starea `200` și un tip de conținut CSS.
2. `GET /api/clues?case=missing-cookie` returnează JSON cu starea `200`, headerul `X-Case-Id` și un corp care conține identificatorul cazului și o listă mică de indicii.
3. `POST /api/verdicts`, cu un corp JSON care conține `caseId` și `verdict`, returnează JSON cu starea `201`, un header `Location` pentru resursa creată și reprezentarea verdictului.

Browserul inițiază toate cele trei schimburi după deschiderea DevTools și activarea controlului, astfel încât ele apar împreună în Network. Serverul poate expune numai rutele necesare paginii, resurselor și acestor schimburi.

## Comportament obligatoriu

- `case-report.json` conține câte o intrare pentru `stylesheet`, `clues` și `verdict`.
- Fiecare intrare consemnează:
  - metoda cererii;
  - calea;
  - parametrii query ca obiect, gol când nu există;
  - tipul media al corpului cererii sau `null` când corpul lipsește;
  - codul de stare al răspunsului;
  - tipul media normalizat al răspunsului, fără parametri charset;
  - reprezentarea corpului, exact `text` sau `json`.
- Intrarea `clues` consemnează și valoarea observată `X-Case-Id`.
- Intrarea `verdict` consemnează și valoarea observată `Location`.
- Valorile sunt observații ale aplicației în execuție, nu constante copiate din server.
- `npm test` pornește ținta pe un port efemer, trimite cereri echivalente și compară raportul cu observațiile HTTP reale.
- La nepotrivire, validarea numește schimbul și câmpul fără a afișa raportul corect complet.
- Pagina rămâne utilizabilă, iar cele trei cereri reușesc după completarea raportului.

## Constrângeri

- JavaScript, module ECMAScript, Node.js LTS, `fetch` nativ și runnerul de teste Node.
- Facilitățile HTTP incluse în Node; Express aparține unei unități ulterioare.
- Serverul ascultă numai pe loopback și acceptă un port atribuit de sistem.
- Fără internet, API-uri terțe, extensii de browser sau servicii externe.
- Fără dependențe adăugate doar pentru inspectarea HTTP.
- Numele headerelor sunt tratate fără diferențierea literelor, iar tipurile media sunt comparate fără parametri opționali.
- Studenții nu modifică serverul sau codul cererilor furnizate.
- Căile importante rămân suficient de mici pentru a fi inspectate într-un tutorial.

## Criterii observabile de finalizare

- Activarea **Rulează investigația** produce vizibil în DevTools cele trei cereri cu metodele și stările specificate.
- Comenzi `curl` echivalente expun aceleași stări, headere relevante și reprezentări.
- `case-report.json` nu conține placeholder-e și descrie corect toate schimburile reale.
- `npm test` se încheie cu starea `0`, iar verificările de bază, obiectiv și regresie trec.
- Studentul poate indica dovada DevTools sau `curl` pentru fiecare valoare și poate explica diferența dintre cerere și răspuns.

## Plan de validare

### Verificări de bază

- Proiectul folosește ESM și se instalează reproductibil din lock file, fără pachete runtime terțe.
- Serverul poate asculta pe un port loopback efemer și servește pagina și resursele.
- Cele trei endpointuri răspund fără dependență de `case-report.json`.
- Modulul browserului conține și invocă toate cele trei cereri.

### Verificările obiectivului

- Validatorul trimite cereri reale și derivă metoda, calea, query-ul, tipul cererii, starea, tipul răspunsului, reprezentarea și headerele relevante.
- Observațiile sunt comparate câmp cu câmp cu intrările raportului.
- Validatorul eșuează la intrări lipsă, placeholder-e, câmpuri suplimentare, tipuri sau valori incorecte și confuzia cerere/răspuns.
- Eșecul numește numai schimbul, câmpul și valoarea trimisă, fără a dezvălui valoarea așteptată.

### Verificări de regresie

- Răspunsul `clues` păstrează asocierea dintre payload, `X-Case-Id` și valoarea query `case=missing-cookie`.
- Răspunsul `verdict` reprezintă datele trimise, returnează `201` și oferă un `Location` pentru resursa creată.
- Răspunsul stylesheet rămâne text CSS, iar pagina îl încarcă.
- Căile necunoscute returnează o stare fără succes și nu blochează serverul.

## Munca destinată studentului

După validarea referinței, varianta studentului se obține înlocuind numai observațiile completate din `case-report.json` cu valori explicite `"TODO"`, `null` sau obiecte placeholder, păstrând cele trei intrări și numele câmpurilor. Serverul, pagina, cererile, validatorul, scripturile, resursele și documentația nu se schimbă.

Singura responsabilitate a studentului este observarea schimburilor și înlocuirea placeholder-elor. Verificările de bază și regresie continuă să treacă; verificările obiectivului eșuează câmp cu câmp până când raportul este exact. Nicio copie completată a raportului nu poate rămâne în arborele studentului.

## Sarcină pentru Gemini

> Citiți structura proiectului, `case-report.json` și eșecul validării. Nu editați încă și nu deduceți răspunsurile din server. Oferiți o listă concisă care arată unde poate fi observat fiecare câmp în DevTools și în ieșirea `curl -i` sau `curl -v`. Marcați câmpurile care cer dovezi din cerere, nu din răspuns. Sarcina este finalizată când pot colecta independent fiecare valoare.

După completare, studentul cere Gemini să revizuiască numai diff-ul raportului pentru presupuneri nejustificate, apoi rulează `npm test` și verifică orice corecție în traficul real.

## Sarcină de depanare/extensie

- Schimbați intenționat tipul media al răspunsului `verdict` în `text/plain`, păstrând corpul asemănător JSON. Folosiți testul, DevTools și `curl` pentru a diagnostica diferența dintre aspect și tipul declarat. Cereți o reparație de o linie, inspectați diff-ul, rerulați verificările și restaurați comportamentul canonic.

## În afara domeniului

- Implementarea serverului sau rutelor de către student.
- Express, CRUD REST, persistență, autentificare, CORS, proxy-uri, cache, redirecturi sau deployment.
- Captură de pachete, detalii TLS, framing HTTP/2 sau HTTP/3 și automatizarea browserului.
- Predarea generală a sintaxei JavaScript dincolo de citirea proiectului mic.
- Acceptarea unui raport generat de Gemini fără observarea și verificarea independentă a traficului.
