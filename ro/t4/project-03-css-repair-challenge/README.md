# Proiectul 03 — Provocare de remediere CSS

## Obiectiv

Diagnostichează o foaie de stil generată și păstrată, apoi restabilește fluxul, aranjarea responsive, culorile lizibile ale mesajului, înălțimea intrinsecă a cardurilor și focusul vizibil printr-un singur strat țintit al cascadei.

## Flux de lucru

Rulează pagina ta inițială la 390 și 1024 px înainte să editezi. Folosește stilurile calculate pentru a urmări fiecare defect până la declarația veche și ordinea straturilor. Clasifică-l drept problemă de cascadă, flux, dimensionare sau focus.

Transmite-i lui Codex sarcina delimitată din `spec.md`. Respinge editările în afara lui `public/repair.css`, escaladarea selectorilor, `!important`, overflow ascuns, înălțimi fixe sau o foaie înlocuitoare copiată. Verifică modul în care fiecare declarație propusă tratează o cauză observată.

## Criterii de reușită

- Verificările de bază, obiectiv și regresie trec.
- Navigarea rămâne în flux și se împachetează deasupra conținutului.
- Conținutul principal are o coloană sub 48rem și Grid sidebar/conținut deasupra.
- Culorile mesajului, focusul vizibil și înălțimea intrinsecă respectă contractul.
- Doar `public/repair.css` diferă față de starea furnizată.

## Sarcină de depanare

Plasează temporar stratul de remediere înaintea celui vechi. Examinează valorile calculate și explică de ce ordinea straturilor se rezolvă înaintea specificității. Restabilește ordinea canonică și rerulează verificările.

## Ce ar trebui să poți explica

- Straturile cascadei față de specificitate.
- Fluxul normal față de poziționarea fixă.
- Înălțimea intrinsecă și de ce tăierea nu este remediere.
- Breakpoint-uri determinate de conținut și dimensionarea pistelor Grid.
- De ce vizibilitatea focusului este comportament observabil.
