# Exemplu de curs — Randarea componentelor și a proprietăților

## Concept demonstrat

Un arbore React compune componente; părinții transmit proprietăți doar în citire și copii; identitatea colecției provine din chei stabile.

## De ce apare exemplul în curs

Randarea pe server permite inspectarea transformării componentă-element fără starea browserului sau o aplicație de dimensiunea unui tutorial. Se folosește `createElement` pentru ca Node simplu să poată executa aceeași structură pe care ar compila-o JSX.

## Ce să observați

- `TopicList` deține iterarea colecției, dar nu și marcajul cardului.
- `TopicCard` primește `title`, `level` și `children` ca proprietăți.
- ID-urile stabile ale subiectelor devin chei React, nu atribute vizibile.
- Componentele returnează descrieri de elemente; React produce HTML-ul.

## Rulare/inspectare

```bash
npm install
npm run dev
npm run build
```

## Explicație

Echivalentul JSX al apelului cardului este `<TopicCard key={topic.id} title={topic.title} level={topic.level}>{topic.summary}</TopicCard>`. Proprietățile circulă în jos; această randare nu are stare locală sau efecte deoarece nu sunt necesare.

## Variații

- Transmiteți o proprietate callback și identificați de ce randarea pe server nu poate declanșa un eveniment.
- Înlocuiți ID-urile stabile cu indexuri și discutați ce se întâmplă când rândurile se mută.

## Validare

Validat cu instalarea blocată, audit fără vulnerabilități și `npm run build`; inspectați arborele de componente randat în aplicația Vite.
