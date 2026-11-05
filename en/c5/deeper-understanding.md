# Deeper understanding — Lecture 05 — Server-Side JavaScript and REST APIs

Use these readings after the lecture to revisit its concepts in more depth.

- [MDN: HTTP response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status) — design consistent success and failure contracts.
- [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110) — consult the normative definitions behind methods, fields, and status codes.


- [Express 5 error handling](https://expressjs.com/en/5x/guide/error-handling/) — compare returned promises, callbacks, and the headers-sent case with example 06.
- [Joi API](https://joi.dev/api/18.x.x) — inspect required fields, unknown keys, conversion, and validation results; example 05 pins the compatible Joi 17.13.8 release.
- [OpenAPI 3.1.1](https://spec.openapis.org/oas/v3.1.1.html) — read the Paths, Operation, Request Body, and Responses objects beside example 05's JSON file.
- [Fastify encapsulation](https://fastify.dev/docs/latest/Reference/Encapsulation/) — compare its plugin scopes with the ordered Express middleware you traced. This is an optional framework comparison.

- [Fielding: REST architectural style](https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm) — distinguish the architectural constraints from CRUD conventions.
- [Richardson maturity model](https://martinfowler.com/articles/richardsonMaturityModel.html) — compare resources, HTTP semantics and hypermedia; this is not a REST conformance standard.
- [RFC 9110: content negotiation](https://www.rfc-editor.org/rfc/rfc9110.html#section-12) — relate Accept, quality values and Vary to the JSON/CSV collection example.
