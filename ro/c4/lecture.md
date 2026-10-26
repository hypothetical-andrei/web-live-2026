# Cursul 04 — HTML, CSS, interfețe responsive și accesibilitate

> Durată planificată: 95 de minute  
> Format: trei blocuri conceptuale, șase exemple și trei intermezzouri de recapitulare

## Rezultatele învățării

La finalul cursului, ar trebui să poți alege elemente HTML potrivite, să exprimi relațiile accesibile din formulare, să explici cascada, să calculezi dimensiunile cutiilor, să folosești Flexbox și Grid, să identifici blocul de conținere al unui element poziționat, să adaptezi aranjarea la spațiul disponibil și să verifici focusul și preferințele utilizatorului în browser.

## Planul sesiunii

| Segment | Timp | Temă |
| --- | ---: | --- |
| Parcurgerea documentului | 0–7 min | Identificarea conținutului și a relațiilor |
| Bloc conceptual 1 | 7–29 min | Elementele documentului, structură, formulare |
| Intermezzo 1 | 29–33 min | Verificarea relațiilor semantice |
| Bloc conceptual 2 | 33–57 min | Cascadă, moștenire, modelul cutiei |
| Intermezzo 2 | 57–61 min | Verificarea cascadei și dimensionării |
| Bloc conceptual 3 | 61–82 min | Flux, poziționare, Flex, Grid, focus |
| Intermezzo 3 | 82–86 min | Verificarea aranjării și preferințelor |
| Sinteză | 86–95 min | Analiza interfeței bazată pe dovezi |

## Introducere — descrie documentul înainte să îl stilizezi

Deschide [pagina atelierului](examples/01-semantic-form-relationships/workshop.html) și păstrează sursa HTML lângă browser. Are un titlu, paragrafe introductive, o legătură către locație, o imagine, o listă de cunoștințe necesare, un orar și un formular de înscriere. Aceste părți au scopuri diferite înainte să le alegem fonturile, culorile sau pozițiile.

Identifică mai întâi informația și relațiile dintre părțile ei. Marchează relațiile în HTML, folosește CSS pentru prezentare și adaugă JavaScript acolo unde interacțiunea îl cere. Această ordine face pagina mai ușor de înțeles și modificat: un design vizual nou nu ar trebui să impună rescrierea structurii conținutului.

## Bloc conceptual 1 — de la structura documentului la formulare

### 1. HTML reprezintă un document hipertext structurat

HTML a început ca limbaj de marcare pentru documente legate între ele și descrie în continuare conținutul și structura unui document. Browserul transformă marcajele într-un arbore de elemente, DOM-ul introdus în Cursul 03. Imbricarea exprimă relații: elementele unei liste aparțin listei, celulele unui tabel aparțin rândurilor, iar etichetele identifică controalele formularului.

Un document minimal are un `head` pentru metadate, inclusiv `title`, și un `body` pentru conținutul paginii. În corp, titlurile împart conținutul în secțiuni denumite, iar paragrafele exprimă unități de text. Titlul documentului denumește pagina; un titlu din corp denumește o parte a conținutului.

Un element este scris folosind etichete; atributele din eticheta de început configurează sau descriu elementul. În `<a href="#schedule" class="section-link">Orar</a>`, `a` este numele elementului, `href` și `class` sunt nume de atribute, iar șirurile dintre ghilimele sunt valorile lor. Textul dintre etichete este conținutul legăturii. Unele elemente, precum `input` și `img`, nu au etichetă de închidere sau conținut copil.

Unele atribute se aplică anumitor elemente: `href` indică destinația unei ancore, iar `src` identifică sursa unei imagini. **Atributele globale** sunt disponibile pe toate elementele HTML, deși efectul lor depinde de element și de context. Vei întâlni:

| Atribut | Scop |
| --- | --- |
| `id` | Identifică unic un element în document; este folosit de legături către fragmente, etichete de formular, CSS și scripturi. |
| `class` | Atribuie nume de clase separate prin spații, care pot fi comune mai multor elemente, frecvent pentru selectori CSS. |
| `lang` | Declară limba conținutului unui element; descendenții o moștenesc dacă nu specifică altă limbă. |
| `title` | Oferă informație suplimentară, adesea afișată ca indiciu la trecerea cursorului; nu înlocuiește în mod sigur o etichetă vizibilă. |
| `hidden` | Marchează conținut care nu este relevant momentan pentru afișare. |
| `data-*` | Păstrează date personalizate, precum `data-session="html"`, pe care scripturile le pot citi prin `dataset`. |

Unele atribute sunt booleene: prezența lor activează setarea. De exemplu, `required` face obligatoriu un control de formular compatibil; `required="false"` îl face tot obligatoriu. Omite atributul pentru a dezactiva setarea. Nu toate atributele funcționează astfel: `aria-invalid="false"`, introdus mai jos, are o valoare textuală cu semnificație proprie.

### 2. Alege elementele după scopul conținutului

Vocabularul HTML distinge tipuri obișnuite de informație și interacțiune:

| Scop | Elemente | Relație structurală |
| --- | --- | --- |
| Titluri și paragrafe | `h1`–`h6`, `p` | Nivelurile titlurilor exprimă ierarhia; paragrafele grupează textul. |
| Legături | `a` cu `href` | Conectează documentul cu altă resursă sau cu o poziție dintr-un document. |
| Imagini | `img`, opțional `figure` și `figcaption` | Includ conținut vizual; oferă o alternativă textuală potrivită și o legendă când este necesar. |
| Liste | `ul`, `ol`, `li`; `dl`, `dt`, `dd` | Reprezintă elemente neordonate, secvențe ordonate sau termeni și descrieri. |
| Tabele | `table`, `caption`, `tr`, `th`, `td` | Exprimă relații între date prin rânduri, coloane și antete. |
| Formulare | `form`, `label`, `input`, `select`, `textarea`, `button` | Colectează valori denumite și oferă controale pentru trimitere sau acțiuni. |
| Audio și video | `audio`, `video`, `source`, `track` | Includ conținut media temporal, cu controale de redare și piste suplimentare, precum subtitrările. |

Audio și video au fost adăugate ulterior acestui vocabular. Principiul de organizare rămâne scopul conținutului: un tabel pentru date cu relații între rânduri și coloane, o listă pentru elemente și un paragraf pentru text. Spațiile, întreruperile de linie și alinierea vizuală nu pot exprima toate aceste relații.

Pentru pagina atelierului, întreabă: cerințele sunt pași ordonați sau o listă neordonată? Orarul leagă sesiunile de ore și săli? Textul locației este o legătură sau un control de acțiune? Aceste decizii determină marcajele înainte să înceapă aranjarea vizuală.

### 3. Separă structura de prezentare

Browserele oferă stiluri implicite, deci titlurile apar de obicei mai mari, iar legăturile sunt adesea subliniate. Aceste stiluri pot fi schimbate; nivelul unui titlu descrie poziția lui în document, nu o dimensiune de font cerută.

Istoria HTML include elemente de prezentare precum `font` și `center` și atribute precum `bgcolor`. CSS mută aceste alegeri în reguli de stil care pot fi reutilizate și modificate independent. Separarea reduce formatarea repetată și permite adaptarea aceluiași conținut la ecrane diferite sau la tipărire.

Containerele generice `div` și `span` grupează conținut fără să denumească un anumit tip de regiune. Rămân utile când nu se potrivește un element mai specific. Elementele semantice pentru regiuni, apărute ulterior, precum `header`, `nav`, `main`, `article`, `aside` și `footer`, permit exprimarea explicită a scopului multor grupuri. Ele extind vocabularul structural HTML, fără să înlocuiască paragrafele, listele sau containerele generice.

Separarea are limite practice. CSS `::before` și `::after` pot genera conținut afișat fără să adauge elemente DOM obișnuite. Folosește-le pentru decor sau prezentare suplimentară; păstrează instrucțiunile și informația esențială în document, fără ca foaia de stil să fie singura lor sursă.

### 4. Structura determină lectura și navigarea

Organizează sursa paginii atelierului într-o ordine semnificativă: introducere, cerințe, orar, înscriere. Folosește nivelurile titlurilor pentru secțiuni și subsecțiuni. Un `header` grupează materialul introductiv, `nav` identifică legăturile de navigare, iar `main` identifică zona principală. Aceste denumiri explicitează structura pentru cei care întrețin pagina și pot expune regiuni utile tehnologiilor asistive.

Legăturile și butoanele au și ele scopuri diferite. O ancoră cu `href` navighează către o resursă sau o poziție. Un buton execută o acțiune, precum trimiterea unui formular. Focusul și comportamentul nativ la tastatură urmează aceste scopuri. Alegerea elementului evită reconstruirea comportamentului prin gestionare de clicuri pe containere generice.

### 5. Formularele trimit date; controalele oferă intrări standard

În ciclul tradițional al unei aplicații web, încarci o pagină HTML care conține un formular, completezi controalele și apeși butonul de trimitere. Browserul colectează valorile controalelor denumite ca perechi cheie–valoare și le trimite la URL-ul din `action`, folosind metoda din `method`. Cu `GET`, perechile codificate ajung în query-ul URL-ului; cu `POST`, ajung de obicei în corpul cererii. Răspunsul serverului este afișat ca pagina următoare.

De exemplu, `<input name="email" type="email">` contribuie cu o pereche precum `email=alex@example.com`. `name` furnizează cheia trimisă; `id` permite unei etichete sau unui script să identifice elementul. Controalele dezactivate și checkbox-urile sau butoanele radio nebifate nu sunt incluse.

Într-o aplicație cu o singură pagină, gestionezi frecvent evenimentul `submit` al formularului în JavaScript și apelezi `event.preventDefault()` pentru a opri navigarea. Poți apoi să citești valorile, să trimiți o cerere cu `fetch` și să actualizezi pagina curentă. Controalele îți oferă în continuare câmpuri de text, checkbox-uri, butoane radio, selectoare, butoane, comportament la tastatură și validare în browser.

Deschide pagina atelierului și inspectează `action`, `method` și numele controalelor. Demonstrația locală folosește `GET`: trimite valori fictive și inspectează URL-ul rezultat. Nu există un backend de înscriere. Examinează apoi cum te ajută etichetele, indicațiile și grupurile să folosești controalele.

### 6. Un control de formular are nevoie de nume accesibil

Un `<label>` vizibil, asociat prin `for` și `id` sau prin includere explicită, oferă controlului un nume persistent și o țintă de activare mai mare. Placeholder-ul nu îl înlocuiește.

### 7. Descrierile completează numele

**ARIA** înseamnă **Accessible Rich Internet Applications**. Definește roluri, stări și proprietăți prin care poți descrie o interfață tehnologiilor asistive, precum un cititor de ecran. Browserele folosesc semantica HTML nativă împreună cu informația ARIA aplicabilă pentru a construi un arbore de accesibilitate: o reprezentare a rolurilor, numelor, stărilor și relațiilor elementelor.

Atributele care încep cu `aria-` descriu proprietăți sau stări; `role` poate identifica rolul unui element. De exemplu, `aria-describedby="email-help"` se referă la elementul al cărui `id` este `email-help`. Aceste atribute nu adaugă operare la tastatură, nu validează date și nu schimbă aspectul. Preferă elementul HTML nativ când oferă deja ce îți trebuie: un `button` real furnizează comportament pe care simplul `role="button"` nu îl poate oferi.

Instrucțiunile și indicațiile de format pot fi conectate prin `aria-describedby`. Eticheta răspunde „ce câmp este?”, iar descrierea „ce trebuie să știu despre el?”.

### 8. Grupurile au nevoie de semantică de grup

Folosește `fieldset` și `legend` pentru butoane radio sau checkbox-uri înrudite. Repetarea unui titlu vizual nu creează aceeași relație programatică.

### 9. Tipurile intrărilor oferă comportament

Tipuri precum `email`, `url`, `date` și `number` pot oferi tastaturi potrivite, așteptări de parsare și validare nativă. Folosește tipul potrivit valorii colectate.

### 10. Exemplu — relații semantice într-un formular

Rulează [relațiile semantice](examples/01-semantic-form-relationships/):

```bash
node lectures/04-html-css-accessibility/ro/examples/01-semantic-form-relationships/validate.js
```

Apoi navighează cu Tab, Shift+Tab, săgeți și Enter. Observă cât comportament există fără JavaScript personalizat.

### 11. Starea de accesibilitate trebuie conectată

Pentru validare, asociază erorile afișate lângă câmp, actualizează `aria-invalid` când este cazul, oferă un sumar focalizabil la eșecul trimiterii și mută deliberat focusul pentru ca eroarea să fie descoperită.

### 12. Ordinea DOM este ordinea interacțiunii

CSS poate rearanja vizual conținutul, dar ordinea tastaturii și citirii urmează în general DOM-ul. Păstrează semnificativă ordinea sursei, în loc să repari structura slabă prin poziționare vizuală.

## Intermezzo 1 — relații semantice

Folosește întrebările cu prefixul `u04-i1-` din [intermezzo.gift](intermezzo.gift). Rezervă patru minute pentru răspunsuri, apoi explică diferența dintre un buton nativ și un `div` stilizat.

## Bloc conceptual 2 — cascadă, moștenire și dimensionare

### 13. Compară declarațiile concurente în ordine

O regulă CSS are un selector și un bloc de declarații: `p { color: navy; }` selectează paragrafe și declară o valoare pentru `color`. Mai multe reguli pot viza același element. **Cascada** alege separat valoarea fiecărei proprietăți; nu alege o regulă întreagă pentru a le elimina pe celelalte.

Pentru regulile obișnuite din foile de stil ale acestui curs—fără `!important`, stiluri inline, animații, tranziții sau `@scope`—folosește această ordine:

1. **Identifică declarațiile aplicabile.** Păstrează regulile ai căror selectori corespund elementului și ale căror condiții, precum media queries, sunt îndeplinite. Compară declarațiile aceleiași proprietăți.
2. **Compară originile.** Pentru declarațiile normale, foaia de stil a autorului paginii are prioritate față de stilurile utilizatorului, iar acestea față de stilurile implicite ale browserului. Un selector implicit mai specific al browserului nu învinge regula autorului.
3. **Compară straturile din aceeași origine.** Pentru declarațiile normale, un strat declarat ulterior învinge unul anterior. Declarațiile din afara straturilor au prioritate față de straturile denumite.
4. **Compară specificitatea selectorilor din stratul câștigător.** Selectorul cu specificitate CSS mai mare câștigă chiar dacă regula lui apare mai devreme.
5. **Folosește ordinea apariției la specificitate egală.** Dacă toate comparațiile anterioare sunt egale, câștigă declarația care apare ultima.

În interiorul unui strat—sau când nu folosești straturi—comparația centrală este deci **specificitate mai mare, apoi apariție mai târzie la egalitate**. Ordinea straturilor îți permite să stabilești prioritatea grupurilor de reguli înainte de compararea selectorilor.

Lista acoperă intenționat regulile normale din foile de stil. `!important` schimbă prioritatea originilor și inversează prioritatea straturilor; stilurile inline au prioritate proprie față de regulile cu selectori de aceeași importanță. Regulile cu domeniu delimitat adaugă comparația proximității după specificitate. Nu ai nevoie de aceste mecanisme pentru exemplele următoare.

### 14. Specificitatea este un calcul CSS, nu o restrângere logică

Pentru selectorii de mai jos, numără trei componente și compară-le de la stânga la dreapta:

1. Selectori de ID, precum `#registration`.
2. Selectori de clasă, selectori de atribut și pseudo-clase obișnuite, precum `.note`, `[required]` și `:hover`.
3. Selectori de element și pseudo-elemente, precum `p` și `::before`.

| Selector | Specificitate (ID-uri, clase/atribute/pseudo-clase, elemente/pseudo-elemente) |
| --- | --- |
| `p` | `(0, 0, 1)` |
| `div p` | `(0, 0, 2)` |
| `div > p` | `(0, 0, 2)` |
| `.note` | `(0, 1, 0)` |
| `p.note` | `(0, 1, 1)` |
| `#registration p` | `(1, 0, 1)` |

Compară prima componentă diferită; nu aduna componentele într-un singur total. Astfel, `.note` învinge `div p`, iar un selector ID învinge orice număr de selectori de clasă în această comparație.

Combinatorii—spațiul, `>`, `+` și `~`—nu adaugă specificitate. `div > p` selectează numai paragrafe care sunt copii direcți ai unui `div`; `div p` selectează și paragrafe imbricate mai adânc. Primul selectează o submulțime a celui de-al doilea, dar ambii au specificitatea `(0, 0, 2)`. CSS nu stabilește prioritatea demonstrând care mulțime selectată este mai restrânsă.

Selectorul universal `*` nu adaugă nici el specificitate. Unele pseudo-clase funcționale au reguli speciale: `:where(...)` contribuie cu zero, iar `:is(...)`, `:not(...)` și `:has(...)` preiau specificitatea celui mai specific argument. Folosește mai întâi selectorii simpli din tabel pentru a înțelege calculul de bază.

### 15. Straturile ordonează explicit grupuri de reguli

```css
@layer reset, base, components, utilities;
```

Această instrucțiune stabilește ordinea straturilor. Pentru declarațiile normale, `utilities` are prioritate față de `components`, apoi `base`, apoi `reset`, indiferent de specificitatea selectorilor. În fiecare strat, compară ca de obicei specificitatea și apoi ordinea apariției. Fără straturi, regulile normale ale foii de stil aparțin aceluiași grup din afara straturilor.

### 16. Exemplu — ordinea straturilor cascadei

Deschide [ordinea straturilor cascadei](examples/02-cascade-layer-order/). O regulă de clasă din stratul ulterior `theme` depășește o regulă ID-plus-clasă din `legacy`. Inversează ordinea declarată pentru a izola cauza.

### 17. Urmărește o egalitate de specificitate

```html
<div><p class="note">Adu laptopul.</p></div>
```

```css
div > p { color: navy; } /* (0, 0, 2) */
div p   { color: teal; } /* (0, 0, 2): apare ulterior, deci câștigă */
```

Ambii selectori corespund acestui paragraf. Textul este teal, deși selectorul anterior cere un copil direct. Inversează regulile și textul devine navy. Adaugă acum `.note { color: maroon; }` înaintea ambelor: maroon câștigă deoarece `(0, 1, 0)` depășește `(0, 0, 2)`, indiferent de ordinea apariției. Comparațiile presupun că toate trei sunt declarații normale ale autorului, în același strat.

### 18. Unele proprietăți se moștenesc de la părinte

Proprietăți precum `color` și setările fontului se moștenesc frecvent. Dimensiunile cutiei și bordurile, de regulă, nu. O valoare moștenită concurează diferit față de o declarație care vizează direct elementul.

### 19. Folosește stilurile calculate din DevTools

Examinează declarația câștigătoare, concurenții tăiați, sursa moștenirii, stratul și valoarea calculată. Nu folosi `!important` pentru a repara propriul CSS. Corectează selectorul, poziția în straturi sau declarațiile conflictuale.

O suprascriere punctuală poate fi potrivită când o bibliotecă externă injectează o declarație inline normală pe care nu o poți modifica:

```html
<div class="vendor-panel" style="width: 900px">Conținutul bibliotecii</div>
```

```css
/* Suprascrie lățimea inline injectată de bibliotecă pe ecrane înguste. */
@media (max-width: 40rem) {
  .vendor-panel { width: 100% !important; }
}
```

Un selector normal mai specific nu poate suprascrie acea lățime inline; declarația importantă poate. Limitează suprascrierea și explică ce declarație externă o impune. `!important` atribuie unei declarații o importanță mai mare în cascada existentă; nu mărește specificitatea selectorului și nu pornește o cascadă separată. Exemplul suprascrie o declarație inline normală, nu una care folosește ea însăși `!important`.

### 20. Ce determină modul în care este desenat un element?

După ce afli care declarații CSS câștigă, trebuie să determini rezultatul pe ecran. Inspectează acești factori:

1. **Conținutul și ordinea sursei:** textul, imaginile, controalele, ordinea și imbricarea elementelor din DOM.
2. **Spațiul disponibil:** viewport-ul și blocul de conținere—dreptunghiul folosit pentru calcularea dimensiunii și poziției unui element.
3. **Modul de aranjare:** `display` determină participarea cutiilor la aranjare, de exemplu drept conținut block sau inline ori elemente în Flexbox sau Grid.
4. **Dimensiunile cutiei:** lățime și înălțime, limite minime/maxime, padding, bordură, margine și `box-sizing`.
5. **Dimensionarea conținutului:** metrica fontului, împărțirea textului pe linii și dimensiunile naturale ale unei imagini afectează spațiul necesar.
6. **Poziționarea:** `position` și deplasări precum `top` și `left` pot muta cutia sau o pot scoate din fluxul normal.
7. **Desenarea și suprapunerea:** fundalurile, bordurile, umbrele, decuparea, transformările și ordinea de suprapunere determină ce este vizibil și care cutie apare deasupra alteia.

Aranjarea calculează dimensiuni și poziții; desenarea produce rezultatul vizual. O transformare poate deplasa cutia desenată fără să rearanjeze vecinii. `overflow` poate decupa conținut fără să îl facă să încapă. Aceste diferențe te ajută să alegi proprietatea care schimbă efectiv problema observată.

Începe cu **modelul cutiei**: conținutul este înconjurat de padding, apoi de bordură, apoi de margine. Padding-ul este spațiu în interiorul bordurii; marginea separă cutia de vecini. Fundalul se extinde în mod normal prin padding și sub bordură, iar marginea este transparentă. Un element poate genera mai multe cutii—de exemplu, textul inline împărțit pe linii—iar `display: none` nu generează niciuna.

### 21. `content-box` adaugă padding-ul și bordura

Cu o lățime declarată de 200px, padding de 20px pe fiecare parte și borduri de 1px, lățimea exterioară este 242px sub `content-box`.

### 22. `border-box` le include

Sub `border-box`, lățimea declarată include conținutul, padding-ul și bordura. De obicei, constrângerile componentelor sunt astfel mai ușor de urmărit:

```css
*, *::before, *::after { box-sizing: border-box; }
```

### 23. Exemplu — dimensionarea în modelul cutiei

Deschide [dimensionarea în modelul cutiei](examples/03-box-model-sizing/). Browserul raportează `242` față de `200` pentru cutii altfel identice.

### 24. Conținutul are propriile cerințe de dimensiune

**Dimensionarea intrinsecă** determină dimensiunea pornind de la conținut, în loc să atribuie pur și simplu o lățime din exterior. Textul depinde de font și de posibilitățile de împărțire pe linii; o imagine are dimensiuni naturale și un raport de aspect.

Pentru text, `min-content` este aproximativ cea mai mică lățime obținută folosind toate posibilitățile permise de împărțire pe linii, adesea lățimea celui mai lung cuvânt care nu poate fi împărțit. `max-content` este lățimea necesară fără împărțiri opționale pe linii. Acestea sunt măsurători bazate pe conținut, nu lățimi fixe de ecran.

`border-box` schimbă măsurarea unei dimensiuni declarate; nu garantează că încape conținutul. Dacă un URL lung depășește un card, inspectează împărțirea textului și dimensiunile minime. Pentru o imagine prea lată, ia în calcul `max-width: 100%; height: auto`. Ascunderea depășirii doar maschează excesul.

### 25. Preferă proprietățile logice

`margin-inline`, `padding-block` și `inline-size` exprimă relații față de direcția scrierii. Îmbunătățesc adaptabilitatea fără reguli stânga/dreapta duplicate.

## Intermezzo 2 — cascadă și dimensionare

Folosește întrebările cu prefixul `u04-i2-` din [intermezzo.gift](intermezzo.gift). Rezervă patru minute pentru răspunsuri. Calculează lățimea `content-box` și explică egalitatea de specificitate înainte să verifici răspunsurile.

## Bloc conceptual 3 — aranjare, adaptabilitate și preferințe

### 26. Începe cu fluxul normal

În aranjarea block obișnuită, blocurile se succed vertical într-un mod de scriere orizontal. Conținutul inline, precum textul și legăturile, se așază pe linii și trece pe linia următoare când spațiul se termină. Un paragraf devine mai înalt când textul se împarte pe linii și împinge în jos conținutul următor.

`display: block`, `inline` și `inline-block` schimbă participarea cutiei la această aranjare. Un inline-block se așază într-o linie, acceptând dimensiuni ca un bloc. `display: flex` sau `grid` stabilește alt mod de aranjare pentru copiii containerului. Schimbarea lui `position` este o decizie separată.

Pe pagina atelierului, paragrafele, lista, orarul și formularul apar deja într-o succesiune utilă fără coordonate. Păstrează acest flux pentru conținutul principal. Folosește poziționarea când ai nevoie de o deplasare intenționată, o suprapunere sau o ancorare în timpul derulării.

### 27. Flexbox rezolvă distribuția unidimensională

Flexbox coordonează elementele în principal pe o axă. Folosește-l pentru rânduri de navigare, grupuri de controale, interiorul cardurilor și alinieri unde împachetarea rămâne semnificativă.

### 28. Permite micșorarea elementelor Flex când conținutul se poate împărți pe linii

Elementele Flex au o dimensiune minimă automată care le poate păstra la lățimea cerută de conținut. Un cuvânt sau URL lung poate astfel împiedica micșorarea unui element chiar când containerul este îngust.

Setează `min-width: 0` pe element când vrei să permită micșorarea sub acel minim bazat pe conținut. Oferă și o împărțire potrivită, precum `overflow-wrap: anywhere` pentru șiruri lungi, sau alt mod deliberat de gestionare a excesului. Micșorarea cutiei nu face singură textul să încapă.

### 29. Grid coordonează rânduri și coloane

Grid este potrivit când rândurile, coloanele și alinierea pe două dimensiuni definesc aranjarea. Poți defini explicit dimensiunile rândurilor și coloanelor sau poți lăsa browserul să repete coloane în funcție de spațiul disponibil.

### 30. Alege un mod de poziționare

`position` determină dacă o cutie își păstrează locul în fluxul normal și cum sunt interpretate deplasările:

| Valoare | Spațiu în fluxul normal | Semnificația deplasărilor |
| --- | --- | --- |
| `static` (implicit) | Păstrat | Aranjarea normală poziționează cutia; `top`, `right`, `bottom` și `left` nu o deplasează. |
| `relative` | Păstrat la poziția inițială | Deplasările mută cutia față de poziția normală fără să mute vecinii. |
| `absolute` | Eliminat | Deplasările poziționează cutia în blocul ei de conținere pentru poziționare absolută. |
| `fixed` | Eliminat | De obicei, poziționarea este față de viewport și se păstrează când documentul se derulează. |
| `sticky` | Păstrat | Deplasările constrâng cutia față de cel mai apropiat scrollport în timpul derulării, în limitele blocului de conținere. |

Un **scrollport** este zona vizibilă a unui container cu derulare: fereastra prin care îi vezi conținutul care se deplasează. Pentru document, aceasta este de obicei viewport-ul browserului.

Pentru o insignă simplă poziționată absolut, setează `position: relative` pe card. Cardul devine blocul de conținere al insignei. Fără un asemenea strămoș, elementul poziționat absolut folosește blocul de conținere inițial; nu folosește automat părintele imediat. Alte proprietăți, precum `transform`, pot stabili și ele blocuri de conținere, inclusiv pentru poziționarea fixed.

```css
.card { position: relative; }
.badge { position: absolute; top: .75rem; right: .75rem; }
```

Insigna nu rezervă spațiu, deci oferă suficient padding dacă altfel ar acoperi textul cardului. Pentru `sticky`, furnizează o deplasare precum `top: 0` și suficient spațiu de derulare; setările overflow ale unui strămoș pot schimba scrollport-ul urmărit.

Când cutiile se suprapun, `z-index` poate controla ordinea lor în contextul de suprapunere relevant. Un asemenea context grupează descendenții pentru desenare; creșterea lui `z-index` pe un copil nu îl poate scoate din contextul strămoșului său. Nu ai nevoie de un număr arbitrar mare pentru a poziționa o insignă.

Deschide [containerul Flex și copilul poziționat](examples/06-flex-positioned-container/). Inspectează `display: flex`, `justify-content`, `align-items` și `gap` pe bara de instrumente, apoi `position: relative` pe card și `position: absolute` pe insignă. Schimbă insigna în `static`: revine în flux. Restabilește valoarea și elimină poziționarea cardului: inspectează unde este acum ancorată insigna.

### 31. Responsive înseamnă adaptarea conținutului

O aranjare responsive funcționează cu spațiu, zoom, mărimea fontului, lungimea conținutului și preferințele utilizatorului variabile. Nu este o listă de dispozitive denumite.

### 32. Începe îngust și adaugă un breakpoint când îl cere conținutul

Începe cu un flux utilizabil pe o singură coloană. Adaugă o condiție media sau container acolo unde relațiile devin înghesuite, nu pentru că un tabel de dispozitive numește acea lățime.

### 33. Lasă Grid să aleagă câte coloane încap

```css
.cards {
  display: grid;
  grid-template-columns:
    repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
  gap: 1rem;
}
```

Citește expresia din interior spre exterior:

- `min(100%, 14rem)` alege minimul dintre lățimea containerului și 14rem. Astfel, o coloană încape și când containerul este mai îngust de 14rem.
- `minmax(..., 1fr)` folosește acea valoare ca lățime minimă a coloanei și permite distribuirea spațiului rămas. `fr` reprezintă o fracțiune din spațiul disponibil coloanelor flexibile.
- `repeat(auto-fit, ...)` creează câte coloane încap în container, ținând cont de spațiile dintre ele, și colapsează coloanele goale.

Această abordare este numită adesea **aranjare responsive intrinsecă**: numărul de coloane rezultă din spațiul disponibil și constrângerile alese, în locul unei liste de breakpoint-uri ale viewport-ului. Nu este un tip separat de Grid. În această regulă, 14rem este o lățime aleasă de tine, nu o dimensiune intrinsecă măsurată din conținutul cardului. Distinge această utilizare a termenului de `min-content` și `max-content` din secțiunea 24.

### 34. Exemplu — coloane de carduri care încap automat

Redimensionează [coloanele de carduri care încap automat](examples/04-intrinsic-card-grid/). La lățimi mici obții o coloană; cu suficient spațiu, toate trei cardurile încap alăturat. Cardul mai lung determină înălțimea necesară rândului, fără decuparea textului printr-o înălțime fixă. Inspectează coloanele calculate și ține cont de padding-ul containerului și de spațiile dintre coloane când anticipezi următorul număr de coloane.

### 35. Arată ce control are focusul tastaturii

**Focusul** identifică elementul care primește momentan intrarea de la tastatură. Apasă Tab pe pagina atelierului pentru a trece între legături și controale; tastează când un câmp de text are focus. Focusul diferă de trecerea cursorului peste element și de marcarea unei opțiuni de navigare ca selectată.

Trebuie să vezi unde va ajunge intrarea de la tastatură. Browserele desenează în mod normal un indicator de focus, adesea un contur. Păstrează-l sau oferă un înlocuitor la fel de clar:

```css
:focus-visible {
  outline: 3px solid #174ea6;
  outline-offset: 3px;
}
```

`:focus` corespunde elementului focalizat. `:focus-visible` corespunde când browserul stabilește și că un indicator vizibil este potrivit, frecvent la navigarea cu tastatura și la introducerea textului. Nu este doar o verificare că ultima acțiune a fost apăsarea unei taste. Conturul este desenat fără să ocupe spațiu în aranjare, deci afișarea lui nu mută conținutul din jur. Nu elimina global contururile cu `outline: none`.

### 36. Adaptează prezentarea la preferințele utilizatorului

`prefers-reduced-motion` poate elimina animația neesențială. Contrastul, culorile forțate, zoom-ul și spațierea textului pot expune alte presupuneri. Păstrează funcționalitatea în timp ce adaptezi prezentarea.

### 37. Exemplu — focus și preferințe pentru mișcare

Deschide [focus și preferințe](examples/05-focus-and-motion-preferences/), navighează cu Tab și emulează mișcarea redusă. Acțiunea rămâne disponibilă, iar tranziția este eliminată.

### 38. Separă conținutul, prezentarea și comportamentul

HTML păstrează conținutul și relațiile structurale, CSS controlează prezentarea, iar JavaScript adaugă comportament cu stare. Responsabilitățile clare fac modificările mai ușor de înțeles. Revino la pagina atelierului: orarul rămâne un tabel când culorile sau lățimile coloanelor se schimbă.

## Intermezzo 3 — comportament responsive și preferințe

Folosește întrebările cu prefixul `u04-i3-` din [intermezzo.gift](intermezzo.gift). Rezervă patru minute pentru răspunsuri, apoi explică de ce insigna folosește cardul drept bloc de conținere.

## Sinteză — diagnostichează înainte să adaugi CSS

```text
Semnificația HTML este corectă?
→ Ce declarație câștigă și de ce?
→ Ce constrângere a cutiei/intrinsecă produce geometria?
→ Ce relație de aranjare este intenționată?
→ Ce se schimbă la spațiu îngust, zoom, tastatură și preferințe?
```

## Moduri frecvente de eșec

- Elemente `div` clicabile în locul legăturilor sau butoanelor.
- Placeholder în locul etichetelor.
- Niveluri de titlu alese după mărimea fontului.
- Erori afișate, dar neasociate programatic.
- Repararea cascadei prin `!important`.
- Tratarea specificității drept întreaga cascadă.
- Omiterea padding-ului și bordurii din calculele lățimii.
- Înălțimi fixe cu conținut ascuns la depășire.
- Poziționare absolută pentru aranjarea obișnuită.
- Breakpoint-uri denumite după dispozitive, fără legătură cu conținutul.
- Eliminarea indicatorilor de focus.
- Testarea unui singur viewport și a conținutului de lungime ideală.

## Legătura cu tutorialul

Responsive Card/Grid Reconstruction aplică constrângeri de cutie, Flexbox, Grid și breakpoint. Accessible Form adaugă stare de validare și gestionarea focusului relațiilor semantice. CSS Repair Challenge folosește un strat ulterior de remediere, în loc să rescrie markup-ul fix sau să crească specificitatea.

## Considerații pentru dezvoltarea asistată de IA

Oferă agentului HTML-ul fix, suprafața permisă pentru editare, dovezi pentru viewport și cerințele de accesibilitate. Cere diagnosticul semanticii, stilurilor calculate și dimensionării intrinseci înaintea declarațiilor. Analizează diferențele generate pentru înălțimi fixe, overflow ascuns, `!important`, focus absent, reordonarea vizuală a sursei și schimbări de markup fără legătură.

## Referințe

- Harta de migrare a cursului, Unitatea 04.
- `webtech-2025-course/c3/html-basics/`, `c4/css/` și `c5/`.
- `webTechTutorials-main/S05/` și `S06/`.
- HTML Living Standard; specificațiile CSS Cascade, Box Sizing, Flexbox și Grid.
- Referința rapidă WCAG și ghidul WAI pentru formulare.

Surse pentru introducerea despre HTML: [structura documentului în HTML 2.0](https://www.w3.org/MarkUp/html-spec/html-spec_5.html) și [indexul actual al elementelor HTML](https://html.spec.whatwg.org/dev/indices.html).

Referințe pentru cascadă și specificitate: [CSS Cascade](https://www.w3.org/TR/css-cascade-5/#cascade-sort), [Selectors specificity](https://www.w3.org/TR/selectors/#specificity-rules).

Referințe pentru afișare: [positioning](https://www.w3.org/TR/css-position-3/), [intrinsic sizing](https://www.w3.org/TR/css-sizing-3/#intrinsic-sizes), [focus indicators](https://www.w3.org/TR/selectors-4/#the-focus-visible-pseudo).
