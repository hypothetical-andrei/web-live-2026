# Exemplu de curs — Focus și preferințe pentru mișcare

## Concept demonstrat

Focusul prin tastatură are nevoie de un indicator observabil, iar mișcarea neesențială trebuie să respecte preferința utilizatorului pentru mișcare redusă.

## De ce este inclus acest exemplu

Un buton nativ arată că îmbunătățirea la hover, indicarea focusului și preferința pentru mișcare sunt contracte de interacțiune separate.

## Ce trebuie observat

- Butonul nativ poate primi focus fără simularea prin script a unui rol de tastatură.
- `:focus-visible` oferă un contur cu contrast ridicat fără să elimine modelul de interacțiune al browserului.
- Interogarea pentru mișcare redusă dezactivează tranziția, păstrând acțiunea.

## Rulare și examinare

Deschide `index.html`, navighează cu Tab și comută mișcarea redusă în emularea browserului/sistemului. Ieșirea raportează focusul și preferința calculată.

## Explicație

Adaptările de accesibilitate păstrează funcționalitatea. Mișcarea redusă elimină tranziția, nu butonul; stilul focusului adaugă un indiciu, nu un înlocuitor disponibil doar cu pointerul.

## Variante

- Elimină regula personalizată de focus și examinează stilul implicit al browserului.
- Emulează mișcarea redusă și confirmă că durata tranziției devine zero.

## Validare

Validat în Chromium headless; butonul nativ devine element activ, iar ieșirea calculată raportează un contur vizibil. Emularea manuală confirmă suprascrierea pentru mișcare redusă.
