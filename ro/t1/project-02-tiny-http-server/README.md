# Proiectul 02 — Server HTTP minimal

## Obiectiv

Studiati structura unui server HTTP Node brut foarte mic, apoi adaugati o
singura ruta lipsa bazata pe cale in `student/src/application-handler.js`.

Proiectul furnizat arata deja patru tipare de cereri:

- o cerere de fisier care citeste si returneaza HTML;
- o cerere de fisier care citeste si returneaza CSS;
- o ruta de procesare care citeste parametri din query;
- o ruta de procesare care citeste un corp JSON.

Sarcina voastra este sa completati ruta lipsa bazata pe cale astfel incat
serverul sa trateze si `GET /api/greetings/<name>`.

## Model mental

Cereri diferite pot duce la responsabilitati diferite in server:

```text
cerere pentru fisier → citeste fisierul de pe disc → trimite raspuns text
cerere pentru endpoint cu query → citeste search params → trimite raspuns JSON
cerere pentru endpoint cu cale → citeste segmentul din pathname → trimite raspuns JSON
cerere pentru endpoint cu corp → citeste corpul JSON → trimite raspuns JSON
```

Shell-ul furnizat detine pornirea, `/health`, livrarea fisierelor statice,
fallbackul pentru rute necunoscute si erorile neasteptate. Handlerul
returneaza `true` cand trimite raspunsul si `false` cand shell-ul trebuie sa
pastreze comportamentul de fallback.

## Lucrul cu proiectul studentului

1. Rulati `npm install` in `student/`.
2. Rulati o data `npm run test:baseline`, `npm run test:objective` si
   `npm run test:regression` inainte de editare.
3. Cititi `src/server.js` inainte de a edita handlerul. Identificati ce cereri
   citesc fisiere si ce cereri delega catre `handleApplicationRequest`.
4. Cititi `src/application-handler.js`, `src/http-utils.js` si testele
   obiectivului. Comparati rutele functionale bazate pe query si corp cu ruta
   lipsa bazata pe cale.
5. Cereti lui Codex sarcina delimitata din `spec.md`. Respingeti editarile din
   afara `student/src/application-handler.js` si orice dependenta noua.
6. Inspectati cu atentie fluxul: fiecare ramura tratata trebuie sa trimita
   exact un raspuns si sa returneze `true`.
7. Rulati din nou toate verificarile si inspectati manual rutele de mai jos cu
   `curl` sau Thunder Client.

## Testati manual serverul

Rulati `npm start`, apoi inlocuiti `<base-url>` cu URL-ul loopback afisat.

### Cu curl

Inspectati raspunsul de fisier:

```sh
curl -i "<base-url>/"
```

Inspectati ruta functionala bazata pe query:

```sh
curl -i "<base-url>/api/greetings?name=Ada"
```

Inspectati ruta lipsa bazata pe cale dupa implementare:

```sh
curl -i "<base-url>/api/greetings/Ada%20Lovelace"
```

Inspectati ruta bazata pe corp:

```sh
curl -i -X POST \
  -H 'content-type: application/json' \
  -d '{"clue":"crumbs","count":2}' \
  "<base-url>/api/echo"
```

### Cu Thunder Client

1. Creati o cerere `GET` catre `<base-url>/` si confirmati ca raspunsul este
   HTML citit dintr-un fisier.
2. Creati o cerere `GET` catre `<base-url>/api/greetings?name=Ada` si
   inspectati raspunsul JSON generat din query string.
3. Creati o cerere `GET` catre `<base-url>/api/greetings/Ada%20Lovelace` si
   verificati raspunsul JSON generat din segmentul de cale dupa schimbare.
4. Creati o cerere `POST` catre `<base-url>/api/echo`, setati tipul corpului
   la JSON, trimiteti `{"clue":"crumbs","count":2}` si confirmati atat JSON-ul
   returnat, cat si headerul de raspuns `X-Echoed-Method`.

## Detalii importante

Potriviti impreuna metoda si calea. Pentru ruta lipsa bazata pe cale,
decodati ultimul segment de cale, aplicati `trim` si respingeti o valoare
goala cu `{ "error": "name_required" }`. Pentru ruta de echo, normalizati
numai partea de tip media din `Content-Type`, deoarece pot urma parametri
precum `charset`. Nu parsati corpul inainte de a respinge un tip neacceptat.

## Criterii de reusita

- Verificarile de baza si regresie raman verzi pe tot parcursul.
- Toate verificarile obiectivului trec.
- `npm start` plus cererile documentate cu `curl` sau Thunder Client expun un
  raspuns de fisier, un raspuns bazat pe query, un raspuns bazat pe cale si un
  raspuns bazat pe corp.
- Diff-ul final schimba numai ruta lipsa din handlerul obiectivului.

## Sarcina de depanare

Dupa obtinerea testelor verzi, eliminati temporar un `return` de dupa un
raspuns de eroare pentru salut. Reproduceti si cititi esecul inainte de a cere
un diagnostic de la Codex. Acceptati numai o reparatie focalizata, rerulati
cazul si confirmati ca `/health` functioneaza in continuare.

## Ce ar trebui sa puteti explica

- Ce cereri citesc fisiere de pe disc si ce cereri sunt calculate dinamic.
- De ce potrivirea rutei include metoda si calea.
- Cum difera datele din query de datele din cale si de corpul JSON.
- De ce validarea preceda construirea raspunsului de succes.
- De ce un handler nu trebuie sa trimita doua raspunsuri.
- Cum ati verificat independent codul generat.
