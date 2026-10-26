# Exemplu de curs — Ordinea straturilor cascadei

## Concept demonstrat

Precedența straturilor cascadei este stabilită înaintea specificității selectorilor, astfel încât o regulă puțin specifică dintr-un strat ulterior poate suprascrie o regulă foarte specifică dintr-un strat anterior.

## De ce este inclus acest exemplu

Un mesaj și două reguli izolează ordinea straturilor de o remediere CSS mai amplă.

## Ce trebuie observat

- Selectorul vechi include un ID și o clasă.
- Selectorul temei este doar o clasă.
- Ordinea declarată a straturilor face totuși culorile temei câștigătoare.

## Rulare și examinare

Deschide `index.html` într-un browser sau rulează verificarea headless documentată:

```bash
google-chrome --headless=new --no-sandbox --disable-gpu --virtual-time-budget=1000 --dump-dom "file://$PWD/index.html"
```

## Explicație

Declarația straturilor plasează `legacy` înainte de `theme`. Declarațiile normale din stratul ulterior le depășesc pe cele din stratul anterior fără `!important` sau creșterea specificității.

## Variante

- Inversează numele straturilor în declarația ordinii.
- Elimină straturile și compară rezultatul folosind specificitatea obișnuită.

## Validare

Validat în Chromium headless; stilurile calculate sunt scrise în `#result` ca `color=rgb(23, 32, 51); background=rgb(220, 233, 255)`.
