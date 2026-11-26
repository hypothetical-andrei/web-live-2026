# Proiectul 01 — Coada de lectură de la vanilla la React

## Ce ai de făcut

Reconstruiește lista de lecturi furnizată în React. Păstrează adăugarea, filtrarea și actualizarea, păstrează starea în componenta potrivită și sincronizează datele cerute cu stocarea.

Lucrează în `student/`. Modifică doar `src/App.jsx`.

## Cum lucrezi

Rulează și inspectează mai întâi dovezile vanilla. Notează starea care supraviețuiește evenimentelor, fiecare acțiune a utilizatorului, numele accesibil, starea randată și punctul de persistență. Apoi inspectează datele de test, adaptorul sigur de stocare, contractul proprietăților și verificările clasificate.

Dă Codex sarcina din `spec.md`. Respinge API-urile DOM manuale, modificarea directă, cheile-index, starea filtrată duplicată, scrierile în stocare declanșate de filtru, dependențele noi sau editările din afara `src/App.jsx`.

## Verifică rezultatul

- Toate verificările de referință clasificate, compilarea, auditul și testul minimal în browser trec.
- Stocarea validă inițializează o singură dată; formele invalide folosesc sigur valoarea implicită.
- Comportamentele de adăugare/comutare/eliminare/filtrare/numărare/stare goală corespund aplicației vanilla.
- Inputul controlat, ID-urile/cheile stabile și înlocuirile imuabile sunt vizibile în diferențe.
- Un singur efect sincronizează elementele complete, nu interfața derivată din filtru.

## Sarcină de depanare

Adaugă `filter` la dependențele efectului de persistență. Schimbați numai filtrul, observă scrierea inutilă, explică de ce efectul deține elementele, nu vederile, și restabilește dependența minimă.

## Ce ar trebui să poți explica

- Cum se mapează la React fiecare variabilă/listener/operație de randare vanilla.
- Proprietățile, starea, valorile derivate și efectele drept categorii distincte de proprietate.
- De ce contează înlocuirea imuabilă și cheile stabile.
- De ce compilarea Vite și comportamentul din browser sunt dovezi distincte.
