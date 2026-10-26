# Exemplu de curs — Coloane de carduri care încap automat

## Concept demonstrat

CSS Grid poate alege numărul coloanelor din spațiul disponibil, iar înălțimea cardurilor rămâne determinată de conținut.

## De ce este inclus acest exemplu

Trei carduri și o regulă de aranjare prezintă împachetarea responsive fără să reproducă proiectul de reconstrucție din tutorial.

## Ce trebuie observat

- `auto-fit` creează doar coloanele care încap.
- `minmax(min(100%, 14rem), 1fr)` împiedică pista minimă să depășească un viewport îngust.
- Cardul mai lung crește în loc să taie conținutul.

## Rulare și examinare

Deschide `index.html` și redimensionează viewport-ul peste lățimile de 14rem, 28rem și 42rem.

## Explicație

Browserul construiește aranjarea pornind de la lățimea minimă utilă a cardului și spațiul disponibil. Nu sunt necesare măsurarea viewport-ului prin JavaScript sau o înălțime fixă.

## Variante

- Înlocuiește `auto-fit` cu `auto-fill` și examinează comportamentul pistelor nefolosite.
- Adaugă un card cu un token lung neîntrerupt și decide cui îi revine responsabilitatea împachetării.

## Validare

Validat prin capturi Chromium headless la 360 px și 900 px: grila afișează una, respectiv trei coloane, cu întregul text vizibil.
