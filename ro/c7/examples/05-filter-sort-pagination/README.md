# Filtrare, sortare și paginare cu offset

## Concept demonstrat

Interogați sesiunile copil prin join cu conferința, combinând where, order, limit și offset.

## Ce trebuie să observați

GET /api/conferences/:conferenceId/sessions întoarce doar sesiunile conferinței respective. Testele parcurg ambele sortări, verifică orele egale, combină filtrul advanced cu offset, verifică pagini goale și resping parametri invalizi/repetați. A șaptea sesiune aparține altei conferințe și nu trebuie să intre în aceste pagini.

## Rulare / examinare

```bash
npm ci
npm test
```

## Explicație și limite

Session.findAll este interogarea principală: fiecare rând întors este o sesiune copil. include unește conferința cu required: true și o condiție pe ID-ul părintelui. level filtrează sesiunile, tablourile order fixe le sortează, iar limit/offset le paginează. Join-ul belongsTo adaugă cel mult o conferință per sesiune, deci nu multiplică rândurile paginate. Astfel evităm o limită globală pe un include hasMany. Paginile sunt deterministe pentru date nemodificate; inserările anterioare pot deplasa offset-urile. O conferință necunoscută produce o colecție goală în acest contract mic. Scriptul pornește și închide propriul server HTTP.

## Variații

Anticipați limit=1&offset=1 cu level=advanced și sort=title_asc, apoi inspectați aserțiunea. Explicați de ce ID-ul departajează orele egale.

## Validare

La 2026-11-11, npm ci offline curat și npm test au trecut pe Node 24.5.0 cu dependențele fixate. Verificările folosesc SQLite real; exemplele HTTP trimit cereri locale reale.
