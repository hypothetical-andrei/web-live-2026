# Proiectul 01 — API pentru sarcini în memorie

## Ce ai de făcut

Implementează rutele API pentru listarea, crearea, citirea, modificarea și ștergerea sarcinilor. Validează cererile și folosește depozitul de date furnizat.

Lucrează în `student/`. Modifică doar `src/task-router.js`.

## Cum lucrezi

Pornește aplicația studentului și examinează `/`, `/health`, ordinea montării, metodele repository-ului și testele categorizate. Scrie un tabel metodă/cale/stare înainte să editezi.

Transmite-i lui Codex sarcina din `spec.md`. Analizează diferența pentru schimbări în afara routerului, validare prin truthiness, câmpuri necunoscute acceptate, `return` absent după răspunsuri, JSON accidental cu `204` sau erori neașteptate înghițite local.

## Verifică rezultatul

- Toate verificările categorizate trec.
- Listarea, crearea, obținerea, actualizarea și ștergerea respectă contractele exacte.
- Erorile pentru media/corp invalid și resursă absentă folosesc anvelopa standard.
- O creare reală arată `201` și `Location`; ștergerea nu are corp.
- Se schimbă doar `src/task-router.js`.

## Sarcină de depanare

Elimină un `return` după un răspuns de validare, reproduce continuarea nedorită și urmărește dacă apare un al doilea răspuns sau apel de repository. Restabilește cea mai mică remediere.

## Ce ar trebui să poți explica

- Montarea routerului Express și potrivirea metodă/cale.
- Validarea limitei față de responsabilitatea repository-ului.
- Starea, `Location`, anvelopele de succes și semantica `204`.
- Transmiterea eșecurilor neașteptate către tratarea centralizată.
