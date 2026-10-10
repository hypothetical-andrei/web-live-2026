# Cursul 02 — JavaScript pentru citirea și modificarea programelor

> Durată planificată: 96 de minute  
> Format: trei blocuri conceptuale, cinci exemple și trei intermezzouri de recapitulare

## Rezultatele învățării

La sfârșitul sesiunii, studenții ar trebui să poată:

- descrie JavaScript ca limbaj multiparadigmă, centrat pe obiecte, cu sintaxă de suprafață din familia C;
- distinge cele șapte tipuri primitive de valorile-obiect și recunoaște tablourile și funcțiile ca participanți speciali la sistemul de obiecte;
- urmări căutarea proprietăților proprii, delegarea prin prototip, ascunderea și metodele claselor;
- explica identitatea obiectelor, aliasurile, mutația și copierea superficială;
- folosi funcții de ordin întâi, operații de ordin superior și închideri lexicale;
- citi fluxuri `filter`–`map`–`reduce` prin forma intrărilor și ieșirilor;
- audita cod JavaScript generat necunoscut folosind contraexemple și verificări țintite.

Programarea asincronă este intenționat în afara domeniului acestui curs. Cursul 03 introduce module, promisiuni, `async`/`await`, evenimente de browser și execuție planificată.

## Planul sesiunii

| Segment | Timp | Temă |
| --- | ---: | --- |
| Harta inițială a limbajului | 0–7 min | Ce fel de limbaj este JavaScript? |
| Bloc conceptual 1 | 7–28 min | Sintaxă, valori și tipuri în execuție |
| Intermezzo 1 | 28–32 min | Clasificarea valorilor și afirmațiilor despre sintaxă |
| Bloc conceptual 2 | 32–55 min | Obiecte, prototipuri, identitate și copii |
| Intermezzo 2 | 55–59 min | Urmărirea căutării și a referințelor partajate |
| Bloc conceptual 3 | 59–82 min | Nucleu funcțional, închideri, fluxuri și audit |
| Intermezzo 3 | 82–86 min | Urmărirea funcțiilor și contraexemple |
| Sinteză | 86–96 min | Un limbaj, mai multe perspective de lectură |

## Harta inițială — punctuație familiară, execuție diferită

```js
const select = (records, predicate) => {
  const selected = [];
  for (const record of records) {
    if (predicate(record)) selected.push(record);
  }
  return selected;
};
```

Acoladele, declarațiile, bucla, condiția, apelurile și `return` sunt familiare programatorilor care cunosc limbaje din familia C. Întrebările mai profunde sunt specifice JavaScript: la ce valoare se referă fiecare nume în acest moment, ce obiect deține `push`, unde este găsită metoda și cum poate ajunge o funcție prin `predicate`?

## Bloc conceptual 1 — sintaxă, valori și tipuri în execuție

### 1. JavaScript este multiparadigmă

JavaScript acceptă cod procedural, delegare orientată pe obiecte și compunere funcțională în același program. Descrierea lui exclusiv ca orientat pe obiecte sau exclusiv funcțional ascunde părți utile ale proiectării. „Centrat pe obiecte” descrie amploarea sistemului de obiecte fără să pretindă că fiecare valoare este obiect.

### 2. Sintaxa de suprafață aparține intenționat familiei C

Blocurile folosesc acolade, apelurile folosesc paranteze, expresiile folosesc operatori aritmetici și de comparație familiari, iar fluxul de control include `if`, `for`, `while` și `switch`. Familiaritatea reduce costul citirii fluxului de control de bază.

### 3. Sintaxa familiară nu implică semantica limbajului C

JavaScript are tipare dinamică, colectare automată a memoriei și prototipuri. Variabilele nu declară tipuri fixe, obiectele nu sunt structuri C, funcțiile sunt valori, iar căutarea metodelor poate continua printr-un lanț de prototipuri. Citește regulile execuției, nu ghici pe baza punctuației.

### 4. Un nume se poate referi la valori de tipuri diferite

```js
let estimate = 3;
estimate = "three";
```

`estimate` este numele (sau identificatorul) din codul sursă. Declarația creează o legătură: în timpul execuției, numele se referă mai întâi la numărul `3`, apoi la șirul `"three"`. JavaScript nu atașează un tip permanent numelui; fiecare valoare are un tip. Când citești codul, poți cunoaște valoarea și tipul exact, poți cunoaște doar tipul sau tipurile posibile ori le poți afla abia la execuție. Dacă o declarație `let` nu are inițializator, valoarea ei devine `undefined` după inițializare; citirea ei înainte de inițializare aruncă o eroare. `Symbol` în JavaScript este un tip de valoare primitivă, nu un alt cuvânt pentru numele unei variabile.

### 5. JavaScript modern are șapte tipuri primitive

Tipurile primitive sunt `string`, `number`, `bigint`, `boolean`, `undefined`, `symbol` și `null`. Sunt categorii distincte de valori, cu roluri distincte: text, valori numerice obișnuite și mari, valori logice, o valoare neatribuită, un simbol unic și o absență intenționată. Avem nevoie de toate șapte în model chiar acum: de exemplu, `0`, `"0"`, `false`, `null` și `undefined` nu sunt interschimbabile, chiar dacă unele expresii cu conversie implicită le tratează asemănător. `===` compară valorile primitive după valoare; când compară obiecte, compară identitatea.

### 6. Primitivele nu sunt obiecte

Valorile primitive nu sunt obiecte și nu pot păstra proprietăți modificabile. Totuși, `"web".toUpperCase()` funcționează: la accesarea proprietății și apelul metodei, JavaScript oferă temporar comportamentul obiectului wrapper pentru șir. Această împachetare automată nu transformă șirul într-un obiect și nu îi oferă spațiu persistent pentru proprietăți. `null` și `undefined` nu au un astfel de comportament, deci accesarea proprietăților lor aruncă o eroare.

### 7. `typeof` este util, dar nu clasifică totul

Tablourile sunt obiecte, de aceea `typeof []` este `"object"`; funcțiile apelabile raportează `"function"`. Rezultatul istoric și înșelător este `typeof null === "object"`. Folosește `value === null` pentru null și `Array.isArray(value)` pentru tablouri. `value instanceof SomeClass` întreabă dacă `SomeClass.prototype` apare în lanțul de prototipuri al valorii; poate distinge instanțele unei clase, dar nu este un test universal de tip (de exemplu, poate eșua între contexte JavaScript separate). Alege verificarea care răspunde întrebării concrete.

### 8. Obiectele sunt colecții de proprietăți accesate prin referință

Un obiect este o valoare cu identitate și proprietăți: fiecare proprietate asociază o cheie de tip șir sau simbol cu o valoare. O variabilă care conține un obiect păstrează o referință la el, astfel încât atribuirea acelei valori altei variabile oferă încă o cale de acces la același obiect. Valorile proprietăților pot fi orice valori JavaScript, inclusiv funcții. JavaScript are funcții de ordin întâi, astfel că o funcție stocată într-un obiect este numită adesea metodă. Tablourile, datele, hărțile și alte obiecte încorporate adaugă comportamente specializate aceluiași model de obiecte.

### 9. Funcțiile sunt valori apelabile

O funcție poate fi atribuită unei legări, stocată într-un obiect, plasată într-un tablou, transmisă ca argument și întoarsă din altă funcție. Apelabilitatea este o capacitate suplimentară, nu un univers separat de obiecte.

### 10. Exemplu — structura limbajului JavaScript

Rulează [structura limbajului JavaScript](examples/01-language-shape/):

```bash
node lectures/02-javascript/ro/examples/01-language-shape/example.js
```

Folosește tabelul pentru a deosebi modelul real primitive/obiecte de rezultatul incomplet oferit de `typeof`. Apoi identifică funcția transmisă prin `apply`.

### 11. `const` și `let` controlează legările

`const` împiedică reatribuirea; nu îngheață un obiect. Folosește `let` pentru o legare care chiar se schimbă și păstrează-i domeniul restrâns. Evită `var` în codul nou al cursului, deoarece domeniul său la nivel de funcție și regulile de hoisting nu aduc valoare bazei standard.

### 12. Conversia implicită este o regulă de execuție, nu validare

Conversia schimbă o valoare dintr-un tip în altul, de exemplu `Number("12")` produce `12`. Coerciția este conversia pe care JavaScript o face ca parte a altei operații. JavaScript acceptă cu mult entuziasm coerciția implicită: `0 == false` este adevărat, iar `"5" + 1` produce șirul `"51"`. Și `Boolean("false")` produce `true`, deoarece orice șir nevid este truthy. Folosește conversia explicită când asta intenționezi și decide deliberat dacă operația ar trebui să permită coerciția implicită.

## Intermezzo 1 — structura limbajului și valori

Folosește întrebările cu prefixul `u02-i1-` din [intermezzo.gift](intermezzo.gift). Acordă patru minute, apoi corectează afirmația „totul în JavaScript este obiect”.

## Bloc conceptual 2 — obiecte, prototipuri, identitate și copii

### 13. Obiectele asociază chei de proprietăți cu valori

Cheile proprietăților sunt șiruri sau simboluri. Sintaxa cu punct este comodă pentru nume fixe asemănătoare identificatorilor; sintaxa cu paranteze evaluează o expresie-cheie. Citirea unei proprietăți și deținerea acelei proprietăți sunt afirmații diferite.

### 14. Căutarea începe cu proprietățile proprii

`Object.hasOwn(value, key)` verifică dacă receptorul însuși conține proprietatea. Nu raportează proprietăți moștenite. Distincția contează pentru valori implicite, serializare, intrări nesigure și analiza traversării obiectelor în cod generat.

### 15. Căutarea nereușită deleagă unui prototip

Când proprietatea proprie lipsește, JavaScript urmează legătura internă către prototip și repetă căutarea. Procesul continuă până găsește proprietatea sau lanțul se termină la `null`, producând `undefined`.

### 16. Moștenirea prototipală este delegare

Un obiect nu are nevoie de o declarație de clasă pentru a moșteni comportament. Poate delega căutarea altui obiect. Acest model diferă de moștenirea centrată pe clase din Java, C# și limbaje similare.

### 17. Exemplu — căutarea proprietăților prin prototip

Rulează [căutarea proprietăților prin prototip](examples/02-prototype-lookup/):

```bash
node lectures/02-javascript/ro/examples/02-prototype-lookup/example.js
```

Urmărește `id`, `priority`, `describe` și `missing` dinspre receptor spre exterior. Folosește `Object.hasOwn` și `Object.getPrototypeOf` drept dovezi, nu doar valoarea întoarsă.

### 18. Atribuirea poate ascunde o proprietate moștenită

Atribuirea `task.priority = "urgent"` creează sau actualizează de obicei o proprietate proprie. Nu rescrie `priority` din prototip. Ștergerea proprietății proprii dezvăluie din nou valoarea moștenită.

### 19. Apelurile metodelor leagă un receptor

În `task.describe()`, căutarea găsește o funcție, iar apelul furnizează `task` drept `this`. Extragerea funcției și apelarea ei separată poate pierde receptorul. Funcțiile săgeată nu își creează propriul `this` dinamic; folosește-le pentru captură lexicală, nu ca sintaxă universală pentru metode.

### 20. Sintaxa `class` folosește prototipuri

Metodele declarate în corpul unei clase sunt stocate în mod normal în `Constructor.prototype` și partajate de instanțe. Clasele oferă sintaxă utilă pentru construire și moștenire, dar nu înlocuiesc mecanismul prototipal de căutare.

### 21. Nu modifica prototipurile încorporate

Înțelegerea prototipurilor este necesară pentru citirea limbajului. Extinderea lui `Array.prototype` schimbă comportamentul tuturor tablourilor din contextul curent; o altă bibliotecă poate folosi același nume de proprietate sau se poate baza pe comportamentul standard. Schimbarea prototipului unui obiect în timpul execuției face și căutarea mai greu de urmărit. Evită aceste schimbări în codul obișnuit, cu excepția cazului în care implementezi și testezi intenționat ceva precum un polyfill; este o regulă generală de mentenabilitate, nu o convenție specială a cursului.

### 22. Atribuirea unui obiect creează un alias

Două legări se pot referi la același obiect. Mutația prin oricare referință schimbă obiectul partajat. În schimb, două literale-obiect create separat, chiar dacă arată la fel, au identități distincte.

### 23. Spread, înghețarea, sigilarea și copierea profundă au scopuri diferite

Spread pentru tablou sau obiect creează un singur nivel nou de container. Obiectele imbricate rămân partajate dacă nu este copiată și calea modificată. Destructurarea selectează valori locale; nu le copiază.

`Object.freeze(value)` împiedică adăugarea sau eliminarea proprietăților proprii și schimbarea valorilor proprietăților proprii de date. `Object.seal(value)` împiedică adăugarea sau eliminarea proprietăților proprii și schimbarea descriptorilor lor, dar valorile proprietăților de date care pot fi scrise pot fi în continuare atribuite. Ambele operații sunt superficiale: un obiect imbricat poate fi modificat în continuare. Niciuna nu creează o copie, deci toate aliasurile către acel obiect văd aceleași restricții.

O copie profundă creează obiecte noi de-a lungul unei structuri imbricate, astfel încât modificările obiectelor imbricate copiate nu afectează originalul. Trebuie să țină cont de cicluri și referințe partajate, iar ce poate copia depinde de metoda aleasă. `structuredClone(value)` gestionează multe tipuri de date încorporate și cicluri, dar nu poate copia funcții și nu păstrează comportamentul claselor personalizate. Alege copierea când ai nevoie de date independente; alege `freeze` sau `seal` când scopul este să restricționezi modificările obiectului existent.

### 24. Exemplu — identitate, aliasuri și copii superficiale

Rulează [identitate, aliasuri și copii superficiale](examples/03-identity-shallow-copy/):

```bash
node lectures/02-javascript/ro/examples/03-identity-shallow-copy/example.js
```

Desenează containerele referențiate înainte să citești aserțiunile. Modelul identității pregătește actualizările ulterioare ale stării React fără să introducă React prematur.

## Intermezzo 2 — urmărirea prototipurilor și identității

Folosește întrebările cu prefixul `u02-i2-` din [intermezzo.gift](intermezzo.gift). Acordă patru minute, apoi desenează atât lanțul căutării prin prototip, cât și graful referințelor obiectelor imbricate.

## Bloc conceptual 3 — nucleu funcțional, închideri, fluxuri și audit

### 25. Funcțiile sunt valori: acesta este sensul expresiei „de ordin întâi”

Funcțiile JavaScript sunt obiecte apelabile, iar limbajul ne permite să le folosim ca valori: să atribuim una unei variabile, să o stocăm într-un obiect, să o transmitem altei funcții sau să o întoarcem dintr-o funcție. „De ordin întâi” înseamnă că pot apărea în aceste poziții obișnuite de valori. O funcție de ordin superior primește altă funcție, întoarce una sau ambele. Metodele tablourilor, înregistrarea evenimentelor, middleware-ul și multe API-uri web folosesc această capacitate.

### 26. Funcțiile săgeată și cele obișnuite se suprapun, dar diferă

Ambele forme creează valori-funcție. Într-o funcție obișnuită, `this` este de regulă determinat de modul apelului: `task.describe()` o apelează cu `task` drept `this`, pe când extragerea lui `task.describe` și apelarea funcției extrase nu păstrează `task` drept receptor. Acesta este receptorul dinamic al metodei, iar valoarea lui depinde de apel. Funcțiile săgeată preiau `this` din domeniul exterior și nu pot fi constructori. Alege forma al cărei comportament pentru `this` și construire se potrivește scopului.

### 27. Domeniul lexical permite închideri

O funcție rezolvă numele înconjurătoare din locul unde a fost creată. Dacă folosește un nume din acel domeniu exterior, funcția păstrează accesul la mediul lexical necesar chiar și după terminarea apelului exterior. Funcția împreună cu mediul păstrat formează o închidere; astfel, comportamentul și starea pot rămâne împreună.

### 28. O închidere păstrează comportamentul împreună cu starea capturată

Închiderea este un mecanism al limbajului, nu un ocol pentru o funcție lipsă. De exemplu, o funcție poate crea un contor și poate întoarce o funcție care îl incrementează. Funcția întoarsă are în continuare acces la contor după terminarea funcției care l-a creat, în timp ce alt cod nu poate accesa direct acea variabilă locală. Închiderile sunt utile pentru a păstra comportamentul și starea împreună; dacă starea capturată se poate schimba, clarifică durata ei de viață și cine o poate modifica.

### 29. Metodele colecțiilor sunt funcții de ordin superior

- `filter` selectează zero sau mai multe elemente originale;
- `map` produce câte o ieșire pentru fiecare intrare;
- `reduce` combină colecția într-un acumulator;
- `some` și `every` reduc colecția la o valoare booleană.

Callback-urile lor sunt valori-funcție obișnuite, furnizate de apelant.

### 30. Urmărește ce primește și ce întoarce fiecare etapă a fluxului

Pentru fiecare etapă, întreabă-te ce intră, ce operație are loc și ce iese. În `Task[] → selected Task[] → EstimateView[] → number`, `filter` păstrează sarcinile care trec un test, `map` transformă fiecare sarcină selectată într-o estimare, iar `reduce` combină estimările într-un număr. Un rezultat intermediar numit `selectedTasks` face mai ușoară inspectarea datelor în acel punct. Destructurarea arată ce proprietăți citește o etapă; rest și spread colectează sau copiază proprietăți. Acestea sunt metode practice de urmărire a datelor, nu o cerință de a adăuga tipuri explicite peste tot.

### 31. `reduce` are nevoie de o valoare inițială și de o expresie pentru valoarea următoare

`reduce` pornește de la o valoare inițială a acumulatorului. Pentru fiecare element, callback-ul calculează acumulatorul următor din acumulatorul curent și elementul respectiv, la fel cum `map` folosește o expresie pentru a calcula o ieșire pentru fiecare intrare. De exemplu, suma prețurilor pornește de la `0`; la fiecare pas, acumulatorul următor este `sum + price`. Valoarea inițială definește și rezultatul unui tablou gol. Dacă datele conțin un șir în loc de număr, `+` poate concatena în loc să adune, deci inspectează sau convertește datele în mod deliberat.

### 32. Exemplu — flux de ordin superior și închidere

Rulează [fluxul de ordin superior și închiderea](examples/04-higher-order-pipeline/):

```bash
node lectures/02-javascript/ro/examples/04-higher-order-pipeline/example.js
```

Separă momentul configurării de cel al evaluării, apoi numește forma intrării și ieșirii fiecărei etape a colecției.

### 33. Un nucleu funcțional face tranzițiile ușor de examinat

Funcțiile mici care întorc rezultate din intrări explicite sunt ușor de compus și testat. JavaScript nu impune puritatea: funcțiile pot modifica obiecte, captura stare, efectua I/O sau depinde de timp. Consideră puritatea o proprietate utilă de proiectare, nu o garanție a limbajului.

### 34. Auditează codul generat prin contraexemple

Pornește de la tipurile acceptate și forma ieșirii. Furnizează valori precum `"false"` alături de `false`, un șir alături de un număr, colecții goale, obiecte imbricate partajate și proprietăți absente. Un lanț familiar de metode nu dovedește că îi sunt respectate contractele.

### 35. Păstrează eșecurile precise până când politica este cunoscută

Codul de nivel inferior poate arunca o eroare când nu își poate respecta contractul. Capturează la limita care știe dacă trebuie să reîncerce, să omită, să raporteze sau să oprească. Un `catch` larg care întoarce o valoare implicită plauzibilă distruge distincția dintre date invalide și rezultat valid.

### 36. Exemplu — trei capcane JavaScript în execuție

Rulează [trei capcane JavaScript în execuție](examples/05-runtime-pitfalls/):

```bash
node lectures/02-javascript/ro/examples/05-runtime-pitfalls/example.js
```

Înainte să rulezi codul, prezice rezultatul coerciției, ambele rezultate pentru valorile implicite și ce se întâmplă când proprietatea proprie `describe` ascunde metoda moștenită. Compară apoi JSON-ul greșit format cu o estimare validă de zero și explică ce ascunde blocul `catch`.

### 37. Citește codul necunoscut dinspre limite spre interior

```text
punct de intrare
→ tipuri și forme acceptate
→ căutarea proprietăților și identități partajate
→ callback-uri și legări capturate
→ mutații și alte efecte
→ forma ieșirii
→ responsabilitatea pentru eșec
```

Nu citi fiecare funcție auxiliară în ordinea fișierului înainte să localizezi traseul observabil.

### 38. Transformă presupunerile în verificări țintite

Folosește contraexemple care pot infirma implementarea: tipuri primitive amestecate pentru conversie, proprietăți proprii față de moștenite pentru căutare, aserțiuni de identitate pentru copii, tablouri goale pentru reducer-e, configurație invalidă pentru închideri și eșecuri distincte pentru limitele `catch`. Examinează semantic diferențele generate și rulează singur verificările.

## Intermezzo 3 — funcții, închideri și audit

Folosește întrebările cu prefixul `u02-i3-` din [intermezzo.gift](intermezzo.gift). Acordă patru minute, apoi urmărește o funcție de la creare, prin captură și transmitere ca argument, până la apel.

## Sinteză — un limbaj, mai multe perspective de lectură

| Perspectivă | Întrebare |
| --- | --- |
| Valoare | Ce valori primitive sau obiect pot ajunge la această expresie? |
| Proprietate | Valoarea este proprie, moștenită, ascunsă sau absentă? |
| Identitate | Ce legări partajează un obiect? |
| Funcție | Unde a fost creată, transmisă și apelată și ce capturează? |
| Formă | Ce formă de colecție sau înregistrare intră și iese din fiecare etapă? |
| Efect | Ce se poate modifica, ce poate arunca erori sau evada în alt fel din funcție? |

Aspectul JavaScript din familia C ajută la parsarea inițială. Valorile dinamice, delegarea prin prototip, identitatea obiectelor și funcțiile de ordin întâi determină ce face programul în realitate.

## Moduri frecvente de eșec

- Afirmația „totul este obiect”, urmată de tratarea greșită a primitivelor sau a lui `null`.
- Tratarea lui `typeof` ca un clasificator complet în execuție.
- Presupunerea că sintaxa claselor înlocuiește prototipurile.
- Confundarea unei proprietăți moștenite cu una proprie.
- Modificarea prototipurilor încorporate doar pentru că există delegare prototipală.
- Presupunerea că `const` îngheață obiectul sau spread îl copiază profund.
- Pierderea receptorului unei metode la extragerea unei funcții obișnuite.
- Tratarea truthiness sau conversiei drept validare.
- Omiterea valorii inițiale a unui reducer pentru intrări posibil goale.
- Acceptarea unui flux generat compact fără contraexemple.
- Capturarea tuturor excepțiilor și întoarcerea unei valori implicite înșelătoare.

## Legătura cu tutorialul

Dataset Transformer aplică verificări la limitele execuției și etape denumite ale unui flux de ordin superior. Rule Engine construiește predicate și transformări compozabile din funcții de ordin întâi și închideri. Generated-Code Audit folosește perspectivele tipului, proprietății, identității, funcției, formei și efectului pentru a găsi defecte de conversie și mutație. Căutarea prin prototip rămâne fundament de curs, nu devine un tutorial despre modificarea prototipurilor.

## Legătura cu cursurile învecinate

Cursul 01 a furnizat reprezentări JSON și mici scripturi de verificare, al căror JavaScript poate fi acum citit mai deliberat. Cursul 03 adaugă module și planificare asincronă acestei fundații sincrone. El acoperă promisiuni, `async`/`await`, evenimente, `fetch` și eșecuri peste limite asincrone; niciunul dintre aceste mecanisme nu este necesar aici.

## Considerații pentru dezvoltarea asistată de IA

Cere unui agent să clasifice valorile, să urmărească prototipurile, să deseneze identitățile obiectelor și să numească intrările/ieșirile callback-urilor înainte să modifice cod necunoscut. Solicită contraexemple care îi pot infirma interpretarea. După schimbare, examinează diferențele, rulează verificările și explică mecanismul relevant din execuție fără să depinzi de prompt.

## Referințe

- Harta de migrare a cursului, Unitatea 02.
- `webtech-2025-course/c2/`.
- `webTechTutorials-main/S01/` și `S02/`.
- Ghidul JavaScript MDN: gramatică, tipuri, obiecte, moștenire prin prototip, funcții, închideri, tablouri și tratarea erorilor.
- Secțiunile specificației ECMAScript despre tipuri, obiecte și căutarea obișnuită a proprietăților.
- Documentația Node.js pentru aserțiuni și rularea testelor.
