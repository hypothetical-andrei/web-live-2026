# Lecture Example — Schema and model definition

This example defines a Sequelize model, creates its table in SQLite, and compares the model definition with the resulting database schema.

`Note.getAttributes()` exposes the current public model metadata API, while `describeTable()` inspects what SQLite actually received. Model validation rejects a blank title before insertion, and the database table independently records nullability, defaults, uniqueness, and its primary key.

```bash
npm install
npm test
```

Try changing a model constraint, synchronize a fresh database, and inspect both metadata views again.

Revalidated on 2026-10-26: clean npm ci and npm test pass on Node 24.5.0 against real Sequelize/SQLite operations; HTTP examples also use actual loopback requests.

### Direct execution and console output

Run `npm start` after `npm ci`. The console explains the steps and observed results. The script exits after its checks and closes the database.
