import { readFileSync, writeFileSync } from 'node:fs';
import { evaluateRecords } from './rule-engine.js';

const inputFile = new URL('../data/scenario.json', import.meta.url);
const outputFile = new URL('../data/result.json', import.meta.url);

export function run(io = console) {
  try {
    const { records, rule } = JSON.parse(readFileSync(inputFile, 'utf8'));
    writeFileSync(outputFile, `${JSON.stringify(evaluateRecords(records, rule), null, 2)}\n`);
    io.log('Wrote data/result.json');
    return 0;
  } catch (error) {
    io.error(error.message);
    return 1;
  }
}

if (process.argv[1] === new URL(import.meta.url).pathname) process.exitCode = run();
