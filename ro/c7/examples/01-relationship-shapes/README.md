# Forma relațiilor

## Concept demonstrat

Modelați cardinalitatea prin chei și constrângeri, apoi navigați prin asocieri Sequelize.

## Ce trebuie să observați

Un participant are un profil și participă la două sesiuni. Tipurile diferite de bilet aparțin celor două înscrieri. SQLite respinge profilul duplicat, înscrierea duplicată, sesiunea orfană și ștergerea restricționată a conferinței. Ștergerea participantului elimină în cascadă profilul și înscrierile, păstrând sesiunile.

## Rulare / examinare

```bash
npm ci
npm test
```

## Explicație și limite

Verificați constrângerea de unicitate pe attendeeId, asocierile în ambele sensuri și obiectele asociate din rezultat. Graful este afișat înaintea verificărilor finale de ștergere. Testele verifică dacă baza aplică efectiv cheile străine și regulile de ștergere.

## Variații

Schimbați un alias și anticipați ce include trebuie schimbat. Explicați de ce ID-ul generat al înscrierii nu înlocuiește unicitatea perechii.

## Validare

La 2026-10-26, instalarea curată npm ci și npm test trec pe Node 24.5.0 cu Sequelize 6.37.8 și sqlite3 6.0.1 fixate. Aserțiunile execută SQLite real; exemplele HTTP trimit cereri locale reale. Închiderea bazei/serverului rulează în finally.
