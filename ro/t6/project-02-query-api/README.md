# Proiectul 02 — API de interogare

## Ce ai de făcut

Validează parametrii interogării API și transformă valorile acceptate în opțiuni Sequelize. Asigură filtrarea, căutarea, sortarea, selecția câmpurilor și limitele de rezultate specificate.

Lucrează în `student/`. Modifică doar `src/note-query.js`.

## Cum lucrezi

Inspectează rândurile inițiale și scrie ID-urile așteptate pentru fiecare filtrare și sortare înainte de editare. Separă validarea de construirea opțiunilor și folosește limita de eroare furnizată.

Dă-i lui Codex sarcina din `spec.md`. Verifică SQL brut, câmpuri sau direcții arbitrare, coerciție booleană truthy, interpretarea wildcard-urilor, lipsa departajării prin ID, mutarea interogării sau procesarea ulterioară în memorie.

## Verifică rezultatul

- Toate verificările pe categorii și auditul trec.
- Filtrele owner/archived/search se combină cu semantică AND.
- Modurile de sortare sunt permise explicit și deterministe.
- Proiecția include mereu ID-ul și respinge câmpuri invalide sau duplicate.
- Datele invalide nu execută interogarea și întorc `400 invalid_query`.
- Se modifică numai `src/note-query.js`.

## Sarcină de depanare

Elimină departajarea prin ID pentru valori `updatedAt` egale. Explică de ce sortarea primară nu completează contractul, apoi restabilește ordinea deterministă explicită.

## Ce ar trebui să poți explica

- Limbajul public de interogare față de opțiunile ORM.
- Construirea sigură a operatorilor și expresiilor.
- Proiecția și ordinea deterministă.
- De ce respingerea trebuie să aibă loc înaintea execuției în bază.
