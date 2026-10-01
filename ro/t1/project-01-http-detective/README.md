# Proiectul 01 — Detectiv HTTP

## Obiectiv

Construiți o descriere bazată pe dovezi a trei schimburi HTTP reale. Veți separa ce trimite clientul de ce returnează serverul și veți verifica fiecare afirmație cu DevTools sau `curl`.

Lucrați în `student/`. Aplicația este completă; numai `case-report.json` este incomplet.

## Model mental

Un schimb HTTP are două direcții:

```text
client -- metodă, URL, headere, corp opțional --> server
client <-- stare, headere, corp opțional -------- server
```

URL-ul conține o cale și poate conține query. Tipul de conținut este declarat de un header; simplul aspect JSON sau CSS al corpului nu îl stabilește.

## Investigația în browser

1. În `student/`, rulați `npm install` și `npm start`.
2. Deschideți URL-ul loopback afișat.
3. Deschideți panoul Network și eliminați traficul anterior.
4. Selectați **Rulează investigația**.
5. Inspectați separat `detective.css`, `clues` și `verdict` prin Headers, Payload, Preview și Response.
6. Completați câmpurile existente din `case-report.json`, păstrând numele intrărilor și câmpurilor.

Nu folosiți rezultatul randat în pagină drept substitut pentru Network: el nu arată toate proprietățile cererii și răspunsului.

## Verificarea cu curl

Folosiți `curl -i` când sunt suficiente headerele răspunsului și `curl -v` când trebuie văzute și headerele cererii. Pentru POST, trimiteți același JSON și același tip de conținut ca modulul browserului. Înlocuiți `<base-url>` cu URL-ul afișat de server.

Comparați dovezile din linia de comandă cu cele din browser înainte de `npm test`.

## Gemini ca partener de investigație

Cereți Gemini să inspecteze proiectul și ieșirea validării fără editare și fără a deduce răspunsuri din server. Solicitați o listă care asociază fiecare câmp din raport cu locul său în DevTools și `curl`. După completare, cereți revizuirea exclusivă a diff-ului pentru presupuneri fără dovezi.

Responsabilitatea observării fiecărei valori, a revizuirii diff-ului și a rulării verificărilor vă aparține.

## Criterii de reușită

- `npm run test:baseline` și `npm run test:regression` continuă să treacă.
- `npm run test:objective` și `npm test` trec după completarea raportului.
- Puteți identifica partea schimbului care furnizează fiecare câmp.
- Puteți explica de ce tipul declarat și reprezentarea corpului sunt legate, dar distincte.

## Sarcină de depanare

Schimbați temporar tipul media declarat al răspunsului verdict în `text/plain`, fără a-i schimba corpul asemănător JSON. Observați nepotrivirea, rulați verificările și cereți Gemini o reparație focalizată pe o linie. Inspectați diff-ul și verificați headerul reparat cu DevTools și `curl`. Restaurați comportamentul canonic la final.

## Ce ar trebui să puteți explica

- Cum formează metoda, calea, query-ul, headerele, starea și corpul un schimb HTTP.
- Ce proprietăți aparțin cererii și ce proprietăți aparțin răspunsului.
- De ce succesul transportului nu dovedește singur corectitudinea aplicației.
- De ce o afirmație generată de AI despre trafic cere dovezi independente din execuție.
