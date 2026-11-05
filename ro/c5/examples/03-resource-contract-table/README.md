# Exemplu de curs — Contracte de resurse REST în Express

## Concept demonstrat

Un serviciu REST real coordonează metoda, starea resursei, statusul, header-ele și body-ul: crearea întoarce `201` cu `Location`, resursele lipsă întorc `404`, iar ștergerea reușită întoarce `204` fără body.

## Rulare și examinare cu un client REST

```bash
npm install
npm start
curl -i 'http://127.0.0.1:3000/api/tasks'
curl -i -X POST 'http://127.0.0.1:3000/api/tasks' -H 'Content-Type: application/json' -d '{"title":"Testează API-ul"}'
curl -i -X DELETE 'http://127.0.0.1:3000/api/tasks/t-1'
npm test
```

Citiți linia de status, `Location`, `Content-Type` și body-ul ca un singur contract. Un body JSON plauzibil cu status greșit rămâne incorect.

## Validare

`npm test` efectuează cereri HTTP reale către un server Express efemer și verifică listarea, crearea, citirea ulterioară, resursa lipsă și ștergerea fără body.


Revalidat la 2026-10-26: instalarea curată și verificările HTTP reale trec pe Node 24.5.0.

Exemplul presupune un titlu valid pentru a izola semantica HTTP. Map se resetează la repornire; validarea este demonstrată separat în exemplele 04 și 05.

## Vederi ale colecției și formate de răspuns

Gestionarul GET al colecției demonstrează acum filtrare → sortare stabilă → paginare → codificare. Rulează cu serverul deja pornit:

```bash
curl -i 'http://127.0.0.1:3000/api/tasks?sort=title&order=desc&limit=1'
curl -i 'http://127.0.0.1:3000/api/tasks?q=Agenda&limit=2' -H 'Accept: application/json'
curl -i 'http://127.0.0.1:3000/api/tasks?q=Agenda&limit=2' -H 'Accept: text/csv'
curl -i 'http://127.0.0.1:3000/api/tasks' -H 'Accept: application/xml'
```

Filtrarea caută un subșir al titlului fără diferențiere între majuscule și minuscule. Sortarea acceptă doar titlul, cu direcție asc/desc și departajare după ID crescător. Implicit offset este 0 și limit este 2; limit trebuie să fie 1–20. Parametrii numerici trebuie să fie întregi zecimali în intervalul sigur JavaScript. Parametrii necunoscuți sau repetați sunt respinși cu 400. Sortarea folosește compararea șirurilor JavaScript, nu ordinea alfabetică a unei limbi. Nu modifică niciodată Map-ul stocat.

JSON include data și meta (totalul potrivirilor, offset, limit). CSV include aceiași membri selectați, cu câmpuri între ghilimele și ghilimele interne dublate. Antetul Link oferă URI-ul paginii următoare păstrând selecția din interogare; păstrează Accept când îl urmezi. Lipsa lui Accept sau un wildcard alege implicit JSON. Exemplul respectă preferințele media, trimite Vary: Accept și alege 406 când niciun format disponibil nu este acceptabil. Erorile diagnostice folosesc JSON. Cache-Control: no-store dezactivează intenționat stocarea răspunsurilor în această demonstrație schimbătoare; Vary singur nu activează cache-ul.

Compară Content-Type din cerere cu Accept: primul descrie corpul cererii, al doilea negociază răspunsul. Nu sunt implementate antete proprii de filtrare sau un parametru de format. Paginarea cu offset se poate deplasa la modificări concurente; nu asigură un instantaneu izolat. Linkul următor demonstrează navigarea, nu conformitatea completă cu nivelul 3 REST.

Revalidat la 2026-10-26: verificările existente creare/citire/ștergere și cele noi pentru colecție trec. Acestea acoperă filtrarea, departajarea deterministă, ordonarea fără modificarea stocării, paginarea și continuarea, paginile goale, respingerea parametrilor invalizi, JSON/CSV, preferințele de calitate, 406, Vary și ghilimelele CSV.

Verificări suplimentare la 2026-10-30: `check.test.js` demonstrează filtrarea și sortarea descrescătoare înaintea paginării, urmărirea linkului următor fără pierderea selecției și rezultatele goale reușite ca JSON sau CSV doar cu antetul coloanelor. Toate cele cinci verificări trec cu `npm test`.
