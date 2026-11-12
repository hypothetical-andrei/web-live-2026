# Proiectul 03 — Reproiectarea API-ului de înscriere

## Ce ai de făcut

Înlocuiește rutele de înscriere bazate pe acțiuni cu URL-urile de resurse specificate. Validează filtrele și paginarea și asigură rezultatul cerut pentru cererile repetate asupra aceleiași înscrieri.

Lucrează în `student/`. Modifică doar `src/registration-router.js`.

## Cum lucrezi

Inventariați rutele-acțiune naive nemontate, apoi inspectează rezultatele serviciului, montarea aplicației, erorile și verificările. Scrieți un tabel metodă–URL–date–stare înainte de modificări.

Dă-i lui Codex sarcina din `spec.md`. Respinge aliasurile-acțiune, identitatea din body, transmiterea arbitrară a query-ului, expunerea rezultatelor interne, dependențele ORM, remontarea sau editarea altui fișier.

## Verifică rezultatul

- Toate verificările referinței și auditul trec.
- Inventarul conține numai GET colecție, PUT membru și DELETE membru.
- Validarea filtrului și paginii respinge datele invalide înaintea serviciului.
- PUT creat/repetat/actualizat și DELETE repetat expun exact stările, locația și anvelopele.
- Erorile de domeniu sunt stabile, iar cele neașteptate sunt igienizate centralizat.

## Sarcină de depanare

Repetă același PUT presupunând pierderea primului răspuns. Verifică existența unei singure înscrieri și păstrarea lui registeredAt. Repetă DELETE și verifică absența înscrierii. Explică de ce statusurile pot diferi, dar starea intenționată rămâne aceeași.

## Ce ar trebui să poți explica

- De ce calea exprimă identitatea înscrierii.
- Cum PUT și DELETE susțin reîncercările.
- De ce query-ul necesită gramatică închisă și ordine deterministă.
- Când ajută domeniul imbricat și când este mai clară o resursă de nivel superior.
