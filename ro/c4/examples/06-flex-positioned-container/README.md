# Exemplu de curs — Container Flex și copil poziționat

## Concept demonstrat

Flexbox distribuie și aliniază elementele într-un container, iar poziționarea CSS poate ancora un copil suprapus de un bloc de conținere explicit.

## De ce este acest exemplu în curs

Face vizibile două responsabilități fundamentale: Flexbox controlează elementele barei de instrumente din fluxul normal, iar `position: relative` oferă etichetei poziționate absolut un cadru local de referință.

## Ce trebuie observat

- `.toolbar` este containerul flex; copiii săi direcți sunt elemente flex.
- `justify-content` distribuie spațiul pe axa principală, iar `align-items` aliniază elementele pe axa transversală.
- `gap` creează spațiere fără marginile copiilor, iar `flex-wrap` păstrează controalele când spațiul se îngustează.
- `.card` rămâne în fluxul normal și stabilește blocul de conținere al etichetei prin `position: relative`.
- `.badge` folosește `position: absolute`, este scoasă din fluxul normal și este deplasată față de marginile block-start și inline-end ale cardului.

## Rulare / examinare

```bash
node validate.js
```

Deschideți `index.html`, redimensionați viewport-ul și examinați bara, cardul și eticheta în DevTools. Pagina raportează aranjarea calculată și relația cu blocul de conținere.

## Explicație

Flexbox ar trebui să poziționeze elemente înrudite care participă în continuare la aranjare. Poziționarea absolută este potrivită pentru suprapuneri intenționate când blocul de conținere este explicit. Nu ar trebui să înlocuiască Flexbox, Grid sau fluxul normal pentru structura paginii. `fixed` folosește de regulă viewport-ul, iar `sticky` participă la flux până la traversarea unui prag de derulare.

## Variații

- Eliminați `position: relative` de pe card și examinați unde se ancorează eticheta.
- Schimbați separat `justify-content` și `align-items` pentru a identifica axele lor.
- Eliminați `flex-wrap` și examinați overflow-ul într-un container îngust.

## Validare

Validat cu `node validate.js`; verifică proprietățile containerului flex, blocul de conținere relativ, deplasările copilului absolut și relația părinte–copil.
