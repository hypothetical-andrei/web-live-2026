# Exemplu de curs — Identitate, aliasuri și copii superficiale

## Concept demonstrat

Variabilele pentru obiecte păstrează referințe, iar spread pentru tablouri și obiecte creează doar o copie superficială a containerului.

## De ce este inclus acest exemplu

Leagă modelul obiectelor JavaScript de defectele de mutație întâlnite în codul generat și, ulterior, în starea React.

## Ce trebuie observat

- Atribuirea creează un alias către același tablou.
- Copierea tabloului nu copiază obiectul-sarcină din el.
- Copierea unei sarcini nu copiază obiectul `meta` imbricat.
- O actualizare fără mutație copiază fiecare container de pe calea modificată.

## Rulare și examinare

```bash
node example.js
```

## Explicație

Egalitatea valorilor-obiect verifică identitatea. Spread este o sintaxă utilă pentru copii superficiale selective, nu dovada că întreaga stare imbricată este independentă.

## Variante

- Îngheață fiecare nivel al intrării și compară actualizările cu și fără mutație.
- Desenează graful obiectelor înainte și după fiecare copiere.

## Validare

Validat cu `node example.js`; verificările pentru alias, copia superficială, identitatea imbricată și absența mutației trec.
