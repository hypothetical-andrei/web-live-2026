# Exemplu de curs — Trei capcane JavaScript în execuție

## Concept demonstrat

Acest exemplu scurt separă trei mecanisme care pot face codul plauzibil să se comporte neașteptat:

- truthiness și coerciție implicită într-un filtru și o reducere;
- `||` tratează numărul valid `0` ca pe o cerere pentru valoarea implicită;
- o proprietate proprie ascunde o metodă moștenită cu același nume;
- un `catch` larg face ca JSON-ul greșit format să pară o estimare validă de zero.

## Ce să prezici

Înainte de rulare, prezice ce rânduri trec și ce tip are totalul. Apoi prezice ambele rezultate pentru limită. Urmărește `describe` din prototip spre sarcină și prezice ce se schimbă când atribui un șir lui `task.describe`. La final, compară rezultatul pentru o estimare validă de zero cu cel pentru JSON greșit format: ce informație elimină blocul `catch`?

## Rulare

```bash
node example.js
```

## Explicație

`"false"` este un șir nevid, deci trece de filtrul bazat pe truthiness. Adunarea estimării de tip șir face ca `+` să treacă de la adunare numerică la concatenare, producând șirul `"035"`. `configuredLimit || 10` produce `10`, deoarece `0` este falsy; `configuredLimit ?? 10` păstrează `0`, deoarece folosește valoarea implicită doar pentru `null` sau `undefined`. Inițial, sarcina găsește `describe` în prototip. Atribuirea proprietății proprii `describe` ascunde funcția, deci proprietatea devine un șir și nu poate fi apelată ca funcție. Blocul `catch` larg transformă și JSON-ul greșit format în același rezultat `0` ca o estimare validă de zero, ascunzând eroarea de parsare.

## Utilizare la curs

Oprește-te după fiecare predicție și cere studenților să urmărească operația care determină rezultatul. Programul arată dovezile, dar nu auditează, validează sau repară intrările.
