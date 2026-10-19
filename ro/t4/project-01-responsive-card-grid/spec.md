# Specificația exercițiului — Reconstrucție responsive cu carduri/Grid

## Unitate

Unitatea 04 — HTML, CSS, interfețe responsive și accesibilitate

## Obiectiv de învățare

Reconstruiește o interfață responsive cu carduri din criterii vizuale și de aranjare explicite, folosind cascada, modelul cutiei, Grid, Flexbox și două breakpoint-uri specificate.

## De ce există acest exercițiu

CSS se învață cel mai bine ca sistem de constrângeri, nu ca declarații izolate. Markup-ul semantic fix permite analizarea spațiului disponibil, dimensionării intrinseci, alinierii și cascadei prin compararea aranjărilor observabile la lățimi indicate.

## Cerințe preliminare

- Instrumentele de dezvoltare ale browserului și proiectele statice din Unitatea 3.
- Familiaritate de bază cu elemente HTML și selectori.

## Context inițial

Ai primit HTML semantic pentru antetul catalogului, controale de filtrare și patru carduri; conținut fix; server static fără dependențe; `visual-spec.md`; verificări și `public/styles.css` incomplet. HTML-ul nu trebuie restructurat.

## Comportament necesar

- Dimensionare globală border-box și font de sistem lizibil; corpul nu depășește orizontal la 320 px.
- Conținut centrat cu lățime maximă `72rem`, padding și contrast vizibil al fundalului.
- Antet Flexbox care se împachetează sigur și aliniază titlul/filtrele cu spațiere consecventă.
- Lista de carduri folosește CSS Grid: o coloană sub 40rem, două de la 40rem și patru de la 64rem.
- Cardurile folosesc padding egal, bordură/rază și coloană flex, astfel încât acțiunea să se alinieze jos chiar pentru descrieri diferite.
- Zona media păstrează raportul 16/9 prin CSS, fără înălțime fixă în pixeli.
- Legăturile/controalele cu `focus-visible` au contur clar; hover-ul nu elimină focusul.
- La `prefers-reduced-motion: reduce`, tranzițiile sunt dezactivate.

## Restricții

- Modifică doar `public/styles.css`.
- Folosește Grid pentru colecție și Flexbox în card/antet unde este potrivit.
- Fără framework-uri, preprocesoare, măsurători JavaScript, poziționare absolută pentru aranjarea principală sau lățimi fixe ale cardurilor.
- Nu ascunde overflow-ul pentru a masca un defect.
- Folosește proprietăți personalizate cel puțin pentru culori, spațiere și rază.

## Criterii observabile de finalizare

- La 320 px: o coloană lizibilă și fără derulare orizontală.
- La 768 px: două coloane cu lățime disponibilă egală.
- La 1280 px: patru coloane în containerul centrat cu lățime maximă.
- Titlurile lungi se împachetează fără să împingă controalele; acțiunile se aliniază pe rând.
- Focusul prin tastatură este vizibil, iar emularea mișcării reduse elimină tranzițiile.
- Verificările automate ale sursei/structurii trec.

## Plan de validare

### Verificări de bază

- HTML-ul semantic conține ierarhia header/main/form/list/article și întregul conținut fix.
- Serverul static pornește și servește HTML/CSS.

### Verificări de obiectiv

- Foaia declară border-box, token-uri personalizate, container centrat, antet/interior flex, colecție grid, raport de aspect și breakpoint-urile exacte 40rem/64rem.
- Declarațiile Grid implementează stările 1/2/4.
- Există reguli pentru focus vizibil și mișcare redusă.

### Verificări de regresie

- Foaia nu conține `overflow-x: hidden`, poziționare absolută principală sau lățime fixă de card.
- HTML-ul este neschimbat și fără stil inline.
- Acoladele CSS sunt echilibrate și toate proprietățile personalizate folosite sunt definite.

### Verificări în browser

- Chrome headless măsoară 1/2/4 coloane Grid calculate la 320/768/1280 px, componentele Flexbox, depășirea orizontală și conturul linkului focalizat.

## Sarcina ta

Trebuie să implementezi stilurile lipsă în `public/styles.css`. Fișierul inițial conține câteva proprietăți personalizate și un TODO. HTML-ul, specificația vizuală, serverul și testele sunt furnizate. Pagina rulează, dar nu îndeplinește încă cerințele de aspect; completează CSS-ul și verifică toate cele trei lățimi specificate.

## Sarcină pentru Codex

> Citește `visual-spec.md`, HTML-ul semantic și verificările CSS. Implementează numai `public/styles.css` cu proprietăți personalizate, Grid pentru 1/2/4 coloane la breakpoint-urile exacte, Flexbox pentru aliniere, dimensionare intrinsecă, focus vizibil și mișcare redusă. Nu schimba HTML-ul, nu adăuga dependențe, nu ascunde overflow-ul și nu folosi lățimi fixe. Finalizat când verificările trec, iar examinarea la 320/768/1280 px corespunde specificației. Explică fiecare constrângere înainte să editezi.

## Sarcină de depanare/extindere

- Adaugă o etichetă de produs neobișnuit de lungă, reproduce depășirea la 320 px și cere-i lui Codex o remediere țintită a dimensionării intrinseci. Verifică să nu ascundă conținutul sau să strice aranjarea largă.

## În afara domeniului exercițiului

- Framework-uri CSS, container queries, responsive prin JavaScript, optimizarea imaginilor, mod întunecat sau editarea conținutului.
