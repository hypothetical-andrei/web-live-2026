# Exemplu de curs — Validatori și constrângeri în baza de date

## Concept demonstrat

Urmărește aceeași notă prin validarea JavaScript și constrângerile SQLite. Validatorii incluși, cei personalizați pe câmp și cei pe întregul model rulează în Sequelize; constrângerile NOT NULL și UNIQUE protejează și scrierile SQL directe.

## De ce apare exemplul în curs

Exemplul schemei arată metadatele. Comparația face vizibilă aplicarea regulilor: jurnalul SQL rămâne gol la validarea respinsă în model, dar înregistrează INSERT încercat pentru un slug duplicat. Baza temporară în memorie permite verificări invalide directe fără afectarea notelor păstrate.

## Ce trebuie să observi

- notEmpty, len cu args/msg, tiparul slugului, isIn, limitele numerice și isEmail resping fiecare valorile invalide corespunzătoare.
- meaningfulTitle aruncă pentru titlul rezervat; archiveNeedsReason folosește this pentru două atribute împreună.
- Validatorul personalizat nullable primește null; validatorul inclus de e-mail permite null deoarece allowNull este true.
- build construiește instanța, validate verifică fără SQL, iar save o scrie.
- Slugul duplicat ajunge la SQLite și eșuează cu UniqueConstraintError.
- SQL direct poate insera un titlu gol deoarece regula JavaScript nu este o constrângere SQL. Nu poate totuși insera titlu null sau slug duplicat.
- bulkCreate omite implicit validatorii pe rând; validate:true îi activează.

## Rulare / examinare

```bash
npm ci
npm test
```

Citește aserțiunile lângă model. Pentru fiecare eșec, numește regula, dacă s-a încercat SQL și ce scriitor ar putea ocoli regula. Scriptul închide baza în finally și nu lasă fișier.

## Explicație

Erorile de validare identifică un câmp sau regula pe model în error.errors. Verificarea căii împiedică un eșec fără legătură să satisfacă accidental testul. O valoare implicită completează lipsa, nu înlocuiește validarea. Motivul opțional al arhivării are explicit valoarea implicită null.

## Variații

Schimbă împreună o regulă inclusă și valoarea invalidă. Prezice de ce un validator JavaScript nou nu schimbă SQL direct. Explică de ce o căutare de unicitate înaintea inserării nu înlocuiește constrângerea când doi scriitori rulează concurent. Nu transforma probele care ocolesc validarea în căi de scriere ale aplicației.

## Validare

La 2026-10-26, instalarea curată npm ci și npm test au trecut pe Node 24.5.0, cu Sequelize 6.37.8 și SQLite prin sqlite3 6.0.1. Verificările execută SQL real, fără simulări ale bazei. Acoperă respingerea prin validatori incluși și personalizați, null, verificarea fără inserare, salvare/actualizare, unicitate/nulabilitate SQL și validarea implicită versus activată pentru crearea în masă.

### Pornire directă și consola

Rulează `npm start` după `npm ci`. Consola explică pașii și rezultatele observate. Scriptul se încheie după verificări și închide baza de date.
