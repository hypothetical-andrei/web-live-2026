# Cursul 03 — Module, asincronicitate, evenimente și browserul

> Durată planificată: 95 de minute  
> Format: trei blocuri conceptuale, cinci exemple rezolvate și trei intermezzo-uri de recapitulare

## Rezultatele învățării

Studenții ar trebui să poată explica limitele ESM, urmări continuările promisiunilor, alege coordonarea secvențială sau paralelă, clasifica rezultatele `fetch`, randa stări explicite ale interfeței, manipula DOM-ul în siguranță, analiza propagarea evenimentelor și diagnostica comportamente asincrone învechite sau netratate.

## Desfășurarea cursului

| Segment | Timp | Temă |
| --- | ---: | --- |
| Cronologia inițială | 0–7 min | De ce codul din browser nu este o singură execuție de sus în jos |
| Bloc conceptual 1 | 7–28 min | Module, callback-uri și promisiuni |
| Intermezzo 1 | 28–32 min | Verificări despre module și event loop |
| Bloc conceptual 2 | 32–56 min | Coordonarea promisiunilor, fetch și eșecuri |
| Intermezzo 2 | 56–60 min | Verificări despre rezultate asincrone |
| Bloc conceptual 3 | 60–81 min | Starea DOM și evenimente propagate |
| Intermezzo 3 | 81–85 min | Verificări despre DOM și delegare |
| Sinteză | 85–95 min | Recapitulare bazată pe cronologii |

## Cronologia inițială — o pagină, mai multe declanșatoare

La încărcarea paginii, codul JavaScript pregătește interfața și înregistrează funcții care tratează evenimente. Aceste funcții rulează când se întâmplă ceva: utilizatorul apasă un buton, expiră un timer sau devin disponibile datele solicitate.

```text
pagina se încarcă → rulează inițializarea → inițializarea se termină
mai târziu: click → rulează handlerul → handlerul se termină
mai târziu: sosesc datele → rulează codul care le folosește
```

Vom urmări acești pași pentru a răspunde la două întrebări: ce rulează acum și ce rulează mai târziu?

## Bloc conceptual 1 — module, callback-uri și promisiuni

### 1. Modulele permit fișierelor să partajeze funcții și valori selectate

Un modul este un fișier JavaScript cu propriul domeniu de vizibilitate. Folosiți `export` pentru a face o funcție sau o valoare disponibilă altor module și `import` pentru a o folosi:

```js
// render.js
export function showUser(user) {
  console.log(user.name);
}

// main.js
import { showUser } from "./render.js";
showUser({ name: "Ana" });
```

`showUser` este funcția exportată. `"./render.js"` indică browserului de unde să încarce modulul. Parametrii și comportamentul funcției descriu cum se folosește; calea importului localizează fișierul.

### 2. Indicați browserului să încarce un modul

```html
<script type="module" src="./main.js"></script>
```

Acesta încarcă `main.js` și importurile sale. Fără `async`, scriptul de tip modul rulează după parsarea HTML-ului. Modulele folosesc strict mode, iar declarațiile de la nivelul superior rămân în domeniul modulului, fără să devină variabile globale.

### 3. Importurile relative folosesc URL-ul modulului care importă

Dacă `main.js` se află la `/scripts/main.js`, importul său `"./render.js"` se referă la `/scripts/render.js`. Calea este relativă la modul, nu la pagina HTML. Importurile native din browser folosesc URL-uri; scrieți extensia fără să așteptați ca browserul să o adauge. Instrumentele de build pot permite reguli suplimentare, pe care le vom studia ulterior.

### 4. Importarea aceluiași modul partajează starea sa

În același mediu JavaScript, importurile care se referă la același URL de modul folosesc aceeași instanță. Codul de la nivelul superior rulează o singură dată. Dacă modulul păstrează o variabilă, funcțiile care îl importă pot observa modificările acelei variabile prin exporturile sale.

### 5. Exemplu rezolvat — funcții care partajează starea unui modul

Rulați [limita modulului și instanța comună](examples/01-module-live-binding/):

```bash
node lectures/03-browser-async-events/ro/examples/01-module-live-binding/example.js
```

Urmăriți `addTask` în `state.js`, apoi `summarizeTasks` în `summary.js`. Ambele folosesc aceleași sarcini stocate. Rezumatul returnat conține copii ale datelor, deci modificarea lui nu schimbă sarcinile stocate. Întrebați: ce fișier păstrează datele și ce funcție exportată le modifică?

### 6. Apelurile obișnuite returnează înainte de următoarea instrucțiune

```js
const user = getUser();
showUser(user);
```

Pentru o funcție sincronă obișnuită, `getUser()` rulează și returnează o valoare înainte să înceapă `showUser(user)`. Stiva de apeluri urmărește apelurile active. Pe firul principal JavaScript al browserului, un alt handler de eveniment nu întrerupe această secvență sincronă.

Unele calcule au nevoie de valori care nu sunt încă disponibile. Afișarea numelui unui utilizator necesită datele sale, dar obținerea lor poate implica o cerere de rețea. Pasul care folosește datele trebuie să aștepte până când acestea sunt disponibile; codul independent poate continua.

Un răspuns de rețea poate dura câteva secunde. Dacă am ține firul JavaScript al browserului ocupat așteptând, acesta nu ar putea trata click-uri. În schimb, pornim cererea acum și descriem ce trebuie să se întâmple când rezultatul devine disponibil. O continuare descrie calculul care urmează; o promisiune ne oferă un obiect prin care putem primi rezultatul sau trata eșecul.

### 7. Un callback poate descrie pasul următor

Să presupunem că un API numit `getUserWithCallback` începe încărcarea datelor utilizatorului și apelează o funcție primită când datele devin disponibile:

```js
getUserWithCallback((user) => {
  showUser(user);
});
console.log("Cererea a pornit");
```

Funcția săgeată este transmisă ca argument; nu este apelată în acest punct. În acest API asincron ipotetic, `getUserWithCallback` returnează înainte să sosească datele. Mesajul se afișează primul; ulterior, API-ul apelează callback-ul cu utilizatorul. Această ordine rezultă din comportamentul API-ului: acceptarea unui callback nu face automat o funcție asincronă.

### 8. O continuare exprimă ce trebuie făcut în continuare

O **continuare** reprezintă calculul rămas după un anumit punct. Aici, după obținerea utilizatorului, pasul rămas este `showUser(user)`. El poate fi exprimat prin callback-ul de mai sus. Continuările sunt utile și pentru explicarea codului sincron; nu presupun neapărat așteptare.

În **stilul de transmitere a continuării (continuation-passing style, CPS)**, o funcție primește explicit o continuare și îi transmite rezultatul, în loc să returneze rezultatul în mod obișnuit:

```js
function addWithContinuation(a, b, next) {
  next(a + b);
}

addWithContinuation(2, 3, (sum) => console.log(sum));
```

Acest mic exemplu CPS este sincron. API-urile asincrone bazate pe callback-uri folosesc aceeași idee de a transmite pasul următor, dar nu orice callback este o continuare: un comparator pentru sortare calculează o comparație, fără să exprime restul programului.

### 9. O promisiune permite apelantului să trateze un rezultat sau un eșec

O promisiune reprezintă un rezultat care poate deveni disponibil ulterior. Obiectul promisiune este disponibil imediat; rezultatul său poate să nu fie încă disponibil. JavaScript nu așteaptă automat când folosiți o promisiune într-o expresie sau o transmiteți unei funcții:

```js
const userPromise = getUserPromise();
showUser(userPromise); // rulează acum, primind obiectul promisiune, nu utilizatorul
```

Funcția noastră `showUser` are nevoie de datele utilizatorului, deci acest apel nu îi oferă ceea ce îi trebuie. Trebuie să organizăm explicit execuția acelui pas când valoarea devine disponibilă. Cu `.then()`, înregistrăm continuarea pe promisiune:

```js
const userPromise = getUserPromise();
const displayPromise = userPromise.then((user) => {
  showUser(user);
});
displayPromise.catch((error) => {
  console.error("Utilizatorul nu a putut fi afișat:", error);
});
```

Numele API-urilor sunt ilustrative: `getUserWithCallback` primește un callback, iar `getUserPromise` returnează o promisiune.

| Starea promisiunii | Semnificație |
| --- | --- |
| Pending | Nu există încă un rezultat final |
| Fulfilled | Este disponibilă o valoare |
| Rejected | Este disponibil un motiv al eșecului, de obicei o eroare |

O promisiune începe în starea pending și poate deveni fulfilled sau rejected o singură dată. **Settled** înseamnă fulfilled sau rejected. Când primiți o promisiune, ea poate fi deja într-o stare finală.

`.then()` înregistrează o funcție care folosește valoarea disponibilă și returnează o promisiune nouă. În exemplu, noua promisiune preia și o eroare aruncată de `showUser`. `.catch()` înregistrează tratarea eșecului. Înregistrarea acestor funcții nu așteaptă execuția lor. Promisiunea este un obiect, nu un fir de execuție; API-ul și browserul organizează operația propriu-zisă.

### 10. `async` și `await` exprimă aceiași pași în ordinea instrucțiunilor

```js
async function displayUser() {
  try {
    const user = await getUserPromise();
    showUser(user);
  } catch (error) {
    console.error("Utilizatorul nu a putut fi afișat:", error);
  }
}
```

Apelarea unei funcții `async` începe imediat execuția corpului său și returnează o promisiune. La `await`, funcția se suspendă și redă controlul apelantului. Când promisiunea așteptată este îndeplinită, funcția își reia execuția, iar `user` primește valoarea. Dacă promisiunea este respinsă, expresia `await` aruncă motivul respingerii, tratat aici de `catch`. Eșecul nu furnizează o valoare pentru utilizator: execuția trece la tratarea erorii, sărind peste `showUser(user)`.

Instrucțiunile de după `await` formează continuarea. Firul JavaScript al browserului poate executa alte operații cât timp această funcție așteaptă. Promisiunea returnată de funcția `async` este îndeplinită când funcția se termină normal sau este respinsă dacă o eroare iese din funcție fără să fie tratată. Adăugarea lui `async` nu mută calculul pe alt fir de execuție.

### 11. Exemplu rezolvat — anticipați ce rulează înainte și după `await`

Rulați [ordinea continuării asincrone](examples/02-async-continuation-order/):

```bash
node lectures/03-browser-async-events/ro/examples/02-async-continuation-order/example.js
```

Citiți codul și anticipați cele cinci intrări înainte de rulare:

```text
script start → function start → script end → after await → promise fulfilled
```

`run()` începe imediat. La `await`, se suspendă, permițând codului apelant să înregistreze `script end`. Ulterior, își reia execuția și înregistrează `after await`. Terminarea lui `run()` îndeplinește promisiunea returnată, astfel încât callback-ul atașat prin `.then()` înregistrează apoi `promise fulfilled`.

### 12. Handler-ele promisiunilor și funcțiile reluate rulează ca microtask-uri

De ce exemplul afișează mai întâi `script end`, deși așteaptă o promisiune deja îndeplinită? Handler-ele promisiunilor și execuția reluată după `await` rulează prin **coada de microtask-uri**. Ele nu întrerup codul sincron curent.

Browserul termină execuția sincronă curentă, apoi procesează microtask-urile din coadă înainte să treacă la alt task, precum callback-ul unui timer. Microtask-urile adăugate în timpul procesării cozii sunt și ele procesate înainte de următorul task. Dacă promisiunea așteptată este încă pending, continuarea funcției așteaptă rezultatul ei înainte să poată rula.

Folosiți exemplul pentru a distinge trei momente: apelarea funcției, obținerea rezultatului promisiunii și rularea codului care folosește acel rezultat. Acestea nu trebuie să se întâmple simultan.

## Intermezzo 1 — module și planificare

Folosiți întrebările cu prefixul `u03-i1-` din [intermezzo.gift](intermezzo.gift). Alocați patru minute și cereți studenților să deseneze unde este planificată continuarea.

## Bloc conceptual 2 — coordonare, fetch și eșecuri

### 13. Operațiile secvențiale exprimă o dependență

```js
const user = await loadUser();
const tasks = await loadTasks(user.id);
```

A doua operație are nevoie de primul rezultat, deci așteptarea secvențială corespunde dependenței dintre date.

### 14. Operațiile paralele pornesc înaintea așteptării

```js
const profilePromise = loadProfile();
const tasksPromise = loadTasks();
const [profile, tasks] = await Promise.all([profilePromise, tasksPromise]);
```

Operațiile independente ar trebui de obicei pornite împreună.

### 15. Exemplu rezolvat — forma cererilor paralele

Rulați [forma cererilor paralele](examples/03-parallel-request-shape/):

```bash
node lectures/03-browser-async-events/ro/examples/03-parallel-request-shape/example.js
```

Toate pornirile preced toate finalizările. Ordinea finalizării diferă, dar `Promise.all` păstrează ordinea intrărilor în rezultat.

### 16. `Promise.all` este respinsă dacă o promisiune de intrare este respinsă

`Promise.all` returnează o promisiune pentru promisiunile primite. Ea este îndeplinită cu valorile lor, în ordinea intrărilor, când toate sunt îndeplinite. Dacă una este respinsă, promisiunea combinată este respinsă cu acel motiv fără să aștepte finalizarea celorlalte. Cererile rămase continuă; `Promise.all` nu le anulează. Tabloul de bord necesită toate cele trei rezultate pentru rezumatul combinat. Dacă o funcționalitate poate utiliza rezultate parțiale, trebuie să le trateze separat.

### 17. Primirea unui răspuns HTTP diferă de succesul HTTP

În mod normal, `fetch` este îndeplinită cu un `Response` când serverul trimite starea și antetele, inclusiv pentru `404` și `500`. Verificați `response.ok`: este true pentru stările 200–299. O eroare de rețea sau anularea poate respinge promisiunea. Așadar, doar `catch` nu detectează o stare HTTP de eroare; codul trebuie să verifice răspunsul și să arunce o eroare dacă starea nu este acceptabilă.

### 18. Exemplu rezolvat — verificarea unui răspuns HTTP de eroare

Rulați [limita HTTP a fetch](examples/04-fetch-http-boundary/):

```bash
node lectures/03-browser-async-events/ro/examples/04-fetch-http-boundary/example.js
```

Răspunsul `404` simulat îndeplinește promisiunea. `loadJson` verifică `response.ok` și transformă deliberat răspunsul inacceptabil într-o eroare a aplicației.

### 19. Citirea corpului răspunsului necesită încă un pas asincron

`await fetch(url)` furnizează un `Response` când starea și antetele sunt disponibile; corpul poate fi încă în curs de transfer. Corpul unui răspuns este un flux: octeții pot sosi în fragmente, în momente diferite. Acest lucru contează mai ales pentru descărcări mari sau răspunsuri generate treptat de server.

`await response.json()` așteaptă corpul complet, îl decodează ca text și parsează textul ca JSON. Returnează o promisiune deoarece citirea corpului poate necesita așteptarea altor octeți, chiar și pentru un răspuns mic. Aceasta nu înseamnă că parsarea JSON rulează pe alt fir: `JSON.parse(text)` este sincronă, iar parsarea unei valori mari poate dura un timp considerabil.

Alegeți metoda de citire în funcție de formatul corpului:

| Metodă | Rezultat și utilizare obișnuită |
| --- | --- |
| `response.json()` | O valoare JavaScript parsată din JSON, precum datele unui API |
| `response.text()` | Un șir, precum text simplu, HTML, XML sau CSV; parsarea suplimentară este separată |
| `response.blob()` | Un `Blob`, util pentru imagini sau fișiere de descărcat |
| `response.arrayBuffer()` | Un `ArrayBuffer` cu octeți pentru prelucrare binară |
| `response.formData()` | Un obiect `FormData` parsat din date de formular multipart sau codificate URL |

Toate aceste metode returnează promisiuni și consumă corpul complet. Sunt alternative de citire, nu pași care se apelează consecutiv pe același răspuns: în mod normal, corpul poate fi consumat o singură dată. Pentru XML sau HTML, citiți textul și parsați-l cu `DOMParser`; CSV necesită propriul parser. Nici `text()`, nici metodele binare nu interpretează corpul ca date structurate ale aplicației.

Pentru prelucrare incrementală, citiți `response.body`, un `ReadableStream`, în loc să așteptați o valoare completă. Fragmentele nu coincid neapărat cu liniile sau înregistrările JSON; aplicația trebuie să gestioneze aceste delimitări. Procesarea în flux poate evita colectarea întregului răspuns mare înainte de prelucrare. `json()` nu furnizează rezultate JSON incrementale.

Citirea corpului poate eșua dacă se întrerupe conexiunea sau cererea este anulată. Parsarea JSON poate eșua dacă textul primit nu este JSON valid. Chiar și un JSON valid poate avea câmpuri sau tipuri greșite, deci o stare HTTP de succes nu garantează date utilizabile în aplicație.

Consultați [MDN: citirea și procesarea în flux a corpului răspunsului](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#reading_the_response_body).

### 20. Arătați ce se întâmplă în timpul încărcării

Aici, randarea înseamnă actualizarea paginii afișate pornind de la datele aplicației. Cât timp cererea este în așteptare, afișați un indicator de încărcare. După finalizare, afișați rezultatul, un mesaj pentru rezultat gol sau o eroare. De exemplu, căutarea sarcinilor poate afișa „Se încarcă…”, sarcinile găsite, „Nu s-au găsit sarcini” sau „Sarcinile nu au putut fi încărcate”. Înlocuiți afișarea precedentă când este necesar, pentru ca un rezultat vechi să nu fie confundat cu cel curent.

```text
idle → loading → success
              ↘ empty
              ↘ error
```

### 21. Tratați erorile de încărcare acolo unde actualizați pagina

O funcție care încarcă date poate raporta eșecul aruncând o eroare. Funcția apelantă poate trata eroarea și decide ce afișează utilizatorului:

```js
async function loadUser() {
  const response = await fetch("/user.json");
  if (!response.ok) {
    throw new Error(`Utilizatorul nu a putut fi încărcat: HTTP ${response.status}`);
  }
  return response.json();
}

async function displayUser() {
  showLoading();
  try {
    const user = await loadUser();
    showUser(user);
  } catch (error) {
    showError(error.message);
  }
}
```

Funcțiile de afișare reprezintă actualizări ale paginii; implementarea lor DOM apare în blocul următor. `loadUser()` raportează eșecul; `displayUser()` îl tratează. Prin `await`, blocul `catch` poate trata erorile cererii, verificării stării și citirii JSON. Dacă funcția de încărcare nu poate recupera după eroare, lăsați promisiunea să fie respinsă, în loc să ascundeți eroarea și să returnați ca și cum încărcarea ar fi reușit.

### 22. Folosiți `finally` pentru lucrul necesar după succes sau eșec

Un bloc `finally` rulează când execuția părăsește blocul `try`/`catch` corespunzător, indiferent dacă operația a reușit sau a eșuat. Puneți acolo curățarea comună: de exemplu, ascunderea unui indicator de activitate sau eliminarea unui timer de timeout. `finally` nu tratează singur eroarea; o eroare netratată se propagă în continuare. Evitați returnarea din `finally`, deoarece poate înlocui rezultatul dorit sau ascunde o eroare.

### 23. Anulați o cerere cu `AbortController`

Un `AbortController` este un obiect prin care codul poate solicita anularea. Proprietatea sa `.signal` este un `AbortSignal`: un obiect transmis operației pentru ca aceasta să poată observa solicitarea de anulare. Apelarea lui `controller.abort()` marchează semnalul drept anulat și notifică operațiile care îl folosesc. Este un API al browserului, nu un fir de execuție sau un semnal al sistemului de operare.

```js
async function loadWithTimeout(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 1000);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}
```

Timerul solicită anularea după o secundă. Când `abort()` este apelat fără un motiv personalizat, anularea respinge un fetch sau o citire a corpului încă nefinalizată cu o eroare numită `AbortError`; apelantul trebuie să o trateze. `return await` păstrează timeoutul activ până la terminarea citirii JSON. `finally` elimină timerul chiar dacă operația se termină devreme sau eșuează. Un semnal anulat rămâne anulat, deci o nouă încercare necesită un controller nou. Anularea cererii clientului nu anulează efectele operațiilor deja executate de server.

Consultați [MDN: AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).

### 24. Limitați reîncercările și alegeți ce eșecuri reîncercați

O reîncercare este o nouă încercare după un eșec. O problemă temporară de conexiune sau un server supraîncărcat poate permite succesul ulterior; solicitarea repetată a aceluiași fișier inexistent de obicei nu ajută. Decideți ce eșecuri merită reîncercate, stabiliți un maxim și așteptați între încercări pentru a nu încărca suplimentar serverul.

Tutorialul alege următoarele reguli pentru exercițiu: reîncercați erorile de rețea, timeouturile și răspunsurile `5xx`; nu reîncercați răspunsurile `4xx` sau JSON-ul invalid. Permite două reîncercări, adică cel mult trei încercări. Întârzierile sunt 50 ms, apoi 100 ms. Creșterea întârzierii dintre încercări se numește **backoff**; dublarea ei se numește **backoff exponențial**. Aceste alegeri aparțin exercițiului, nu sunt reguli universale pentru orice serviciu.

Eliminați timerul fiecărei încercări înainte de a aștepta următoarea și păstrați ultima eroare dacă toate încercările eșuează. Reîncercarea unei cereri care modifică date poate repeta modificarea dacă serverul a procesat prima cerere, dar răspunsul s-a pierdut. Pentru asemenea cereri, reîncercați doar când API-ul oferă o modalitate de a evita efectele duplicate.

### 25. Nu lăsați o cerere veche să înlocuiască rezultatul uneia noi

Să presupunem că utilizatorul caută „cat”, apoi imediat „car”. Răspunsul pentru „car” poate sosi primul. Dacă răspunsul vechi pentru „cat” sosește ulterior și actualizează pagina, rezultatele afișate nu mai corespund căutării curente.

Atribuiți fiecărei căutări un număr de ordine și comparați-l cu cel mai recent înainte să afișați rezultatul sau eroarea. Ignorați finalizările căutărilor vechi. Anularea cererii precedente poate reduce lucrul inutil, dar verificarea căutării curente protejează și împotriva operațiilor deja finalizate sau care nu pot fi anulate.

## Intermezzo 2 — rezultate asincrone

Folosiți întrebările cu prefixul `u03-i2-` din [intermezzo.gift](intermezzo.gift). Alocați patru minute și deosebiți respingerea de rețea, eroarea HTTP și respingerea parsării.

## Bloc conceptual 3 — starea DOM și evenimente propagate

### 26. DOM-ul reprezintă pagina prin obiecte conectate

**Document Object Model (DOM)** reprezintă documentul HTML ca arbore de noduri. Elementele sunt noduri, iar textul este reprezentat prin noduri text. Un element poate conține noduri copil și poate avea un nod părinte. JavaScript din browser folosește aceste obiecte pentru a citi și modifica pagina; schimbarea textului sau a copiilor unui element schimbă ce poate afișa browserul.

### 27. Găsiți elementele necesare și verificați că există

Un **selector CSS** este o expresie care descrie ce elemente trebuie găsite în DOM. CSS folosește selectori pentru a alege elementele cărora le aplică stiluri; JavaScript poate folosi aceeași sintaxă pentru a căuta elemente:

| Selector | Elemente găsite |
| --- | --- |
| `form` | Elemente cu numele de tag `form` |
| `#tasks` | Elementul cu `id="tasks"` |
| `.completed` | Elemente a căror listă de clase include `completed` |
| `[data-action="delete"]` | Elemente cu atributul `data-action` egal cu `delete` |
| `#tasks button` | Butoane aflate oriunde în interiorul elementului cu `id="tasks"` |

Selectorul este un șir care descrie căutarea, nu elementul în sine. `document.querySelectorAll("#tasks button")` returnează un `NodeList` cu toate butoanele găsite; `querySelector` returnează doar primul element găsit.

`document.querySelector("#tasks")` găsește primul element care corespunde selectorului CSS sau returnează `null` dacă nu există. La inițializare, găsiți formularul și lista necesare aplicației. Verificați existența elementelor înainte de utilizare, astfel încât un selector greșit să producă o eroare utilă. Transmiteți elementele găsite funcțiilor de randare și tratare a evenimentelor, în loc să căutați repetat în întregul document.

### 28. Construiți un element de listă cu metode DOM

`document.createElement("li")` creează un element. Setați proprietățile, atribuiți textul prin `textContent` și atașați elementul cu `append`. `replaceChildren` înlocuiește copiii curenți ai unui element, fiind utilă pentru redesenarea listei. Aceste metode construiesc direct structura dorită, fără un șir HTML.

### 29. Folosiți `textContent` pentru afișarea datelor ca text

Titlul unei sarcini poate conține `<strong>hello</strong>`. Atribuirea lui la `textContent` afișează literal acele caractere. Atribuirea la `innerHTML` le parsează ca marcaj. Textul primit de la utilizatori sau servicii externe nu trebuie tratat ca marcaj executabil; folosiți `textContent` pentru aceste valori. Folosiți parsarea HTML doar când inserați intenționat marcaj și cu măsurile de protecție potrivite.

### 30. Actualizați datele, apoi redesenați elementele relevante

Păstrați titlurile și indicatoarele de finalizare în datele sarcinilor. Când o sarcină se schimbă, actualizați datele și apelați o funcție de randare pentru afișare. Astfel, datele sunt locul unde inspectați starea curentă a sarcinilor. Dacă handler-ele modifică independent aspectul checkboxurilor, clasele rândurilor și datele sarcinilor, aceste reprezentări pot ajunge să difere.

### 31. Un click poate ajunge la ascultătorii elementelor container

Un **ascultător de evenimente** este o funcție înregistrată cu `addEventListener` pentru a rula când este trimis un eveniment. Pentru un click pe un buton dintr-o listă, traseul evenimentului include butonul și strămoșii săi, precum lista.

În faza **capture**, ascultătorii strămoșilor pot rula pe drumul spre țintă. La **target**, rulează ascultătorii elementului apăsat. În faza **bubbling**, ascultătorii strămoșilor pot rula pe drumul înapoi. `addEventListener("click", handler)` ascultă la țintă sau în bubbling; `{ capture: true }` selectează capture. Clickurile se propagă prin bubbling, dar nu toate tipurile de evenimente o fac.

Consultați [MDN: event bubbling](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling).

### 32. Deosebiți elementul apăsat de elementul care tratează clickul

Pentru un click pe un span dintr-un buton, `event.target` identifică span-ul din exemplul nostru. Dacă ascultătorul este înregistrat pe lista container, `event.currentTarget` identifică lista cât timp rulează ascultătorul. Elementul apăsat și cel care tratează clickul nu trebuie să fie același.

### 33. Tratați clickurile rândurilor cu un singur ascultător pe listă

**Delegarea evenimentelor** înseamnă plasarea unui ascultător pe un element container și folosirea bubblingului pentru a trata evenimentele copiilor. Un ascultător al listei poate trata și rânduri adăugate ulterior, fără ascultător separat pentru fiecare rând.

Pornind de la elementul apăsat, `closest("[data-action]")` verifică elementul și apoi strămoșii săi pentru a găsi controlul cu acțiunea. Găsiți rândul sarcinii care îl conține pentru a obține id-ul. Verificați că acel control și rândul aparțin listei tratate. Apăsarea unui span dintr-un buton de ștergere trebuie să identifice tot butonul și rândul corect.

### 34. Exemplu rezolvat — urmărirea unui click delegat

Deschideți [limita evenimentului delegat](examples/05-delegated-event-boundary/) și apăsați pe eticheta imbricată. Rezultatul identifică separat elementul apăsat, elementul pe care este înregistrat ascultătorul, acțiunea și sarcina.

### 35. Prevenirea acțiunii implicite nu oprește bubblingul

Trimiterea unui formular declanșează în mod normal o acțiune a browserului, precum navigarea. `event.preventDefault()` anulează acțiunea dacă evenimentul permite anularea, lăsând JavaScript să trateze trimiterea. `event.stopPropagation()` împiedică în schimb continuarea evenimentului către alte elemente de pe traseu. Prevenirea navigării nu oprește bubblingul, iar oprirea bubblingului nu previne navigarea.

### 36. Eliminați ascultătorii când nu mai sunt necesari

Dacă inițializarea rulează din nou și înregistrează funcții handler noi fără să le elimine pe cele precedente, un click poate declanșa acțiuni duplicate. Păstrați referințele funcțiilor înregistrate pentru ca eliminarea să poată apela `removeEventListener` cu același tip de eveniment, aceeași referință de funcție și aceeași setare capture. Funcția de inițializare poate returna un `unbind()` care face aceste eliminări înainte de înlocuirea interfeței sau de o nouă inițializare.

Consultați [MDN: removeEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener).

## Intermezzo 3 — limite DOM și de evenimente

Folosiți întrebările cu prefixul `u03-i3-` din [intermezzo.gift](intermezzo.gift). Alocați patru minute, apoi urmăriți un click pe un span imbricat până la ascultătorul delegat al listei.

## Sinteză — urmăriți două cronologii împreună

```text
event target → handler delegat → tranziție stare → randare loading
                                                ↓
                                    pornire operație async
                                                ↓
                    îndeplinire/respingere → mai este actual rezultatul?
                                                ↓
                                    randare stare finală → curățare
```

Revizuiți importurile modulelor și starea partajată, căile de succes și eșec ale promisiunilor, rezultatele distincte de rețea și HTTP ale lui fetch, randarea sigură în DOM și diferența dintre originea unui eveniment și elementul care îl tratează.

## Erori frecvente

- Cicluri de import care fac dependențele greu de urmărit.
- `await` uitat sau respingere neobservată.
- Așteptări secvențiale pentru operații independente.
- Tratarea unui `404` drept `fetch` respins.
- Citirea corpului înainte de verificarea stării HTTP acceptabile.
- Păstrarea stării loading după un eșec.
- Refolosirea unui controller anulat.
- O finalizare învechită care suprascrie starea nouă.
- Randarea datelor nesigure cu `innerHTML`.
- Citirea datelor rândului delegat din `currentTarget`.
- Legarea ascultătorilor duplicați fără curățare.

## Relația cu tutorialul

Multi-source Dashboard combină încărcarea paralelă a datelor cu stările explicite de randare. Interactive Task List combină module, creare DOM și evenimente delegate. Resilient Fetch explicitează timeoutul, reîncercarea, curățarea și clasificarea erorilor. Exemplele cursului rămân modele de diagnostic mai mici.

## Considerații pentru dezvoltarea asistată de AI

Cereți agentului să deseneze cronologia evenimentelor/promisiunilor și să identifice codul care tratează fiecare rezultat și elimină fiecare listener sau timer. Inspectați diferențele generate pentru respingeri netratate, serializare accidentală, erori ascunse, HTML nesigur, refolosirea controllerului și scrieri învechite. Verificați temporizarea cu dependențe controlate, nu cu viteza imprevizibilă a internetului.

## Referințe

- Harta de migrare a cursului, Unitatea 03.
- `webtech-2025-course/c3/async/`, `events/`, `dom/` și `exceptions/`.
- `webTechTutorials-main/S03/` și `S04/`.
- MDN: module, promisiuni, Fetch API, DOM și propagarea evenimentelor.
- Standardele WHATWG Fetch și DOM.
