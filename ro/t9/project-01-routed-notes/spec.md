# Specificația exercițiului — Aplicație de notițe cu rutare

## Unitate

Unitatea 09 — Rutare, formulare și React full-stack

## Obiectiv de învățare

Construiește ecranele pentru lista, detaliile, crearea și editarea notițelor folosind React Router. Identifică notița din URL, validează formularele și tratează notițele lipsă și rutele necunoscute.

## De ce există acest exercițiu

O aplicație SPA nu este un singur ecran ascuns în spatele unor valori booleene locale. URL-urile permit utilizatorilor să navigheze, marcheze, reîmprospăteze, partajeze și folosească istoricul browserului. Trebuie să decidă ce stare aparține URL-ului și ce stare rămâne temporară în formular/interfață înainte de adăugarea sincronizării cu serverul.

## Cerințe preliminare

- Componentele, proprietățile, starea locală, formularele controlate, colecțiile și Vite din Unitatea 08.
- Conceptele despre identitatea/starea resurselor din Unitatea 05.

## Context inițial

Ai primit un proiect React/Vite/React Router cu:

- metodele imuabile furnizate `list`, `get`, `create` și `update` ale `notesStore`, date inițiale, ID-uri deterministe, CSS, intrare/ruter de browser și verificări clasificate;
- `src/NotesApp.jsx` incomplet, care primește `store` și se randează în interiorul ruterului furnizat;
- teste care folosesc `MemoryRouter` pentru a demonstra comportamentul URL-ului/istoricului fără server.

Rutele publice sunt `/notes`, `/notes/new`, `/notes/:noteId` și `/notes/:noteId/edit`. O notiță conține `{ id, title, body }`.

## Sarcina ta

Construiește ecranele pentru lista, detaliile, crearea și editarea notițelor folosind React Router. Identifică notița din URL, validează formularele și tratează notițele lipsă și rutele necunoscute.

Lucrează în proiectul `student/` furnizat. Modifică doar `src/NotesApp.jsx`. Cerințele detaliate precizează cazurile, formele datelor și restricțiile pe care trebuie să le respecți. Folosește testele și instrucțiunile de pornire furnizate pentru verificare.

## Comportament necesar

- Definește rute pentru cele patru stări publice și o pagină universală; `/` redirecționează la `/notes` prin înlocuire în istoric.
- Ruta listei randează notițele drept legături semantice, o stare goală și o legătură `Notiță nouă`.
- Ruta de detaliu derivă `noteId` din `useParams`; randează titlul/corpul plus legăturile `Editează notița` și `Înapoi la notițe` sau o vedere stabilă în aplicație pentru notiță negăsită, fără să arunce o eroare.
- Rutele creare/editare folosesc împreună o singură componentă controlată `NoteForm`; crearea începe goală, editarea se inițializează din notița căii, iar țintele de editare lipsă afișează aceeași vedere „nu a fost găsit”.
- Elimină spațiile din titlu/corp la trimitere; solicită un titlu nevid; afișați o eroare de validare accesibilă fără apelarea depozitului sau navigare.
- Crearea reușită navighează prin înlocuire la noul URL de detaliu; editarea reușită navighează prin înlocuire la URL-ul de detaliu existent.
- Anularea folosește navigare declarativă către starea potrivită de listă/detaliu și nu scrie.
- Înapoi/Înainte ale browserului și inițializarea directă `MemoryRouter` reproduc starea rutei; nu oglindiți ruta sau ID-ul notiței în starea locală.
- Păstrează identitatea notiței în parametrii căii; formularele/corpurile nu pot suprascrie ID-urile.

## Constrângeri

- JavaScript JSX, React 19, React Router, Vite, ESM, depozitul/stilurile/testele furnizate și fișierul lock fixat.
- Implementează numai `src/NotesApp.jsx`; nu edita depozitul, intrarea, datele de test, testele, fișierele pachetului sau CSS-ul.
- Folosește componentele/hook-urile React Router, nu `window.location`, apeluri manuale ale istoricului, expresii regulate pentru rute sau altă dependență de rutare.
- Păstrează datele notițelor sincrone/locale în acest exercițiu; starea serverului apare în Proiectul 2.
- Pentru acest prim ruter nu sunt necesare context, Redux, API-ul loader/action sau abstractizarea unei machete imbricate.

## Criterii observabile de finalizare

- Pornirile directe la fiecare rută randează starea exactă, inclusiv notița lipsă și calea necunoscută.
- Clicurile pe legături plus înapoi/înainte produc URL-urile și conținutul exacte.
- Validarea la creare/editare și rezultatele reușite ale navigării/depozitului sunt deterministe.
- URL-ul este identitatea canonică a rutei/notiței; câmpurile formularului sunt stare locală controlată.
- Compilarea Vite, verificările clasificate, auditul și testul minimal în browser trec; se schimbă numai `src/NotesApp.jsx`.

## Plan de validare (pentru autorii cursului)

### Verificări de bază

- Depozitul/datele furnizate, intrarea browserului, CSS-ul, mediul de testare Vite/React Router și randarea unui copil simulat cunoscut funcționează independent de `NotesApp.jsx`.

### Verificările obiectivului

- Inventarul rutelor și înlocuirea rădăcinii.
- Randări directe pentru listă/detaliu/creare/editare/lipsă/rută universală.
- Legături semantice, parametri, navigarea istoricului și identitate derivată din URL.
- Validarea formularului controlat comun, căi invalide fără apeluri, intrări exacte pentru creare/actualizare, navigare prin înlocuire și comportamentul anulării.
- Verificări ale sursei pentru API-urile ruterului și interdicții.

### Verificări de regresie

- Compilarea de producție reușește.
- Mai multe instanțe de ruter/depozit nu partajează locația, notițele sau starea formularului.
- Editarea după navigarea între ID-uri de notițe reinițializează formularul pentru ținta rutei.
- Sursa obiectivului nu conține rutare prin window/istoric/document, oglindirea ID-ului rutei în stare, stare globală sau HTML nesigur.

## Notă pentru autor — pregătirea variantei inițiale

După validarea referinței, copiați referința și înlocuiți numai `src/NotesApp.jsx` cu o limită de rută indisponibilă care păstrează importurile React Router, semnătura proprietăților și TODO-urile focalizate. Infrastructura Vite/depozit și baza trec; verificările rutei/obiectivului eșuează la interfața indisponibilă documentată.

Niciun arbore alternativ de rute, implementare de pagină, instantaneu sau pachet generat nu rămâne în arborele student.

## Sarcină Codex

> Construiește ecranele pentru lista, detaliile, crearea și editarea notițelor folosind React Router. Identifică notița din URL, validează formularele și tratează notițele lipsă și rutele necunoscute. Modifică doar `src/NotesApp.jsx`. Citește această specificație și codul furnizat înainte să editezi. Respectă comportamentul cerut, intrările/ieșirile exacte și restricțiile de aici. Păstrează testele și infrastructura furnizată. Rulează verificările documentate și spune ce trece, ce eșuează și de ce. Explică modificările ca să le pot inspecta.

## Sarcină de depanare/extensie

- Oglindiți `noteId` în starea componentei și navighează direct între două URL-uri de detaliu/editare. Diagnosticați identitatea învechită, apoi redă parametrilor rutei rolul de unică sursă de adevăr.

## În afara domeniului

- Fetch către server, autentificare, actualizări optimiste, rutere de date, outlet-uri imbricate, stare globală, ștergere sau fallback de implementare.
