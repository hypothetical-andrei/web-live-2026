# Proiectul 02 — Formular accesibil

## Obiectiv

Implementează validare deterministă care combină controale semantice, mesaje lângă câmpuri, un sumar focalizabil și trimitere validă predictibilă.

## Flux de lucru

Examinează formularul furnizat prin tastatură înainte să editezi. Trimite date goale și observă comportamentul absent. Citește cum adaptorul mapează un obiect de erori la `aria-invalid`, regiuni inline, legături în sumar și focus.

Transmite-i lui Codex sarcina delimitată din `spec.md`. Analizează normalizarea, ordinea inserării erorilor, separarea validării de prezentare, lipsa trimiterii când datele sunt invalide și exact o trimitere validă. Respinge schimbările markup-ului sau adaptorului care ocolesc contractul funcției.

## Criterii de reușită

- Toate verificările trec.
- Trimiterea goală focalizează un sumar de erori populat.
- Legăturile sumarului și erorile inline identifică controalele.
- Intrarea validă corectată elimină erorile și se trimite o singură dată.
- Se schimbă doar `public/form-validation.js`.

## Sarcină de depanare

Elimină focusul sumarului invalid și finalizează corectarea folosind doar tastatura. Măsoară navigarea suplimentară, apoi restabilește cel mai mic apel de gestionare a focusului și verifică să nu ruleze la succes.

## Ce ar trebui să poți explica

- Nume și descrieri accesibile.
- Gruparea prin fieldset/legend.
- Erori inline plus navigarea prin sumar.
- Gestionarea focusului după o acțiune eșuată.
