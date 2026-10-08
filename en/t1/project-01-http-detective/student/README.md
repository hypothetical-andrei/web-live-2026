# HTTP Detective investigation target

Run `npm install`, then `npm start`. Open the printed loopback URL, open the browser Network panel, and select **Run investigation**.

Use `curl -i` to inspect response status, headers, and body. Use `curl -v` when request headers must also be visible. Complete `case-report.json` only from observed traffic, then run `npm test`.

The server and browser request code are supplied investigation infrastructure. This exercise changes only the report.
