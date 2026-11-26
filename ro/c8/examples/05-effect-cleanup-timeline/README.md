# Exemplu de curs — Cronologia curățării unui efect

## Concept demonstrat

Sincronizarea are nevoie de un proprietar, curățare și identitatea celei mai recente activități; semnalarea abandonării nu garantează singură că un promise vechi nu se va încheia.

## De ce apare exemplul în curs

Micul proprietar al cererii face vizibilă cronologia efectului fără construirea unei interfețe de căutare. Modelează ciclul de viață pe care un efect React trebuie să îl stabilească și să îl curețe.

## Ce să observați

- Pornirea unei activități noi abandonează controllerul anterior.
- Fiecare pornire primește o identitate strict crescătoare.
- Cel mai recent promise publică primul.
- Promise-ul vechi este rezolvat deliberat ulterior, dar nu poate publica.

## Rulare/inspectare

```bash
npm install
npm run dev
npm run build
```

## Explicație

Efectul creează un `AbortController` pentru valoarea dependenței și întoarce curățarea care abandonează exact acea operație înainte ca efectul următor să preia sincronizarea.

## Variații

- Adăugați un control care demontează componenta sincronizată și observați curățarea.
- Apelați curățarea returnată la demontare, înainte ca vreun promise să se încheie.

## Validare

Validat prin instalare curată și `npm run build`; comutați de la operația lentă la cea rapidă și inspectați curățarea în aplicația Vite.
