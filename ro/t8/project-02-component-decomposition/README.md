# Proiectul 02 — Descompunerea componentelor

## Ce ai de făcut

Împarte panoul mare furnizat în componentele mai mici cerute. Transmite datele și funcțiile prin props și păstrează comportamentul existent al paginii.

Lucrează în `student/`. Modifică doar `src/WorkshopDashboard.jsx`, `src/components/*.jsx`.

## Cum lucrezi

Rulează verificările de caracterizare asupra monolitului și inventariați-i responsabilitățile înainte de editare. Decideți ce componentă deține starea atelierului/înregistrărilor/formularului, ce valori sunt derivate și de ce proprietăți/callback-uri minime are nevoie fiecare copil.

Dă Codex sarcina din `spec.md`. Respinge schimbările dovezilor/testelor/CSS-ului, abaterile comportamentului copiat, contextul/reducerele/efectele pentru valori derivate, împrăștierea proprietăților, elementele de încadrare generice sau funcționalitățile noi.

## Verifică rezultatul

- Dovezile monolitului rămân identice octet cu octet și toate fluxurile de caracterizare concordă.
- `WorkshopToolbar`, `CapacitySummary`, `RegistrationForm`, `AttendeeList` și `AttendeeRow` există cu proprietăți explicite.
- Un singur cel mai apropiat proprietar comun păstrează starea canonică; vederile capacității/selecției sunt calculate în timpul randării.
- Validarea, adăugarea/eliminarea, comutarea, relațiile semantice tabel/formular, compilarea și randarea în browser trec.

## Sarcină de depanare

Oglindiți `remainingSeats` în stare și actualizați-l printr-un efect. Exercitați fluxurile de adăugare/eliminare/comutare, identificați adevărul redundant și problema de timp, apoi derivați-l din nou din înregistrări și capacitate.

## Ce ar trebui să poți explica

- De ce fiecare limită de componentă îmbunătățește inspectarea.
- De ce fiecare valoare de stare se află la proprietarul său.
- Ce valori trebuie să rămână derivate.
- Cum împiedică caracterizarea refactorizarea să schimbe funcționalitățile.
