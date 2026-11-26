# Include-uri multiple și imbricate

## Concept demonstrat

Încărcați conferința și participanții prin două elemente ale aceluiași tablou `include`. În elementul `attendees`, adăugați un alt `include` pentru profilul fiecărui participant.

## Ce trebuie să observați

La sesiunea HTTP sunt înscriși Ana, care are profil, și Dan, care nu are profil. La CSS nu este înscris nimeni. Testele verifică datele încărcate: profilul lipsă apare ca `null`, iar lista fără participanți apare ca `[]`.

## Rulare / examinare

```bash
npm ci
npm test
```

## Explicație și limite

Un tablou `include` permite încărcarea mai multor asocieri ale modelului interogat. Un `include` în interiorul elementului `attendees` încarcă date asociate fiecărui participant: aici, profilul. Folosiți aliasul definit pentru fiecare asociere. Opțiunea `through.attributes` controlează câmpurile din tabelul de legătură care apar în rezultat; nu schimbă tabelul sau constrângerile lui. Exemplul conține puține date, pentru a putea urmări ușor rezultatul. Adăugarea altor colecții poate crește numărul de rânduri SQL intermediare.

## Variații

Anticipați rezultatul dacă eliminați include-ul imbricat profile.

## Validare

La 2026-11-11, npm ci offline curat și npm test au trecut pe Node 24.5.0 cu dependențele fixate. Verificările folosesc SQLite real; exemplele HTTP trimit cereri locale reale.
