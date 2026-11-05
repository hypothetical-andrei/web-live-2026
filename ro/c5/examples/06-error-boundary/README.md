# Exemplu de curs — Middleware centralizat de eroare Express

## Concept demonstrat

Rutele și parserele trimit eșecurile către un singur middleware Express cu patru parametri. Erorile publice cunoscute păstrează statusuri și coduri precise; eșecurile neașteptate devin un `500 internal_error` generic, fără detalii interne.

## Rulare și examinare cu un client REST

```bash
npm install
npm start
curl -i 'http://127.0.0.1:3000/api/tasks/missing'
curl -i 'http://127.0.0.1:3000/api/failure'
curl -i -X POST 'http://127.0.0.1:3000/api/tasks' -H 'Content-Type: application/json' -d '{'
npm test
```

Serverul poate loga diagnostice private, dar contractul răspunsului trebuie să rămână sigur. Examinați statusul, content type, codul erorii și mesajul public.

## Validare

`npm test` exercită eșecuri cunoscute, neașteptate și JSON malformat printr-un server Express real și confirmă că textul cu secrete lipsește din răspunsuri.


## Observații suplimentare

Compară `/api/failure` cu `/api/async-failure`: ambele ajung la același middleware de eroare în Express 5. `/api/untrusted-error` are status 400, dar rămâne un eșec intern deoarece nu este un PublicError construit explicit. `/api/partial-failure` trimite octeți înainte de eșec: clientul vede un răspuns incomplet, iar gestionarul implicit Express poate afișa diagnosticul în terminal. Un POST ulterior reușește. Acel POST verifică doar răspunsul normal; nu validează sau stochează sarcini.

Revalidat la 2026-10-26: instalarea curată și testele HTTP reale trec pe Node 24.5.0, inclusiv pentru JSON prea mare, rute lipsă, promisiune respinsă, răspuns fără detalii interne, eșec după răspuns parțial și o cerere validă ulterioară.
