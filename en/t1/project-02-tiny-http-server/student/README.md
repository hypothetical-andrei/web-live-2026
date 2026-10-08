# Tiny HTTP Server

Run `npm install`, then `npm start`. The server prints its loopback URL.

Inspect the file response:

```sh
curl -i "<base-url>/"
```

Inspect the query route:

```sh
curl -i "<base-url>/api/greetings?name=Ada"
```

Implement the missing path route, then inspect it:

```sh
curl -i "<base-url>/api/greetings/Ada%20Lovelace"
```

Inspect the echo route:

```sh
curl -i -X POST -H 'content-type: application/json' -d '{"clue":"crumbs"}' "<base-url>/api/echo"
```

Thunder Client is a good second check: send one `GET` request to `/`, one
`GET` request to `/api/greetings?name=Ada`, one `GET` request to
`/api/greetings/Ada%20Lovelace`, and one JSON `POST` request to `/api/echo`.

Run `npm test` for all checks, or use the `test:baseline`, `test:objective`, and `test:regression` scripts separately.
