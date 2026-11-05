# Specificația exercițiului — Depanarea serviciului de rezervări

## Obiectiv de învățare

Găsește și repară greșelile modelului și salvării rezervărilor. Aplică restricțiile cerute, așteaptă operațiile bazei de date și întoarce rezultatele cerute fără să înlocuiești rutele HTTP.

## Context inițial

Ai primit un serviciu Express 5 cu Sequelize și SQLite. Fișierele obișnuite definesc modelul rezervării, conectează baza de date, creează rezervări și expun endpointuri de listare/creare. Serviciul pornește și scrierile obișnuite funcționează, dar cazurile speciale nu respectă cerințele de mai jos. Nu există wrapper de reparare, exemplu nesigur separat sau fallback de compatibilitate.

## Sarcina ta

Găsește și repară greșelile modelului și salvării rezervărilor. Aplică restricțiile cerute, așteaptă operațiile bazei de date și întoarce rezultatele cerute fără să înlocuiești rutele HTTP.

Lucrează în proiectul `student/` furnizat. Modifică doar `src/models/reservation.js`, `src/reservation-store.js`. Cerințele detaliate precizează cazurile, formele datelor și restricțiile pe care trebuie să le respecți. Folosește testele și instrucțiunile de pornire furnizate pentru verificare.

## Comportament așteptat

Rezervările conțin `id`, `code`, `guestName`, `seats` și timestampuri. ID-urile sunt întregi generate.

- Codul este obligatoriu, unic și conține 4–16 litere mari, cifre sau cratime. Elimină spațiile marginale înainte de stocare.
- Numele oaspetelui este obligatoriu și nu poate rămâne gol după eliminarea spațiilor marginale; stochează numele normalizat.
- Numărul locurilor trebuie să fie un întreg între 1 și 8 și nu poate fi null.
- Regulile se aplică atât scrierilor directe prin model, cât și cererilor HTTP. Scrierile invalide și duplicate nu trebuie să insereze un rând.
- `POST /api/reservations` returnează `201`, antetul `Location` și `{ data: reservation }` numai după succesul persistării. `GET /api/reservations` listează rândurile în ordine crescătoare după ID.
- Stocarea returnează valori simple, nu instanțe Sequelize. Acestea trebuie să fie independente de obiectul ORM returnat.
- Datele invalide produc `400` cu codul `reservation_invalid`; codurile duplicate produc `409` cu codul `reservation_exists`. Tipurile comune de eroare furnizate definesc mesajele publice.
- Erorile neașteptate ale bazei păstrează identitatea originală până când tratarea HTTP furnizată raportează un `500` generic; răspunsurile nu expun SQL, căi sau stack trace-uri.
- Conexiunea este închisă la oprire și după teste. Serverul de dezvoltare folosește o bază în memorie, resetată la repornire; persistența în fișier este tratată în Proiectul 1.

## Investigația ta

Rulează serviciul și înregistrează comportamentul așteptat și observat pentru cereri obișnuite, invalide, cu spații marginale și cu cod repetat. Inspectează rândurile după fiecare încercare. Folosește verificări directe ale modelului pentru a stabili dacă regulile există sub stratul HTTP. Urmărește o operație eșuată pentru a vedea cum respingerea ajunge la răspuns.

Repară doar `src/models/reservation.js` și `src/reservation-store.js`. Păstrează rutele, conexiunea, erorile comune, testele și dependențele. Nu adăuga wrappere, modele alternative sau validare exclusiv HTTP pentru a ocoli defectele modelului. Nu primești TODO-uri care marchează reparăile.

## Verificare

- Bază: baza reală se inițializează, rândurile obișnuite pot fi create/listate, pagina și health răspund, iar resursele sunt închise.
- Obiectiv: verificările separate acoperă câmpurile obligatorii, formatul codului, intervalul/întregii pentru locuri, normalizarea, unicitatea, rezultatele simple independente, tratarea asincronă a erorilor cunoscute și răspunsurile publice de validare/conflict.
- Regresie: JSON incorect, rute lipsă, erori interne generice, propagarea erorilor neașteptate și cererile reușite după respingerea unei scrieri rămân funcționale.
- Referință: toate verificările trec. Student: baza și regresiile independente trec; testele de obiectiv expun defectele fără potrivirea textului sursă sau impunerea unei sintaxe de reparare.

## Sarcină pentru Codex

> Găsește și repară greșelile modelului și salvării rezervărilor. Aplică restricțiile cerute, așteaptă operațiile bazei de date și întoarce rezultatele cerute fără să înlocuiești rutele HTTP. Modifică doar `src/models/reservation.js`, `src/reservation-store.js`. Citește această specificație și codul furnizat înainte să editezi. Respectă comportamentul cerut, intrările/ieșirile exacte și restricțiile de aici. Păstrează testele și infrastructura furnizată. Rulează verificările documentate și spune ce trece, ce eșuează și de ce. Explică modificările ca să le pot inspecta.

## Depanare / extindere

După reparare, repetă o cerere cu cod duplicat, apoi creează o altă rezervare validă. Verifică lipsa inserării duplicate și funcționarea scrierilor ulterioare.

## Notă pentru autor — pregătirea variantei inițiale

Implementează și validează mai întâi referința. Copiaz-o, apoi elimină restricțiile și normalizarea din fișierul modelului real și înlocuiește crearea așteptată și returnarea valorii simple cu returnarea promisiunii brute în handlerul existent al erorilor din store. Păstrează erorile comune funcționale și documentează diferențele celor două fișiere în derivation.md. Nu marca ramurile defecte cu indicii de soluție.

## În afara domeniului

Asocieri, tranzacții, reguli de disponibilitate, autentificare, migrări, deployment și persistență în fișier la repornire.
