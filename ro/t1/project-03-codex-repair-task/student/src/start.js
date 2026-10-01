import { createServer, listen } from './server.js';

const server = createServer();
console.log(`Sarcină de remediere cu Codex: ${await listen(server, Number(process.env.PORT ?? 0))}`);
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => process.exit(0)));
