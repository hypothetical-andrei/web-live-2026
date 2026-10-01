# Exemplu de curs — Fluxul de verificare asistat de AI

## Ce veți învăța

Un agent AI poate clarifica instrumente nefamiliare, propune un script HTTP focalizat și implementa o reparație delimitată, iar voi rămâneți responsabili să inspectați și să verificați critic fiecare artefact.

## Cum vă ajută acest exemplu

Oferă o secvență concretă și o verificare reală a limitei publice, fără a trata rezultatul agentului sau un test raportat drept dovadă suficientă.

## Ce să observați

- Clarificarea instrumentelor precedă editarea și vă îndrumă spre dovezi observabile.
- Scriptul trimite o cerere reală, nu copiază constantele serverului.
- Schimbarea stării din `201` în `200` face verificarea să eșueze.
- Un test verde și un diff autorizat sunt cerințe de acceptare separate.

## Rulare și inspectare

Folosiți această secvență cu agentul:

1. **Inspectare:** localizați comenzile, punctul de intrare și verificările fără editare.
2. **Clarificarea instrumentelor:** cereți panourile DevTools și flagurile `curl` care expun datele cerute.
3. **Contract:** numiți metoda, ținta, starea, câmpurile, reprezentarea și un caz de eșec.
4. **O verificare:** permiteți doar un fișier mic, API-uri Node incluse și nicio schimbare a aplicației.
5. **Inspectarea verificării:** confirmați că exercită limita HTTP publică și nu reproduce constantele implementării.
6. **Sensibilitate:** introduceți temporar defectul și confirmați eșecul din motivul potrivit, apoi restaurați comportamentul.
7. **Reparație:** limitați fișierele și precizați comenzile focalizate și de regresie.
8. **Inspectarea diff-ului:** respingeți editările fără legătură, testele slăbite și dependențele noi.
9. **Rulați personal verificările focalizate și de regresie.**
10. **Verificați independent:** repetați un schimb important cu DevTools sau `curl -i`.
11. **Explicați acceptarea:** indicați diff-ul și dovezile din execuție.

Repository-ul conține deja un asemenea script mic:

```bash
node verify-http.mjs
```

## Explicație

`verify-http.mjs` pornește serverul pe un port loopback efemer, creează o notiță prin HTTP și verifică independent `201`, `Location`, `Content-Type` și reprezentarea JSON. Importă numai limita de pornire a serverului; nu citește constantele rutelor și nu apelează direct handlerul.

O cerere delimitată corespunzătoare ar putea fi:

> Inspectați `server.mjs` și comportamentul documentat fără editare. Explicați cum îl poate porni un script Node pe un port efemer și observa crearea prin HTTP. Apoi adăugați numai `verify-http.mjs`, folosind API-uri incluse și fără dependențe. Scriptul trebuie să detecteze o stare greșită la creare, lipsa `Location`, tipul media incorect sau reprezentarea JSON greșită. Sarcina este finalizată când scriptul trece pe serverul canonic. Arătați diff-ul și explicați fiecare aserțiune.

## Variante

- Schimbați temporar `201` în `200`, confirmați eșecul aserțiunii de stare, apoi restaurați `201`.
- Întrebați agentul de ce apelarea directă a `createNote()` ar oferi dovezi HTTP mai slabe.
- Propuneți un refactor fără legătură și explicați de ce testul corect nu autorizează domeniul suplimentar.

## Validare

Validat cu `node verify-http.mjs`; verificarea traversează o limită HTTP loopback reală și verifică întregul contract al răspunsului de creare. Sensibilitatea a fost confirmată cu un defect temporar `200`, apoi a fost restaurat `201`.
