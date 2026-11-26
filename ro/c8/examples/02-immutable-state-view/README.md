# Exemplu de curs — Stare imuabilă și vedere derivată

## Concept demonstrat

Evenimentele înlocuiesc imuabil starea deținută; colecțiile filtrate și numărătorile sunt derivate în timpul randării, nu sincronizate ca stare duplicată.

## De ce apare exemplul în curs

Izolează regula de date din spatele `useState` fără zgomot JSX sau DOM. Aceeași tranziție poate fi transmisă unei funcții React de actualizare a stării.

## Ce să observați

- `toggle` returnează un tablou nou și un element modificat nou.
- Setul de date inițial rămâne neschimbat.
- `visible` este un calcul, nu o altă sursă de adevăr.
- Un eveniment de filtrare nu trebuie să rescrie elementele.

## Rulare/inspectare

```bash
npm install
npm run dev
npm run build
```

## Explicație

În React, `setItems(current => toggle(current, id))` deține tranziția. Apelarea `visible(items, filter)` în timpul randării păstrează interfața consecventă cu cele două intrări reale și evită un efect care copiază date derivate în stare.

## Variații

- Adăugați un număr derivat cu `filter(...).length`.
- Modificați direct `initial[0]` și explicați de ce randarea bazată pe identitate devine mai greu de analizat.

## Validare

Validat prin instalare curată și `npm run build`; inspectați comutarea și filtrarea în aplicația Vite.
