# Exemplu de curs — Căutarea proprietăților prin prototip

## Concept demonstrat

Obiectele JavaScript deleagă căutarea proprietăților absente de-a lungul unui lanț de prototipuri; sintaxa `class` folosește același mecanism.

## De ce este inclus acest exemplu

Delegarea prin prototip este o trăsătură definitorie a JavaScript, pe care terminologia centrată pe clase o poate ascunde.

## Ce trebuie observat

- `id` începe ca proprietate proprie, iar `priority` și `describe` sunt moștenite.
- Atribuirea lui `task.priority` creează o proprietate proprie care ascunde valoarea prototipului.
- O proprietate absentă devine `undefined` după ce căutarea ajunge la capătul lanțului.
- O metodă a clasei este găsită în `ReviewTask.prototype`, nu copiată în fiecare instanță.

## Rulare și examinare

```bash
node example.js
```

## Explicație

Accesul la proprietate verifică mai întâi receptorul, apoi urmează legăturile prototipurilor. Exemplul observă legăturile existente; nu recomandă modificarea prototipurilor încorporate sau schimbarea lor dinamică în aplicații.

## Variante

- Șterge proprietatea proprie `priority` și observă reapariția valorii moștenite.
- Adaugă un prototip intermediar și desenează traseul complet al căutării.

## Validare

Validat cu `node example.js`; sunt verificate căutările proprietăților proprii, moștenite, ascunse și absente, precum și ale metodelor clasei.
