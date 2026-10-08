# Proiectul 03 — Auditarea codului generat

## Scop

Face vizibil modelul obiectual JavaScript prin căutarea prototipurilor, proprietăți proprii față de moștenite, identitate, mutație și aliasuri. Acesta este proiectul final și singurul cu interfață CLI; `--file` selectează setul de date pentru comparație.

## Obiectiv

Diagnostichează căutarea prin prototip, acceptarea proprietăților moștenite, mutația și aliasurile din cod generat plauzibil, apoi implementează o limită defensivă strictă fără să rescrii artefactul auditat.

## Auditează înainte să editezi

Rulează `npm run compare -- --file data/events.json` și toate verificările țintite din `student/`. Pentru fiecare defect al modelului obiectual, notează o intrare concretă, rezultatul real, rezultatul cerut și regula JavaScript relevantă. Include o înregistrare al cărei câmp obligatoriu există doar în prototip, alături de mutație, aliasuri și ordonare.

Folosește TODO-urile bazate pe dovezi: cere-i lui Codex un tabel al defectelor, nu o rescriere; reproduce afirmațiile; apoi limitează implementarea la `src/safe-normalizer.js`. Examinează diferența și asigură-te că fișierul nesigur, testele, datele și dependențele rămân neschimbate.

## Criterii de reușită

- Toate verificările trec.
- Ieșirea validă este proiectată, copiată și ordonată determinist.
- Tipurile invalide eșuează în loc să fie convertite.
- Intrarea înghețată funcționează, iar înregistrările rezultatului nu păstrează aliasuri către ea.
- Fiecare remediere acceptată corespunde unor dovezi demonstrate.

## Sarcină de extindere

Adaugă un șir-dată ale cărui semantici calendaristice sunt ambigue, deși `Date.parse` îl acceptă. Specifică regula dorită într-un test înainte să schimbi implementarea. Folosește Codex pentru a critica acel contract și a propune o remediere țintită.

## Ce ar trebui să poți explica

- Proprietăți moștenite accesibile față de date proprii obligatorii.
- Delegarea prin prototip și verificările de proprietăți proprii.
- Aliasurile tablourilor și obiectelor imbricate.
- De ce codul generat lizibil poate fi nesigur semantic.
- De ce contează testele și diferențele în analiza asistată de IA.
