# Derivarea variantei pentru student — Detectiv HTTP

## Sursa de referință

Varianta `reference/`, după ce validarea din `validation.md` a trecut verificările de bază, obiectiv și regresie la 2026-08-10.

## Elemente eliminate sau modificate

### `student/case-report.json`

- **Schimbare:** Fiecare observație completată din cele trei intrări a fost înlocuită cu `"TODO"`, `null` sau un obiect placeholder. Numele intrărilor și câmpurilor au fost păstrate.
- **Motiv:** Colectarea și consemnarea acestor valori din traficul real reprezintă întreaga responsabilitate a studentului.
- **Obiectiv:** Inspectarea schimburilor HTTP și separarea proprietăților cererii de cele ale răspunsului.
- **Consecință observabilă:** Serverul, pagina și cererile funcționează, dar raportul nu le descrie.
- **Verificarea obiectivului:** eșuează până la înlocuirea tuturor placeholder-elor.

Niciun alt fișier de referință nu a fost schimbat intenționat.

## Invariante păstrate

- setul de dependențe și lock file-ul rămân echivalente;
- structura proiectelor rămâne paralelă;
- serverul și investigația din browser rămân intacte;
- testele de bază și regresie sunt identice la nivel de octeți;
- validatorul obiectivului este identic și compară raportul cu traficul real.

## Verificările așteptate pentru varianta studentului

### Trebuie să treacă

- `npm install` curat;
- `npm run test:baseline` — 2 verificări;
- `npm run test:regression` — 3 verificări;
- comportamentul documentat pentru `npm start`.

### Trebuie să eșueze sau să rămână incomplete

- `npm run test:objective` eșuează la primul placeholder din `case-report.json`;
- prin urmare, `npm test` raportează drept eșuat numai fișierul testului obiectivului.

## Verificarea scurgerilor de soluție

Raportul completat nu apare în arborele studentului. Codul aplicației conține în mod necesar cererile ce trebuie observate, dar comentariile, resursele, artefactele generate, documentația și mesajele de eșec nu reproduc raportul complet și nu dezvăluie valorile derivate din răspuns drept răspunsuri.
