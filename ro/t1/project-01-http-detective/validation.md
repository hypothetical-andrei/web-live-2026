# Raport de validare — Detectiv HTTP

## Validarea referinței

- [x] Instalarea curată a dependențelor reușește.
- [x] Comanda de pornire documentată reușește.
- [x] Verificările de bază trec.
- [x] Verificările obiectivului trec.
- [x] Verificările de regresie trec.
- [x] Criteriile observabile sunt îndeplinite.

### Comenzi și rezultate

- `npm install` — reușit; un pachet local auditat, fără vulnerabilități.
- `npm run test:baseline` — 2/2 verificări trecute.
- `npm run test:objective` — 1/1 verificare trecută față de observații reale.
- `npm run test:regression` — 3/3 verificări trecute.
- `npm test` — 6/6 verificări trecute.
- `npm start` — pornit pe un port loopback atribuit de sistem și URL afișat.
- `curl -sS -i <base-url>/api/clues?case=missing-cookie` — observate independent `200`, tipul JSON, `X-Case-Id: missing-cookie` și payload-ul corespunzător.

Comenzile loopback au necesitat execuție în afara sandboxului, deoarece acesta refuză socket binding cu `EPERM`; este o restricție a mediului de autorare, nu un eșec al exercițiului.

## Validarea variantei studentului

- [x] Varianta a fost copiată/derivată din referința validată.
- [x] Instalarea curată reușește.
- [x] Comportamentul de bază funcționează.
- [x] Regresiile independente trec.
- [x] Obiectivul eșuează exact cum este documentat.
- [x] Nu au fost găsite scurgeri accidentale ale soluției.
- [x] Diferența corespunde `derivation.md`.

### Comenzi și rezultate

- `npm install` — reușit; un pachet local auditat, fără vulnerabilități.
- `npm run test:baseline` — 2/2 verificări trecute.
- `npm run test:regression` — 3/3 verificări trecute.
- `npm run test:objective` — eșuat la `stylesheet.method`, deoarece valoarea este încă `"TODO"`; eșecul nu a afișat valoarea așteptată.
- `diff -qr reference student` — numai `case-report.json` diferă.
- Căutarea scurgerilor — nu a găsit un raport completat duplicat sau text care conține răspunsurile.

## Excepții

Observația din Network este reprezentată de aceleași cereri furnizate și exercitate prin verificări de integrare reale. Validatorul a confirmat și pornirea manuală documentată plus un schimb din linia de comandă; interacțiunea completă în DevTools rămâne activitate manuală pentru student.

Verificările loopback ale studentului au necesitat, de asemenea, execuție în afara sandboxului din cauza restricției de socket binding.
