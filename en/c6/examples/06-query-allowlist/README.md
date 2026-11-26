# Lecture Example — Parameterized raw SQL report

An aggregate report is a reasonable place to use SQL directly. The Express route validates its public boolean query parameter, then `sequelize.query()` executes a fixed statement with a named replacement and `QueryTypes.SELECT`. User input is never interpolated into SQL.

```bash
npm install
npm test
npm start
curl -i 'http://localhost:3000/api/reports/note-summary?archived=false'
curl -i 'http://localhost:3000/api/reports/note-summary?archived=false%20OR%201%3D1'
```

Raw SQL does not execute Sequelize model validators. SQL constraints still apply. In this report, the route validates the HTTP parameter separately; the application must still initialize and close the database and handle errors.

Revalidated on 2026-10-26: clean npm ci and npm test pass on Node 24.5.0 against real Sequelize/SQLite operations; HTTP examples also use actual loopback requests.

### Direct execution and console output

Run `npm start` after `npm ci`. The console explains the steps and observed results. Server examples accept `PORT` (default 3000); startup output lists requests to try. SQLite is in memory and resets on restart.

The route calls SQL directly to keep validation and parameterization visible in one small example. In a larger application, move the query into a persistence function as section 30 explains.
