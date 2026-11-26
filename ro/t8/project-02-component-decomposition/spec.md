# Specificația exercițiului — Descompunerea componentelor

## Unitate

Unitatea 08 — React cu Vite

## Obiectiv de învățare

Împarte panoul mare furnizat în componentele mai mici cerute. Transmite datele și funcțiile prin props și păstrează comportamentul existent al paginii.

## De ce există acest exercițiu

Codul React generat de AI funcționează adesea concentrând modelarea datelor, secțiunile interfeței, handlerele de evenimente și marcajul repetat într-o singură componentă. Trebuie să identifice responsabilitățile și separările, apoi să demonstreze că descompunerea îmbunătățește posibilitatea de revizuire fără să schimbe produsul pe ascuns.

## Cerințe preliminare

- Componentele, proprietățile, starea locală, evenimentele, colecțiile și inputul controlat din Proiectul 1.
- Transformări de tablouri/obiecte și HTML semantic.

## Context inițial

Ai primit un proiect Vite React care conține:

- `evidence/OversizedWorkshopDashboard.jsx`, o componentă generată, păstrată și executabilă, cu filtrarea și selectarea atelierelor, rezumatul capacității, formular de înregistrare, lista participanților și comportament de eliminare;
- funcții deterministe pentru date/ID-uri, CSS, intrarea aplicației, nume de accesibilitate și verificări de caracterizare furnizate;
- o țintă de referință compusă din `src/WorkshopDashboard.jsx` și componentele din `src/components/`.

Exemplul păstrat nu este editat. Varianta inițială îl încorporează pentru a oferi comportament funcțional; după descompunere, doar infrastructura de comparație îl randează. Ținta deține comportamentul canonic și primește proprietățile `initialWorkshops` și `createRegistrationId`.

## Sarcina ta

Împarte panoul mare furnizat în componentele mai mici cerute. Transmite datele și funcțiile prin props și păstrează comportamentul existent al paginii.

Lucrează în proiectul `student/` furnizat. Modifică doar `src/WorkshopDashboard.jsx`, `src/components/*.jsx`. Cerințele detaliate precizează cazurile, formele datelor și restricțiile pe care trebuie să le respecți. Folosește testele și instrucțiunile de pornire furnizate pentru verificare.

## Comportament necesar

- Descompuneți ținta în componentele `WorkshopToolbar`, `CapacitySummary`, `RegistrationForm`, `AttendeeList` și `AttendeeRow`, plus `WorkshopDashboard`, care deține starea.
- Păstrează selecția atelierului, înregistrările și câmpurile controlate ale formularului în cel mai apropiat proprietar comun al stării; calculează atelierul selectat, participanții vizibili, locurile ocupate și locurile rămase în timpul randării, în loc să le duplicați în stare/efecte.
- Transmite proprietăți și callback-uri explicite minime; componentele copil nu trebuie să importe datele de test sau să acceseze starea părintelui.
- Păstrează exact comportamentul caracterizat: filtrarea/selectarea atelierului, afișarea capacității rămase, înregistrarea validă, respingerea valorilor goale/depășirii capacității, golirea formularului după reușită, ordinea participanților și eliminarea.
- Păstrează titlurile semantice, etichetele, relațiile tabel/listă, anunțarea stării/erorii, numele butoanelor și operarea din tastatură.
- Folosește actualizări imuabile și ID-uri/chei stabile pentru înregistrări.
- Evită împrăștierea proprietăților, contextul, starea externă, hook-urile personalizate, memoizarea sau elementele de încadrare generice ale unui sistem de design pentru acest arbore intenționat mic.

## Constrângeri

- JavaScript JSX, React + Vite, ESM, stilurile/testele/datele furnizate și fișierul lock fixat.
- Păstrează `evidence/OversizedWorkshopDashboard.jsx` identic octet cu octet.
- Schimbările obiectivului sunt limitate la `src/WorkshopDashboard.jsx` și `src/components/*.jsx`; nu schimba intrarea, datele de test, CSS-ul, testele, fișierele pachetului sau dovezile.
- Componentele pot rămâne intenționat mici; nu sunt necesare elemente de încadrare cu un singur scop care nu adaugă nicio limită semantică sau de stare.

## Criterii observabile de finalizare

- Fluxurile de caracterizare produc același DOM public și aceleași tranziții de stare pentru dovada supradimensionată și ținta descompusă.
- Inventarul componentelor și importurile arată cei cinci copii numiți și un proprietar clar al stării.
- Datele derivate despre capacitate/selecție nu sunt sincronizate prin efecte sau stare duplicată.
- Trimiterile invalide nu modifica înregistrările; adăugarea/eliminarea reușită actualizează numărătorile și rândurile exacte.
- Compilarea, verificările clasificate, auditul și testul minimal în browser trec; fișierele-obiectiv documentate reprezintă întreaga diferență.

## Plan de validare (pentru autorii cursului)

### Verificări de bază

- Dovada supradimensionată păstrată trece verificările de caracterizare cu datele de test, CSS-ul, funcția pentru ID-uri, infrastructura Vite și mediul de testare.

### Verificările obiectivului

- Inspectează inventarul componentelor/graful importurilor și responsabilitățile explicite ale proprietăților.
- Rulează fluxurile de filtrare/selectare/capacitate/formular/adăugare/eliminare asupra țintei și dovezii și compară DOM-ul observabil normalizat.
- Verifică proprietatea stării, valorile derivate la randare, câmpurile controlate, actualizările imuabile, cheile stabile și comportamentul erorii/stării.
- Verifică prin randări focalizate că elementele copil funcționează din proprietăți/callback-uri.

### Verificări de regresie

- Compilarea Vite de producție reușește și ambele infrastructuri de comparație se randează.
- Schimbarea atelierelor după adăugare/eliminare păstrează înregistrările fiecărui atelier și recalculează capacitatea.
- Codul obiectivului nu conține context/reducer/efect/memo/hook personalizat, importuri ale datelor de test în copii, împrăștierea proprietăților, modificare directă sau componenta supradimensionată copiată.
- Suma de control a dovezii păstrate rămâne neschimbată.

## Notă pentru autor — pregătirea variantei inițiale

După validarea referinței, copiază referința, elimină cele cinci fișiere-obiectiv ale componentelor și înlocuiește `src/WorkshopDashboard.jsx` cu un mic adaptor care randează dovada supradimensionată păstrată. Versiunea inițială rămâne complet executabilă și caracterizată comportamental, dar verificările inventarului/descompunerii componentelor-țintă eșuează.

`derivation.md` documentează fișierele eliminate și schimbarea adaptorului. Dovada supradimensionată este o intrare explicită pentru refactorizare, nu o soluție descompusă divulgată; nicio implementare eliminată a componentelor nu rămâne în altă parte.

## Sarcină Codex

> Împarte panoul mare furnizat în componentele mai mici cerute. Transmite datele și funcțiile prin props și păstrează comportamentul existent al paginii. Modifică doar `src/WorkshopDashboard.jsx`, `src/components/*.jsx`. Citește această specificație și codul furnizat înainte să editezi. Respectă comportamentul cerut, intrările/ieșirile exacte și restricțiile de aici. Păstrează testele și infrastructura furnizată. Rulează verificările documentate și spune ce trece, ce eșuează și de ce. Explică modificările ca să le pot inspecta.

## Sarcină de depanare/extensie

- Mută `remainingSeats` în stare și sincronizează-l printr-un efect. Declanșați fluxurile de adăugare/eliminare/schimbare a atelierului, identificați sursa de adevăr redundantă și readuceți valoarea la un calcul efectuat în timpul randării.

## În afara domeniului

- Persistență în rețea, rute, stare globală, optimizarea performanței, sisteme de design reutilizabile, autentificare sau funcționalități noi ale panoului.
