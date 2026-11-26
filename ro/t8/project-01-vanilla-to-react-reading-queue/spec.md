# Specificația exercițiului — Coada de lectură de la vanilla la React

## Unitate

Unitatea 08 — React cu Vite

## Obiectiv de învățare

Reconstruiește lista de lecturi furnizată în React. Păstrează adăugarea, filtrarea și actualizarea, păstrează starea în componenta potrivită și sincronizează datele cerute cu stocarea.

## De ce există acest exercițiu

Sintaxa React este mai ușor de înțeles când poți compara două implementări ale aceleiași interfețe. Sarcina nu este reproiectarea domeniului, ci maparea proprietății DOM imperative la randare declarativă și tranziții de stare, verificând în același timp paritatea comportamentală.

## Cerințe preliminare

- Unitatea 03 despre DOM/evenimente/module și Unitatea 04 despre interfața semantică.
- Tablouri JavaScript, actualizări imuabile, vocabular asincron/despre efecte.
- Comenzi Vite de bază pentru dezvoltare.

## Context inițial

Ai primit un proiect Vite React ESM cu:

- o coadă de lectură vanilla completă și executabilă în `vanilla/`, care acceptă adăugarea, comutarea stării citit, eliminarea, filtrarea cu numărători vizibile și persistența în stocarea locală;
- CSS semantic, adaptor de stocare, ID-uri stabile, date de test, punct de intrare, infrastructură de testare și nume accesibile furnizate;
- un `src/App.jsx` incomplet, al cărui arbore de componente trebuie să ofere același comportament observabil fără interogarea sau modificarea manuală a nodurilor DOM.

Aplicația React primește proprietățile `storage`, `initialItems` și `createItemId` pentru teste deterministe. Datele stocate, când sunt prezente și valide, au prioritate față de `initialItems` la construirea stării inițiale. Datele stocate valide sunt un tablou ale cărui elemente au un șir `id` nevid, un șir `title` nevid și un boolean `read`; orice altă formă analizată revine integral la valoarea implicită.

## Sarcina ta

Reconstruiește lista de lecturi furnizată în React. Păstrează adăugarea, filtrarea și actualizarea, păstrează starea în componenta potrivită și sincronizează datele cerute cu stocarea.

Lucrează în proiectul `student/` furnizat. Modifică doar `src/App.jsx`. Cerințele detaliate precizează cazurile, formele datelor și restricțiile pe care trebuie să le respecți. Folosește testele și instrucțiunile de pornire furnizate pentru verificare.

## Comportament necesar

- Randează o aplicație `ReadingQueue` compusă cel puțin din componentele `QueueForm`, `QueueFilter`, `QueueList` și `QueueItem`; transmite datele/callback-urile prin proprietăți explicite.
- Inițializează elementele o singură dată din `storage.getItem("reading-queue")`, revenind la `initialItems` pentru JSON stocat absent sau invalid.
- Folosește un input controlat pentru titlu; elimină spațiile la trimitere; ignoră titlurile goale; adaugă `{ id, title, read: false }` prin `createItemId`; golește inputul după reușită.
- Randează filtrele toate/rămase/citite cu numărători vizibile exacte și indicarea stării active.
- Comută imuabil un element, elimină un element și afișează chei stabile din ID-uri.
- Afișează o stare goală utilă când filtrul selectat nu are elemente.
- Sincronizează tabloul complet de elemente în `storage.setItem("reading-queue", JSON.stringify(items))` într-un efect după montarea inițială și când elementele se schimbă; schimbarea exclusivă a filtrului nu trebuie să scrie în stocare. Prop-ul storage furnizat are identitate stabilă.
- Păstrează elementele semantice, etichetele, butoanele, textul de stare și comportamentul tastaturii furnizate.
- Nu apela `document.querySelector`, `innerHTML`, API-uri manuale de listenere și nu modifica direct tablourile de elemente/stare.

## Constrângeri

- JavaScript JSX, React cu Vite, ESM, configurația CSS/stocare/ID/test furnizată și fișierul lock fixat.
- Implementează numai `src/App.jsx`; nu edita dovezile vanilla, punctul de intrare, CSS-ul, datele de test, testele sau dependențele.
- Folosește starea locală/efectele React; nu adăuga o bibliotecă de stare, router, server, infrastructură de reducere sau dependență de componente.
- Păstrează persistența sincronă și locală; sincronizarea cu serverul este introdusă ulterior.

## Criterii observabile de finalizare

- Urmele comportamentale vanilla și React concordă pentru fluxurile de adăugare/comutare/eliminare/filtrare/numărare/stare goală.
- Inițializarea la reîncărcare folosește datele stocate valide și revine sigur pentru stocare invalidă.
- Scrierile în stocare conțin exact elementele complete și nu au loc numai deoarece se schimbă un filtru.
- Inventarul/proprietățile componentelor, actualizările imuabile, inputul controlat și cheile stabile pot fi inspectate.
- Compilarea Vite, verificările clasificate, auditul și un test minimal în browser trec; se schimbă numai `src/App.jsx`.

## Plan de validare (pentru autorii cursului)

### Verificări de bază

- Comportamentul aplicației vanilla furnizate, datele de test, adaptorul de stocare, intrarea React/configurația Vite, CSS-ul și mediul de testare funcționează independent de `App.jsx`.

### Verificările obiectivului

- Randează stările inițială/stocată validă/stocată invalidă și numărătorile exacte.
- Trimiteți un input fără spații la margini/gol și verifică golirea controlată plus folosirea ID-ului furnizat.
- Fluxurile de comutare/eliminare/filtrare păstrează identitatea sursei și produc stările vizibile/goale exacte.
- Urmăriți inițializarea stocării și scrierile efectului, inclusiv absența scrierii numai la schimbarea filtrului.
- Inspectează relațiile componentelor/semantice randate și interdicțiile din sursă.

### Verificări de regresie

- Compilarea Vite de producție reușește.
- Mai multe instanțe ale aplicației cu stocare separată nu partajează stare/listenere.
- Formele stocate invalide nu provoacă oprirea aplicației, iar eșecurile stocării sunt expuse prin politica adaptorului sigur furnizat.
- În sursa obiectivului nu apar API-uri DOM manuale, metode care modifică tablouri sau chei-index instabile.

## Notă pentru autor — pregătirea variantei inițiale

După validarea referinței, copiază referința și elimină numai implementarea arborelui de componente/stării/evenimentelor/efectului React din `src/App.jsx`. Păstrează importurile, contractul proprietăților, o componentă focalizată indisponibilă și TODO-uri care numesc comportamentele, dar nu structura codului.

Infrastructura/compilarea Vite, dovezile vanilla, datele de test și baza independentă de router rămân funcționale. Verificările obiectivului React eșuează la limita documentată a interfeței indisponibile. Nicio implementare completă a componentelor nu rămâne în comentarii, instantanee, ieșiri generate sau fișiere alternative.

## Sarcină Codex

> Reconstruiește lista de lecturi furnizată în React. Păstrează adăugarea, filtrarea și actualizarea, păstrează starea în componenta potrivită și sincronizează datele cerute cu stocarea. Modifică doar `src/App.jsx`. Citește această specificație și codul furnizat înainte să editezi. Respectă comportamentul cerut, intrările/ieșirile exacte și restricțiile de aici. Păstrează testele și infrastructura furnizată. Rulează verificările documentate și spune ce trece, ce eșuează și de ce. Explică modificările ca să le pot inspecta.

## Sarcină de depanare/extensie

- Adaugă `filter` la dependențele efectului de persistență în timp ce scrieți numai elementele. Observă sau urmăriți scrierea inutilă în stocare, explică proprietatea dependențelor și restabilește dependența minimă.

## În afara domeniului

- API-uri de rețea, rutare, autentificare, stare globală, reducer, tragere și plasare, actualizări optimiste sau reproiectare vizuală.
