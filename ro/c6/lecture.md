# Cursul 06 — Persistență cu Sequelize și SQLite

> Durată planificată: 100 de minute
>
> Format: trei blocuri conceptuale, șase exemple rezolvate și trei intermezzo-uri de recapitulare

## Rezultatele învățării

La finalul cursului, ar trebui să poți explica rolul ORM-ului, să definești un model Sequelize, să alegi validatorii oferiți de Sequelize, să scrii reguli personalizate pe câmp și model, să distingi validarea de constrângerile SQL, să alegi politica de pornire, să compui interogări cu simbolurile operatorilor, să folosești corect `await` pentru operațiile CRUD, să alegi câmpurile trimise clientului și să clasifici erorile de persistență.

## Desfășurarea cursului

| Segment | Timp | Temă |
| --- | ---: | --- |
| Întrebare inițială despre persistență | 0–5 min | Unde rămân notițele după oprirea procesului? |
| Bloc conceptual 1 | 5–35 min | Model relațional, ORM, constrângeri |
| Intermezzo 1 | 35–39 min | Verificarea modelului și validării |
| Bloc conceptual 2 | 39–63 min | Inițializare, interogări compuse și operații CRUD asincrone |
| Intermezzo 2 | 63–67 min | Verificarea inițializării și CRUD |
| Bloc conceptual 3 | 67–89 min | Interogări, erori, separare |
| Intermezzo 3 | 89–93 min | Verificarea interogărilor și erorilor |
| Sinteză | 93–100 min | Urmărirea completă a stării |

> Când o comandă pornește un server persistent (`npm start`, `npm run dev` sau `node server.mjs`), lasă-l să ruleze și folosește alt terminal pentru teste/build. Pentru un exemplu cu API și Vite, rulează-le în terminale separate; oprește serverele cu Ctrl+C când termini.

Exemplele 01–03 rulează ca scripturi și se închid singure. În fiecare director, `npm ci` instalează dependențele, `npm start` rulează demonstrația cu explicații în consolă, iar `npm test` execută verificările. Exemplele 04–06 pornesc servere independente pe același port implicit; rulează câte unul și folosește alt terminal pentru cereri. Instalează dependențele înainte de demonstrație și încearcă să anticipezi rezultatul fiecărei verificări.

## Creează o notiță, repornește și citește-o din nou

În cursul anterior, API-ul putea păstra sarcinile într-un tablou JavaScript. Când oprești procesul, tabloul dispare. În acest curs, salvezi notițe în SQLite și verifici secvența:

```text
creează o notiță → închide aplicația → redeschide baza → citește aceeași notiță
```

**Persistența** înseamnă păstrarea datelor dincolo de procesul care le-a creat. Alegi locul stocării, definești tabelele, aștepți finalizarea scrierilor și închizi conexiunea. SQLite gestionează baza de date; Sequelize îți permite să definești modele și să execuți operații asupra bazei din JavaScript.

## Bloc conceptual 1 — stare relațională, ORM-uri și constrângeri

### 1. Datele persistente se păstrează după oprirea procesului

Datele persistente nu depind de păstrarea obiectelor în memoria procesului JavaScript. Trebuie să ții cont de ele la pornirea și oprirea aplicației, în teste și la instalarea unei versiuni noi. Și efectele unei scrieri greșite se păstrează.

Un tablou dintr-un modul aparține unui singur proces. Fișierul bazei de date are altă durată de viață: oprirea procesului Node nu șterge rândurile deja salvate. Testează persistența redeschizând același fișier, nu trimițând o a doua cerere către același obiect din memorie. Invers, ștergerea fișierului resetează datele chiar dacă JavaScript nu s-a schimbat.

O scriere în baza de date are efecte care se păstrează după oprirea aplicației. O actualizare greșită poate supraviețui repornirii. Păstrează bazele folosite în demonstrații separat de datele pe care vrei să le păstrezi.

### 2. SQLite este o bază de date relațională încorporată

SQLite stochează tabele relaționale într-un fișier sau într-o bază de date în memorie. Nu necesită un proces server separat, fiind util pentru aplicații mici și teste didactice deterministe.

„Embedded” înseamnă că motorul rulează în procesul aplicației printr-un driver, nu că SQLite este un tablou JavaScript salvat ca JSON. SQLite execută SQL, întreține indexuri și coordonează accesul la fișier. Și o altă aplicație poate deschide același fișier, dar accesul este coordonat prin blocări. SQLite permite citiri concurente, însă operațiile de scriere se execută pe rând.

Conexiunea către fișier și cea `:memory:` pot folosi același model, dar au durate de viață diferite. Folosește memoria pentru teste mici izolate și un fișier temporar când verifici păstrarea datelor după repornire. În SQLite, tipul declarat al unei coloane nu impune întotdeauna restricții stricte asupra valorilor: `STRING(120)` nu impune singur limita de 120 de caractere. Validatorul `len` și o constrângere SQL de lungime sunt mecanisme diferite. Consultă [tipurile SQLite](https://www.sqlite.org/datatype3.html).

### 3. Descrie baza de date printr-o schemă

Un tabel păstrează înregistrări ca rânduri și câmpuri ca coloane. **Schema** descrie numele coloanelor, tipurile și regulile, precum acceptarea valorii null sau unicitatea. Pentru o notiță, un rând poate conține ID-ul, titlul și corpul. Constrângerile bazei resping scrierile care încalcă regulile impuse de bază; tipizarea flexibilă SQLite nu înlocuiește validarea aplicației.

Separă trei descrieri: definiția modelului JavaScript, schema existentă efectiv în bază și JSON-ul public al API-ului. Schimbarea uneia nu le actualizează automat pe celelalte. Modelul poate avea atributul title, tabelul o coloană corespunzătoare, iar serializarea poate expune doar unele câmpuri din rând.

`sequelize.define(...)` înregistrează metadate JavaScript. Sincronizarea sau o migrare schimbă structura bazei. Crearea unei note schimbă datele din rânduri. Sunt trei operații diferite; definirea modelului nu dovedește existența tabelului.

### 4. Cheile primare identifică rândurile

În aceste exerciții folosim un număr întreg generat automat pentru fiecare rând nou. Baza de date generează valoarea, iar API-ul o poate folosi drept identificator al resursei.

Cheia primară identifică unic un rând și nu poate fi null. Titlul se poate schimba fără să se schimbe ID-ul. Nu folosi poziția curentă dintr-un tablou ca ID: sortarea sau ștergerea altui element schimbă poziția, nu identitatea resursei. Sequelize adaugă implicit un id întreg dacă nu definești altă cheie primară. Declarația explicită din exemplul 01 face alegerea vizibilă.

### 5. Folosește Sequelize pentru a lucra cu rândurile din JavaScript

**SQL** este limbajul folosit pentru definirea și interogarea datelor relaționale. Un **ORM**, Object-Relational Mapper, oferă obiecte și metode pentru lucrul cu tabelele. În Sequelize, un model precum `Note` descrie un tabel; o instanță reprezintă un rând încărcat; o interogare cere bazei să citească sau să modifice date. Sequelize transformă apeluri precum `Note.findAll()` în SQL.

Compară nivelurile de abstractizare:

```js
const note = await Note.findByPk(7);
```

Apelul modelului exprimă o căutare. Sequelize generează SELECT pentru dialectul configurat și întoarce o instanță sau null. SQLite execută instrucțiunea asupra tabelelor. Instanța oferă valori și metode precum save(); nu este tabelul însuși, iar schimbarea unei proprietăți JavaScript nu actualizează imediat rândul.

### 6. Avantajele ORM au costuri

Avantajele includ metadate consecvente, interogări parametrizate, validare și tipare portabile. Totuși, uneori trebuie să cunoști detaliile bazei de date pentru a înțelege comportamentul ORM-ului. Trebuie să urmărești interogările generate, starea instanțelor și efectul interogărilor asupra performanței.

Folosește ORM-ul pentru a evita repetarea mapării tabelelor, parametrilor și interogărilor obișnuite în fiecare rută. Poți exprima operațiile în JavaScript și inspecta SQL-ul când este necesar. Reduci munca repetitivă; nu elimini modelul relațional și nu faci automat eficientă o interogare ineficientă.

Portabilitatea are limite. Tipurile, funcțiile SQL, blocările și detaliile erorilor diferă între baze. Faptul că exemplul funcționează cu SQLite nu garantează că va funcționa fără modificări cu altă bază de date. Urmărește interogarea generată și rezultatul ei.

### 7. Configurează stocarea și afișarea SQL-ului generat

```js
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage,
  logging,
});
```

`dialect` selectează tipul bazei. `storage` este calea fișierului SQLite sau `":memory:"` pentru o bază care dispare la închidere. `logging` controlează dacă și cum este raportat SQL-ul generat. În teste, folosește memorie sau un fișier temporar; pentru date de păstrat, alege explicit o cale de fișier.

Alege o cale absolută sau rezolvă calea relativă dintr-un director cunoscut al aplicației. Altfel, aceeași comandă pornită din alt director poate crea un alt fișier, dând impresia că datele s-au pierdut. Fișierul trebuie să fie disponibil, iar aplicația să aibă drept de scriere asupra lui.

O instanță Sequelize gestionează accesul acestei aplicații; nu crea una pentru fiecare cerere. `await sequelize.authenticate()` verifică conectivitatea, nu creează tabele. Așteaptă inițializarea înainte să pornești serverul HTTP, ca să nu primești cereri într-o aplicație incomplet inițializată.

### 8. Definește atributele modelului

Un model Sequelize specifică atribute precum `title` și `body`, tipurile, valorile implicite și regulile lor de validare. Folosești definiția pentru a crea tabelul și a valida operațiile modelului. Definirea modelului nu inserează un rând; `Note.create(...)` execută ulterior acea operație.

În definiția unui atribut, fiecare opțiune are un rol separat:

```js
title: {
  type: DataTypes.STRING(120),
  allowNull: false,
  validate: { notEmpty: true, len: [3, 120] }
}
```

`type` descrie maparea model/bază. `allowNull` controlează nulabilitatea. `validate` conține verificări JavaScript. tableName și timestamps aparțin opțiunilor modelului: implicit Sequelize adaugă createdAt și updatedAt. Folosește `timestamps: false` explicit când exemplul nu are nevoie de ele.

### 9. Distinge validarea de constrângerile bazei de date

Distincția importantă este **unde este verificată regula**:

| Regulă | Aplicare și consecință |
| --- | --- |
| `validate: { notEmpty: true, len: [3, 120] }` | Sequelize verifică valoarea în JavaScript înaintea unei scrieri obișnuite validate. SQL direct nu execută funcțiile. |
| Validator personalizat pe câmp/model | Sequelize rulează funcția înainte de scriere; ai nevoie și de o constrângere SQL dacă regula trebuie respectată de toate programele care scriu în bază. |
| `unique: true` | Definește unicitatea în bază la crearea schemei. O inserare care încalcă unicitatea ajunge în SQLite și poate eșua acolo. |
| `allowNull: false` | Combinație specială: Sequelize verifică null înainte de scriere, iar sincronizarea creează NOT NULL în SQL. |
| `defaultValue` | Completează o valoare care nu a fost furnizată. Nu verifică textul nevid și nu garantează unicitatea. |

`null`, `""` și `"   "` sunt valori diferite. „Obligatoriu” trebuie să însemne ceva precis: nenul, nevid, cu text după normalizare și eventual cu o lungime minimă. Un slug poate avea formatul corect și totuși să fie respins pentru că există deja într-un alt rând.

### 10. Alege validatorul potrivit pentru fiecare regulă

Pune validatorii câmpului în obiectul validate al atributului. Tabelul prezintă câteva categorii de validatori din Sequelize 6; consultă [referința de validare pentru versiunea 6](https://sequelize.org/docs/v6/core-concepts/validations-and-constraints/) pentru API-ul complet și opțiuni.

| Scop | Exemple disponibile |
| --- | --- |
| Lungime și prezența textului | `notEmpty: true`, `len: [3, 120]` |
| Tipar permis sau interzis | `is: /^[a-z0-9-]+$/`, `not: /temporary/` |
| Sintaxă e-mail, URL, adresă | `isEmail`, `isUrl`, `isIP`, `isIPv4`, `isIPv6` |
| Categorii de caractere/majuscule | `isAlpha`, `isAlphanumeric`, `isLowercase`, `isUppercase` |
| Sintaxă numerică și limite | `isNumeric`, `isInt`, `isFloat`, `isDecimal`, `min`, `max` |
| Valori permise sau interzise | `isIn: [["general", "work"]]`, `notIn: [["reserved"]]`, `equals` |
| Subșiruri | `contains`, `notContains` |
| Identificatori și date | `isUUID: 4`, `isDate`, `isAfter`, `isBefore` |

Folosește true pentru o verificare fără argumente. Pentru una parametrizată, folosește valoarea sau lista de argumente așteptate. isIn cere tabloul imbricat deoarece argumentul său este el însuși o listă de opțiuni. Personalizează mesajul cu `len: { args: [3, 120], msg: "Folosește 3–120 de caractere" }`. Alege mesaje sigure dacă API-ul expune detalii de validare selectate.

Pentru nulabilitate, preferă allowNull. Poți personaliza mesajul cu `validate: { notNull: { msg: "Titlul este obligatoriu" } }` împreună cu allowNull: false. Există și isNull pentru o regulă care cere exclusiv null; nu anulează interdicția atributului.

Validatorii verifică în principal forma sau conținutul, nu sensul complet. Un validator de e-mail nu dovedește existența căsuței. Validatorii numerici nu înlocuiesc verificarea strictă a tipurilor HTTP: unele verificări folosesc reprezentarea ca șir, iar tipurile Sequelize pot normaliza valori. Nu presupune că `isInt: true` interzice orice conversie de tip.

### 11. Stabilește explicit cum normalizezi valorile

Un setter poate elimina spațiile înainte de validare sau persistență. Nu trebuie să convertească tipuri fără legătură în șiruri decât dacă API-ul permite explicit aceste conversii.

Setterul rulează când atribui valoarea instanței. Folosește `this.setDataValue("title", value)` pentru rezultat, nu din nou this.title, ceea ce ar reapela recursiv setterul. Verifică typeof value înainte de trim. Normalizarea nu trebuie să transforme numere sau obiecte arbitrare în titluri aparent valide.

De regulă, validarea verifică valoarea și o respinge dacă nu respectă regulile; nu ar trebui să o modifice pe ascuns. Separarea atribuirii/normalizării de validare face previzibilă valoarea verificată și salvată.

### 12. Scrie validatori pe câmp și pe întregul model

Validatorul personalizat al atributului este o funcție numită din obiectul validate al câmpului. Primește valoarea verificată și aruncă o eroare de tip `Error` dacă aceasta nu respectă regula. Simplul `return false` nu semnalează eșecul validării. De exemplu:

```js
validate: {
  meaningfulTitle(value) {
    if (typeof value !== "string" || value.toLowerCase() === "untitled") {
      throw new Error("Folosește un titlu semnificativ");
    }
  }
}
```

Un **validator pe întregul model** aparține opțiunilor modelului, nu unui câmp. Folosește-l pentru o relație între valori, precum obligativitatea motivului când nota este arhivată:

```js
validate: {
  archiveNeedsReason() {
    if (this.archived &&
        (typeof this.archiveReason !== "string" || this.archiveReason.trim() === "")) {
      throw new Error("Notele arhivate au nevoie de un motiv");
    }
  }
}
```

Aici, `this` se referă la instanța validată. Scrie validatorul ca metodă obișnuită pentru a avea acces la această instanță; o funcție săgeată preia `this` din contextul în care a fost definită. Pentru o regulă sincronă, aruncă eroare la eșec. Un validator personalizat async sau care întoarce o promisiune poate respinge promisiunea; trebuie să returnezi promisiunea operației asincrone sau să o aștepți cu `await`, iar apelantul să aștepte operația modelului. Dacă pornești operația asincronă fără să returnezi sau să aștepți promisiunea ei, scrierea poate continua înainte de terminarea verificării.

Ai grijă la câmpurile care permit `null`. Cu `allowNull: false`, valoarea `null` este respinsă la verificarea de nulabilitate și restul validatorilor acelui câmp sunt omiși. Cu `allowNull: true`, validatorii standard nu verifică valoarea `null`, dar cele personalizate rulează în continuare. Tratează explicit null când regula îl permite. Exemplul 02 înregistrează valorile primite de validatorul câmpului care permite `null` pentru a observa diferența.

Un validator care caută un slug existent nu înlocuiește UNIQUE: două cereri concurente pot verifica existența slugului înainte ca vreuna să îl insereze. Lasă constrângerea bazei să decidă conflictul. Folosește verificările personalizate pentru reguli de domeniu, nu pentru a garanta unicitatea în cazul scrierilor concurente.

### 13. Exemplu rezolvat — definirea schemei și modelului

Rulează [definirea schemei și modelului](examples/01-model-metadata/):

```bash
cd lectures/06-persistence-sequelize/ro/examples/01-model-metadata
npm install
npm test
```

Compară Note.getAttributes() cu describeTable("notes"), apoi observă validarea, normalizarea și rândul inserat. Folosește getterul public din exemplu.

### 14. Validează datele la intrarea HTTP, în model și în baza de date

Validarea HTTP oferă feedback precis clientului. Validatorii modelului protejează scrierile care îi execută, inclusiv apelurile directe din scripturi sau joburi. Constrângerile efective ale bazei protejează și scrierile care ocolesc modelul. Aceste mecanisme se completează.

Apelează `await instance.validate()` pentru a verifica fără salvare. build() construiește instanța nesalvată; create() combină construirea, validarea și inserarea; save() obișnuit validează înainte de scriere. La eșec, promisiunea este respinsă cu o eroare Sequelize de tip `ValidationError`. Proprietatea `error.errors` conține detaliile verificărilor care au eșuat. Aceste detalii pot identifica un câmp, un validator și un mesaj; alege ce expui public în loc să serializezi întreaga eroare.

Validarea automată nu este universală. bulkCreate() omite implicit validatorii pe rând; activează `{ validate: true }` când ai nevoie de ei. SQL direct și opțiunile care dezactivează validarea ocolesc verificările JavaScript. Constrângerile SQL rămân active. O regulă pe model are nevoie de valorile relevante: încărcarea instanței, atribuirea schimbărilor permise și salvarea fac vizibilă starea existentă; o actualizare în masă cu valori parțiale nu înlocuiește validarea fiecărui rând complet.

Rulează comparația [validatori și constrângeri](examples/02-validators-and-constraints/) cu npm ci și npm test. Anticipează în ce cazuri se execută INSERT. Verificările compară regulile incluse, titlul rezervat, regula arhivare/motiv, validarea manuală, slugul duplicat, SQL direct și crearea în masă. Scrierile invalide directe sunt probe intenționate într-o bază temporară, nu operații recomandate ale aplicației.

## Intermezzo 1 — modele și constrângeri

Răspunde la întrebările `u06-i1-` din [intermezzo.gift](intermezzo.gift). Rezervă patru minute. Distinge nulabilitatea de unicitate, explică validarea în mai multe locuri și cum respinge o regulă pe model starea invalidă.

## Bloc conceptual 2 — ciclu de viață, CRUD și așteptarea operațiilor

### 15. Alege dacă pornirea păstrează sau resetează rândurile

La pornirea normală, creează tabelele lipsă fără să ștergi rândurile salvate. O resetare șterge și recreează intenționat datele. O migrare schimbă schema existentă gestionând și datele ei. Separă aceste operații pentru ca o simplă repornire a serverului să nu șteargă notițele.

Inițializarea trebuie terminată înaintea cererilor. Deschiderea conexiunii nu dovedește existența schemei, iar definirea modelelor nu creează tabele persistente. Precizează unde se păstrează baza, cum se creează tabelele și când se inserează datele inițiale. Dacă inițializarea eșuează, nu anunța un server funcțional.

sync() creează un tabel lipsă; în general nu migrează un tabel existent după orice schimbare a modelului. sync({ alter: true }) nu înlocuiește pașii de migrare revizuiți pentru date importante. În aceste exemple, folosim sincronizarea pentru a pregăti baza de date. Modificarea unei scheme existente trebuie planificată separat.

### 16. Sincronizarea forțată este distructivă

`sync({ force: true })` șterge și recreează tabelele. Poate fi potrivită pentru o resetare izolată explicită, dar nu trebuie să fie comportamentul implicit pentru o bază ale cărei date vrei să le păstrezi.

### 17. Inserează rânduri inițiale doar când este cazul

**Popularea inițială**, numită și seeding, înseamnă inserarea unor date de pornire, precum notița demonstrativă a exercițiului. Poți popula o bază goală sau una resetată explicit. Verifică dacă a doua pornire normală păstrează rândurile și nu inserează din nou aceleași date inițiale.

„Dacă tabelul este gol, inserează un rând demonstrativ” este o regulă simplă pentru un exemplu rulat local. Nu este un algoritm general concurent: două procese care pornesc simultan pot găsi amândouă tabelul gol. Folosește pași controlați de instalare/migrare și constrângeri în medii partajate. Folosește această regulă simplificată doar când o singură inițializare rulează la un moment dat.

### 18. Exemplu rezolvat — simboluri și interogări compuse

Un obiect `where` descrie condițiile pe care Sequelize le traduce în SQL. `{ archived: false }` cere egalitate. Condițiile alăturate se combină implicit cu AND. Pentru alte comparații și grupări, importă `Op` din Sequelize:

```js
import { Op } from "sequelize";

const where = {
  [Op.and]: [
    { archived: false },
    { priority: { [Op.between]: [2, 5] } },
    {
      [Op.or]: [
        { category: "work" },
        { title: { [Op.like]: "%notes%" } }
      ]
    }
  ]
};
```

Citește condiția: nota este activă ȘI prioritatea este între 2 și 5 inclusiv ȘI (categoria este work SAU titlul conține notes). Gruparea contează: dacă ai muta condiția archived în grupul OR, ai accepta și alte rânduri. `Op.in` verifică apartenența la o listă, iar `Op.gt`, `Op.gte`, `Op.lt` și `Op.lte` exprimă comparații numerice.

**Operatorii din `Op` sunt simboluri JavaScript.** În `[Op.between]`, parantezele pătrate evaluează expresia și folosesc simbolul ca cheie a proprietății. Cheia `"Op.between"` ar fi doar un șir și nu exprimă același lucru. Nu crea un simbol nou cu `Symbol("between")`: folosește simbolul exportat de Sequelize.

`Object.keys` omite cheile simbol, iar `JSON.stringify` pierde aceste condiții. Inspectează obiectul cu `console.dir` sau `Reflect.ownKeys`; nu serializa un obiect `where` în JSON pentru a-l reconstrui ulterior. Tradu parametrii HTTP validați în operatorii și câmpurile alese de aplicație.

Rulează [operatori și interogări compuse](examples/03-query-operators/):

```bash
cd lectures/06-persistence-sequelize/ro/examples/03-query-operators
npm ci
npm start
npm test
```

Anticipează ce rezultate vei obține din cele șapte rânduri, apoi compară-le cu SQL-ul afișat. Filtrul întoarce ID-urile 1, 2, 6. `attributes` selectează coloanele, `order` sortează după prioritate descrescătoare și apoi ID crescător, iar `raw: true` cere obiecte simple în loc de instanțe. Cu `offset: 1` și `limit: 2`, pagina conține 2 și 6. `findAndCountAll` execută și un COUNT separat: totalul este 3, nu lungimea paginii. Secțiunea 21 reia opțiunile unei interogări.

Tiparul `%notes%` este ales de aplicație: în LIKE, `%` înseamnă oricâte caractere, iar `_` un caracter. Nu presupune că un text de căutare cu aceste caractere este un tipar literal. Titlurile sunt identice în ambele ediții pentru ca filtrul să selecteze aceleași rânduri. Relațiile și tranzacțiile urmează în Cursul 07.

### 19. Metodele CRUD sunt asincrone

`findAll`, `findByPk`, `create`, `save`, `destroy`, `sync` și `close` întorc promisiuni. Apelantul trebuie să știe când se încheie fiecare operație.

Apelul asincron întoarce imediat o promisiune. `await` suspendă execuția funcției curente până la obținerea rezultatului; între timp, pot fi tratate alte cereri. Nu transformă SQLite în JavaScript sincron și nu blochează tot serverul. Un răspuns reușit trimis înainte de a aștepta scrierea poate fi urmat de un eșec pe care clientul nu îl mai află.

### 20. Crearea întoarce o instanță a modelului

`Model.create(values)` validează datele și inserează rândul; promisiunea returnată este îndeplinită cu o instanță a modelului după salvare. Nu răspunde înainte de încheierea promisiunii.

Instanța returnată conține valori generate, precum ID-ul și marcajele de timp. Construiește antetul `Location` folosind ID-ul returnat de bază, fără să încerci să ghicești următorul număr. Dacă scrierea respinge promisiunea, nu raporta că resursa a fost creată. Tratarea obișnuită a instrucțiunii în bază asigură persistența operației; coordonarea atomică a mai multor scrieri este tema tranzacțiilor din Cursul 07.

### 21. Metodele de citire necesită ordine deterministă

Fără o sortare explicită, baza de date nu garantează ordinea rândurilor returnate. Adaugă un `order` explicit, incluzând adesea ID-ul drept criteriu de departajare.

Mută operațiile asupra colecției din Cursul 05 în interogare, fără să încarci toate rândurile:

```js
const notes = await Note.findAll({
  where: { archived: false },
  attributes: ["id", "title"],
  order: [["title", "ASC"], ["id", "ASC"]],
  limit: 20,
  offset: 0
});
```

where filtrează rânduri; attributes selectează coloane; order stabilește ordinea; limit și offset stabilesc ce porțiune din rezultate primești. Tradu parametrii validați în acest obiect; nu lăsa clientul să aleagă fragmente SQL sau coloane arbitrare. Rezultatele sunt în continuare instanțe ale modelului, dacă nu ceri obiecte simple prin `raw: true` sau nu le transformi explicit. Relațiile și paginarea mai avansată urmează în Cursul 07.

### 22. Actualizează numai câmpurile furnizate

Pentru comportament de tip patch, distinge un câmp absent de unul furnizat cu o valoare falsy. Atribuie modificările permise, validează, apoi așteaptă `save()`.

De exemplu, if (changes.archived) ignoră false cerut explicit, pe când Object.hasOwn(changes, "archived") detectează prezența. Citește întâi rândul, tratează null ca lipsă, atribuie doar câmpurile acceptate și așteaptă save. Validatorul modelului poate astfel inspecta starea propusă împreună cu valorile neschimbate. Nu transmite întregul corp unei actualizări în masă presupunând că validarea decide și ce câmpuri poate schimba clientul.

### 23. Verifică rezultatul operației de ștergere

`destroy()` pe instanță și ștergerea la nivel de model au rezultate diferite. Adaptează rezultatul la ceea ce trebuie să întoarcă funcția de acces la date, de exemplu `true` numai când a fost șters un rând.

`await Note.destroy({ where: { id } })` întoarce numărul rândurilor afectate. Zero poate indica o resursă absentă; unu înseamnă un rând șters. destroy al instanței lucrează asupra acelei instanțe și nu întoarce numărul rândurilor afectate în același mod. Verifică API-ul apelat înainte să traduci rezultatul în 204 sau 404.

### 24. Așteaptă promisiunea când catch-ul local trebuie să trateze respingerea

Într-o funcție async, `return operation()` transmite promisiunea apelantului fără să aștepte în blocul `try` curent. Dacă este respinsă ulterior, catch-ul acestei funcții nu tratează respingerea. `return await operation()` așteaptă în `try`, deci catch-ul poate clasifica eșecul. Folosește această formă când funcția curentă trebuie să traducă eroarea; altfel poți lăsa apelantul să trateze promisiunea întoarsă.

Distincția privește tratarea locală, nu faptul că funcțiile async întorc promisiuni:

```js
try {
  return await Note.create(values);
} catch (error) {
  // Acest catch poate clasifica respingerea promisiunii create().
  throw error;
}
```

Fără await în try, funcția întoarce promisiunea în așteptare și iese din try înaintea respingerii ulterioare. Apelantul poate încă să aștepte și să prindă eroarea; doar că nu este prinsă aici. Nu adăuga catch care pretinde că tratează eșecul, dar apoi răspunde cu succes.

### 25. Exemplu rezolvat — CRUD Sequelize prin Express

Rulează [CRUD Sequelize prin Express](examples/04-await-error-boundary/):

```bash
cd lectures/06-persistence-sequelize/ro/examples/04-await-error-boundary
npm install
npm test
npm start
```

Creează, listează, modifică și șterge notițe cu `curl` sau un client REST. Rutele așteaptă operații Sequelize reale, iar middleware-ul Express centralizat mapează erorile de validare și unicitate la răspunsuri HTTP stabile.

Modelele exemplelor sunt independente. Exemplul 04 nu include regula archived/archiveReason din exemplul 02: aici urmărim operațiile CRUD și răspunsurile HTTP. Pentru a păstra demonstrația scurtă, rutele apelează direct modelele; secțiunea 38 explică separarea operațiilor bazei într-un repository. Exemplul 05 înlocuiește serializarea automată a instanței cu alegerea explicită a câmpurilor publice.

### 26. Închide conexiunile și elimină fișierele temporare

Testele și oprirea aplicației trebuie să aștepte `sequelize.close()`. Conexiunile gestionate și fișierele temporare necesită curățare chiar și după inițializări sau operații eșuate.

Folosește `try/finally` pentru a închide resursele și când apare o eroare. În testul HTTP, încheie cererile și închide serverul înaintea bazei. Închide baza înainte să ștergi directorul temporar. O conexiune neînchisă poate lăsa testele în așteptare; închide toate conexiunile care folosesc fișierul înainte să îl ștergi.

### 27. Întoarce date simple în locul unei instanțe ORM

O instanță Sequelize conține valorile rândului, metode precum `save()` și date interne de urmărire. `instance.get({ plain: true })` îți oferă date simple în locul metodelor modelului. Nu împiedică modificarea obiectului rezultat și nu garantează o copie profundă independentă a fiecărei valori imbricate. Pentru un răspuns API, alege explicit câmpurile publice înainte de conversia în JSON.

Un obiect simplu nu conține automat doar date care pot fi trimise clientului. Poate conține încă internalReview, marcaje de timp sau coloane adăugate ulterior. O serializare explicită precum `{ id: note.id, title: note.title, archived: note.archived }` definește ce primește clientul. Schimbarea copiei JavaScript nu apelează save; și modificarea instanței cere o operație de persistență pentru a modifica rândul din bază. Modificarea obiectului JavaScript și salvarea în bază sunt operații separate.

### 28. Exemplu rezolvat — alegerea câmpurilor din răspunsul REST

Rulează [alegerea câmpurilor din răspunsul REST](examples/05-detached-data-boundary/):

```bash
cd lectures/06-persistence-sequelize/ro/examples/05-detached-data-boundary
npm install
npm test
npm start
```

Solicită resursa inițială și compară reprezentarea sa publică explicită cu modelul stocat. Câmpurile interne, marcajele temporale și metodele instanței nu sunt incluse în răspunsul HTTP.

## Intermezzo 2 — inițializare și operații asincrone

Răspunde la întrebările `u06-i2-` din [intermezzo.gift](intermezzo.gift). Rezervă patru minute. Explică inițializarea, încheierea scrierii, cheile simbol ale operatorilor și câmpurile publice explicite.

## Bloc conceptual 3 — limbaje de interogare, erori și separare

### 29. Interogările ORM nu sunt singura opțiune

Metodele modelului sunt utile pentru citiri și scrieri obișnuite. Pentru rapoarte, agregări sau funcții specifice bazei de date, SQL-ul direct poate fi mai ușor de urmărit. Același lucru este valabil când trebuie să controlezi mai atent o interogare pentru a-i îmbunătăți performanța.

### 30. Păstrează și interogările SQL directe în codul de acces la date

Folosește `sequelize.query()` în repository sau în serviciul de persistență, nu în codul de prezentare. Ruta gestionează intrarea și ieșirea HTTP; stratul de persistență gestionează SQL-ul și forma rezultatelor bazei de date.

### 31. Transmite valorile SQL separat de instrucțiunea SQL

În textul SQL, un parametru precum `:archived` marchează locul în care va fi folosită o valoare. Pentru o interogare care conține `WHERE archived = :archived`, transmite valoarea acceptată prin opțiunea Sequelize `replacements`, în loc să o concatenezi în textul SQL. Opțiunea `bind` oferă o altă modalitate de a transmite valorile separat. Parametrii reprezintă valori, nu nume arbitrare de tabele sau coloane; alege identificatorii din numele permise de aplicație.

Pentru un parametru numit, textul SQL conține :archived, iar obiectul replacements oferă valoarea. Sequelize o introduce în textul SQL folosind regulile de escapare ale dialectului. Cu `bind`, valorile sunt trimise separat de textul SQL și sunt asociate parametrilor de către baza de date. Mecanismul este înrudit cu `replacements`, dar folosește altă opțiune. Niciunul nu permite unei valori neverificate să reprezinte numele unei coloane ORDER BY. Alege coloana și direcția dintr-o listă permisă.

### 32. Declară forma rezultatului

`QueryTypes.SELECT` face rezultatul așteptat explicit și întoarce direct rândurile. Numele coloanelor și valorile agregate din interogări raw trebuie în continuare adaptate la forma răspunsului API.

### 33. Acceptă doar valorile documentate ale interogării

Pentru `archived`, acceptă exact șirurile `"true"` și `"false"` dacă aceasta este alegerea documentată a API-ului. Respinge celelalte valori, transformă șirul acceptat în valoarea cerută de bază și transmite-o ca parametru. Validarea intrării și parametrizarea SQL au roluri diferite; ai nevoie de ambele.

### 34. Exemplu rezolvat — raport SQL parametrizat

Rulează [raportul SQL parametrizat](examples/06-query-allowlist/):

```bash
cd lectures/06-persistence-sequelize/ro/examples/06-query-allowlist
npm install
npm test
npm start
```

Apelează raportul agregat cu `curl` sau un client REST. Ruta respinge sintaxa booleană invalidă, iar instrucțiunea SQL fixă primește valoarea acceptată prin opțiunea `replacements`, folosind numele parametrului.

### 35. Lasă baza de date să efectueze operațiile relaționale

Încărcarea tuturor rândurilor și agregarea în JavaScript irosesc memorie și ignoră capabilitățile bazei de date. Exprimă filtrarea, sortarea, asocierea și agregarea prin interogări ORM sau SQL parametrizat, după caz.

Dacă ai nevoie de un număr de rânduri, cere bazei să le numere; nu încărca toate rândurile doar ca să citești lungimea tabloului. Pentru proiecție, selectează coloanele necesare. Reduci transferul și poți permite folosirea indexurilor. Jurnalul SQL este o dovadă utilă, dar cronometrarea unui test minuscul în memorie nu este un benchmark de producție relevant.

### 36. Erorile de persistență necesită clasificare

Poți transforma erorile de validare și conflictele de unicitate în răspunsuri de eroare cu format și semnificație bine definite. Erorile I/O sau ale bazei de date neașteptate trebuie propagate către mecanismul centralizat de tratare a erorilor, care nu expune clientului detalii interne.

ValidationError indică în mod obișnuit eșecul verificării modelului. UniqueConstraintError indică un conflict de unicitate în bază. În Sequelize 6, a doua clasă este și subclasă ValidationError, deci clasific-o prima; altfel ramura generică poate ascunde conflictul ca simplu câmp invalid. Dacă fișierul nu poate fi accesat sau apare o eroare SQL neașteptată, răspunde cu 500 și un mesaj generic, fără să copiezi diagnosticul bazei în răspuns.

### 37. Clasifică erorile după tip, fără să expui detalii interne

Folosește clasele de erori Sequelize și proprietățile structurate disponibile. Potrivirea mesajelor brute leagă comportamentul de formularea dialectului și riscă să expună detalii interne.

Inspectează proprietăți structurate precum error.errors doar pentru a construi răspunsul de eroare ales pentru API. Nu returna error.sql, stack trace, parametri bruți sau căi de stocare. Un mesaj despre câmpul invalid îl poate ajuta pe client să corecteze datele; diagnosticul complet poate divulga implementarea sau datele. Păstrează politica de clasificare consecventă cu Cursul 05.

### 38. Separă tratarea HTTP de operațiile bazei de date

Ruta citește intrarea HTTP și alege starea, antetele și corpul răspunsului. O funcție a aplicației aplică regulile operației cerute. Un repository grupează funcțiile care citesc sau modifică datele prin modele și întorc rezultatele. O metodă a repository-ului nu ar trebui să aibă nevoie de un răspuns Express pentru a semnala un rând lipsă sau un eșec al bazei.

### 39. Testează atât operațiile bazei de date, cât și răspunsurile HTTP

Testele directe ale repository-ului demonstrează constrângerile, interogările, păstrarea datelor după repornire și curățarea. Testele de integrare HTTP verifică dacă aceste rezultate produc răspunsurile documentate ale API-ului.

Testul direct al modelului poate întreba precis: titlul gol a eșuat înainte de SQL, duplicatul a ajuns la constrângere sau rândul s-a păstrat după redeschiderea bazei? Testul HTTP întreabă altceva: operația a produs codul de stare și corpul de răspuns corect? Succesul unui nivel nu dovedește celălalt. Folosește stocare temporară pentru ca scrierile intenționat invalide să nu afecteze date păstrate.

### 40. Inspectează SQL-ul generat în timpul diagnosticării

Doar citind apelul ORM, nu vezi întotdeauna exact ce SQL se execută. Activează logarea controlată sau inspectează SQL-ul în diagnosticare, apoi concentrează testele asupra rezultatelor, ordinii și comportamentului verificat.

## Intermezzo 3 — interogări și erori de persistență

Răspunde la întrebările `u06-i3-` din [intermezzo.gift](intermezzo.gift). Rezervă patru minute. Explică parametrii SQL, paginarea deterministă și totalul potrivirilor, clasificarea subclaselor de erori și răspunsurile de eroare fără detalii interne.

## Sinteză — urmărește datele de la cerere până la salvare

```text
date de intrare HTTP
→ validarea datelor din cerere
→ metoda aplicației/repository-ului
→ executarea interogării Sequelize cu await
→ constrângeri ale modelului și bazei de date
→ rând salvat sau eroare clasificată
→ obiect simplu cu câmpurile publice
→ răspuns HTTP
```

Adaugă ciclul de viață: deschide, inițializează intenționat, introdu datele inițiale în mod previzibil, servește cererile, închide, redeschide și demonstrează păstrarea datelor.

## Erori frecvente

- Sincronizare forțată la pornirea normală.
- Populare necondiționată care dublează rândurile.
- Bazarea exclusivă pe validarea rutei.
- Omiterea așteptării scrierilor sau închiderii.
- Așteptarea ca un `catch` sincron să trateze respingerea ulterioară.
- Returnarea instanțelor ORM prin HTTP.
- Interpolarea datelor cererii în SQL raw.
- Omiterea criteriilor deterministe de departajare.
- Filtrarea tuturor rândurilor în memorie.
- Returnarea înregistrărilor care conțin date secrete.
- Amestecarea obiectelor de răspuns Express în repository.

## Relația cu tutorialul

API-ul de notițe persistente înlocuiește un repository în memorie și demonstrează păstrarea datelor după repornire. API-ul de interogare traduce un set bine definit de parametri HTTP în operații Sequelize. Depanarea serviciului de rezervări investighează valorile stocate și răspunsurile de eroare incorecte, apoi repară modelul și stocarea reale.

## Considerații pentru dezvoltarea asistată de AI

Cere-i lui Codex să precizeze regulile modelului, politica de pornire, câmpurile publice, parametrii SQL și locul unde sunt tratate erorile înainte de editare. Inspectează accesul depreciat la metadate, resetările forțate, cuplarea rută/ORM, SQL-ul interpolat, apelurile fără `await`, potrivirea mesajelor și expunerea instanțelor. Verifică prin inspectarea schemei, scrieri directe invalide, cereri HTTP, SQL generat în diagnosticare și teste de repornire.

## Referințe

- Harta de migrare a cursului, Unitatea 06.
- `webtech-2025-course/c7/` și `webTechTutorials-main/S08/`.
- Documentația Sequelize 6 pentru modele, validare, interogare și ciclul de viață.
- Documentația SQLite pentru tipuri, constrângeri, fișiere și baze de date în memorie.
