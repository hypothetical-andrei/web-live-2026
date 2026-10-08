# Specificația exercițiului — Rule Engine

## Unitate

Unitatea 02 — JavaScript pentru citirea și modificarea programelor

## Obiectiv de învățare

Construiește predicate compozabile din reguli declarative folosind închideri și funcții de ordin superior, apoi partiționează înregistrările fără să modifici intrările.

## De ce există acest exercițiu

Regulile concretizează funcțiile ca valori: o configurație este compilată o dată într-un predicat reutilizat pentru mai multe înregistrări. Compunerea recursivă `all`, `any` și `not` expune captura închiderilor și scurtcircuitarea.

## Cerințe preliminare

- Conceptele Dataset Transformer: tablouri, obiecte, callback-uri, absența mutației și validare.

## Context inițial

Studenții primesc un proiect Node ESM fără dependențe, cu scenarii și un shell furnizat pentru citire și scriere de fișiere, plus `src/rule-engine.js` incomplet. Înregistrările descriu sarcini prin `owner`, `status`, `priority` și `estimate`.

## Comportament necesar

- `compileRule(definition)` întoarce o închidere-predicat.
- Regulile-frunză sunt `{ field, operator, value }`; operatorii acceptați sunt `equals`, `atLeast` și `includes`.
- Regulile compuse sunt `{ all: [...] }`, `{ any: [...] }` sau `{ not: rule }` și combină recursiv predicate compilate, cu scurtcircuitare.
- Definițiile invalide sau ambigue, `all`/`any` goale, operatorii neacceptați și câmpurile absente aruncă erori `TypeError` descriptive în timpul compilării.
- `evaluateRecords(records, definition)` întoarce `{ matchedIds, rejectedIds }` în ordinea intrării și nu modifică intrările.
- `includes` acceptă numai un câmp-tablou în înregistrare; `atLeast` acceptă câmpuri și valori de comparație numerice, fără conversie.

## Restricții

- JavaScript ESM, Node LTS, fără dependențe.
- Shell-ul furnizat citește și scrie sincron fișiere; regulile și I/O asincrone aparțin Unității 03.
- Studentul modifică doar `src/rule-engine.js`.
- Compilează fiii o singură dată; nu recompila în interiorul predicatului întors.
- Folosește `every`, `some` și o închidere care neagă pentru comportamentul compus.

## Criterii observabile de finalizare

- Scenariul de verificare furnizat scrie exact identificatorii de sarcini așteptați.
- Compunerea imbricată și toți operatorii-frunză trec verificările țintite.
- Definițiile invalide eșuează înaintea evaluării înregistrărilor.
- Definițiile și înregistrările înghețate rămân neschimbate.
- Studentul poate desena arborele predicatelor și explica valorile capturate.

## Plan de validare

### Verificări de bază

- JSON-ul scenariului se încarcă, iar runnerul fix scrie JSON valid sintactic cu substitutul furnizat studentului.

### Verificări de obiectiv

- Operatorii-frunză întorc predicate corecte cu comportament strict al tipurilor.
- Compunerea imbricată `all`/`any`/`not` selectează exact înregistrările.
- Definițiile și operatorii invalizi aruncă erori în timpul compilării.
- Evaluarea partiționează identificatorii în ordinea sursei.

### Verificări de regresie

- Regulile și înregistrările înghețate în profunzime nu sunt modificate.
- O regulă compusă scurtcircuitează înaintea unui predicat ulterior care aruncă intenționat.
- Runnerul pe fișiere scrie JSON valid pentru un scenariu valid.

## Lucrul prevăzut pentru student

După validarea referinței, copiaz-o și elimină numai corpurile pentru validare, compilare recursivă și evaluare din `src/rule-engine.js`, păstrând semnăturile exportate și TODO-urile. Verificările de bază rămân valide. Verificările de obiectiv și regresiile dependente de motor eșuează conform documentației.

## Sarcină pentru Codex

> Examinează formele regulilor, testele și `src/rule-engine.js` fără să editezi. Explică ce capturează fiecare închidere compilată și unde are loc scurtcircuitarea. Apoi implementează doar `src/rule-engine.js`. Compilează reguli-frunză și compuse validate în predicate reutilizabile, păstrează tipurile stricte și ordinea intrării și nu modifica nimic. Nu edita datele, runnerul pe fișiere sau testele și nu adăuga dependențe. Finalizat când toate verificările trec și diferența schimbă un singur fișier. Arată cazurile recursive și explică reutilizarea predicatului compilat.

Examinează diferența pentru recompilări în predicate, conversii bazate pe truthiness, validare absentă și schimbări dincolo de modulul indicat.

## Sarcină de depanare/extindere

- Înlocuiește un `every` cu `forEach`, observă comportamentul boolean incorect și folosește un diagnostic Codex țintit pentru remediere. Explică de ce iterarea și agregarea predicatelor sunt operații diferite.

## În afara domeniului exercițiului

- Parsarea unui limbaj de reguli, evaluare JavaScript dinamică, persistență, reguli asincrone sau autorizarea utilizatorilor.
