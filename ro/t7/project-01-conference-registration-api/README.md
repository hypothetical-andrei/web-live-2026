# Proiectul 01 — API de înscriere la conferință

## Ce ai de făcut

Definește în Sequelize relațiile dintre conferințe, sesiuni, participanți și înscrieri. Implementează citirile cerute păstrând cheile străine, câmpurile înscrierii și numărul de interogări cerut.

Lucrează în `student/`. Modifică doar `src/conference-model.js`.

## Cum lucrezi

Inspectează rândurile inițiale, forma serializatorului, erorile și verificările furnizate. Desenează tabelele, cheile, cardinalitățile, aliasurile și atributele legăturii înainte de editare. Apoi urmărește o listare de la metadate la SELECT-ul generat și JSON-ul public.

Dă-i lui Codex sarcina din `spec.md`. Respinge valorile implicite ghicite, cheile through inversate, join-urile manuale, buclele N+1, SQL-ul brut, cuplarea cu ruta sau modificările din afara fișierului obiectivului.

## Verifică rezultatul

- Toate verificările referinței și auditul trec.
- Cheile externe, aliasurile, modelul through, unicitatea, validarea și cascade respectă contractul.
- O interogare eager delimitată întoarce determinist sesiunile, participanții și datele legăturii.
- Înscrierea întoarce date detașate și clasifică exact absența și duplicatul.
- Numai `src/conference-model.js` diferă de versiunea inițială.

## Sarcină de depanare

Inversează `foreignKey` și `otherKey` pe o direcție mulți-la-mulți. Inspectează metadatele sau SQL-ul, explică necesitatea acordului între direcții, apoi restabilește maparea simetrică.

## Ce ar trebui să poți explica

- Ce tabel deține fiecare cheie externă și de ce.
- De ce atributele înscrierii aparțin legăturii.
- Interacțiunea aliasurilor eager, atributelor, ordinii și numărului de instrucțiuni.
- De ce erorile de persistență rămân separate de stările HTTP.
