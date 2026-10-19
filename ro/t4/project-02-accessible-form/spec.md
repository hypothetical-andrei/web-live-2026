# Specificația exercițiului — Formular accesibil

## Unitate

Unitatea 04 — HTML, CSS, interfețe responsive și accesibilitate

## Obiectiv de învățare

Implementează validare accesibilă pe client care păstrează etichetarea semantică, asociază erorile inline, oferă un sumar focalizabil și permite corectarea prin tastatură.

## Context inițial

Ai primit un formular de înscriere stilizat, cu etichete semantice, fieldset/legend, tipuri de intrare potrivite, containere stabile pentru erori, sumar, adaptor al aplicației, server și teste. `validateEnrollment(values)` și `handleSubmission(values, ui)` sunt incomplete.

## Comportament necesar

- Elimină spațiile marginale din nume/e-mail; numele este obligatoriu; e-mailul trebuie să corespundă formei documentate `local@domain.tld`; `track` trebuie să fie `frontend` sau `backend`; `terms` trebuie să fie boolean `true`.
- Întoarce `{ values, errors }`, cu valori normalizate și mesaje de eroare indexate prin `name`, `email`, `track`, `terms`.
- Trimiterea cu erori apelează `ui.setErrors(errors)`, apoi `ui.focusSummary()`, nu apelează `ui.submit` și întoarce `{ ok:false, errors }`.
- Trimiterea validă elimină erorile, apelează o singură dată `ui.submit(values)`, nu focalizează sumarul și întoarce `{ ok:true, values }`.
- Adaptorul furnizat mapează erorile la containere inline, `aria-invalid`, legături ale sumarului și focus.

## Restricții

- ESM/DOM în browser, teste/server Node LTS, fără dependențe.
- Modifică doar `public/form-validation.js`.
- Nu folosi doar culoarea pentru erori; nu înlocui etichetele native sau semantica fieldset.
- Nu valida la fiecare apăsare și nu dezactiva comportamentul nativ al tastaturii.

## Criterii observabile de finalizare

- Trimiterea goală afișează sumarul și erorile inline și mută focusul pe sumar.
- Legăturile erorilor vizează controalele; trimiterea validă corectată afișează succesul.
- Ordinea Tab urmează documentul și fiecare control are nume accesibil.
- Toate verificările trec și se schimbă doar modulul de validare.

## Plan de validare

### Verificări de bază

- HTML-ul conține perechi etichetă/control, fieldset/legend, atribute required/type/autocomplete, sumar și regiune live de succes.
- Adaptorul gestionează `aria-invalid`, textul inline, legăturile sumarului și focusul.

### Verificări de obiectiv

- Normalizarea și toate regulile câmpurilor întorc erorile exacte.
- Trimiterea invalidă urmează calea erori/focus/fără trimitere.
- Trimiterea validă urmează calea eliminare/trimitere/fără focus.

### Verificări de regresie

- Intrările și obiectul UI nu sunt modificate de validare.
- Callback-ul de trimitere rulează cel mult o dată.
- Ordinea erorilor rămâne name, email, track, terms.

### Verificări în browser

- Formularul real execută trimiterea invalidă și cea corectată, expune etichetele și cele patru erori asociate, focalizează rezumatul și afișează succesul.

## Sarcina ta

Trebuie să implementezi `validateEnrollment` și `handleSubmission` în `public/form-validation.js`. Ambele funcții returnează momentan rezultate provizorii. Formularul, serverul și codul care afișează erorile sunt furnizate. Citește cum folosește acel cod rezultatele validării, apoi implementează regulile câmpurilor și tratarea trimiterii invalide sau valide.

## Sarcină pentru Codex

> Implementează numai `public/form-validation.js`. Normalizează și validează cele patru câmpuri, păstrează ordinea deterministă a erorilor și orchestrează exact callback-urile pentru cazurile invalid și valid. Nu modifica HTML-ul, adaptorul, testele sau dependențele. Finalizat când verificările trec, iar testarea prin tastatură confirmă focusul sumarului și corectarea. Explică de ce sunt utile atât erorile inline, cât și sumarul.

## Sarcină de depanare/extindere

- Elimină focusul sumarului după trimiterea invalidă. Completează formularul numai cu tastatura, notează costul navigării, apoi cere-i lui Codex cea mai mică remediere a focusului.

## În afara domeniului exercițiului

- Trimitere către server, validare de producție a e-mailului, localizare, widget-uri personalizate sau înlocuirea semanticii native.
