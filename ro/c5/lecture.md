# Cursul 05 — JavaScript pe server și API-uri REST

> Durată planificată: 100 de minute
>
> Format: trei blocuri conceptuale, șase exemple, o variantă opțională 5b și trei intermezzouri de recapitulare

## Rezultatele învățării

La finalul cursului, ar trebui să poți explica de ce folosești Express, să urmărești middleware-ul în ordine, să alegi rute de resurse și răspunsuri HTTP, să distingi parsarea de validare, să compari verificările manuale cu Joi, să citești o operație OpenAPI, să selectezi și negociezi reprezentări ale colecției, să explici constrângerile REST și nivelurile modelului de maturitate și să transmiți erorile fără un al doilea răspuns.

## Planul sesiunii

| Segment | Timp | Temă |
| --- | ---: | --- |
| Urmărirea inițială a cererii | 0–5 min | Urmărește o cerere de creare a unei sarcini |
| Bloc conceptual 1 | 5–28 min | Node, Express, rutare, middleware |
| Intermezzo 1 | 28–32 min | Verificarea fluxului și rutelor |
| Bloc conceptual 2 | 32–64 min | REST, vederi ale colecției, formate, Joi, OpenAPI |
| Intermezzo 2 | 64–68 min | Verificarea răspunsurilor și validării |
| Bloc conceptual 3 | 68–89 min | Erori, observabilitate, verificare |
| Intermezzo 3 | 89–93 min | Erori și recapitulare REST |
| Sinteză | 93–100 min | Secvența de la cerere la răspuns |

> Când o comandă pornește un server persistent (`npm start`, `npm run dev` sau `node server.mjs`), lasă-l să ruleze și folosește alt terminal pentru teste/build. Pentru un exemplu cu API și Vite, rulează-le în terminale separate; oprește serverele cu Ctrl+C când termini.

Exemplele sunt aplicații independente; serverele lor folosesc același port implicit. Instalează dependențele înainte de curs, pornește un singur server odată și prezice rezultatul cererii înainte să îl verifici. Exemplul 05 adaugă Joi și o descriere pentru instrumente după verificările manuale; exemplul 06 izolează apoi tratarea erorilor.

## Începe cu o cerere de creare a unei sarcini

Știi deja să primești o cerere cu modulul HTTP din Node. Express este o bibliotecă ce te ajută să alegi funcția care tratează cererea și să reutilizezi pași precum parsarea JSON.

Urmărește o cerere `POST /api/tasks` pe parcursul cursului:

1. Node primește cererea HTTP.
2. Express rulează funcțiile potrivite în ordinea înregistrării lor.
3. Ruta verifică datele și cere unui repository—obiectul care citește și scrie sarcinile—să creeze o sarcină.
4. Ruta trimite o stare, antete și un corp sau transmite eșecul codului de tratare a erorilor.

Tu decizi ce date sunt valide și ce înseamnă fiecare răspuns. Documentează metodele și datele acceptate, răspunsurile posibile și modificările produse asupra datelor. Clienții au nevoie de aceste informații; OpenAPI le poate face accesibile și instrumentelor externe.

## Bloc conceptual 1 — Node, Express, rute și middleware

### 1. Node rulează JavaScript în afara browserului

Node oferă API-uri pentru proces, sistem de fișiere, rețea, fluxuri și HTTP. Programele server sunt procese de lungă durată care acceptă lucru concurent și trebuie să gestioneze eșecurile fără să corupă cereri ulterioare.

Node folosește același limbaj ca browserul, dar mediul diferă. Nu există DOM-ul unei pagini decât dacă îl adaugi. Poți citi configurația din `process.env`, deschide un socket de ascultare și accesa fișierele permise procesului. O funcție care tratează o cerere rulează în acel proces; nu este un program nou pornit pentru fiecare cerere.

Cât timp o funcție așteaptă I/O, Node poate începe tratarea altei cereri. Asta nu face calculele JavaScript intensive să ruleze în paralel pe același fir al buclei de evenimente. Un calcul sincron lung întârzie alte cereri. Păstrează distincția când citești o rută `async`.

### 2. Node primește cererea; Express o tratează

Serverul HTTP Node acceptă conexiuni și creează obiectele cerere și răspuns. Transmiți aplicația Express serverului ca funcție de tratare a cererilor. Express folosește același răspuns: trimiterea lui dintr-o rută nu creează un alt răspuns pentru middleware-ul următor.

Cu `node:http` poți inspecta `request.method`, parsa URL-ul, colecta fragmentele corpului, alege o funcție, serializa răspunsul și trata erorile manual. Este util pentru a înțelege HTTP. Într-o aplicație mai mare, repetarea acestor operații înseamnă să întreții propriul framework de rutare și middleware: potrivirea rutelor, limitele parserului, propagarea erorilor și răspunsurile au nevoie de comportament consecvent și teste.

Express oferă aceste mecanisme recurente. Aplicația ta continuă să aleagă rutele, să valideze datele și să traducă rezultatele în HTTP. Astfel poți studia aceste decizii păstrând vizibil traseul cererii.

Alegem Express în loc de Fastify aici deoarece lista ordonată de funcții obișnuite este mai ușor de urmărit în această etapă. Fastify adaugă mecanisme utile: hook-uri de ciclu de viață, încapsularea pluginurilor și validare/serializare bazată pe scheme. Acestea ar introduce concepte suplimentare înainte să fi urmărit un server mic. Este o alegere didactică, nu afirmația că Express este mereu mai simplu pentru orice aplicație sau mai rapid. Consultă [încapsularea în Fastify](https://fastify.dev/docs/latest/Reference/Encapsulation/) și [validarea](https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/).

### 3. Funcțiile middleware rulează în ordinea înregistrării

Un **middleware** este o funcție pe care Express o apelează cu `(request, response, next)`. Poate inspecta cererea, atașa o valoare precum ID-ul cererii, trimite un răspuns sau apela `next()` pentru a continua. Înregistrează middleware cu `app.use(...)` și rute pentru o metodă prin apeluri precum `app.get(...)` sau `app.post(...)`. Rulează doar funcțiile care corespund cererii.

Gândește-te la `next` ca la funcția de continuare oferită de Express. O funcție care nici nu răspunde, nici nu apelează `next` lasă cererea în așteptare. Dacă răspunde și apoi apelează `next`, codul ulterior poate încerca un al doilea răspuns. Middleware-ul nu trebuie să știe ce funcție urmează; înregistrarea și potrivirea stabilesc asta.

```js
app.use((request, response, next) => {
  response.set("X-Course-Example", "routing");
  return next();
});
app.get("/api/ping", (_request, response) => {
  return response.json({ data: "pong" });
});
```

Aici `app.use` nu are restricție de cale, deci rulează pentru fiecare cerere care ajunge la el. Ruta rulează doar pentru metoda și calea potrivite.

### 4. Ordinea middleware-ului este comportament

Parsarea JSON trebuie să ruleze înaintea codului care consumă `request.body`; conținutul static trebuie montat înaintea unui fallback care l-ar ascunde; middleware-ul de eroare vine după rutele normale. Reordonarea nu este cosmetică.

Urmărește și o cerere cu JSON invalid, nu doar una validă. Dacă parserul este înaintea rutei, parsarea poate eșua înaintea validării. Express caută apoi înainte un middleware de eroare. Un gestionar aflat deasupra parserului nu poate prinde o eroare ulterioară prin întoarcerea în listă.

`app.use("/api", router)` montează un router sub un prefix comun. În el, `router.get("/tasks", ...)` tratează `/api/tasks`. Poți grupa rutele fără un model nou de execuție.

### 5. Trimite răspunsul sau continuă la funcția următoare

Dacă apelezi `response.json(...)`, trimiți răspunsul. Dacă apelezi `next()`, Express caută următoarea funcție potrivită. Niciun apel nu este un `return` JavaScript: instrucțiunile de după el pot continua. Folosește `return response.json(...)`, `return next()` sau ramuri exclusive când funcția curentă trebuie să se oprească. Nu trimite răspunsul și apoi continua într-un gestionar care poate trimite din nou.

### 6. Observă când se termină răspunsul

Înregistrează momentul inițial, atașează ascultătorii pentru evenimentele răspunsului și abia apoi apelează `next()`. Astfel nu pierzi finalizarea produsă de codul următor. `finish` înseamnă că Node a predat datele răspunsului sistemului de dedesubt; nu demonstrează că le-a primit clientul. `close` poate urma atât finalizarea normală, cât și întreruperea conexiunii. Verifică dacă răspunsul s-a terminat și asigură-te că înregistrezi rezultatul o singură dată.

### 7. Exemplu — fluxul unei cereri Express

Rulează [fluxul Express](examples/01-express-request-flow/):

```bash
cd lectures/05-server-rest-api/ro/examples/01-express-request-flow
npm ci
npm test
npm start
```

Secvența arată un observator în jurul unei resurse statice și al unei rute API.

Prezice lista de evenimente înainte să rulezi testul: cererea statică nu are eveniment de rută API, dar ambele cereri se încheie. Exemplul izolează ordinea execuției; nu implementează un jurnal complet.

### 8. Servește fișiere și rute API din aceeași aplicație

`express.static` servește fișiere precum HTML, CSS și imagini dintr-un director. Rutele `/api/...` calculează răspunsuri din datele aplicației. Înregistrează-le explicit, apoi pune gestionarul final pentru resurse lipsă după ele, ca să nu intercepteze cereri valide.

Directorul static este o locație din sistemul de fișiere, nu implicit un prefix URL. De exemplu, `app.use("/assets", express.static(publicDirectory))` face ca `/assets/logo.svg` să indice `logo.svg` din acel director. Păstrează sursele și secretele în afara directorului servit. Servirea fișierelor statice nu transformă un răspuns API JSON într-o pagină; clientul decide ce cere și cum afișează.

### 9. Rutele potrivesc metoda și calea

`GET /api/tasks` și `POST /api/tasks` sunt operații diferite. Un model mental bazat doar pe cale tratează greșit metodele neacceptate drept potriviri.

Definiția unei rute descrie ce tratează aplicația, nu toate cererile HTTP legale. O cerere nepotrivită ajunge de obicei la gestionarul final 404. Express nu construiește automat un răspuns 405 complet cu metodele permise pentru fiecare resursă; adaugă-l explicit dacă API-ul îl promite. Un detaliu al framework-ului: Express poate folosi gestionarul GET pentru HEAD dacă nu ai înregistrat separat un gestionar HEAD.

### 10. Parametrii căii identifică membri

`/api/tasks/:taskId` numește un tipar; `request.params.taskId` conține identificatorul potrivit. Validează-l și interpretează-l la limita potrivită.

În `/api/tasks/t-7`, parametrul extras este șirul `"t-7"`. Potrivirea rutei nu dovedește că sarcina există. Verifică întâi forma identificatorului, apoi întreabă obiectul de acces la date dacă există resursa. Tiparul rutei nu este o interogare a bazei de date.

### 11. Parametrii interogării rafinează reprezentarea

`GET /api/tasks?completed=true` cere o vedere filtrată a colecției. Interogarea face parte din URI: acesta și `/api/tasks?completed=false` pot identifica vederi diferite, deși folosesc aceeași rută Express. Valorile cer verificare explicită.

Pentru `?completed=false`, `Boolean(request.query.completed)` este greșit: șirul nevid `"false"` este truthy. Compară explicit cu șirurile acceptate și respinge alte valori dacă API-ul cere un boolean. Parametrii pot avea chei repetate sau o structură determinată de parserul configurat, deci nu presupune că fiecare valoare este un singur șir.

### 12. Exemplu — potrivirea rutelor Express

Rulează [potrivirea rutelor Express](examples/02-route-match-boundary/):

```bash
cd lectures/05-server-rest-api/ro/examples/02-route-match-boundary
npm install
npm test
```

Testul și cererile `curl` documentate exercită prin Express selecția metodă/cale, extragerea membrului, rafinarea prin query și fallback-ul pentru ruta fără corespondent.

## Intermezzo 1 — fluxul cererii și rutare

Răspunde la întrebările `u05-i1-` din [intermezzo.gift](intermezzo.gift). Rezervă patru minute. Explică de ce folosești Express, cum se potrivesc rutele și ce se întâmplă când middleware-ul răspunde sau continuă.

## Bloc conceptual 2 — contracte REST, parsare și validare

### 13. Denumește resursele în URL-uri

O **resursă** este ceva identificat de API, precum colecția de sarcini la `/api/tasks` sau sarcina de la `/api/tasks/t-7`. O **reprezentare** este informația pe care o trimiți despre ea, de exemplu un obiect JSON. Folosește metoda HTTP pentru citire, creare, modificare și ștergere, în loc să inventezi un URL de acțiune fără legătură pentru fiecare operație.


### 14. Selectează o vedere a colecției: filtrează, sortează, apoi paginează

Pentru o cerere precum `GET /api/tasks?q=notes&sort=title&order=asc&offset=0&limit=2`, separă aceste operații:

| Operație | Întrebare | Parametri în exemplul 03 |
| --- | --- | --- |
| Filtrare | Ce membri se potrivesc? | `q` este un subșir al titlului, fără diferențiere între majuscule și minuscule. |
| Sortare | În ce ordine apar membrii potriviți? | `sort=title`, `order=asc` sau `desc`; ID-ul departajează titlurile egale. |
| Paginare | Ce parte limitată a rezultatului ordonat primești? | `offset` sare peste membri; `limit` limitează dimensiunea paginii. |

Aplică operațiile în această ordine. Paginarea înaintea filtrării poate elimina membri potriviți; sortarea unei pagini deja extrase nu ordonează întregul rezultat. Sortează o copie, fără să modifici stocarea pentru o altă afișare. Folosește o departajare deterministă pentru ca titlurile egale să nu treacă arbitrar între pagini.

Exemplul folosește implicit offset 0 și limit 2, limitează limit la 20, respinge parametrii invalizi/repetați/necunoscuți și întoarce `meta: { total, offset, limit }`. Aici `total` numără potrivirile înaintea paginării. O pagină de după sfârșit este o listă goală cu succes, nu o resursă lipsă cu 404. Răspunsul poate include antetul `Link` cu `rel="next"`; urmează acel URI în loc să îl reconstruiești și să pierzi accidental filtrul.

Paginarea cu offset este ușor de urmărit, dar inserările și ștergerile între cereri pot muta elemente între pagini. Paginarea cu cursor cere porțiunea de după o valoare de continuare într-o ordine stabilă. Cursorul nu asigură automat un instantaneu: actualizările concurente au nevoie de o politică de consistență documentată. În demonstrație folosești offset și discuți alternativa fără să implementezi alt sistem de paginare.

Numele parametrilor și limitele sunt alegeri ale aplicației, nu reguli impuse de REST.

### 15. REST descrie constrângeri asupra proiectării unui API

**REST** înseamnă Representational State Transfer. Descrie un stil arhitectural cu resurse identificate, reprezentări, semantica metodelor standard și cereri fără dependență de contextul cererilor anterioare, printre alte constrângeri. O cerere stateless conține informația necesară interpretării ei; aceasta nu interzice o bază de date sau resurse salvate. Simplul răspuns JSON nu face un API RESTful. Aici aplici convențiile resurselor și HTTP în API-uri mici.

Distinge starea resursei de starea conversației. Sarcina rămâne în stocare între cereri. Tratarea fără stare conversațională înseamnă că noua cerere nu depinde de o cerere anterioară care să fi pregătit un context ascuns pentru acel client. Autentificarea, adăugată ulterior, trebuie și ea să furnizeze datele necesare cererii respective.

Metodele HTTP au semantică dincolo de nume. GET este destinat citirii fără modificarea stării resursei. PUT descrie înlocuirea și este idempotent: repetarea aceleiași cereri are același efect intenționat. PATCH descrie o modificare parțială și nu este automat idempotent. Ștergerea unei sarcini deja șterse poate întoarce alt status, deși DELETE rămâne idempotent ca efect intenționat.


Constrângerile arhitecturale explică mai mult decât numele resurselor:

| Constrângere | Ce trebuie să poți explica |
| --- | --- |
| Client–server | Clientul prezintă și cere informații; serverul gestionează resurse. Implementările pot evolua separat prin interfață. |
| Interacțiune fără stare conversațională | Fiecare cerere furnizează informația necesară interpretării; datele resurselor pot rămâne stocate. |
| Posibilitatea folosirii cache-ului | Răspunsul comunică dacă și cum poate fi reutilizat. Metadatele corecte pot evita altă cerere; datele private sau schimbătoare cer o politică explicită. |
| Interfață uniformă | Identifici resurse, le modifici prin reprezentări, faci mesajele autodescriptive și expui tranzițiile disponibile prin hipermedia. |
| Sistem stratificat | Clientul poate comunica prin intermediari, precum proxy-uri sau gateway-uri, fără să depindă de straturile ascunse ale implementării. |
| Cod la cerere, opțional | Serverul poate furniza cod executabil clientului, precum JavaScript unui browser. Un API nu trebuie să folosească această constrângere opțională. |

Reprezentarea nu este neapărat un rând din baza de date. O sarcină poate fi codificată JSON, afișată HTML sau inclusă într-un export CSV al colecției. Identitatea și sensul ei sunt separate de codificare. Interogarea din URI participă la identificarea vederii cerute; antetele pot apoi selecta o reprezentare pentru acea țintă. Consultă [constrângerile REST ale lui Fielding](https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm).

### 16. Compară API-uri HTTP prin modelul Richardson

**Modelul de maturitate Richardson** este un model didactic, nu un standard REST sau un certificat de corectitudine:

| Nivel | Ce se schimbă? | Schiță pentru API-ul de sarcini |
| --- | --- | --- |
| 0: HTTP ca transport | Un singur endpoint primește mesaje cu numele operațiilor. | `POST /taskService` cu o acțiune în corp. |
| 1: resurse | Operațiile adresează resurse individuale, dar metodele pot fi încă folosite fără diferențiere. | `/tasks/t-7`, cu POST atât pentru citire, cât și pentru schimbare. |
| 2: semantică HTTP | Metodele, statusurile și antetele exprimă operația și rezultatul. | GET citește; POST întoarce 201 și Location; DELETE poate întoarce 204. |
| 3: controale hipermedia | Reprezentările descriu acțiuni următoare disponibile și țintele lor. | Răspunsul oferă un link către pagina următoare sau o tranziție permisă pe care clientul o poate urma. |

**HATEOAS** înseamnă **Hypermedia as the Engine of Application State**. Clientul urmează controale ale căror relații și semantică de tip media le înțelege, în loc să inventeze toate URL-urile din reguli nedocumentate. Un link de paginare ilustrează navigarea; singur nu dovedește nivelul 3 sau respectarea tuturor constrângerilor REST de către întregul API. Controalele pentru acțiuni trebuie să ofere și informația necesară efectuării operației.

Exemplele noastre demonstrează în principal tehnici de nivel 2 și un mic control de navigare în exemplul colecției. JSON plus CRUD nu definește complet REST; publicarea OpenAPI nu adaugă hipermedia. Folosește [modelul Richardson explicat de Fowler](https://martinfowler.com/articles/richardsonMaturityModel.html) pentru diferențe concrete, nu pentru a clasifica API-ul după framework.

### 17. Asociază operațiile CRUD cu metode și răspunsuri

**CRUD** înseamnă Create, Read, Update, Delete: creare, citire, modificare și ștergere. Pentru un API de sarcini, o asociere obișnuită este:

| Operație | Cerere | Răspuns reușit uzual |
| --- | --- | --- |
| Listare/citire | `GET /api/tasks` sau `/api/tasks/:id` | `200` cu date |
| Creare | `POST /api/tasks` | `201` cu date și `Location` |
| Modificare | `PATCH /api/tasks/:id` | `200` cu date sau `204` fără corp |
| Ștergere | `DELETE /api/tasks/:id` | `204` fără corp |

Documentează alegerile efective ale API-ului. Numele CRUD nu determină singure toate stările sau erorile.

### 18. Starea, antetele și corpul trebuie să concorde

Un răspuns de creare nu trebuie să folosească `201` și un corp de eroare fără legătură. Un răspuns `204` nu trebuie să trimită JSON. Clienții se bazează pe întregul răspuns.

Citește `response.status(201).location("/api/tasks/t-7").json({ data: task })` ca o singură construcție de răspuns. Statusul anunță crearea, antetul identifică resursa nouă, iar JSON-ul o reprezintă. `response.status(204).end()` încheie fără corp. Un `{ success: true }` asociat cu 204 este contradictoriu chiar dacă framework-ul elimină octeții corpului.


### 19. Selectează codificarea prin negocierea conținutului

Antetul **Accept** al clientului declară tipurile media de răspuns pe care le poate folosi. **Content-Type** din răspuns declară tipul efectiv trimis. Dacă cererea are corp, Content-Type al cererii descrie acel corp; nu alege formatul răspunsului.

```http
GET /api/tasks?sort=title&limit=2 HTTP/1.1
Accept: text/csv
```

Aceeași țintă poate întoarce CSV aici și JSON pentru `Accept: application/json`. Exemplul 03 apelează `request.accepts(["application/json", "text/csv"])`, apoi folosește serializarea și Content-Type potrivite. Lipsa lui Accept sau un wildcard permite alegerea implicită JSON. Preferința `text/csv;q=0.8, application/json;q=0.2` favorizează CSV; valoarea `q` zero înseamnă neacceptabil. Dacă niciun tip disponibil nu este acceptabil, exemplul alege 406. HTTP permite serverului să ignore preferințele în anumite situații; documentează politica, nu promite implicit negociere strictă peste tot.

Poți selecta prin parametri sau antete? Da, dacă API-ul documentează asta, dar consecințele diferă:

| Alegere | Consecință |
| --- | --- |
| `?q=notes&offset=2&limit=2` | Selecția este vizibilă în URI; poți salva sau distribui vederea și o poți distinge într-un cache bazat pe URI. |
| Antete proprii de filtrare/paginare | Posibile, dar URI-ul singur nu mai păstrează selecția. Răspunsurile reutilizabile cer numele antetelor relevante în `Vary`, iar navigarea trebuie să păstreze separat preferințele. Nu există un antet standard general pentru orice opțiune de interogare. |
| `Accept: text/csv` | Negociere HTTP standard pentru tipul media al răspunsului. `Vary: Accept` spune cache-urilor că antetul participă la selecție. |
| `?format=csv` sau cale `.csv` | Este posibil și un URI explicit pentru format. Definește relația cu Accept și ce se întâmplă când se contrazic. |

`Vary` singur nu permite reutilizarea în cache. Exemplul 03 emite `Cache-Control: no-store` pentru a ține schimbările din memorie în afara cache-urilor; expune totuși `Vary: Accept` pentru a face vizibilă regula de selecție. Negociază răspunsurile reușite ale colecției; erorile diagnostice folosesc JSON. Metadatele JSON și rândurile CSV nu trebuie să aibă structuri identice: ambele conțin membrii selectați, iar antetul Link comun oferă continuarea. Consultă [negocierea conținutului HTTP](https://www.rfc-editor.org/rfc/rfc9110.html#section-12) și [Vary](https://www.rfc-editor.org/rfc/rfc9110.html#section-12.5.5).

### 20. Folosește un obiect de eroare consecvent

Un **înveliș** este un obiect exterior care dă răspunsurilor o structură previzibilă. De exemplu:

```json
{ "error": { "code": "task_not_found", "message": "Sarcina nu a fost găsită" } }
```

Codul clientului poate verifica `code`; utilizatorul poate citi `message`. Păstrează mesajul potrivit pentru afișare publică și detaliile de diagnostic în logurile serverului.

### 21. Exemplu — contracte de resurse REST în Express

Rulează [contractele resurselor REST](examples/03-resource-contract-table/):

```bash
cd lectures/05-server-rest-api/ro/examples/03-resource-contract-table
npm install
npm test
```

Folosește cererile `curl` documentate pentru a examina o creare reală, citirea ulterioară, resursa lipsă și ștergerea fără body. Citește metoda, statusul, header-ele, body-ul și starea rezultată drept un singur contract.

Acest exemplu izolează semantica HTTP: funcția minimă de creare presupune un titlu valid, iar Map se resetează la repornirea aplicației. Nu este API-ul validat din exemplele 04 și 05.

### 22. Parsarea și validarea sunt separate

`express.json()` stabilește dacă octeții formează JSON și produce o valoare JavaScript. Nu dovedește că valoarea este obiect, are câmpuri permise sau respectă regulile domeniului.

Sunt trei întrebări separate: este acceptat tipul media, corpul este JSON valid sintactic și valoarea rezultată este validă pentru operație? `{"title":7}` trece de sintaxa JSON, dar nu de regula unui titlu șir. `{"title":` eșuează înainte să ai un obiect de inspectat. Distinge aceste eșecuri când depanezi.

`express.json()` are și o limită de dimensiune și opțiunea `strict`. Modul strict implicit acceptă obiecte și tablouri JSON, nu orice valoare JSON. Exemplul 04 folosește `strict: false` ca să vezi validatorul însuși respingând `null` și valorile primitive. Depășirea limitei de dimensiune primește în mod obișnuit 413, nu un mesaj despre titlu invalid.

### 23. Verifică tipul media înaintea semanticii corpului

O rută care așteaptă JSON trebuie să respingă deliberat un tip neacceptat, de obicei cu `415`. Nu interpreta octeți arbitrari drept JSON doar pentru că ruta are nevoie de obiect.

### 24. „Obiect” necesită o definiție exactă

În JavaScript, `typeof null` și `typeof []` sunt `"object"`. O limită pentru obiecte simple le exclude de obicei pe ambele.

### 25. Acceptă doar câmpurile documentate de rută

Dacă pentru creare accepți doar `title`, stabilește ce faci cu un câmp suplimentar precum `admin`. În aceste exerciții, respinge câmpurile necunoscute în loc să transmiți întregul corp codului de salvare. După verificarea tipurilor, creează un obiect nou doar cu valorile acceptate.

Aceasta este o alegere de politică, nu o cerință universală REST. Unele API-uri ignoră intenționat câmpurile suplimentare pentru compatibilitate. Aici forma acceptată este închisă, astfel încât o greșeală de scriere sau o proprietate neașteptată să fie vizibilă. Respingerea ei evită și transmiterea accidentală a unor câmpuri pe care clientul nu avea voie să le seteze. Validarea nu înlocuiește autorizarea.

### 26. Validează tipul înaintea normalizării

Eliminarea spațiilor dintr-un șir poate fi normalizare validă. Conversia valorilor arbitrare prin `String(value)` schimbă contractul și poate transforma intrarea invalidă în date plauzibile.

Alege separat normalizarea și conversia de tip. Eliminarea spațiilor din `"  Review notes  "` păstrează intenția unui șir. Transformarea lui `42` în `"42"` acceptă alt tip de intrare. O bibliotecă poate activa conversiile implicit; verifică opțiunile în loc să presupui că respectă politica ta.

### 27. Descrie regulile de intrare cu Joi

După validare, transmite aplicației un obiect normalizat nou. Înghețarea lui poate expune în teste mutații neașteptate în aval.

Pentru date mai complexe, o bibliotecă de scheme poate exprima într-un singur loc verificările repetate. **Joi** descrie câmpuri obligatorii, tipuri, limite și tratarea câmpurilor necunoscute în JavaScript. Întoarce un rezultat cu `value` și, la eșec, `error`. Folosește `value` numai după verificarea lui `error`.

```js
const schema = Joi.object({ title: Joi.string().required() })
  .unknown(false).required();
const { error, value } = schema.validate(request.body, {
  convert: false, abortEarly: false
});
```

`required()` pe câmp respinge lipsa titlului; pe obiect respinge lipsa corpului. `unknown(false)` respinge cheile suplimentare. `convert: false` dezactivează conversia automată; `abortEarly: false` cere mai multe erori de validare când sunt disponibile. Schema nu știe dacă utilizatorul are voie să creeze sarcina sau dacă o constrângere a bazei de date va reuși. Consultă [API-ul Joi](https://joi.dev/api/18.x.x) pentru opțiuni; exemplul rulabil fixează versiunea Joi 17.13.8.

### 28. Exemplu — limita corpului cererii

Rulează [limita corpului](examples/04-request-body-boundary/):

```bash
cd lectures/05-server-rest-api/ro/examples/04-request-body-boundary
npm install
npm test
```

Ruta Express distinge tipul media, parsarea JSON, intrarea normalizată validă, tablourile, câmpurile necunoscute și titlurile goale. README-ul oferă cereri `curl` echivalente.

### 29. Descrie API-ul pentru oameni și instrumente

Rutele traduc intrarea HTTP în apeluri ale aplicației și rezultatele înapoi în HTTP. Repository-urile nu trebuie să cunoască obiectele cerere/răspuns Express.

Poți descrie aceeași interfață HTTP în **OpenAPI**, un document interpretabil de programe, scris în JSON sau YAML. `paths` grupează URL-uri și metode; o operație descrie parametri, tipuri media și scheme de intrare, răspunsuri și antete. Instrumentele externe pot folosi descrierea pentru documentație, pregătirea cererilor, generarea de clienți sau verificarea interacțiunilor HTTP.

De exemplu, `/api/tasks` cu `post` descrie crearea; `requestBody.content.application/json.schema` descrie intrarea JSON. `required: [title]` cere câmpul, iar `additionalProperties: false` respinge câmpurile nelistate în `properties`. În `responses`, cheia șir `"201"` descrie crearea, corpul și antetul Location. O cale pentru un membru ar folosi `/api/tasks/{taskId}` și o declarație explicită a parametrului de cale.

OpenAPI nu este un router Express sau o schemă Joi. Publicarea fișierului nu validează cereri, nu implementează rute și nu dovedește conformitatea serverului. Joi folosește metode JavaScript; OpenAPI are structura sa de document și vocabularul JSON Schema. Menține regulile aliniate și testează răspunsurile reale. Consultă [OpenAPI 3.1.1](https://spec.openapis.org/oas/v3.1.1.html).

Deschide [Joi și OpenAPI](examples/05-joi-openapi/) după validatorul manual. Compară `validateManually` și `validateWithJoi`: ambele resping numere, tablouri, titluri lipsă, titluri goale și câmpuri necunoscute și elimină spațiile din șirurile acceptate fără să modifice intrarea. În varianta Joi, șirurile alcătuite doar din spații sunt respinse după normalizarea explicită. Inspectează apoi `/openapi.json` într-un client REST sau instrument de documentație. Descrierea cere un caracter diferit de spațiu și menționează normalizarea; un generator de clienți nu o reproduce automat. Ruta întoarce o sarcină demonstrativă și nu o stochează.

Comparație opțională: [exemplul 5b — OpenAPI și artefacte de interfață generate](examples/05b-generated-openapi/) convertește schemele Joi și metadatele HTTP comune într-o specificație generată, o pagină Swagger UI cu Try it out și un client fetch JavaScript mic. Compară schemas.js, operation.js și generated/openapi.json: tipurile și regulile sunt convertite, iar metoda/calea/statusurile rămân declarate explicit. Reduci descrierile duplicate fără să descoperi automat comportament arbitrar. Varianta este material suplimentar; păstrează cele șase demonstrații principale în planul sesiunii.

## Intermezzo 2 — răspunsuri și validare

Răspunde la întrebările `u05-i2-` din [intermezzo.gift](intermezzo.gift). Rezervă patru minute. Urmărește filtrare → sortare → paginare, distinge parsarea de validarea Joi și explică Accept și rolul OpenAPI.

## Bloc conceptual 3 — limite pentru erori, observabilitate și teste

### 30. Nu toate rezultatele așteptate sunt excepții

O sarcină absentă poate fi un rezultat normal al serviciului reprezentat ca `404`. Eșecurile neașteptate ale repository-ului trebuie să ajungă la tratarea centralizată. Alege un protocol consecvent între serviciu și rută.

Nu transforma „sarcină absentă” în „bază de date defectă”. Obiectul de acces la date poate întoarce `null` pentru o înregistrare absentă și respinge promisiunea pentru o conexiune eșuată. Ruta traduce primul rezultat în 404 și lasă al doilea să ajungă la gestionarul de erori. Dacă folosești erori publice construite explicit, păstrează alegerea clară și consecventă.

### 31. Transmite eșecurile middleware-ului de erori

Apelează `next(error)` pentru a sări peste gestionarii normali rămași și a căuta un gestionar de erori înregistrat ulterior. În Express 5, o eroare aruncată sau respingerea promisiunii întoarse de un gestionar async este transmisă automat. Un callback de timer separat sau o promisiune pe care nici nu o întorci, nici nu o aștepți nu face automat parte din promisiunea gestionarului.

Înregistrează gestionarul după rute și păstrează toți cei patru parametri ca Express să îl recunoască:

```js
app.use((error, request, response, next) => {
  // Clasifică eroarea, trimite un răspuns sau deleagă prin next(error).
});
```

Middleware-ul de eroare are **patru** parametri: `(error, request, response, next)`. Express folosește semnătura pentru a-l distinge de middleware obișnuit, chiar dacă un parametru nu este folosit. `next()` continuă procesarea normală; `next(error)` trece la traseul de eroare. Un 404 nu este automat o excepție: dacă nicio rută nu se potrivește, un middleware obișnuit final poate răspunde sau construi o eroare publică recunoscută.

```js
app.get("/api/tasks/:taskId", async (request, response) => {
  const task = await repository.find(request.params.taskId);
  if (!task) return response.status(404).json({ error: { code: "task_not_found" } });
  return response.json({ data: task });
});
```

Dacă `repository.find` respinge promisiunea, și promisiunea returnată de această funcție Express 5 este respinsă, iar Express propagă eroarea. Un API cu callback cere propagare explicită, de exemplu `if (error) return next(error)` în callback. Un `try/catch` în jurul apelului care programează un timer nu prinde excepția aruncată ulterior în timer. Urmează [regulile Express 5](https://expressjs.com/en/5x/guide/error-handling/), nu presupunerea că orice operație asincronă este capturată.

### 32. Eșecurile cunoscute ale clientului pot fi precise

JSON-ul incorect, validarea eșuată, conflictele și resursele absente pot primi coduri 4xx stabile când sunt clasificate sigur.

Clasifică eșecurile pe care le recunoști. Erorile parserului pot deveni `invalid_json` sau `payload_too_large`; o eroare construită explicit de aplicație poate expune un cod stabil. Nu te baza pe `status` sau `message` ale oricărui obiect aruncat doar pentru că există. Și o bibliotecă internă le poate adăuga. Exemplul 06 folosește o clasă mică `PublicError` pentru erorile pe care aplicația le permite explicit în răspuns.

### 33. Eșecurile neașteptate trebuie sanitizate

Jurnalizează intern detaliile diagnostice, dar întoarce un corp `500` generic stabil. Mesajele bazei de date, stack trace-urile, căile, credențialele și datele brute ale cererii nu aparțin ieșirii publice.

Tratarea centralizată face alegerea o singură dată. După eșecurile de client recunoscute, cazul implicit este status 500 și corp generic. Jurnalizarea primește excepția originală pentru diagnostic; clientul primește informația utilă lui. Parola sintetică din exemplul 06 este o valoare de test pentru detectarea scurgerilor, nu o credențială reală. Și jurnalele reale cer grijă: nu înregistra cereri întregi, tokenuri bearer sau parole.

### 34. Exemplu — limită centralizată pentru erori

Rulează [limita centralizată](examples/06-error-boundary/):

```bash
cd lectures/05-server-rest-api/ro/examples/06-error-boundary
npm install
npm test
```

Cereri reale arată cum JSON-ul incorect devine o eroare precisă a clientului, iar un eșec neașteptat cu un secret devine răspuns generic prin middleware-ul Express de eroare cu patru parametri.

Prezice răspunsurile pentru un 404 cunoscut, JSON invalid, un eșec sincron și o promisiune respinsă dintr-o funcție async. Testele verifică și că o eroare arbitrară cu status 400 rămâne privată, că un răspuns parțial este întrerupt, nu înlocuit, și că o cerere validă ulterioară reușește. Exemplul demonstrează traseul erorii, nu o infrastructură de jurnalizare pentru producție.

### 35. Nu trimite un al doilea răspuns după trimiterea antetelor

`response.headersSent` arată dacă antetele au fost deja trimise. După trimitere, nu poți înlocui starea și începe un nou răspuns JSON de eroare. În middleware-ul de erori, deleagă prin `return next(error)` ca Express să poată finaliza sau închide răspunsul existent, după caz.

Începutul gestionarului trebuie să facă decizia vizibilă:

```js
app.use((error, request, response, next) => {
  if (response.headersSent) return next(error);
  // Clasifică erorile recunoscute; altfel trimite un singur răspuns 500 generic.
});
```

Dacă o rută de streaming a trimis deja o parte a răspunsului, un eșec ulterior nu poate schimba statusul inițial într-un răspuns JSON 500 complet. Delegarea permite mecanismului de eroare rămas sau implicit să încheie răspunsul eșuat. Clientul poate observa date trunchiate sau o eroare de conexiune. Este altceva decât un răspuns de eroare complet, generat intenționat.

### 36. Identitatea cererii conectează dovezile

Un ID al cererii în antete și jurnale structurate conectează raportul clientului cu timpii și erorile serverului. Acceptă deliberat ID-uri primite de încredere sau generează unul.

### 37. Înregistrează finalizarea, nu doar ieșirea din gestionar

Ieșirea dintr-un gestionar nu înseamnă neapărat că răspunsul s-a terminat. Folosește evenimentele răspunsului pentru a înregistra starea și durata. Dacă asculți atât `finish`, cât și `close`, păstrează un indicator ca finalizarea normală urmată de închidere să nu producă două înregistrări.

### 38. Testează prin limita HTTP reală

Testele unitare ale validatorilor sunt utile, dar verificările de integrare trebuie să pornească aplicația pe un port local efemer și să folosească un client HTTP real. Astfel verifică împreună parsarea, ordinea middleware-ului, rutarea, antetele, serializarea și maparea erorilor.

Exportă `createApp()` separat de `server.js`. Testul poate crea o aplicație nouă, asculta pe portul `0` pentru ca sistemul de operare să aleagă un port liber, trimite cereri prin `fetch` și închide serverul în `finally`. Pornirea normală poate folosi un port stabil configurat. Separarea evită importarea unui modul care deschide neașteptat un socket permanent.

### 39. Verifică perechi de succes și eșec

Pentru creare, testează tipuri media valide și invalide. Pentru obținere, găsit și absent. Pentru erori, ieșirea sanitizată și o cerere sănătoasă ulterioară. Perechile expun greșeli la limite.

### 40. Analizează fluxul de control al schimbărilor generate

Verifică fiecare cale de răspuns pentru `return` sau ramură exclusivă, fiecare eșec asincron pentru delegare, fiecare intrare pentru validare exactă și fiecare eroare publică pentru scurgeri. Respinge schimbările fără legătură ale framework-ului sau dependențelor.

## Intermezzo 3 — erori și recapitulare REST

Răspunde la întrebările `u05-i3-` din [intermezzo.gift](intermezzo.gift). Rezervă patru minute. Explică propagarea erorilor async și cazul antetelor deja trimise, apoi distinge tehnicile de nivel 2 de conformitatea REST completă.

## Sinteză — urmărește responsabilitatea o singură dată

```text
server Node
→ middleware Express ordonat
→ rută metodă + cale
→ parsarea tipului media
→ validarea/normalizarea intrării
→ operația aplicației/repository-ului
→ maparea rezultatului la HTTP
→ finalizarea răspunsului
↘ limita centralizată pentru erori
```

La fiecare etapă întreabă dacă stratul poate răspunde, delega sau eșua și cine deține următoarea tranziție.

## Moduri frecvente de eșec

- Middleware montat în ordine greșită.
- Potrivirea căii cu ignorarea metodei.
- Tratarea șirurilor interogării drept valori deja tipizate.
- Întoarcerea lui `200` pentru orice rezultat.
- Trimiterea unui corp cu `204`.
- Confundarea parsării JSON cu validarea aplicației.
- Acceptarea tablourilor sau câmpurilor necunoscute drept obiecte valide.
- Trimiterea răspunsului și continuarea execuției.
- Capturarea locală a tuturor erorilor cu forme inconsistente.
- Expunerea detaliilor interne în `500`.
- Testarea funcțiilor auxiliare fără testarea limitei HTTP.

## Legătura cu tutorialul

In-memory Task API construiește un router complet pentru resurse. Middleware Pipeline izolează identitatea, timpul, validarea, scurtcircuitarea și finalizarea. Repararea API-ului pentru întâlniri diagnostichează o cale fără răspuns, o clasă de status greșită, JSON inconsecvent și direcția de sortare ignorată în handlere obișnuite.

## Considerații pentru dezvoltarea asistată de IA

Limitează schimbările la o singură graniță și furnizează tabelele rutelor, anvelopele, ordinea montării și verificările observabile. Caută rescrieri ale aplicației, dependențe noi, reveniri absente, conversii ascunse, gestionari locali catch-all și scurgeri de detalii interne. Verifică printr-un client real, nu doar citind codul.

## Referințe

- Harta de migrare a cursului, Unitatea 05.
- `webtech-2025-course/c6/` și `webTechTutorials-main/S07/`.
- Documentația Express 5 pentru rutare, middleware, resurse statice, parsare JSON și erori.
- Documentația Node.js pentru serverul HTTP și `fetch` nativ.
- Specificația HTTP Semantics.

- [Express 5 error handling](https://expressjs.com/en/5x/guide/error-handling/).
- [Node HTTP response events](https://nodejs.org/api/http.html).
