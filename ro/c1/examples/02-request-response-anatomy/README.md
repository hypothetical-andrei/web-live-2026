# Exemplu de curs — Anatomia cererii/răspunsului și extinderea prin headere

## Ce veți învăța

Un schimb HTTP conține două mesaje distincte, iar headerele opționale le pot extinde metadatele fără să schimbe contractul mai simplu format din stare și reprezentare.

## Cum vă ajută acest exemplu

Traseul compact face vizibilă limita client/server. Pagina executabilă expune aceleași informații în DevTools și compară un client care ignoră un câmp opțional cu unul care îl folosește.

## Ce să observați

- Metoda și `Content-Type` al cererii aparțin cererii.
- Starea și `Location` aparțin răspunsului.
- Ambii clienți folosesc corpul; numai clientul nou folosește `Example-Trace-Id`.
- Ignorarea unui câmp opțional necunoscut păstrează schimbul simplu, dar o semantică obligatorie nu poate depinde în siguranță de acel câmp.
- Ambele mesaje pot transporta JSON, dar corpurile au roluri diferite.

## Rulare și inspectare

Citiți mai întâi [`exchange.http`](exchange.http) de la fiecare linie inițială spre corp, apoi porniți ținta locală:

```bash
node server.mjs
```

Deschideți URL-ul afișat și DevTools **Network**, ștergeți intrările și selectați **Rulează schimburile**. Inspectați intrările `GET` și `POST` în ordinea din curs. Pagina afișează separat clientul care folosește numai corpul și clientul care citește headerul.

Rulați verificarea automată:

```bash
node verify.mjs
```

## Explicație

Clientul trimite o reprezentare JSON colecției. Serverul raportează crearea prin `201 Created`, identifică resursa cu `Location` și returnează reprezentarea. `Example-Trace-Id` adaugă metadate opționale de corelare. Clientul care cunoaște numai starea, tipul media și corpul își poate îndeplini în continuare sarcina simplă.

## Variante

- Schimbați cererea în `GET` și identificați câmpurile corpului care ar dispărea.
- Înlocuiți `201` cu `200` și discutați sensul pierdut.
- Eliminați câmpul trace și confirmați că primul client continuă să funcționeze.
- Presupuneți că corpul nu poate fi interpretat fără trace și explicați de ce extensia nu mai este opțională compatibilă.

## Validare

Validat cu `node verify.mjs`: stările de preluare și creare, tipurile media, locația, câmpurile trace și reprezentările JSON sunt verificate prin limita HTTP reală. Traseul static a fost verificat pentru sintaxă și lungimi coerente.
