# Exemplu de curs — Relații semantice într-un formular

## Concept demonstrat

Elementele native ale formularului expun nume, instrucțiuni, grupare și starea obligatorie prin relații HTML explicite.

## De ce este inclus acest exemplu

Prezintă cel mai mic formular de înregistrare util, fără ca aranjarea CSS sau validarea personalizată să îi ascundă semantica.

## Ce trebuie observat

- Fiecare câmp are o etichetă asociată programatic.
- Instrucțiunea pentru e-mail este conectată prin `aria-describedby`.
- Butoanele radio înrudite sunt grupate prin `fieldset` și `legend`.
- Butonul trimite formularul fără o cale JavaScript disponibilă doar prin clic.

## Rulare și examinare

```bash
node validate.js
```

Deschide `index.html` într-un browser și navighează folosind doar Tab, Shift+Tab, săgețile și Enter.

## Explicație

HTML exprimă direct relațiile controalelor. CSS sau JavaScript pot îmbunătăți ulterior formularul, dar nu trebuie să înlocuiască numele, gruparea, tastatura și trimiterea native.

## Variante

- Elimină o pereche `for`/`id` și examinează eșecul validatorului.
- Compară textul placeholder cu instrucțiunea persistentă.

## Validare

Validat cu `node validate.js`; verifică etichetele, legătura descrierii, gruparea câmpurilor, tipurile intrărilor și trimiterea nativă.

## Pagina atelierului

Deschide [workshop.html](workshop.html), pagina completă la care revine introducerea cursului. Fișierele HTML și [imaginea locală](workshop.svg) sunt păstrate în repository. Inspectează ierarhia titlurilor, legăturile, lista, antetele tabelului și formularul. Pagina nu include CSS sau JavaScript personalizat: observă prezentarea implicită a browserului și navighează cu tastatura. Folosește date fictive; trimiterea GET le afișează în URL fără să creeze o înscriere reală.

Validare (2026-10-18): imaginea locală și țintele etichetelor, descrierilor și navigării au fost verificate în ambele limbi; documentul englez a fost încărcat în Chrome headless. Nu este necesar un serviciu de înscriere.
