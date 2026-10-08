# Specificația exercițiului — Auditarea codului generat

## Unitate

Unitatea 02 — JavaScript pentru citirea și modificarea programelor

## Obiectiv de învățare

Auditează o transformare JavaScript generată și plauzibilă pentru a explica modelul obiectual în acțiune: delegarea prin prototip, proprietățile proprii față de cele moștenite, identitatea obiectelor, mutația și aliasurile. Folosește interfața CLI pentru a furniza un set de date și a compara comportamentul generat cu o limită defensivă de normalizare bine delimitată.

## De ce există acest exercițiu

Codul generat pare adesea concis, dar ascunde comportamente ale modelului obiectual: un câmp poate fi găsit pe prototip, sortarea poate modifica tabloul apelantului, iar obiectele întoarse pot păstra aliasuri către intrare. Studenții folosesc dovezi din execuție pentru a lega căutarea proprietăților și identitatea de comportamentul observabil al programului. CLI-ul apare aici, după ce studenții au lucrat cu date în memorie și intrări/ieșiri din fișiere.

## Cerințe preliminare

- Valori, tipuri și conversii, tablouri și obiecte, funcții, tratarea erorilor și absența mutației din proiectele anterioare ale Unității 2.

## Context inițial

Studenții primesc `unsafe-generated.js`, o funcție generată păstrată intenționat; date, un CLI de comparație cu `--file`, teste și limita sigură incompletă `normalizeEvents(events)`. Evenimentele au `id` șir, `occurredAt` ISO, `active` boolean și `durationMs` numeric finit.

## Comportament necesar

- `normalizeEvents` respinge intrarea care nu este tablou și înregistrările invalide printr-un `TypeError` specific indexului.
- Fiecare câmp obligatoriu trebuie să fie proprietate proprie; valorile moștenite nu satisfac contractul datelor externe.
- Acceptă numai tipuri exacte; nu convertește șiruri în valori booleene sau numere.
- Întoarce obiecte-eveniment noi, ordonate crescător după marcaj temporal și apoi după id.
- Evenimentele întoarse conțin doar `id`, `occurredAt`, `active` și `durationMs`.
- Nu modifică tabloul sau înregistrările de intrare.
- `summarizeEvents` întoarce `{ activeCount, totalDurationMs }` din evenimente normalizate.
- Funcția generată nesigură rămâne neschimbată ca dovadă pentru audit.
- CLI-ul acceptă argumentul opțional `--file cale`, folosește implicit datele furnizate și oferă `--help`.

## Restricții

- JavaScript ESM, Node LTS, fără dependențe.
- CLI-ul de comparație citește sincron fișierul, pentru ca auditul să rămână în modelul sincron al Unității 02.
- Studentul modifică doar `src/safe-normalizer.js`.
- Validează înainte să sortezi sau să agregi.
- Verifică proprietățile proprii la limita normalizării; nu modifica prototipuri și nu accepta valori implicite moștenite drept date furnizate.
- Nu ascunde intrări invalide prin filtrarea lor.
- Păstrează implementarea nesigură pentru comparație; nu o prezenta drept cod recomandat.

## Criterii observabile de finalizare

- `npm run compare -- --file data/events.json` arată acceptarea proprietăților moștenite și modificarea ordinii de intrare.
- Normalizarea sigură trece verificările tipurilor stricte, proiecției, ordinii și sumarului.
- Testele cu intrare înghețată trec.
- Diferența finală este un singur fișier, iar studentul poate numi dovezile fiecărei remedieri.

## Plan de validare

### Verificări de bază

- Datele și CLI-ul de comparație se încarcă independent.
- Comportamentul nesigur rămâne incorect reproductibil pentru cazurile auditului.
- Un contraexemplu construit demonstrează că artefactul nesigur acceptă un câmp obligatoriu moștenit prin prototip.

### Verificări de obiectiv

- Înregistrările valide sunt normalizate, proiectate și ordonate exact.
- Valorile booleene/numerice exprimate ca șir, câmpurile obligatorii moștenite, datele invalide și duratele nefinite sunt respinse.
- Sumarul folosește valori booleene și numerice normalizate.

### Verificări de regresie

- Intrarea înghețată în profunzime nu aruncă erori și nu se schimbă.
- Înregistrările întoarse nu păstrează aliasuri către cele de intrare.
- Marcajele temporale egale sunt departajate după id.

## Lucrul prevăzut pentru student

După validarea referinței, copiaz-o și înlocuiește doar validarea, copierea/sortarea și sumarizarea din `safe-normalizer.js` cu un TODO care deleagă temporar către `unsafeNormalizeEvents`. Păstrează exporturile. Dovezile auditului de bază rămân valide; verificările de obiectiv și absență a mutației eșuează conform documentației.

## Sarcină pentru Codex

> Examinează `unsafe-generated.js`, `spec.md` și eșecurile țintite fără să editezi. Rulează comparația cu datele furnizate și cu un al doilea fișier. Construiește un tabel de dovezi pentru căutarea prin prototip, un câmp obligatoriu moștenit, mutație și aliasuri. Apoi implementează numai `safe-normalizer.js`; păstrează fișierul nesigur, nu adăuga dependențe, cere câmpuri proprii cu tipuri stricte și întoarce înregistrări noi. Finalizat când toate verificările trec, fiecare remediere corespunde unui contraexemplu demonstrat, iar diferența schimbă un singur fișier. Explică diferența înainte să ceri aplicarea ei.

Studenții verifică fiecare defect afirmat prin CLI, examinează diferența și resping rescrieri cosmetice care nu remediază un comportament demonstrat al modelului obiectual.

## Sarcină de depanare/extindere

- Adaugă o înregistrare cu o dată calendaristică invalidă pe care `Date.parse` o normalizează neașteptat. Decide și documentează dacă acel contract trebuie să o accepte, apoi adaugă un test țintit înainte să ceri o remediere Codex.

## În afara domeniului exercițiului

- Pachete de validare a schemelor, fusuri orare dincolo de ordonarea ISO, intrare în flux sau rescrierea artefactului nesigur păstrat.
