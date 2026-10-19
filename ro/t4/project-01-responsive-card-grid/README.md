# Proiectul 01 — Reconstrucție responsive cu carduri/Grid

## Obiectiv

Reconstruiește un catalog responsive cu 1/2/4 coloane din HTML semantic fix și `visual-spec.md`.

## Flux de lucru

Examinează pagina nestilizată din `student/` la 320, 768 și 1280 px. Identifică separat dimensionarea exterioară, aranjarea colecției, interiorul cardurilor, depășirea intrinsecă, focusul și mișcarea. Folosește stilurile calculate și suprapunerile Grid, nu presupuneri din aspect.

Transmite-i lui Codex sarcina delimitată din `spec.md`. Analizează propunerea pentru lățimi fixe, ascunderea overflow-ului, specificitate excesivă, aranjare JavaScript, focus absent și breakpoint-uri nepotrivite. Compară toate viewport-urile după fiecare schimbare importantă.

## Criterii de reușită

- Verificările automate trec.
- Aranjările afișează 1/2/4 coloane la lățimile indicate, fără depășire orizontală.
- Conținutul lung se împachetează, iar acțiunile se aliniază.
- Focusul prin tastatură rămâne vizibil, iar mișcarea redusă dezactivează tranzițiile.
- Se schimbă doar `public/styles.css`.

## Sarcină de depanare

Introdu o etichetă lungă fără întreruperi și reproduce depășirea pe ecran îngust. Cere-i lui Codex diagnosticul dimensionării intrinseci, apoi verifică faptul că remedierea împachetează conținutul, nu îl ascunde.

## Ce ar trebui să poți explica

- Cascada și valorile moștenite.
- Dimensionarea content-box/border-box.
- Responsabilitățile Grid față de Flexbox.
- Dimensiunea minimă intrinsecă și breakpoint-urile responsive.
