# Specificația exercițiului — Depanarea stării și efectelor

## Unitate

Unitatea 08 — React cu Vite

## Obiectiv de învățare

Repară panoul de căutare React. Folosește textul curent pentru căutare, împiedică răspunsurile vechi să înlocuiască rezultatele noi și oprește cererile când componenta nu mai are nevoie de ele.

## De ce există acest exercițiu

Componentele generate par frecvent corecte într-o demonstrație ideală, în timp ce efectele rulează din nou inutil, cererile vechi suprascriu rezultatele noi, starea derivată deviază, iar timerele supraviețuiesc demontării. Ai nevoie de dovezi deterministe legate de ciclul randare/efect React, nu de recomandări generale precum „optimizați rerandările”.

## Cerințe preliminare

- Proiectul 1 sau cunoștințe echivalente din curs despre stare, inputuri controlate, evenimente, efecte, props și valori calculate la randare. Finalizarea Proiectului 2 opțional nu este necesară.
- Promisiuni, `AbortController`, timere și curățare.

## Context inițial

Ai primit un proiect Vite React cu:

- `evidence/GeneratedSearchPanel.jsx`, cod fragil păstrat care oglindește `filteredResults` în stare, recreează opțiunile la randare, omite curățarea și permite răspunsuri învechite;
- un substitut determinist injectat `search(query, { signal })`, controale pentru răspunsuri amânate, infrastructură pentru timere, date de test, intrare/CSS/limită de eroare și verificări ale dovezilor de bază;
- `src/SearchPanel.jsx` incomplet, care primește proprietățile `search`, `debounceMs`, `minimumLength` și `onUnexpectedError`.

## Sarcina ta

Repară panoul de căutare React. Folosește textul curent pentru căutare, împiedică răspunsurile vechi să înlocuiască rezultatele noi și oprește cererile când componenta nu mai are nevoie de ele.

Lucrează în proiectul `student/` furnizat. Modifică doar `src/SearchPanel.jsx`. Cerințele detaliate precizează cazurile, formele datelor și restricțiile pe care trebuie să le respecți. Folosește testele și instrucțiunile de pornire furnizate pentru verificare.

## Comportament necesar

- Păstrează numai `query`, deținut de utilizator, și starea `{ status, results, error }`, deținută de cerere; derivați numărul/conținutul rezultatelor vizibile în timpul randării.
- Un input controlat se actualizează imediat; interogările fără spații marginale mai scurte decât `minimumLength` revin la starea inactivă cu un tablou gol de rezultate, fără apelarea `search`.
- Aplică debounce căutărilor eligibile cu `debounceMs`; schimbarea interogării sau demontarea curăță timerul anterior.
- Pentru fiecare cerere pornită, creează un `AbortController`, transmite-i semnalul și anulează-l la curățarea efectului.
- Ignoră încheierea cererilor învechite/abandonate chiar când substitutul injectat se rezolvă după abandonare; numai cea mai recentă interogare eligibilă poate actualiza starea vizibilă.
- Afișează stările exacte inactiv, încărcare, gol, rezultate și eroare neutralizată, cu semantică de stare accesibilă.
- Transmite obiectele erorilor neașteptate neschimbate către `onUnexpectedError`; nu randa niciodată mesajele interne. Respingerile asociate abandonării sunt curățări așteptate și nu sunt înregistrate.
- Include toate valorile reactive folosite de efect în dependențele lui. Callback-urile de căutare și eroare furnizate sunt stabile; nu omite o dependență, nu dezactiva lintingul și nu memoiza un obiect arbitrar de opțiuni doar pentru a ascunde execuțiile repetate.


Un input controlat primește valoarea afișată din starea React și actualizează acea stare prin onChange. Debounce înseamnă așteptarea unei pauze în tastare înainte de pornirea căutării; înlocuirea timerului amână căutarea. Curățarea rulează înainte de înlocuirea unui efect și la demontarea componentei. Mesajul pentru rezultat gol descrie o căutare finalizată fără rezultate; starea inactivă înseamnă că textul este prea scurt pentru căutare. Acestea sunt stări vizibile, nu o cerință de cinci valori distincte de status în cod.

## Constrângeri

- JavaScript JSX, React + Vite, ESM, testele deterministe/timerele simulate/adaptorul de căutare furnizate și fișierul lock fixat.
- Implementează numai `src/SearchPanel.jsx`; păstrează dovada fragilă, intrarea, stilurile, testele, dependențele și infrastructura.
- Folosește un singur efect pentru ciclul cererii cu debounce; fără bibliotecă pentru preluarea datelor, reducer, stare globală, extragerea unui hook personalizat sau bibliotecă de optimizare a numărului de randări.
- Nu modifica funcția de căutare injectată și nu presupune că abandonarea împiedică încheierea promisiunii.

## Criterii observabile de finalizare

- Tastarea rapidă declanșează numai apelul final cu debounce.
- Răspunsurile mai vechi și lente nu pot înlocui rezultatele noi, inclusiv în comportamentul de rezolvare după abandonare.
- Scurtarea interogării și demontarea curăță timerele/abandonează cererile și nu produc actualizări ulterioare ale stării.
- Tranzițiile inactiv/încărcare/gol/rezultate/eroare și textul accesibil de stare sunt exacte.
- Nu rămân stare oglindită pentru filtrare/numărare, obiect instabil de dependențe, închidere învechită sau timer necurățat.
- Compilarea, verificările clasificate, auditul și testul minimal în browser trec; se schimbă numai `src/SearchPanel.jsx`.

## Plan de validare (pentru autorii cursului)

### Verificări de bază

- Substitutul de căutare, controalele amânate, mediul timerelor, infrastructura aplicației/limita de eroare și dovada fragilă păstrată reproduc independent defectele răspunsurilor învechite și curățării.

### Verificările obiectivului

- Input controlat și comportament de resetare la lungimea minimă.
- Timpul/argumentele apelului cu debounce, înlocuirea timerului și numărul exact de apeluri.
- Încheierile în ordine inversă și după abandonare expun numai cele mai recente rezultate.
- Curățarea la schimbarea/scurtarea interogării/demontare abandonează semnalele corecte și împiedică actualizările.
- Stările accesibile inactiv/încărcare/gol/rezultate/eroare neutralizată.
- Inspectarea sursei pentru un singur efect, proprietatea dependențelor, absența stării derivate oglindite și absența suprimării lintingului.

### Verificări de regresie

- Compilarea Vite de producție reușește.
- Instanțele separate ale panoului nu partajează timere, controllere, rezultate sau starea interogării.
- Aceeași interogare vizibilă repetată nu se declanșează din cauza obiectelor de opțiuni recreate.
- Componenta finalizată nu randează exemplul defect. Varianta inițială îl încorporează intenționat pentru reproducerea defectelor; fișierul exemplului rămâne neschimbat.

## Notă pentru autor — pregătirea variantei inițiale

După validarea referinței, copiază referința și înlocuiește numai `src/SearchPanel.jsx` cu un mic adaptor în jurul dovezii generate păstrate și TODO-uri focalizate. Aplicația rămâne executabilă, iar dovada de bază rămâne observabilă; verificările ciclului de viață/obiectivului eșuează din motivele documentate despre învechire/curățare.

Dovada expune intenționat defectele, dar nu conține niciun model reparat de debounce/abandonare/cea mai recentă cerere. Testele descriu timpul observabil fără să duplice componenta finalizată.

## Sarcină Codex

> Repară panoul de căutare React. Folosește textul curent pentru căutare, împiedică răspunsurile vechi să înlocuiască rezultatele noi și oprește cererile când componenta nu mai are nevoie de ele. Modifică doar `src/SearchPanel.jsx`. Citește această specificație și codul furnizat înainte să editezi. Respectă comportamentul cerut, intrările/ieșirile exacte și restricțiile de aici. Păstrează testele și infrastructura furnizată. Rulează verificările documentate și spune ce trece, ce eșuează și de ce. Explică modificările ca să le pot inspecta.

## Sarcină de depanare/extensie

- Elimină protecția celei mai recente cereri, păstrând abandonarea. Rezolvă o cerere simulată abandonată după cererea mai nouă și explică de ce semnalarea curățării este insuficientă singură înainte de a restabili ambele protecții.

## În afara domeniului

- Cache pe server, Suspense, React Query, tranziții, componente de server, rutare, paginare, stare globală sau clasarea căutării în producție.
