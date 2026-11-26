# Cursul 07 — Relații, tranzacții și proiectarea API-urilor

> Durată planificată: 100 de minute
>
> Format: trei blocuri conceptuale, șase exemple rezolvate și trei scurte verificări ale cunoștințelor

## Rezultatele învățării

La finalul cursului, ar trebui să puteți alege cheile și constrângerile potrivite pentru relațiile dintre tabele, să definiți asocierile Sequelize și să explicați costul încărcării datelor asociate. Veți putea proiecta resurse pentru înscrieri, folosi `include` pe mai multe niveluri și filtra, sorta și pagina sesiunile unei conferințe. Veți putea explica și ce garantează o tranzacție, când se confirmă modificările și ce poate anula un rollback.

## Harta sesiunii

| Segment | Timp | Temă |
| --- | ---: | --- |
| Schița inițială a domeniului | 0–5 min | Obiectele devin rânduri și chei |
| Bloc conceptual 1 | 5–29 min | Relații, legături, asocieri |
| Intermezzo 1 | 29–33 min | Verificarea formei relaționale |
| Bloc conceptual 2 | 33–61 min | Încărcare eager, resurse, paginare |
| Intermezzo 2 | 61–65 min | Verificarea interogării și API-ului |
| Bloc conceptual 3 | 65–89 min | Tranzacții și consistență |
| Intermezzo 3 | 89–93 min | Verificarea atomicității |
| Sinteză | 93–100 min | Date, tranzacție și răspuns HTTP |

> Când o comandă pornește un server persistent (`npm start`, `npm run dev` sau `node server.mjs`), lăsați-l să ruleze și folosiți alt terminal pentru teste/build. Pentru un exemplu cu API și Vite, rulați-le în terminale separate; opriți serverele cu Ctrl+C când terminați.

Toate cele șase exemple sunt scripturi complete. Comanda `npm test` execută verificările, apoi se încheie. Cele două exemple Express pornesc servere temporare și trimit singure cererile de test. Instalați dependențele înainte de curs. Înainte de rulare, încercați să anticipați rezultatul câtorva verificări; nu este necesar să citiți toate aserțiunile cu voce tare.

## Modelați o conferință și înscrierile ei

O conferință are mai multe sesiuni. Un participant se poate înscrie la mai multe sesiuni și fiecare sesiune poate avea mai mulți participanți. Tipul biletului aparține unei înscrieri, nu doar participantului sau sesiunii.

```text
Conference 1 ─── * Session
Session    * ─── * Attendee, prin Registration
```

Citiți `1` ca unu și `*` ca mai mulți. Identificați întâi tabelul care păstrează fiecare informație. Urmăriți apoi cum încărcați rânduri legate, le expuneți prin URL-uri și modificați mai multe rânduri împreună fără să lăsați o rezervare pe jumătate terminată.

## Bloc conceptual 1 — rânduri, chei străine și asocieri

### 1. Folosiți o cheie străină și unicitate pentru o relație unu-la-unu

O **cheie străină** este o coloană care face referire la cheia altui tabel. Pentru un profil per participant, rândul profilului poate referi ID-ul participantului și impune unicitatea acelei referințe. Astfel, un participant poate avea cel mult un profil; regula nu cere singură ca fiecare participant să aibă profil.

Descrieți ambele sensuri înainte să alegeți asocierea. Participantul poate avea zero sau un profil; profilul aparține exact unui participant. attendeeId din profil cere astfel cheie străină, NOT NULL dacă legătura este obligatorie și UNIQUE pentru a împiedica două profiluri ale aceleiași persoane. Cheia străină singură permite mai multe profiluri către același participant.

Cardinalitatea spune câte rânduri legate sunt permise. Caracterul opțional spune dacă relația poate lipsi. Nici o proprietate JavaScript, nici numele singular al asocierii nu dovedesc aplicarea regulilor SQL. Exemplul 01 încearcă al doilea profil și verificați respingerea.

### 2. Unu-la-mulți plasează cheia pe partea „mulți”

Fiecare rând `Session` stochează un `conferenceId`; multe sesiuni pot referi aceeași conferință. Cheia externă a bazei protejează referința.

Pentru conferința 7 cu sesiunile 10 și 11, stochează conferenceId 7 în ambele sesiuni. Nu adăuga session1Id, session2Id și session3Id în conferință: impui un număr arbitrar de copii și complici interogările. Cheia străină referă o conferință reală; NOT NULL face referința obligatorie.

Constrângerea poate respinge o sesiune orfană. Nu cere ca fiecare conferință să aibă deja o sesiune și nu decide dacă ștergerea conferinței șterge sesiunile. Sunt reguli separate.

### 3. Folosiți un tabel de legătură pentru o relație mulți-la-mulți

Un **tabel de legătură** păstrează câte un rând pentru fiecare asociere dintre două tabele. `Registration(sessionId, attendeeId)` leagă un participant de o sesiune. Mai multe rânduri pot avea același ID de sesiune sau participant, reprezentând mai multe înscrieri în ambele direcții.

Doi participanți înscriși la o sesiune înseamnă două rânduri Registration. Același ID de participant poate apărea apoi pentru altă sesiune. Nu copiați numele și datele persoanei în fiecare înscriere; schimbarea lor ar deveni inconsistentă între copii.

Tabelul de legătură are două chei străine, câte una spre fiecare părinte. Pentru citire faceți join după acele chei. Tablourile de ID-uri sau textul separat prin virgule în părinte pierd regulile simple de integritate și unicitate ale rândurilor obișnuite.

### 4. Tabelul de legătură poate păstra date despre înscriere

Tipul biletului, rolul, cantitatea, starea și momentul înscrierii aparțin unei anumite relații, nu independent unuia dintre părinți.

Ana poate avea bilet student la HTTP și standard la SQLite. ticketType nu poate fi o singură proprietate a Anei, fiindcă depinde de sesiune. Nu poate fi o singură proprietate HTTP, fiindcă participanții pot avea bilete diferite. Rândul înscrierii răspunde complet: acest participant, această sesiune, acest bilet.

Un model through explicit este util când legătura are date sau comportament propriu. Sequelize poate genera un tabel pur de legătură, dar numele Registration face vizibil înscrierea și constrângerile sale.

### 5. Împiedică inserarea aceleiași înscrieri de două ori

O **constrângere de unicitate compusă** verifică o combinație de coloane: perechea `(sessionId, attendeeId)` trebuie să fie unică. Un ID generat separat pentru înscriere, numit uneori cheie surogat, identifică rândul, dar nu împiedică alt rând să repete perechea. Folosiți constrângerea pe pereche când înscrierea duplicată este interzisă.

Comparați două chei posibile:

```text
id=100, sessionId=7, attendeeId=42
id=101, sessionId=7, attendeeId=42
```

ID-urile generate diferă, deci cheia primară id acceptă ambele rânduri. Perechea este identică, deci unicitatea (sessionId, attendeeId) respinge al doilea. Puteți alege și perechea ca cheie primară compusă. Identitatea din URL și cheile interne nu trebuie reprezentate identic, dar ambele trebuie să identifice înscrierea dorită.

### 6. Stabiliți ce se întâmplă la ștergerea unui rând referit

Pentru referința unei sesiuni la conferință, `RESTRICT` împiedică ștergerea conferinței dacă există sesiuni care o referă. `CASCADE` șterge și sesiunile respective. `SET NULL` golește referința lor, ceea ce cere o coloană care acceptă null. Alegeți comportamentul după ce trebuie să se întâmple cu datele, nu după opțiunea care simplifică un test.

Alegeți acțiunea de ștergere pentru fiecare relație. O conferință istorică poate fi protejată prin RESTRICT, iar profilul fără sens în absența participantului poate folosi CASCADE. Ștergerea înscrierii nu trebuie să șteargă participantul sau sesiunea referită.

Declarația asocierii și constrângerea efectiv aplicată nu sunt aceeași dovadă. În SQLite, aplicarea cheilor străine este o setare a conexiunii; testează inserarea invalidă și ștergerea în mediul real. Exemplul 01 dovedește respingerea orfanului, restricționarea ștergerii conferinței și ștergerea în cascadă a profilului/înscrierilor dependente. Consultați [cheile străine SQLite](https://www.sqlite.org/foreignkeys.html).

### 7. Exemplu rezolvat — formele relațiilor

Rulați [formele relațiilor](examples/01-relationship-shapes/):

```bash
cd lectures/07-relationships-transactions/ro/examples/01-relationship-shapes
npm install
npm test
```

Urmăriți cheia străină a conferinței, apoi rândurile înscrierilor și identificați `ticketType`.

Anticipați rezultatele: un participant apare în două sesiuni cu bilete diferite și are un profil. Profilul duplicat și înscrierea duplicată încalcă reguli de unicitate diferite. ID-ul unei conferințe inexistente încalcă cheia străină. Graful afișat este o vedere încărcată înaintea verificărilor cascadei, nu altă copie permanentă a tabelelor.

### 8. Asocierile Sequelize codifică metadate de navigare

`hasOne`, `hasMany`, `belongsTo` și `belongsToMany` descriu direcții, aliasuri, chei și comportamentul generat de acces și interogare. Nu creează automat un model bun.

Citiți asocierea dinspre modelul sursă:

| Declarație | Unde este cheia străină? | Ce navigare primește sursa? |
| --- | --- | --- |
| Attendee.hasOne(Profile) | Profile | Un profil legat |
| Profile.belongsTo(Attendee) | Profile | Participantul său |
| Conference.hasMany(Session) | Session | O colecție de sesiuni |
| Session.belongsTo(Conference) | Session | Conferința sa |
| Session.belongsToMany(Attendee, through Registration) | Registration are ambele chei | Participanți prin legături |

conference.getSessions() este o operație pe bază cu promisiune, nu citirea unui tablou deja încărcat. Definirea asocierii pregătește navigarea/interogarea; crearea sau schimbarea schemei rămâne sarcină de inițializare/migrare. Consultați [asocierile Sequelize 6](https://sequelize.org/docs/v6/core-concepts/assocs/).

### 9. Definiți ambele direcții utile

`Conference.hasMany(Session)` se asociază cu `Session.belongsTo(Conference)`. Direcțiile mulți-la-mulți trebuie să folosească același model through și aceleași chei.

Conference.hasMany(Session) învață Conference să navigheze la sesiuni. Nu învață independent Session să navigheze înapoi. belongsTo adaugă metadatele inverse către aceeași coloană; nu trebuie să creeze o a doua relație de conferință.

În apelul belongsToMany invers, inversează foreignKey și otherKey: din Session, sessionId este cheia sursei în Registration; din Attendee, attendeeId este. Explicați sensul înainte să copiați opțiunile invers.

### 10. Folosiți același alias al asocierii când încărcați rânduri legate

Un **alias** este numele dat unei asocieri, precum `sessions`. Dacă definiți asocierea cu acel nume, folosiți-l și în `include`-ul interogării. Sequelize are nevoie de alias pentru a identifica relația încărcată; nu este doar o etichetă pentru formatarea rezultatului.

Folosiți alias singular pentru un rând și plural pentru colecție. Relațiile multiple către același model cer sensuri diferite: speaker și reviewer ai unei sesiuni pot referi amândoi participanți, dar cer coloane și aliasuri distincte. include trebuie să aleagă asocierea dorită, nu să ghicească doar după modelul țintă.

### 11. Asocierile sunt implementate prin interogări SQL

Asocierile produc join-uri peste chei străine. Inspectați metadatele și SQL-ul generat când graful de obiecte este surprinzător.

Rezultatul SQL aplatizat poate repeta coloanele conferinței pentru fiecare sesiune și participant. Sequelize reconstruiește instanțe imbricate folosind identități și asocieri. Forma este utilă, dar baza nu a stocat un obiect JSON gigantic pentru conferință.

Când rezultatul este greșit, verificați valorile cheilor, aliasul, join-ul și coloanele selectate. Serializarea nu repară un join care a legat rândurile greșite.

### 12. Păstrați constrângerile bazei chiar dacă aplicația verifică înainte

O verificare a aplicației poate oferi o eroare utilă înaintea scrierii. Altă cerere poate totuși schimba datele între verificare și scriere. Cheile străine și constrângerile unice permit bazei să impună relația pentru orice scriere, inclusiv scripturi care ocolesc ruta HTTP.

Secvența verificare/inserare are o fereastră: A nu găsește înscrierea, B nu o găsește, apoi ambele inserează. Unicitatea perechii decide ce inserare poate reuși. Tratați și clasificați acel eșec cunoscut; nu eliminați constrângerea doar fiindcă aplicația verifică deja.

Constrângerile protejează regulile pe care le exprimă efectiv. Cheia străină nu validează politica biletelor, iar unicitatea înscrierii nu numără locurile rămase.

## Intermezzo 1 — forma relației

Răspundeți la întrebările `u07-i1-` din [intermezzo.gift](intermezzo.gift). Rezervați patru minute. Identificați cheile străine, unicitatea perechii, unicitatea unu-la-unu și tipul biletului.

## Bloc conceptual 2 — încărcare eager, resurse și paginare

În minutele 33–61: comparația interogărilor 4 min, contractul resursei 6 min, include-uri multiple/imbricate 6 min, filtrare/sortare/paginare 12 min.

### 13. Numărați interogările când încărcați date legate

**Încărcarea la cerere**, lazy loading, citește ulterior rândurile legate, când le solicitați. O interogare pentru trei sesiuni urmată de câte una pentru participanții fiecărei sesiuni înseamnă patru interogări: `1 + N`, cu `N = 3`. Această **problemă N+1** devine costisitoare când crește numărul rândurilor părinte. Numărați instrucțiunile SQL efective, nu evaluați doar bucla JavaScript.

Pentru trei conferințe, bucla getSessions() emite patru instrucțiuni: citirea conferințelor plus trei citiri de sesiuni. Promise.all poate suprapune o parte din lucru, dar nu reduce numărul. N+1 privește forma cererilor, nu caracterul sincron al buclei.

Încărcarea lazy este utilă când aveți nevoie de o colecție doar după o decizie ulterioară. Devine costisitoare când serializarea fiecărui părinte declanșează previzibil altă interogare. Goliți jurnalul după pregătire, pentru ca schema și datele inițiale să nu intre în măsurătoare.

### 14. Cereți rândurile legate împreună prin include

**Încărcarea anticipată**, eager loading, cere Sequelize datele legate ca parte a rezultatului solicitat, prin `include`. Exemplul preia părinții și rândurile legate printr-un join—o operație SQL care combină rânduri corespunzătoare prin cheile lor. Selectați câmpurile necesare și păstrați informații utile ale înscrierii, precum tipul biletului. Alte opțiuni pot schimba SQL-ul, deci inspectați instrucțiunile executate efectiv.

De exemplu:

```js
const conferences = await Conference.findAll({
  include: [{ model: Session, as: "sessions", attributes: ["id", "title"] }],
  order: [["id", "ASC"]]
});
```

include numește relația și câmpurile necesare. Pentru multe-la-multe, through: { attributes: ["ticketType"] } păstrează datele înscrierii și exclude alte coloane de legătură. Nu ascunde ticketType doar fiindcă este în tabelul intermediar.

Un include opțional păstrează de obicei părinții fără copii potriviți. required: true cere părinți cu potrivire. Un where în include poate schimba join-ul și părinții rămași; decide dacă filtrați părinții sau doar copiii afișați. Consultați [încărcarea eager Sequelize](https://sequelize.org/docs/v6/advanced-association-concepts/eager-loading/).

### 15. Exemplu rezolvat — numărul interogărilor eager

Rulați [numărul interogărilor eager](examples/02-eager-loading-query-count/):

```bash
cd lectures/07-relationships-transactions/ro/examples/02-eager-loading-query-count
npm install
npm test
```

Rezultatul afișat compară cele `1 + N` instrucțiuni ale încărcării lazy cu singura instrucțiune folosită aici pentru încărcarea eager.

### 16. O singură interogare nu este automat mai ieftină

Join-urile mai multor colecții pot multiplica rândurile. Delimitați colecția părinte, inspectați SQL-ul, măsurați rezultatul și alegeți interogări separate când se potrivesc mai bine.

O conferință cu trei sesiuni și patru sponsori poate produce 3 × 4 rânduri intermediare când uniți ambele colecții. ORM-ul poate elimina obiectele părinte repetate, dar tot a transferat și procesat rezultatul SQL multiplicat.

Alegeți datele necesare ecranului sau operației, nu cel mai mare graf posibil. Un set mic de interogări limitate poate fi mai bun decât un join imens. Unele încărcări hasMany pot folosi intenționat interogări separate; „mai mult de o instrucțiune” nu înseamnă automat N+1.

### 17. Ordonarea rezultatelor imbricate este explicită

Ordinea părinților și cea a copiilor sunt contracte separate. Adăugați criterii deterministe de departajare pentru ca rândurile cu valori egale să aibă o ordine bine stabilită.

Ordonarea conferințelor după ID nu ordonează automat tablourile de sesiuni. Specificați ordinea copiilor prin calea asocierii sau opțiunea de interogare separată. Dacă paginați părinții uniți cu copii, LIMIT SQL se aplică rândurilor SQL, nu automat numărului de părinți distincți dorit. Sequelize poate genera subinterogări pentru limita părinților; verificați rândurile returnate și numărul lor. Combinarea opțiunilor include și limit poate schimba interogarea SQL generată.

### 18. Modelul API nu trebuie să oglindească tabelele

Clienții au nevoie de resurse care au sens pentru aplicație, nu de numele modelelor sau legăturilor Sequelize. `/api/sessions/:sessionId/registrations/:attendeeId` poate expune identitatea înscrierii fără detalii interne `Registration`.

Clientul poate identifica înscrierea prin pereche chiar dacă baza îi dă și ID generat. Serializați câmpurile necesare, precum attendeeId și ticketType, fără coloane interne sau metode ORM. Un nume nou de tabel nu trebuie să schimbe URL-urile tuturor clienților.

URL-ul nu este autorizare: cunoașterea ID-ului nu dă dreptul de editare. Autentificarea și permisiunile vin ulterior; exemplul mic arată comportamentul resursei, nu controlul accesului.

### 19. URL-urile imbricate arată cărei sesiuni îi aparține înscrierea

Imbricarea este utilă când clienții văd înscrierile în cadrul unei sesiuni și părintele este semnificativ. Imbricarea adâncă sau accesul independent pot justifica o resursă de nivel superior.

Citiți `/api/sessions/7/registrations/42` ca înscrierea participantului 42 în sesiunea 7, nu neapărat rândul Registration cu cheia primară 42. Aplicați ambii identificatori căutării. Căutarea doar după participant poate modifica înscrierea aceleiași persoane la altă sesiune.

Folosiți URL-uri imbricate când identificarea sesiunii ajută clientul să lucreze cu înscrierea. O înscriere administrată independent, cu ID public propriu, poate avea URL la nivel superior. Identitatea și întrebările clientului decid, nu regula că orice cheie străină adaugă un segment.

### 20. Folosiți PUT pentru a crea sau înlocui aceeași înscriere

O operație este **idempotentă** când repetarea aceleiași cereri are același efect intenționat ca aplicarea ei o singură dată. Un `PUT` la un URL cunoscut al înscrierii poate stabili înscrierea și reprezentarea ei. Primul răspuns poate diferi de cel repetat; idempotența privește efectul asupra datelor, nu identitatea codurilor de stare.

La URL-ul cunoscut, PUT poate crea înscrierea absentă și înlocui reprezentarea editabilă documentată când există. Aici reprezentarea completă mică este ticketType. Prima cerere întoarce 201, repetarea 200, iar numărul rândurilor rămâne unu. Codurile de stare diferite sunt compatibile cu aceeași stare finală intenționată.

Dacă adăugați câmpuri, precizați ce se întâmplă cu cele omise din cererea PUT. Tratarea cererii ca o actualizare parțială ar face neclară regula de înlocuire. Folosiți PATCH pentru actualizare explicit parțială. Idempotența compară repetarea aceleiași cereri, nu două tipuri diferite de bilet.

### 21. DELETE asigură că înscrierea nu mai există

API-ul poate răspunde cu `204` atât când șterge înscrierea, cât și când aceasta nu mai există. În ambele cazuri, rezultatul urmărit este același: înscrierea nu există.

DELETE se aplică înscrierii: participantul rămâne disponibil altor sesiuni. Exemplul alege 204 și când legătura era deja absentă. Alt API poate întoarce 404 la repetare și păstra efectul idempotent; răspunsurile identice nu sunt definiția. Oricum, 204 nu are corp JSON.

### 22. Exemplu rezolvat — contractul resursei

Rulați [contractul resursei](examples/03-resource-contract/):

```bash
cd lectures/07-relationships-transactions/ro/examples/03-resource-contract
npm install
npm test
```

Scriptul trimite PUT și DELETE printr-un server HTTP temporar real. Urmăriți repetările și verificările înscrierii stocate, comparând starea și codurile de stare.

### Exemplu rezolvat — include-uri multiple și imbricate

Rulați [include-uri multiple și imbricate](examples/04-multiple-deep-includes/):

```bash
cd lectures/07-relationships-transactions/ro/examples/04-multiple-deep-includes
npm ci
npm test
```

Încărcați conferința și participanții prin două elemente ale aceluiași tablou `include`. În elementul `attendees`, adăugați un alt `include` pentru profilul fiecărui participant.

```js
include: [
  { association: "conference" },
  { association: "attendees", through: { attributes: [] },
    include: [{ association: "profile" }] },
]
```

La sesiunea HTTP sunt înscriși Ana, care are profil, și Dan, care nu are profil. La CSS nu este înscris nimeni. Testele verifică datele încărcate: profilul lipsă apare ca `null`, iar lista fără participanți apare ca `[]`.

Un tablou `include` permite încărcarea mai multor asocieri ale modelului interogat. Un `include` în interiorul elementului `attendees` încarcă date asociate fiecărui participant: aici, profilul. Folosiți aliasul definit pentru fiecare asociere. Opțiunea `through.attributes` controlează câmpurile din tabelul de legătură care apar în rezultat; nu schimbă tabelul sau constrângerile lui. Exemplul conține puține date, pentru a putea urmări ușor rezultatul. Adăugarea altor colecții poate crește numărul de rânduri SQL intermediare.

### 23. Acceptați doar filtrele definite de API

Transformați valorile acceptate ale parametrilor în condiții Sequelize `where`. Respingeți câmpurile și valorile necunoscute.

Parametrii din URL nu sunt opțiuni Sequelize. Transformați level=advanced într-o condiție pe câmpul level. Respingeți parametrii repetați și valorile necunoscute. Precizați ce se întâmplă când filtrul lipsește. Nu permiteți clientului să injecteze include, attributes sau where arbitrar prin transmiterea directă către findAll. Opțiunile pot expune date sau produce interogări nelimitate.

### 24. Sortarea folosește mapări fixe și criterii de departajare

Asociați fiecare valoare acceptată, precum `starts_asc`, cu un tablou `order` definit în cod. Folosiți ID-ul pentru a stabili ordinea rândurilor care au aceeași valoare de sortare.

Pentru starts_asc folosiți order: [["startsAt", "ASC"], ["id", "ASC"]]. Dacă două sesiuni încep la 09:00, ID-ul decide egalitatea. Pentru title_asc, titlul este cheia principală a ordonării, iar ID-ul departajează. ID-ul departajează fiecare pagină ordonată; offset sare apoi peste rânduri din această ordine completă.

### 25. Definiți mărimea paginii și ordinea înainte de paginare

**Paginarea** întoarce pe rând părți ale unei colecții. `limit` stabilește numărul maxim de rânduri din rezultat; `offset` sare peste un număr de rânduri din colecția ordonată. Sortați după câmpuri documentate și adăugați ID-ul pentru departajare, ca valorile egale să nu lase ordinea nespecificată. Inserările înaintea unui offset pot deplasa pozițiile, deci o sortare stabilă nu transformă cererile separate într-un instantaneu fix.

Offset este potrivit pentru o listă mică, ușor de urmărit, și poate oferi pagini numerotate. Costurile includ sărirea rândurilor anterioare și deplasarea pozițiilor când ele se schimbă. Sortarea stabilă determină egalitățile într-o cerere, nu îngheață baza între cereri independente. Decideți dacă aveți nevoie de parcurgerea unor date care se pot modifica, pagini numerotate sau o vedere fixă a datelor.

### 26. Paginați rândurile copil prin join cu părintele

Folosiți Session.findAll cu include: [{ association: "conference", required: true, where: { id: conferenceId } }]. Join-ul restrânge sesiunile la o conferință. Aplicați filtrul level în Session.where și puneți order, limit și offset pe interogarea principală a sesiunilor. Fiecare pagină conține sesiuni, iar fiecare sesiune include conferința sa. Un join belongsTo contribuie cu cel mult un părinte per sesiune.

Nu puneți o limită globală pe Conference.findAll așteptând să pagineze sesiunile dintr-un include hasMany. Identificați mai întâi entitatea numărată de pagină. Aici numărăm sesiunile copil; niciun join de colecție nu multiplică aceste rânduri.

### 27. Exemplu rezolvat — filtrare, sortare și paginare

Rulați [filtrarea, sortarea și paginarea](examples/05-filter-sort-pagination/):

```bash
cd lectures/07-relationships-transactions/ro/examples/05-filter-sort-pagination
npm ci
npm test
```

Urmăriți GET /api/conferences/:conferenceId/sessions?level=advanced&sort=title_asc&limit=1&offset=1. Join-ul cu părintele selectează conferința, where selectează sesiunile advanced, order sortează după titlu și ID, offset sare peste prima sesiune potrivită, iar limit întoarce cel mult una. Anticipați rezultatul înainte de rulare: sesiunea returnată ar trebui să fie `Transactions`.

Datele inițiale au șase sesiuni într-o conferință și o a șaptea sesiune mai devreme în alta. Testele verifică izolarea conferinței, ambele secvențe complete de sortare, orele egale, filtrarea combinată cu paginarea, paginile goale și parametrii invalizi. Cele două sesiuni de la 09:00 păstrează ordinea ID-urilor. Verificările folosesc date nemodificate; discutați cum o inserare înaintea unui offset ulterior poate repeta un rând deja văzut. Cererile succesive nu citesc neapărat aceeași stare a bazei de date.

## Intermezzo 2 — forma interogării și API-ului

Răspundeți la întrebările `u07-i2-` din [intermezzo.gift](intermezzo.gift). Rezervați patru minute. Explicați N+1, DELETE repetat, deplasarea offset și paginarea copiilor prin join cu părintele.

## Bloc conceptual 3 — tranzacții și limite de consistență

### 28. Mai multe await nu fac scrierile atomice

Presupuneți că așteptați actualizarea locurilor, apoi inserarea rezervării, apoi auditul. Fără tranzacție, eșecul auditului poate lăsa primele două scrieri salvate. `await` controlează secvența; nu anulează operațiile reușite anterior. Folosiți o tranzacție când scrierile trebuie să reușească sau să eșueze împreună.

Imaginați-vă eșecul după fiecare pas: scăderea stocului, crearea rezervării, înaintea finalizării auditului. Dacă instrucțiunile au fost confirmate separat, try/catch nu restaurează automat starea. Tranzacția grupează efectele în bază; tratarea excepției decide dacă grupul se poate încheia.

### 29. Precizați ce scrieri trebuie să reușească împreună

O **invariantă** este o regulă care trebuie să rămână adevărată după operație. În demonstratorul mic de rezervare, o operație reușită reduce disponibilitatea și creează o rezervare împreună cu înregistrarea ei de audit. Dacă un pas eșuează, nu trebuie să rămână nicio schimbare. Aceasta stabilește scrierile tranzacției. Demonstratorul verifică commit și rollback; prevenirea rezervărilor duplicate și alocarea concurentă a locurilor cer reguli suplimentare.

Scrieți starea intenționată înaintea codului:

| Rezultat | Locuri disponibile | Rezervări | Rânduri audit |
| --- | --- | --- | --- |
| Inițial | 3 | 0 | 0 |
| Eșec după inserarea rezervării | 3 | 0 | 0 |
| O rezervare reușită pentru un loc | 2 | 1 | 1 |

Invarianta oferă testului ceva mai puternic decât „promisiunea a fost respinsă”. Verificați fiecare tabel participant. Auditul aici este în aceeași bază SQLite; un mesaj imprimat în terminal nu ar fi anulat de rollback.

### 30. Confirmați toate schimbările sau anulează-le

O **tranzacție** grupează operații ale bazei de date. **Commit** confirmă schimbările grupului; **rollback** le anulează după eșec. Proprietatea totul-sau-nimic se numește **atomicitate**. Dacă inserarea auditului eșuează după inserarea rezervării, rollback trebuie să elimine rezervarea și să anuleze și schimbarea locurilor.

Rollback restaurează modificările bazei din tranzacție. Nu anulează atribuiri JavaScript, răspunsuri HTTP, fișiere sau mesaje deja trimise altui serviciu. Dacă ați modificat availableSeats pe o instanță încărcată, nu o mai folosiți sau reîncărcați-o după rollback; valoarea din memorie nu dovedește starea stocată. Exemplul citește din nou sesiunea la verificare.

### 31. Separați cele patru proprietăți ACID

| Proprietate | Ce întrebare puneți? |
| --- | --- |
| Atomicitate | Se confirmă toate modificările participante sau niciuna? |
| Consistență | Constrângerile declarate și regulile corect implementate sunt respectate după operație? |
| Izolare | Ce observă operațiile concurente și poate intercalarea lor încălca regula? |
| Durabilitate | După commit reușit, sunt păstrate schimbările conform garanțiilor de stocare și recuperare? |

Tranzacția nu inventează reguli lipsă. Poate confirma atomic un număr negativ incorect dacă logica și constrângerile nu îl previn. Testul în memorie dovedește rollback/commit, nu supraviețuirea unei defecțiuni a mașinii; exemplul cu fișier din Cursul 06 verifică altă proprietate de persistență.

### 32. Sequelize confirmă sau anulează tranzacția în funcție de rezultatul callback-ului

`sequelize.transaction(async transaction => { ... })` face commit când callback-ul reușește și rollback când acesta este respins.

Valoarea returnată de callback devine rezultat numai după commit-ul tranzacției gestionate. Aruncarea sau respingerea semnalează eșec și produce rollback. Nu apelați manual commit sau rollback în forma gestionată.

Un catch în callback poate fi periculos: dacă doar înregistrează eroarea în jurnal și revine normal, callback-ul reușește și modificările anterioare se pot confirma. Tratați eroarea într-un `catch` în afara apelului `await sequelize.transaction(...)`. Dacă o tratați în interiorul callback-ului, aruncați-o din nou pentru a declanșa rollback-ul. Consultați [tranzacțiile gestionate](https://sequelize.org/docs/v6/other-topics/transactions/).

### 33. Transmiteți aceeași tranzacție fiecărei interogări participante

În acest model cu transmitere explicită, apeluri precum `Booking.create(values, { transaction })` trebuie să primească tranzacția creată de callback-ul gestionat. Procedați la fel pentru citirile, actualizările locurilor și inserările de audit care aparțin operației. Dacă o scriere rulează în afara tranzacției, rollback-ul acelei tranzacții nu o anulează.

Obiectul tranzacției nu este doar eticheta ultimei inserări. Citirile care decid schimbarea, stocul, rezervarea și auditul aparțin aceleiași operații. Transmiteți-l fiecărui apel și așteptați rezultatul. O operație asincronă pornită fără returnarea sau așteptarea promisiunii poate continua după callback și commit.

Exemplele transmit explicit opțiunea. Transmiterea automată a tranzacției necesită o configurare separată, care nu este folosită aici. În SQLite, conexiunile și blocările pot face o opțiune omisă să producă erori diferite sau reutilizare neașteptată a conexiunii; transmiteți întotdeauna opțiunea transaction în loc să vă bazați pe reutilizarea conexiunii.

### 34. Exemplu rezolvat — tranzacție Sequelize gestionată

Rulați [cronologia tranzacției](examples/06-transaction-timeline/):

```bash
cd lectures/07-relationships-transactions/ro/examples/06-transaction-timeline
npm install
npm test
```

Introduceți un eșec după crearea rezervării și verificați anularea scrierilor pentru locuri, rezervare și audit. La succes, verificați confirmarea lor împreună. Exemplul mic demonstrează scrieri atomice, nu o politică completă de alocare concurentă a locurilor.

Anticipați numărul de locuri, rezervări și înregistrări de audit după eroarea introdusă intenționat. Apoi comparați aceste valori cu cele obținute când operația reușește. Exemplul respinge și cantitățile invalide înaintea lucrului tranzacțional și stocul insuficient în tranzacție. Verificați cereri secvențiale; nu este test de încărcare sau proiect complet de concurență între dialecte.

### 35. Validați datele de intrare înainte de a începe tranzacția

Respingeți numărul de locuri neîntreg sau nepozitiv înaintea tranzacției. Verificările dependente de bază rămân în tranzacție.

Validați tipuri, limite și sintaxă înainte să ocupați resursele bazei. Păstrați verificările dependente de starea curentă, precum stocul, în operația care o schimbă. Nu faceți cereri de rețea lente ținând inutil tranzacția de scriere; creșteți concurența pentru acces la baza de date fără să puteți anula efectul extern împreună cu SQLite.

### 36. Impuneți regulile și când două cereri se suprapun

Două cereri pot verifica ambele că o înscriere lipsește înainte ca vreuna să o insereze. O constrângere de unicitate pe perechea înscrierii face baza să respingă inserarea duplicată. Disponibilitatea locurilor cere propria strategie corectă de verificare și actualizare în tranzacție; unicitatea singură nu împiedică vânzarea peste capacitate.

Pentru stoc partajat, „citește 1, apoi scrie 0” în două operații suprapuse cere mai mult decât sintaxa tranzacției. O variantă este actualizarea condițională care scade doar unde availableSeats >= requested, apoi verifică numărul rândurilor afectate în tranzacție. Alte motoare pot folosi blocări pe rând sau verificări de versiune. Alegerea depinde de bază, iar operațiile respinse/blocate cer politică explicită.

Separați regulile: unicitatea perechii împiedică înscrierea duplicată; contabilizarea stocului împiedică rezervările peste numărul de locuri disponibile. Niciuna nu o dovedește pe cealaltă.

### 37. Izolarea și blocarea rămân importante

Sintaxa tranzacției nu definește orice observație concurentă. SQLite și motoarele de producție au comportamente diferite de blocare și izolare.

SQLite serializează în mod obișnuit scrierile: o singură operație de scriere poate modifica baza la un moment dat. Concurența pentru acces la baza de date poate respinge sau întârzia operația; nu înseamnă că funcția JavaScript este singura cerere activă. Modul jurnalului influențează și interacțiunea cititori/scriitori. Alte baze permit mai multor tranzacții să scrie simultan rânduri diferite.

Nu copiați o opțiune de blocare pe rând din alt dialect presupunând același comportament SQLite. Testați baza folosită, țineți tranzacțiile scurte și reîncercați doar eșecuri înțelese, cu un număr limitat de încercări. Consultați [izolarea SQLite](https://www.sqlite.org/isolation.html).

### 38. Păstrați diferența dintre erorile cunoscute și cele neașteptate

Distingeți o eroare cunoscută a aplicației, precum lipsa locurilor, de o eroare neașteptată a bazei de date. Dacă două cereri încearcă aceeași înscriere, încălcarea constrângerii de unicitate poate fi raportată ca un conflict. Erorile neașteptate trebuie să declanșeze rollback și să ajungă la middleware-ul de tratare a erorilor.

Păstrați distinct eșecul de domeniu cunoscut, precum stoc insuficient, de problema discului sau SQL. Tratați după rollback clase specifice sau coduri stabile, nu fragmente arbitrare de mesaj. Transformarea tuturor excepțiilor în 409 induce în eroare clientul și ascunde eșecuri pe care nu le rezolvă schimbând cererea.

### 39. Întoarceți rezultatul după commit

Trimiteți rezultatul de succes numai după ce tranzacția gestionată s-a încheiat și modificările au fost confirmate prin commit.

În ruta HTTP, așteptați întreaga operație care deține tranzacția, apoi trimiteți rezultatul public. response.json din callback este prea devreme: callback-ul sau commit-ul poate eșua după trimitere. Commit nu dovedește nici că răspunsul a ajuns la client; un client deconectat poate repeta ceva deja confirmat. Identitatea și politica de idempotență contează aici.

### 40. Scrierile compensatorii nu sunt echivalente

O modificare executată în afara tranzacției nu este anulată de rollback. Puteți încerca să o anulați prin altă operație, dar și aceasta poate eșua. Între timp, alte cereri pot vedea datele modificate. Includeți în aceeași tranzacție toate modificările care trebuie să reușească sau să eșueze împreună.

Trimiterea e-mailului urmată de ștergerea înregistrării nu anulează e-mailul. Și scrierea SQL „de anulare” este o operație nouă care poate eșua sau fi observată separat. Folosiți tranzacția pentru schimbările atomice în acea bază. Coordonarea serviciilor externe cere alt proiect, abordat ulterior la lucrul asincron; nu pretindeți că tranzacția locală le cuprinde.

## Intermezzo 3 — integritatea tranzacției

Răspundeți la întrebările `u07-i3-` din [intermezzo.gift](intermezzo.gift). Rezervați patru minute. Distingeți await de atomicitate, explicați transmiterea tranzacției și momentul commit-ului și identificați efectele pe care rollback nu le anulează.

## Sinteză — urmăriți datele, modificările și HTTP

```text
relațional: chei → constrângeri → asocieri → join-uri
modificare: invariantă → participanți → commit sau rollback
HTTP: identitate → parametri acceptați → metodă → răspuns
```

Rutele nu trebuie să expună erori SQL sau numele modelelor de legătură. Persistența nu trebuie să aleagă starea HTTP. Serializatoarele nu trebuie să depindă accidental de instanțe ORM.

## Moduri frecvente de eșec

- Chei de asociere inversate sau direcții incomplete.
- Ascunderea atributelor semnificative ale legăturii.
- Interogări asociate N+1.
- Prea multe date încărcate prin eager loading sau prea multe rânduri produse de join-uri.
- Lipsa ordinii deterministe.
- Parametri din URL transmiși direct către ORM, fără validare.
- Tratarea operațiilor await secvențiale drept tranzacție.
- Lipsa opțiunii de tranzacție pe o operație.
- Convertirea generală a oricărei erori în conflict.
- Returnarea înainte de commit.
- Presupunerea că URL-urile imbricate sunt mereu mai bune.

## Relația cu tutorialul

API-ul de înscriere la conferință definește asocieri explicite și încărcare eager delimitată. Rezervarea tranzacțională impune o invariantă totul-sau-nimic. Reproiectarea API înlocuiește rutele-acțiune cu resurse imbricate idempotente.

## Considerații pentru dezvoltarea asistată de AI

Înainte de editare, cereți agentului să declare identitățile rândurilor, cheile, atributele legăturii, numărul interogărilor, invarianta, participanții tranzacției și contractul resursei. Verificați cheile implicite, buclele N+1, include-urile nedelimitate, opțiunile de tranzacție lipsă, catch-urile generale și identificatorii preluați din corpul cererii.

## Referințe

- Harta de migrare a cursului, Unitatea 07.
- `webtech-2025-course/c7/`, `c8/`, și `webTechTutorials-main/S09/`.
- Documentația Sequelize pentru asocieri, încărcare eager, constrângeri și tranzacții gestionate.
- Documentația SQLite pentru tranzacții și chei străine.
