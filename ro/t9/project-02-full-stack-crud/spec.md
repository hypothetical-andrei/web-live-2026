# Specificația exercițiului — CRUD full-stack pentru notițe

## Unitate

Unitatea 09 — Rutare, formulare și React full-stack

## Obiectiv de învățare

Construiește interfața React pentru API-ul de notițe furnizat. Încarcă, creează, editează, șterge și reîmprospătează notițele; actualizează datele serverului afișate doar după confirmarea API-ului.

## De ce există acest exercițiu

Starea React locală se actualizează imediat și aparține unei singure interfețe în execuție. Starea serverului este asincronă, partajată, predispusă la eșec și autoritară. Ai nevoie de o mică limită full-stack în care cererile, stările, reîmprospătările și starea interfeței sunt observabile fără introducerea unei biblioteci de preluare a datelor sau a stării globale.

## Cerințe preliminare

- Formularele cu rutare din Proiectul 1 și curățarea efectelor/proprietatea stării din Unitatea 08.
- API-urile JSON, învelișurile de stare/eroare, fetch și CRUD din Unitățile 5–6.

## Context inițial

Ai primit un spațiu de lucru cu:

- un API Express furnizat pentru notițe cu Sequelize și SQLite, montat la `/api/notes`, contracte exacte de listare/preluare/creare/actualizare/ștergere, endpoint determinist de resetare pentru teste, erori centralizate și infrastructură în buclă locală;
- un adaptor fetch furnizat `src/notes-api.js`, care acceptă `baseUrl` și `signal` facultativ, validează rezultatele HTTP/învelișului și returnează date detașate ale notițelor;
- configurație proxy Vite, intrare/CSS, date de test, nume accesibile și teste;
- `src/NotesWorkspace.jsx` incomplet, care primește `api` și deține ciclul clientului.

Interfața canonică este intenționat un singur spațiu de lucru, nu o repetare a rutelor din Proiectul 1. Listează notițe, selectează una pentru editare, creează, actualizează, șterge și reîmprospătează din server.

Backendul furnizat stochează notițele într-un fișier SQLite la pornirea obișnuită, creează tabelele lipsă fără ștergerea datelor și inserează notița inițială numai într-o bază goală. Așteaptă operațiile bazei și închide conexiunea la oprire. Testele folosesc baze izolate în memorie sau fișiere temporare. ID-urile publice rămân șiruri și reprezentările rămân `{ id, title, body }`; metadatele ORM nu sunt expuse. Ruta de resetare pentru teste este activată doar când aplicația este creată explicit în modul de test. Persistarea este infrastructură furnizată, nu lucru suplimentar pentru student.

## Sarcina ta

Construiește interfața React pentru API-ul de notițe furnizat. Încarcă, creează, editează, șterge și reîmprospătează notițele; actualizează datele serverului afișate doar după confirmarea API-ului.

Lucrează în proiectul `student/` furnizat. Modifică doar `client/src/NotesWorkspace.jsx`. Cerințele detaliate precizează cazurile, formele datelor și restricțiile pe care trebuie să le respecți. Folosește testele și instrucțiunile de pornire furnizate pentru verificare.

## Comportament necesar

- La montare, solicită `api.list({ signal })`; afișează stările exacte de încărcare, listă încărcată/gol și eroare de încărcare neutralizată; curățarea abandonează cererea.
- Păstrează notițele serverului numai din rezultate API reușite. Păstrează separat starea locală a interfeței: ID selectat, titlu/corp controlat, mod, starea trimiterii și eroare vizibilă utilizatorului.
- Selectarea unei notițe completează formularul controlat de editare din datele curente ale serverului; `Notiță nouă` resetează selecția/formularul.
- Elimină spațiile valorilor trimise și respinge local titlul gol fără apel API.
- Crearea apelează `api.create({ title, body })`; actualizarea apelează `api.update(selectedId, { title, body })`; în timpul oricăreia, dezactivează trimiterea și expuneți o stare de trimitere.
- După crearea/actualizarea reușită, folosește notița confirmată de server returnată pentru actualizarea imuabilă a listei, selectarea ei și golirea erorilor de trimitere fără o reîncărcare completă inutilă.
- Ștergerea solicită API-ului ID-ul selectat, îl elimină numai după reușită și readuce interfața la starea de selecție nouă/goală.
- O acțiune `Reîmprospătează notițele` rulează din nou listarea, înlocuiește datele serverului, păstrează selecția numai dacă acel ID încă există și nu poate permite unei reîmprospătări vechi să suprascrie una nouă.
- Rezultatele abandonării/demontării sunt silențioase; eșecurile neașteptate/de rețea/API randează mesaje stabile, păstrează datele existente ale serverului și permit reîncercarea.
- Nu deduceți niciodată reușita din intenția locală, nu expune mesaje interne, nu trimite ID-uri în corpuri și nu actualizați datele serverului înaintea confirmării API-ului.

## Constrângeri

- JavaScript JSX, React 19 + Vite, fetch nativ prin adaptorul furnizat, server Express 5 + Sequelize/SQLite furnizat, ESM și fișier lock fixat.
- Implementează numai `client/src/NotesWorkspace.jsx`; păstrează adaptorul API/serverul/proxy-ul/datele/testele/dependențele.
- Folosește numai stare locală și efecte; aici nu este necesar React Router și nu sunt permise Redux/context, React Query/SWR, actualizare optimistă, bibliotecă de cache sau pachet pentru formulare.
- Folosește un singur ciclu de încărcare/reîmprospătare deținut, cu protecție pentru curățare/cea mai recentă cerere; trimiterile CRUD pot fi handlere explicite de evenimente.

## Criterii observabile de finalizare

- Testul minimal real client/server demonstrează lista inițială, crearea, actualizarea, ștergerea, reîmprospătarea și stările de eșec neutralizate.
- Testele amânate demonstrează curățarea și comportamentul în care cea mai nouă reîmprospătare câștigă.
- Testele care urmăresc API-ul disting starea interfeței de valorile autoritare returnate de server.
- Stările încărcare/gol/eroare/trimitere/reușită și controalele dezactivate sunt accesibile și exacte.
- Compilările/verificările/auditurile clientului/serverului trec; se schimbă numai `client/src/NotesWorkspace.jsx`.

## Plan de validare (pentru autorii cursului)

### Verificări de bază

- Contractul/eroarea/resetarea/curățarea API Express furnizat, adaptorul fetch, infrastructura proxy/compilare Vite, datele de test și API-ul amânat determinist funcționează independent.

### Verificările obiectivului

- Încărcare/reușită/gol/eroare la montare și curățare prin abandonare.
- Proprietatea formularului controlat la selectare/creare și validare locală cu zero apeluri API.
- Intrări de creare/actualizare, stare de trimitere, înlocuire cu rezultatul autoritar, identitate și păstrarea/reîncercarea la eșec.
- Limita de confirmare a ștergerii și starea selecției/listei după reușită.
- Înlocuirea la reîmprospătare, resetarea selecției lipsă, protecția împotriva încheierii în altă ordine și date păstrate la eșec.
- Mai multe instanțe ale spațiului de lucru/API-ului rămân izolate.
- Verificări ale sursei pentru un singur efect de încărcare deținut, protecție pentru cea mai recentă cerere/abandonare și interdicția cunoașterii HTTP.

### Verificări de regresie

- Compilarea de producție a clientului și pornirea/sănătatea serverului funcționează.
- Secvența CRUD reală în buclă locală și erorile deformate/necunoscute/neutralizate trec.
- Intrarea aplicației injectează adaptorul API furnizat în spațiul de lucru.
- În componenta-obiectiv nu există fetch direct/cunoașterea stării HTTP, iar în adaptorul API/server nu există cod de interfață.

## Notă pentru autor — pregătirea variantei inițiale

După validarea referinței, copiați spațiul de lucru complet și înlocuiți numai `client/src/NotesWorkspace.jsx` cu un panou indisponibil executabil care păstrează importurile React, semnătura proprietăților și TODO-urile focalizate. Serverul, adaptorul, proxy-ul, compilarea, verificările API de bază și infrastructura statică rămân funcționale; obiectivele ciclului/CRUD eșuează la limita indisponibilă.

Niciun ciclu complet al spațiului de lucru nu rămâne în teste, comentarii, ieșiri generate, componente alternative sau fișiere de server.

## Sarcină Codex

> Construiește interfața React pentru API-ul de notițe furnizat. Încarcă, creează, editează, șterge și reîmprospătează notițele; actualizează datele serverului afișate doar după confirmarea API-ului. Modifică doar `client/src/NotesWorkspace.jsx`. Citește această specificație și codul furnizat înainte să editezi. Respectă comportamentul cerut, intrările/ieșirile exacte și restricțiile de aici. Păstrează testele și infrastructura furnizată. Rulează verificările documentate și spune ce trece, ce eșuează și de ce. Explică modificările ca să le pot inspecta.

## Sarcină de depanare/extensie

- Elimină protecția identității reîmprospătării, pornește două reîmprospătări amânate, rezolvați cererea nouă și apoi pe cea veche, observă datele învechite ale serverului și restabilește publicarea numai pentru cea mai recentă cerere împreună cu curățarea prin abandonare.

## În afara domeniului

- Integrarea rutării, autentificare, paginare, interfață optimistă, cache-uri offline, rezolvarea conflictelor, implementarea stratului de persistență furnizat sau stare globală.
