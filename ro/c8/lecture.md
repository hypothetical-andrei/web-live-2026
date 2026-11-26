# Cursul 08 — React cu Vite

> Durată planificată: 95 de minute  
> Format: trei blocuri conceptuale, cinci exemple rezolvate și trei intermezzo-uri de recapitulare

## Obiective de învățare

La finalul cursului, ar trebui să poți citi JSX, să transmiți props și callback-uri, să actualizezi starea locală fără mutație, să folosești chei stabile și intrări controlate și să pornești și cureți efecte pentru sisteme externe.

## Structura sesiunii

| Segment | Timp | Temă |
| --- | ---: | --- |
| Comparație introductivă | 0–7 min | Modificare imperativă vs. interfață declarativă |
| Bloc conceptual 1 | 7–29 min | Componente, JSX, proprietăți, descompunere |
| Intermezzo 1 | 29–33 min | Verificări despre randare/proprietăți |
| Bloc conceptual 2 | 33–57 min | Stare, evenimente, formulare, colecții |
| Intermezzo 2 | 57–61 min | Verificări despre stare/identitate |
| Bloc conceptual 3 | 61–82 min | Efecte, curățare, migrare, Vite |
| Intermezzo 3 | 82–86 min | Verificări despre sincronizare |
| Sinteză | 86–95 min | Recapitulare ghidată de proprietate |

> Când o comandă pornește un server persistent (`npm start`, `npm run dev` sau `node server.mjs`), lasă-l să ruleze și folosește alt terminal pentru teste/build. Pentru un exemplu cu API și Vite, rulează-le în terminale separate; oprește serverele cu Ctrl+C când termini.

## Descrie pagina pornind de la datele curente

În Cursul 03 ai creat noduri DOM și le-ai schimbat din gestionari de evenimente. În React scrii componente care descriu ce trebuie afișat pentru intrările și starea curente. Când aceste valori se schimbă, React apelează din nou componentele și actualizează DOM-ul unde este necesar.

Ia o listă de lecturi: componenta părinte păstrează cărțile, o listă le afișează, iar butoanele cer modificări. Vei urmări datele de la părinte la copil, apoi un clic până la actualizarea stării și o nouă randare. **Randarea** înseamnă apelarea componentelor pentru calcularea descrierilor elementelor; **commit-ul** aplică schimbările necesare în DOM.

## Bloc conceptual 1 — componente, JSX, proprietăți și limite

### 1. O componentă este o funcție care descrie o parte a interfeței

O componentă funcțională primește un obiect de intrări numite **props** și întoarce elemente React. De exemplu, o componentă `BookTitle` poate primi titlul și întoarce un `h2` care îl conține. Folosește componente pentru părți utile ale paginii, precum un rând de carte sau formularul de adăugare.

### 2. Elementele React descriu DOM-ul dorit

Un element descrie un tip precum `h2`, proprietățile și copiii săi. Nu este el însuși nodul DOM al browserului. React compară descrierea nouă cu cea anterioară—proces numit reconciliere—apoi aplică schimbările necesare în DOM. Funcția de randare descrie rezultatul în loc să apeleze `document.createElement` la fiecare actualizare.

### 3. Citește JSX ca sintaxă pentru crearea elementelor

**JSX** este o extensie de sintaxă transformată de instrumentul de build în apeluri JavaScript care creează elemente. `<h2>{title}</h2>` descrie un titlu al cărui conținut vine din expresia JavaScript `title`. Folosește acolade pentru expresii, `className` pentru clasa CSS și nume cu majusculă pentru propriile componente. JSX seamănă cu HTML, dar browserul nu execută direct sursa JSX.

### 4. Randarea trebuie să rămână pură

Pentru aceleași proprietăți și aceeași stare, randarea ar trebui să descrie aceeași interfață fără să pornească cereri, timere, abonamente sau scrieri în stocare.

### 5. Proprietățile circulă de la părinte la copil

Proprietățile sunt intrări doar în citire ale componentelor. Un copil nu ar trebui să le modifice sau să importe pe ascuns datele de test ale părintelui.

### 6. Transmite un callback prin care copilul cere o schimbare

Părintele păstrează cărțile și transmite unei componente de rând o carte și `onToggle`. Gestionarul de clic al rândului apelează `onToggle(book.id)`; părintele își actualizează starea; React randează din nou cu valorile noi. Copilul nu trebuie să modifice tabloul părintelui sau să știe unde este păstrat.

### 7. `children` este o proprietate

Folosește copiii când o componentă deține structura înconjurătoare, iar părintele furnizează conținutul imbricat.

### 8. Exemplu rezolvat — randarea componentelor și a proprietăților

Rulează [randarea componentelor și a proprietăților](examples/01-component-props-render/):

```bash
cd lectures/08-react-vite/ro/examples/01-component-props-render
npm install
npm run dev
npm run build
```

Deschide pagina Vite și inspectează componentele părinte și copil. Părintele parcurge datele; copiii primesc props și conținut imbricat prin children. Observi o pagină React randată, nu doar text HTML generat.

### 9. Separă componente când părțile devin mai ușor de înțeles

Extrage un rând repetat, un formular cu propriul comportament sau o regiune semnificativă a paginii. Dă componentei props și callback-uri explicite. Nu crea o componentă pentru orice înveliș: separarea utilă permite înțelegerea și verificarea unei părți fără urmărirea codului fără legătură.

### 10. Evitați ambele extreme

O componentă uriașă ascunde responsabilitățile. Zeci de componente care doar transmit date creează navigare fără claritate. Preferă cel mai mic arbore ale cărui nume și proprietăți îmbunătățesc inspectarea.

### 11. Starea aparține celui mai apropiat proprietar comun

Plasați starea în cea mai de jos componentă care trebuie să coordoneze toți consumatorii și toate tranzițiile. Nu ridicați reflex fiecare valoare la rădăcina aplicației.

### 12. Notează comportamentul existent înainte să împarți componentele

Înainte să reorganizezi panoul, notează etichetele, numerele afișate, ordinea, validarea, focusul și regulile de capacitate în teste sau verificări manuale. Acestea sunt **verificări de caracterizare**: descriu ce face aplicația curentă. Rulează-le după extragerea componentelor, ca o structură mai curată să nu schimbe pe ascuns comportamentul paginii.

## Intermezzo 1 — randare și proprietăți

Răspunde la întrebările `u08-i1-` din [intermezzo.gift](intermezzo.gift). Rezervă patru minute. Identifică props transmise copilului și callback-ul folosit pentru a cere schimbarea.

## Bloc conceptual 2 — stare, evenimente, formulare controlate și liste

### 13. Folosește un Hook pentru a păstra starea între randări

Un **Hook** este o funcție React precum `useState` sau `useEffect`, apelată la nivelul superior al unei componente sau al altui Hook, nu într-o condiție sau buclă. `useState(initial)` întoarce valoarea curentă și o funcție de actualizare. Apelarea ei cere o nouă randare; nu schimbă valoarea stării capturată de randarea curentă. O variabilă locală este recreată la apelul următor și nu înlocuiește starea.

### 14. Înlocuiți starea imuabil

Creează tablouri/obiecte noi pentru schimbări în loc să modifică starea curentă. Identitatea comunică astfel ce valori s-au schimbat.

### 15. Folosește actualizări funcționale pentru tranziții bazate pe starea anterioară

```js
setItems(current =>
  current.map(item => item.id === id ? { ...item, done: !item.done } : item)
);
```

Această tranziție folosește starea furnizată de React la momentul actualizării.

### 16. Valorile derivate sunt calcule

Elementele filtrate, numărătorile, înregistrările selectate și capacitatea rămasă ar trebui de obicei calculate în timpul randării din intrările lor reale.

### 17. Exemplu rezolvat — stare imuabilă și vedere derivată

Rulează [starea imuabilă și vederea derivată](examples/02-immutable-state-view/):

```bash
cd lectures/08-react-vite/ro/examples/02-immutable-state-view
npm install
npm run dev
npm run build
```

Bifează sarcini și schimbă filtrul. Inspectează tabloul păstrat în stare, apoi lista vizibilă și numărul rămas calculate la randare. Numărul nu este încă o valoare de stare de sincronizat.

### 18. Proprietățile de eveniment primesc funcții

`onClick={remove}` transmite un handler. `onClick={remove()}` îl invocă în timpul randării și transmite rezultatul său.

### 19. Păstrează semantica browserului

Butoanele au în continuare nevoie de tipuri potrivite; etichetele au nevoie de controale; trimiterea unui formular gestionat local poate apela `preventDefault`. React nu oferă automat accesibilitate.

### 20. Inputurile controlate se randează din stare

```jsx
<input value={title} onChange={event => setTitle(event.target.value)} />
```

Starea este sursa curentă de adevăr a interfeței.

### 21. Normalizați la o limită deliberată

Păstrează ceea ce tastează utilizatorul, apoi elimină spațiile/validează la trimitere, dacă produsul nu cere explicit normalizare în timp real.

### 22. Exemplu rezolvat — tranziția formularului controlat

Rulează [tranziția formularului controlat](examples/03-controlled-form-transition/):

```bash
cd lectures/08-react-vite/ro/examples/03-controlled-form-transition
npm install
npm run dev
npm run build
```

Scrie un titlu și trimite-l. Verifică validarea, salvarea valorii fără spații marginale, actualizarea listei și golirea câmpului după succes. Trimite și text gol: pagina trebuie să afișeze eroarea accesibilă, nu să ignore încercarea în tăcere.

### 23. Colecțiile folosesc `map`

Fiecare element devine un subarbore de elemente. Stările de colecție goală, încărcare și eroare fac parte din contractul colecției.

### 24. Dă fiecărui element o cheie stabilă

Elementele **surori** sunt elemente din aceeași listă întoarsă la randare. React folosește valorile `key` pentru a asocia un element între randări, deci folosește un ID stabil al înregistrării, nu poziția curentă din tablou. Dacă un rând păstrează text editat și inserezi o carte înaintea lui, cheia ID păstrează textul asociat acelei cărți. React consumă `key`; transmite ID-ul separat dacă trebuie citit ca prop de copil.

### 25. Indexul este poziție, nu identitate

Cheile-index sunt nesigure când elementele sunt inserate, șterse sau reordonate, deoarece starea locală a componentei poate urma o poziție, nu o înregistrare din domeniu.

### 26. Exemplu rezolvat — identitatea cheilor stabile

Rulează [identitatea cheilor stabile](examples/04-stable-key-identity/):

```bash
cd lectures/08-react-vite/ro/examples/04-stable-key-identity
npm install
npm run dev
npm run build
```

Editează intrarea locală a unui rând, apoi inserează un prim element nou. Compară cheile bazate pe index cu ID-urile stabile: cu o cheie stabilă, textul editat rămâne asociat înregistrării, nu poziției din tablou.

## Intermezzo 2 — stare și identitate

Răspunde la întrebările `u08-i2-` din [intermezzo.gift](intermezzo.gift). Rezervă patru minute. Explică ce se întâmplă cu starea rândului la inserarea unui prim element nou.

## Bloc conceptual 3 — efecte, curățare, migrare și Vite

### 27. Folosește un efect pentru legătura cu un sistem extern

`useEffect(setup, dependencies)` permite pornirea sincronizării după aplicarea unei randări: de exemplu, abonarea la evenimente, pornirea unei cereri sau scrierea în stocare. Funcția setup poate întoarce o funcție de curățare. Calculează listele filtrate și numerele în timpul randării; acestea nu cer un sistem extern sau un efect.

### 28. Enumeră valorile reactive folosite de efect

O **valoare reactivă** este aici un prop, o valoare de stare sau o valoare/funcție declarată în corpul componentei pe care efectul o citește. Enumeră dependențele relevante ca React să poată relua sincronizarea când se schimbă. React le compară prin `Object.is`. Nu omite o valoare folosită doar pentru a forța un anumit program; reorganizează codul dacă sincronizarea trebuie să depindă de mai puține valori.

### 29. Verifică de ce repornește un efect la fiecare randare

Un obiect sau o funcție creată în corpul componentei are o referință nouă la fiecare randare. Dacă este dependență a efectului, React vede o valoare schimbată chiar dacă interiorul pare identic. Verifică întâi dacă poți muta construirea în efect sau folosi dependențe mai simple. Nu ascunde o dependență reală doar pentru a opri reluările.

### 30. O închidere poate păstra valorile unei randări vechi

O **închidere**, closure, este o funcție împreună cu accesul la variabilele din locul creării ei. Fiecare randare creează funcții care pot păstra props și starea acelei randări. Dacă efectul de căutare citește `query`, dar nu îl declară ca dependență, callback-ul ulterior poate folosi încă textul vechi. Verifică valorile capturate de fiecare cerere, fără să presupui că un callback vede ultima stare.

### 31. Urmărește ordinea setup și cleanup

Pentru un efect cu dependențe care se schimbă, urmărește secvența:

1. React aplică randarea și rulează setup.
2. Se schimbă o dependență și React aplică o nouă randare.
3. React rulează cleanup-ul anterior, apoi noul setup.
4. Când componenta este eliminată, React rulează cleanup-ul rămas.

Folosește cleanup pentru eliminarea ascultătorilor, anularea temporizatoarelor sau oprirea cererilor. În dezvoltare, Strict Mode poate rula intenționat un ciclu setup/cleanup suplimentar pentru a verifica tratarea lui.

### 32. Ignoră rezultatele cererilor de care nu mai ai nevoie

Un semnal de anulare cere unui API compatibil să oprească lucrul; nu garantează că se oprește orice adaptor sau callback deja finalizat. Păstrează și un ID de cerere sau un indicator activ, ca un callback vechi să poată ieși fără apelarea funcției de actualizare a stării. Testează o cerere veche lentă care ajunge după una nouă mai rapidă.

### 33. Exemplu rezolvat — cronologia curățării efectului

Rulează [cronologia curățării efectului](examples/05-effect-cleanup-timeline/):

```bash
cd lectures/08-react-vite/ro/examples/05-effect-cleanup-timeline
npm install
npm run dev
npm run build
```

Pornește sincronizarea lentă, apoi pe cea rapidă. Urmărește curățarea efectului anterior și noul setup. Verifică dacă doar operația încă relevantă poate actualiza starea afișată.

### 34. Nu oglindiți starea derivată din randare în efecte

Un efect care copiază `items + filter` în `visibleItems` creează o a doua sursă de adevăr și o randare învechită suplimentară. Calculați valoarea direct.

### 35. Enumeră ce face aplicația vanilla înainte de migrare

Găsește variabilele persistente, valorile calculate din ele, gestionarii de evenimente, funcțiile de construire DOM și operațiile de stocare sau rețea. Pentru fiecare, identifică componenta, valoarea de stare, gestionarul sau efectul React care o va înlocui. Păstrează o listă de comportamente vizibile de verificat înainte și după migrare.

### 36. Traduceți responsabilitățile, nu sintaxa linie cu linie

Variabilele persistente devin stare; construirea DOM devine randare; listenerele devin proprietăți de eveniment; schimbările manuale de clase/text devin expresii; sincronizarea externă poate deveni efect.

### 37. Vite este infrastructură, nu arhitectură

Vite oferă serverul de dezvoltare ESM, transformarea JSX, actualizările rapide, resursele și compilarea pentru producție. Folosește-l în acest curs în loc de Create React App sau Webpack/Babel personalizat.

### 38. Succesul compilării este o dovadă limitată

`npm run build` demonstrează sănătatea modulelor/transformării. Nu demonstrează comportamentul evenimentelor, accesibilitatea, curățarea efectelor sau proprietatea stării. Combină-l cu teste și inspectarea în browser.

## Intermezzo 3 — efecte și migrare

Răspunde la întrebările `u08-i3-` din [intermezzo.gift](intermezzo.gift). Rezervă patru minute. Separă calculele din randare de efecte și curățarea lor.

## Sinteză — distinge părțile unei componente

```text
proprietăți: intrări deținute de părinte
stare: valori deținute de componentă între randări
valori derivate: calcule din proprietăți/stare
evenimente: tranziții solicitate
efecte: sincronizare cu sisteme externe
curățare: inversarea/invalidarea sincronizării
```

## Greșeli frecvente

- Invocarea handlerelor în timpul randării.
- Modificarea proprietăților sau a stării.
- Chei-index pentru liste care se schimbă.
- Duplicarea listelor filtrate/numărătorilor în stare.
- Mutarea întregii stări în context/proprietate globală.
- Copiii importă datele de test ale părintelui.
- Efecte pentru calcule pure.
- Dependențe instabile sau lipsă.
- Lipsa curățării timerelor/cererilor/abonamentelor.
- Presupunerea că abandonarea împiedică orice încheiere învechită.
- Tratarea succesului compilării Vite drept verificare a interfeței.

## Legătura cu tutorialul

Migrarea de la vanilla la React mapează o interfață cunoscută la componente, stare, input controlat și un efect de stocare. Descompunerea componentelor păstrează comportamentul în timp ce extrage responsabilități explicite. Depanarea stării/efectelor expune starea învechită, condițiile de cursă, greșelile de dependențe și curățarea lipsă.

## Considerații pentru dezvoltarea asistată de AI

Cere unui agent să enumere comportamentul, proprietatea stării, valorile derivate, proprietățile, efectele, curățarea și dovezile înainte de editare. Verifică modificarea directă, cheile-index, starea duplicată, contextul inutil, dependențele instabile, curățarea lipsă, regresiile de accesibilitate și verificările de caracterizare schimbate.

## Referințe

- Harta de migrare a cursului, Unitatea 08.
- `webtech-2025-course/c9/`, `webTechTutorials-main/S10/` și exemplele React mapate.
- Documentația React pentru componente, JSX, stare, evenimente, liste, formulare și efecte.
- Documentația React pentru Vite.

- [React useEffect: setup, dependencies, and cleanup](https://react.dev/reference/react/useEffect).
- [React rendering and effects](https://react.dev/learn/synchronizing-with-effects).
