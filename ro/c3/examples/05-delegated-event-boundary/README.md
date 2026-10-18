# Exemplu de curs — Limita evenimentului delegat

## Concept demonstrat

Un ascultător pe un strămoș stabil poate interpreta evenimente provenite dintr-o colecție de copii care se schimbă.

## De ce folosim exemplul

Pagina face vizibile `target`, `closest`, `currentTarget` și propagarea cu doar două butoane și un ascultător.

## Ce trebuie observat

- Un click pe `<span>`-ul imbricat identifică în continuare butonul acțiunii.
- `event.target` numește elementul de origine.
- `event.currentTarget` rămâne lista stabilă care deține ascultătorul.
- Identitatea sarcinii provine din `dataset` al celui mai apropiat rând.

## Rulare și inspectare

Deschideți `index.html` într-un browser și apăsați oricare buton. Pentru o verificare headless repetabilă din acest director:

```bash
google-chrome --headless --no-sandbox --disable-gpu --virtual-time-budget=1000 --dump-dom index.html
```

## Explicație

Ascultătorul listei apelează `closest` de două ori: pentru a identifica acțiunea și pentru a identifica rândul domeniului. Rândurile adăugate ulterior folosesc același ascultător fără legări suplimentare.

## Variante

- Adăugați o a treia sarcină după legare și confirmați că funcționează.
- Apăsați spațiul liber din listă și observați traseul protejat care nu execută nicio operație.

## Validare

Validat în Chromium headless. După încărcare, pagina apasă programatic eticheta imbricată și scrie `target=SPAN; currentTarget=tasks; action=toggle; task=t-1` în `#result`.
