# Proiectul 01 — Dataset Transformer

## Scop

Explorează stilul obișnuit JavaScript printr-o aplicație mică ce transformă o listă de sarcini din memorie folosind funcții și metode de tablou. Primul exemplu lasă în afara atenției lucrul cu fișiere și opțiunile din linia de comandă, pentru ca studenții să se concentreze pe valori, expresii, callback-uri și fluxul de transformare.

## Urmărește fluxul

Lucrează în `student/`. Rulează `npm start` pentru a vedea ieșirea inițială a aplicației, apoi examinează `demoTasks` și semnătura `transformTasks`. Urmărește ce valoare primește fiecare callback de tablou și cum schimbă fiecare etapă colecția.

Folosește instrucțiunile IA etapizate din TODO. Cere mai întâi o explicație fără editări a fluxului și verific-o. Abia apoi cere implementarea delimitată din `spec.md`. Caută sortare în loc, aliasuri, departajare incorectă și editări în afara `src/transform-tasks.js`.

## Criterii de reușită

- Verificările de bază, obiectiv și regresie trec.
- Aplicația emite sumarul determinist al eșantionului din memorie.
- Diferența modifică doar modulul transformării.
- Poți explica rolul fiecărei operații de tablou și de ce intrarea rămâne neschimbată.

## Sarcină de depanare

Introdu temporar o operație în loc asupra unei intrări înghețate. Folosește eșecul pentru a localiza mutația și cere-i lui Codex cea mai mică remediere. Verifică diferența rezultată în loc să accepți un flux regenerat.

## Ce ar trebui să poți explica

- Valori, expresii și callback-uri în JavaScript obișnuit.
- Rolurile lui `filter`, `map`, `sort` și `reduce`.
- Cum compune un flux rezultatul util al unei aplicații.
- De ce transformarea trebuie să lase lista de intrare intactă.
