# Derivarea variantei pentru student — Sarcină de remediere cu Codex

## Sursa de referință

`reference/`, după trecerea tuturor verificărilor de referință consemnate în
`validation.md`.

## Elemente eliminate sau modificate

### `student/src/normalize-contract.js`

- **Schimbare:** Implementarea delimitată de normalizare pentru listare și
  resursa lipsă a fost înlocuită cu un TODO passthrough care întoarce
  rezultatul legacy nemodificat.
- **Motiv:** Lucrul specific studentului este să diagnosticheze și să repare
  defectul de header/tip de conținut pentru listare și defectul de normalizare
  al răspunsului pentru resursa lipsă fără să schimbe serviciul din jur.
- **Obiectiv de învățare:** Repararea unui contract HTTP public într-o limită
  restrânsă, păstrând infrastructura independentă intactă.
- **Consecință observabilă așteptată:** Serviciul rămâne executabil și continuă
  să gestioneze sănătatea, crearea reușită, JSON-ul invalid și rutele
  necunoscute, dar listarea expune `text/plain`, iar resursa lipsă întoarce în
  continuare corpul/statusul legacy greșit.
- **Verificare de obiectiv așteptată:** eșuează.

### `student/src/server.js`

- **Schimbare:** `return`-ul timpuriu de după răspunsul `422 text_required` din
  ramura de validare a creării a fost eliminat și a fost lăsat un comentariu
  TODO în acel punct.
- **Motiv:** Lucrul specific studentului include repararea bugului de control
  al fluxului în care handlerul comite un răspuns de eroare și apoi continuă
  spre un crash de tip headers-sent.
- **Obiectiv de învățare:** Tratarea finalizării răspunsului ca decizie de
  contract HTTP și limită de control al fluxului.
- **Consecință observabilă așteptată:** Cererile de creare cu text gol nu se
  finalizează curat până când ramura nu este reparată, în timp ce rutele fără
  legătură continuă să funcționeze.
- **Verificare de obiectiv așteptată:** eșuează.

## Invariante neschimbate

- setul de dependențe, lock file-ul și structura proiectului rămân paralele;
- producătorul legacy, ruta de stare, parsarea intrării și fallback-urile
  rămân paralele;
- comportamentul pentru JSON invalid și rute necunoscute rămâne intact.

## Verificări așteptate în starea studentului

### Trebuie să treacă

- `npm install` curat;
- `npm run test:baseline` (2 verificări);
- `npm run test:regression` (4 verificări);
- pornirea documentată acolo unde este permisă legarea pe loopback.

### Trebuie să eșueze sau să rămână incomplet

- verificarea de obiectiv pentru creare invalidă eșuează deoarece handlerul
  încearcă un al doilea send după răspunsul `422`;
- verificarea de obiectiv pentru tipul de conținut al listării eșuează deoarece
  răspunsul public expune încă `text/plain`;
- verificarea de obiectiv pentru răspunsul resursei lipsă eșuează deoarece
  `200` și corpul legacy ajung încă la client;
- verificarea de obiectiv pentru nemodificarea intrării continuă să treacă,
  deoarece passthrough-ul nu modifică intrarea;
- suita agregată eșuează numai în cele trei cazuri specifice obiectivului de
  mai sus.

## Revizuirea scurgerilor de soluție

`return`-ul eliminat și maparea de normalizare lipsesc din sursa, proza și
fișierele furnizate studentului. Testele descriu doar comportamentul HTTP cerut
și nu divulgă implementarea remedierii.
