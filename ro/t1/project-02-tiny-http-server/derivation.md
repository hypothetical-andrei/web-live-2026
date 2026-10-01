# Student Variant Derivation — Tiny HTTP Server

## Reference source

`reference/`, after every reference check recorded in `validation.md` passed on
2026-09-21.

## Removed or modified items

### `student/README.md`

- **Change:** Instructiunile de testare manuala au fost reformulate astfel
  incat cererea bazata pe cale sa fie prezentata ca munca lipsa a studentului,
  nu ca comportament deja disponibil.
- **Reason:** Ghidul operational pentru student trebuie sa reflecte starea
  derivata incompleta fara sa schimbe exemplele din jur pentru fisier/query/corp.
- **Expected observable consequence:** Pasii documentati cu `curl` si Thunder
  Client acopera in continuare cereri pentru fisier, query, cale si corp, dar
  ruta bazata pe cale este descrisa clar ca lucru de finalizat.

### `student/src/application-handler.js`

- **Change:** A fost eliminata numai ramura `GET /api/greetings/<name>`,
  lasand intacte importurile plus rutele functionale pentru fisier, query si
  corp.
- **Reason:** Responsabilitatea specifica obiectivului este adaugarea unei
  singure rute bazate pe cale prin comparatie cu exemplele furnizate pentru
  query/corp.
- **Learning objective:** Distingerea dintre livrarea de fisiere, procesarea
  query-ului, procesarea caii si procesarea corpului intr-un singur server
  foarte mic.
- **Expected observable consequence:** rutele pentru fisiere,
  `/api/greetings?name=...` si `/api/echo` functioneaza in continuare, iar
  `/api/greetings/<name>` ajunge la `404`.
- **Expected objective check:** fail.

No other file was intentionally changed.

## Unchanged invariants

- dependency set and lock file remain equivalent;
- project structure remains parallel;
- server startup, health route, static-file handling, fallback handling,
  utilities, and tests remain intact;
- unrelated working behavior remains intact.

## Expected student-state checks

### Must pass

- clean `npm install`;
- `npm run test:baseline` (2 checks);
- `npm run test:regression` (4 checks);
- documented server startup.

### Must fail or remain incomplete

- `npm run test:objective` fails because the missing path route returns the
  supplied fallback response.
- Aggregate `npm test` fails only in objective tests.

## Leakage review

Ramura eliminata pentru ruta bazata pe cale lipseste din arborele studentului.
Testele descriu doar contracte HTTP observabile si nu contin implementarea
duplicata. Documentatia si textul TODO indica ruta lipsa fara sa dezvaluie
codul exact.
