# Proiectul 01 — API de notițe persistente

## Ce ai de făcut

Implementează interfața furnizată pentru notițe folosind Sequelize și SQLite. Salvează modificările înainte să raportezi succesul, păstrează notițele între reporniri și închide baza de date la final.

Lucrează în `student/`. Modifică doar `src/note-store.js`.

## Cum lucrezi

Inspectează interfața depozitului injectat, serializatorul, fixture-ul inițial și testele ciclului de viață. Desenează conexiune → model → inițializare/resetare/populare → CRUD → închidere înainte de editare.

Dă-i lui Codex sarcina din `spec.md`. Respinge cuplarea cu Express, sincronizarea forțată la pornirea normală, apelurile fără await, instanțele de model returnate, fișierele bazei de date comise sau modificările din afara depozitului.

## Verifică rezultatul

- Toate verificările pe categorii și auditul trec.
- Metadatele, valorile implicite și normalizarea titlului respectă contractul.
- CRUD întoarce rezultate detașate și deterministe.
- Resetarea și popularea sunt reproductibile, iar inițializarea normală nu duplică sau șterge.
- O notiță dintr-un fișier supraviețuiește închiderii și redeschiderii.
- Se modifică numai `src/note-store.js`.

## Sarcină de depanare

Elimină `await` dintr-o creare aflată într-o limită `catch`. Declanșează validarea modelului și identifică unde scapă respingerea, apoi restabilește responsabilitatea explicită a soluționării.

## Ce ar trebui să poți explica

- Responsabilitățile conexiunii, modelului și depozitului.
- Constrângerile față de validarea rutei.
- Ciclul resetare, populare, repornire și închidere.
- Importanța rezultatelor detașate și a scrierilor așteptate.
