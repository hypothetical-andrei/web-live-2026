# Specificația exercițiului — Provocare de remediere CSS

## Unitate

Unitatea 04 — HTML, CSS, interfețe responsive și accesibilitate

## Obiectiv de învățare

Diagnostichează defectele de aranjare și cascadă dintr-o foaie generată păstrată și repară-le printr-un strat mic cu prioritate superioară, nu prin creșterea specificității sau rescrierea markup-ului.

## Context inițial

Ai primit HTML semantic fix, `legacy-generated.css` cu defecte documentate, o foaie pentru ordinea straturilor, `repair.css` incomplet, server static, criterii vizuale și verificări.

## Comportament necesar

- Navigarea rămâne în flux normal, se împachetează la lățimi înguste și nu acoperă titlul principal.
- Conținutul folosește Grid sidebar/conținut peste 48rem și o coloană sub acest prag.
- `.notice` folosește paleta accesibilă închis-pe-pal în ciuda regulii vechi `#app .notice`.
- Butoanele păstrează focus vizibil și nu se micșorează sub conținut.
- Cardurile au înălțime determinată de conținut, fără tăiere sau înălțime fixă forțată.
- Fișierul de remediere conține doar suprascrieri țintite în stratul `repair` declarat.

## Restricții

- Modifică doar `public/repair.css`; păstrează CSS-ul vechi și HTML-ul.
- Folosește straturi și selectori potriviți; fără `!important`, stiluri inline, ID-uri adăugate pentru specificitate, overflow ascuns sau duplicarea foii complete.
- Un breakpoint la 48rem.

## Criterii observabile de finalizare

- La 390 px, navigarea se împachetează deasupra titlului, iar conținutul are o coloană.
- La 1024 px, proporțiile sidebar/conținut sunt stabile, iar cardurile cresc odată cu conținutul.
- Culorile calculate ale mesajului provin din stratul de remediere.
- Focusul prin tastatură este vizibil; verificările trec; diferența este un singur fișier.

## Plan de validare

### Verificări de bază

- Artefactul vechi conține reproductibil navigare fixă, mesaj foarte specific și carduri cu înălțime fixă.
- HTML-ul, serverul și ordinea straturilor sunt intacte.

### Verificări de obiectiv

- Stratul de remediere restabilește navigarea în flux cu împachetare, aranjarea cu una/două coloane, paleta mesajului, înălțimea după conținut și focusul.
- Există breakpoint-ul exact de 48rem.

### Verificări de regresie

- Fără `!important`, selector ID, overflow ascuns, înălțime fixă de card sau schimbări HTML/CSS vechi.
- Remedierea rămâne mult mai mică decât foaia veche.

### Verificări în browser

- Chrome headless măsoară fluxul normal, 1/2 coloane Grid calculate, culorile reparate, cardurile netăiate și conturul butonului focalizat la 390/1024 px.

## Sarcina ta

Trebuie să adaugi corecții precise în `public/repair.css`. Fișierul inițial conține declarația stratului `repair` și un TODO. Foaia de stil originală păstrează intenționat defectele pentru a le putea inspecta. Identifică declarațiile aplicate și cauzele de layout, apoi adaugă doar regulile necesare pentru îndeplinirea cerințelor.

## Sarcină pentru Codex

> Examinează stilurile calculate, `legacy-generated.css`, ordinea straturilor și verificările eșuate. Repară doar `repair.css` în stratul existent. Restabilește fluxul normal, Grid responsive, culorile mesajului, înălțimea intrinsecă și focusul la breakpoint-ul exact. Nu modifica HTML/CSS-ul vechi și nu folosi `!important`, ID-uri, overflow ascuns sau înălțimi fixe. Finalizat când verificările și examinarea la 390/1024 px trec. Explică ce cauză de cascadă/aranjare tratează fiecare suprascriere.

## Sarcină de depanare/extindere

- Mută stratul de remediere înaintea celui vechi, observă stilurile calculate și cere-i lui Codex să explice de ce regulile mai puțin specifice pierd sau câștigă diferit între straturi.

## În afara domeniului exercițiului

- Rescrierea fișierului vechi, preprocesoare, framework-uri, măsurători JavaScript sau branding pixel-perfect.
