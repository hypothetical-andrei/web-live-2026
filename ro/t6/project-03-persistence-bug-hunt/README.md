# Proiectul 03 — Depanarea serviciului de rezervări

## Ce ai de făcut

Găsește și repară greșelile modelului și salvării rezervărilor. Aplică restricțiile cerute, așteaptă operațiile bazei de date și întoarce rezultatele cerute fără să înlocuiești rutele HTTP.

Lucrează în `student/`. Modifică doar `src/models/reservation.js`, `src/reservation-store.js`.

## Scop

Investighează un serviciu de rezervări care rulează, dar nu impune consecvent cerințele. Ai primit cod obișnuit de aplicație; localizează defectele prin comportament și repară modelul și stocarea.

## Investigație

Citește `spec.md`, pornește serviciul și compară rezultatele așteptate cu cele observate. Înregistrează fiecare cerere, statusul/corpul răspunsului și rândurile rămase în bază. Include intrări obișnuite, valori invalide, spații marginale și coduri repetate. Baza în memorie se resetează la repornire.

Verifică modelul direct, nu doar endpointurile HTTP: ruta nu este singura sursă posibilă de scrieri. Urmărește apelul de la rută prin creare până la valoarea sau eroarea returnată. Deosebește datele invalide, codul duplicat și eroarea neașteptată a bazei.

Construiește un tabel de dovezi înainte să ceri modificări. Poți folosi testele pentru a restrânge investigația, dar explică singur comportamentul observat. Dă-i lui Codex sarcina din `spec.md` și dovezile tale; examinează modificările propuse, fără să consideri diagnosticul său autoritar.

## Repară și verifică

Modifică doar `src/models/reservation.js` și `src/reservation-store.js`. Păstrează tratarea HTTP, conexiunea, erorile comune, dependențele și testele. Repară codul real al aplicației; nu adăuga model alternativ sau fallback.

Rulează verificările de bază, regresie și obiectiv. Repetă probele API și inspectează rândurile. Confirmă lipsa inserării după respingere și succesul unei scrieri valide ulterioare. Explică de ce codul modificat produce comportamentul necesar.

## Finalizat când

Toate verificările trec; rezervările respectă regulile; șirurile stocate sunt normalizate; succesul înseamnă că rândul a fost creat; cererile invalide și duplicate primesc erorile documentate; apelanții primesc date obișnuite, nu instanțe ORM. Diff-ul este limitat la cele două fișiere ale aplicației.
