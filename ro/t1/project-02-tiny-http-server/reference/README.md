# Server HTTP minimal

Rulati `npm install`, apoi `npm start`. Serverul afiseaza URL-ul loopback.

Inspectati raspunsul de fisier:

```sh
curl -i "<base-url>/"
```

Inspectati ruta bazata pe query:

```sh
curl -i "<base-url>/api/greetings?name=Ada"
```

Inspectati ruta bazata pe cale:

```sh
curl -i "<base-url>/api/greetings/Ada%20Lovelace"
```

Inspectati ruta de echo:

```sh
curl -i -X POST -H 'content-type: application/json' -d '{"clue":"crumbs"}' "<base-url>/api/echo"
```

Puteti trimite aceleasi cereri si din Thunder Client pentru a compara mai usor
tratarea cererilor de fisier, query, cale si corp.

Rulati `npm test` pentru toate verificarile sau separat scripturile
`test:baseline`, `test:objective` si `test:regression`.
