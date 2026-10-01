# Proiectul 03 — Sarcină de remediere cu Codex

## Obiectiv

Inspectați trei categorii diferite de defecte HTTP în timp ce reparați două
fișiere delimitate. Serviciul este intenționat executabil, dar greșit în moduri
specifice:

- un endpoint întoarce datele corecte despre indicii, dar tipul greșit de
  `Content-Type`;
- o ramură de validare pornește un răspuns de eroare și apoi se prăbușește
  pentru că execuția continuă după trimiterea headerelor;
- un endpoint întoarce contractul greșit pentru resursa lipsă și trebuie
  normalizat.

Sarcina este diagnostic, remediere țintită și verificare independentă.

## Citiți înainte să modificați

Rulați separat verificările de bază, obiectiv și regresie în `student/`. Apoi
inspectați:

- `legacy-result.js`, care păstrează intenționat descriptorii vechi naivi;
- `normalize-contract.js`, care trebuie să adapteze cazurile legacy delimitate;
- `server.js`, unde ramura de creare invalidă trebuie să se oprească după un
  singur send;
- eșecurile focalizate din teste și răspunsurile reale.

Notați starea, tipul de conținut, headerele relevante și forma corpului pentru
listare, creare invalidă, creare reușită și resursa lipsă. Comparați aceste
observații cu `spec.md` înainte să implicați Codex.

## Folosiți Codex pentru o remediere delimitată

Dați-i lui Codex obiectivul, fișierele numite, restricția de două fișiere și
condiția observabilă „gata când” din `spec.md`. Cereți-i să clasifice defectele
înainte să editeze:

- defect de headere/tip de conținut;
- defect de control al fluxului după send;
- defect de normalizare/formă a corpului.

Respingeți schimbările asupra producătorului vechi, testelor sau setului de
rute și respingeți o rescriere amplă.

Inspectați diff-ul rezultat. O remediere mică este mai ușor de apărat decât un
serviciu regenerat, dar „mic” nu înseamnă automat „corect”: rulați verificările
focalizate și agregate și verificați cu `curl -i` răspunsurile pentru listare,
creare invalidă și resursa lipsă.

## De ce aceste limite sunt utile

Nu orice bug aparține aceluiași loc. Uneori datele sunt deja corecte și doar
antetul public este greșit. Uneori contractul trebuie normalizat la limită.
Uneori problema este controlul fluxului după ce răspunsul a fost deja trimis.
Acest proiect urmărește identificarea acestor limite, nu tratarea fiecărui
eșec ca „rescrie endpointul”.

## Criterii de succes

- Verificările de bază și de regresie rămân verzi înainte de remediere.
- Toate cele patru verificări de obiectiv trec după remediere.
- Diff-ul atinge doar `src/server.js` și `src/normalize-contract.js`.
- Listarea întoarce tip de conținut JSON fără să schimbe payload-ul indiciului.
- Crearea invalidă întoarce `422` și nu strică o cerere ulterioară de stare.
- Resursa lipsă întoarce `404` și anvelopa de eroare a cursului.
- Puteți explica ce corecție aparține headerelor, controlului fluxului și
  normalizării.

## Sarcină de extindere

Scrieți un test care eșuează pentru o operație de ștergere ce trebuie să
întoarcă `204 No Content`. Cereți-i lui Codex cea mai mică extensie coerentă.
Revizuiți-o cu atenție: un răspuns `204` nu trebuie să includă un corp JSON.
Păstrați acest experiment separat de exercițiul canonic finalizat.

## Ce ar trebui să puteți explica

- De ce datele corecte pot face totuși parte dintr-un răspuns HTTP greșit.
- De ce trimiterea unui răspuns este și o limită de control al fluxului.
- Cum diferă o anvelopă publică de eroare de un rezultat intern legacy.
- De ce testele de contract sunt dovezi mai puternice decât aspectul codului.
- Cum împiedică restricțiile o remediere cu IA să devină o rescriere
  necontrolată.
