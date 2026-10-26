# Exemplu de curs — Dimensionarea în modelul cutiei

## Concept demonstrat

`box-sizing` stabilește dacă lățimea declarată acoperă doar conținutul sau include spațierea interioară și bordura.

## De ce este inclus acest exemplu

Două cutii altfel identice transformă ecuația dimensionării într-o măsurătoare observabilă în browser.

## Ce trebuie observat

- Elementul `content-box` are 242 pixeli: 200 conținut + 40 padding + 2 bordură.
- Elementul `border-box` are cei 200 de pixeli declarați.
- Marginile rămân în afara ambelor calcule ale lățimii.

## Rulare și examinare

Deschide `index.html`, examinează ambele modele calculate sau folosește verificarea headless documentată.

## Explicație

Dimensionarea globală `border-box` simplifică înțelegerea constrângerilor, dar conținutul intrinsec poate impune în continuare dimensiuni minime.

## Variante

- Adaugă un token lung fără întreruperi și examinează presiunea de depășire.
- Înlocuiește padding-ul fizic cu `padding-inline` logic și schimbă direcția scrierii.

## Validare

Validat în Chromium headless; `#result` raportează `content-box=242; border-box=200`.
