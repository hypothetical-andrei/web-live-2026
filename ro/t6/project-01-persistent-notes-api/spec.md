# Specificația exercițiului — API de notițe persistente

## Unitate

Unitatea 06 — Persistență cu Sequelize și SQLite

## Obiectiv de învățare

Implementează interfața furnizată pentru notițe folosind Sequelize și SQLite. Salvează modificările înainte să raportezi succesul, păstrează notițele între reporniri și închide baza de date la final.

## De ce există acest exercițiu

Repository-ul unității precedente era intenționat în memorie. Proiectul păstrează limita API cunoscută pentru a evidenția schimbările aduse de persistență: conexiune și model, interogări asincrone, erori de validare, responsabilitatea resetării și populării și supraviețuirea datelor după repornire.

## Cerințe preliminare

- Rutarea Express, repository-uri injectate, validare și erori centralizate din Unitatea 05.
- JavaScript `async`/`await`, obiecte și teste de integrare HTTP.
- Node.js LTS, npm și vocabular relațional de bază.

## Context inițial

Ai primit un API Express 5 ESM pentru notițe, cu rutele, validarea cererilor, structurile JSON, tratarea rutelor lipsă și a erorilor, pagina statică, pornirea/oprirea serverului și testele deja implementate. Aplicația acceptă un depozit injectat cu metodele `initialize`, `list`, `findById`, `create`, `update`, `remove` și `close`.

Fișierul incomplet `src/note-store.js` exportă `createNoteStore({ storage, logging = false })`. Acesta trebuie să creeze propria conexiune Sequelize și modelul `Note`, fără să cunoască Express. Producția furnizează o cale SQLite inscriptibilă, iar testele folosesc un fișier temporar sau `:memory:`. Lista inițială este transmisă numai către `initialize({ reset, seed })`.

Notițele au câmpurile publice `id`, `title`, `body`, `archived`, `createdAt` și `updatedAt`. ID-urile sunt întregi pozitivi generează de bază. Marcajele temporale sunt șiruri ISO la limita HTTP; depozitul poate întoarce obiecte simple cu valori `Date`.

## Sarcina ta

Implementează interfața furnizată pentru notițe folosind Sequelize și SQLite. Salvează modificările înainte să raportezi succesul, păstrează notițele între reporniri și închide baza de date la final.

Lucrează în proiectul `student/` furnizat. Modifică doar `src/note-store.js`. Cerințele detaliate precizează cazurile, formele datelor și restricțiile pe care trebuie să le respecți. Folosește testele și instrucțiunile de pornire furnizate pentru verificare.

## Comportament obligatoriu

- Definește `Note` cu cheie primară întreagă autoincrementată; `title` șir nenul; `body` text nenul implicit `""`; `archived` boolean nenul implicit `false`; și timestamps Sequelize.
- Validarea respinge un titlu care devine gol după trim și curăță titlurile valide înainte de persistență.
- `initialize({ reset: true, seed })` recreează schema și inserează lista deterministă exact o dată.
- `initialize({ reset: false, seed })` creează schema lipsă fără a șterge rânduri și populează numai un tabel gol.
- `list()` întoarce notițe ordonate după `id` ascendent, drept obiecte simple detașate.
- `findById(id)` întoarce un obiect detașat sau `null`.
- `create({ title, body = "", archived = false })` persistă și întoarce notița.
- `update(id, changes)` actualizează numai câmpurile furnizate `title`, `body` și `archived`, întoarce notița sau `null` pentru ID absent.
- `remove(id)` întoarce `true` numai dacă a fost șters un rând.
- Fiecare metodă așteaptă operația Sequelize; erorile sunt propagate tratării centralizate furnizate.
- `close()` așteaptă închiderea conexiunii și funcționează după inițializarea reușită.
- Cu stocare într-un fișier, notița creată rămâne vizibilă după închiderea unui depozit și inițializarea altuia cu `reset: false`.

## Constrângeri

- JavaScript ESM, Node.js LTS, Express 5 furnizat, Sequelize stabil 6.x, SQLite prin `sqlite3`, `fetch` nativ și runnerul Node.
- Implementează numai `src/note-store.js`; păstrează rutele, serializatoarele, fixture-urile, testele, manifestele și ciclul aplicației.
- Nu folosește SQL brut, migrări, asocieri, hook-uri fără legătură cu normalizarea sau alt ORM.
- Testele folosesc fișiere temporare create și eliminate de harness, nu baze comise.
- Nu apela `sync({ force: true })` decât când `reset` este explicit adevărat.

## Criterii observabile de finalizare

- Toate verificările trec din fișierul lock comis.
- O secvență reală creare/citire/actualizare/ștergere păstrează contractul JSON și de stare din Unitatea 05.
- Verificarea cu repornire demonstrează supraviețuirea unei notițe după închiderea conexiunii.
- Resetarea și popularea produc aceleași ID-uri și rânduri între rulări.
- Datele invalide ating eroarea stabilă fără rând parțial.
- Diferența finală atinge numai `src/note-store.js`.

## Plan de validare (pentru autorii cursului)

### Verificări de bază

- Aplicația Express, rutele, serializatorul, sănătatea, resursele statice și un depozit fake funcționează independent de Sequelize.
- Ajutoarele pentru directoare temporare și server curăță determinist.

### Verificările obiectivului

- Metadatele și validarea respectă toate constrângerile și valorile implicite.
- Resetarea, popularea, listarea, găsirea, crearea, actualizarea parțială și ștergerea respectă contractul.
- Valorile întoarse sunt detașate de instanțele Sequelize.
- Datele din fișier supraviețuiesc închiderii și redeschiderii fără resetare.
- Flagul de logging injectat este transmis fără a schimba comportamentul.

### Verificări de regresie

- JSON-ul incorect, rutele necunoscute și validarea HTTP rămân responsabilitatea middleware-ului furnizat.
- Validarea respinsă nu creează rând, iar cererile ulterioare reușesc.
- Închiderea depozitului eliberează fișierele SQLite temporare.
- Modulul depozitului nu importă Express și nu conține stări sau anvelope HTTP.

## Notă pentru autor — pregătirea variantei inițiale

După validarea referinței, copiaz-o și elimină numai conexiunea, modelul și corpurile metodelor din `src/note-store.js`, păstrând factory-ul, semnăturile și TODO-uri focalizate. Fallback-ul `createUnavailableStore()` păstrează verificările de bază cu un depozit de test injectat. Inițializarea reală este indisponibilă: pornirea normală a serverului necesită implementarea depozitului. Nu rămâne nicio operație de persistență completă.

Verificările de bază și regresiile numai HTTP trec. Verificările obiectivului eșuează cu eroarea documentată până când definești modelul, ciclul de viață și CRUD.

## Sarcină pentru Codex

> Implementează interfața furnizată pentru notițe folosind Sequelize și SQLite. Salvează modificările înainte să raportezi succesul, păstrează notițele între reporniri și închide baza de date la final. Modifică doar `src/note-store.js`. Citește această specificație și codul furnizat înainte să editezi. Respectă comportamentul cerut, intrările/ieșirile exacte și restricțiile de aici. Păstrează testele și infrastructura furnizată. Rulează verificările documentate și spune ce trece, ce eșuează și de ce. Explică modificările ca să le pot inspecta.

## Sarcină de depanare/extensie

- Elimină `await` dintr-un apel de creare aflat într-un `try`/`catch`. Declanșează validarea, observă unde scapă respingerea și restabilește cea mai mică reparare a responsabilității asincrone.

## În afara scopului

Asocieri, tranzacții, migrări, paginare/filtrare, autentificare, pool-uri de producție sau backup-uri de livrare.
