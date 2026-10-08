import { readFileSync } from 'node:fs';
import { normalizeEvents, summarizeEvents } from './safe-normalizer.js';
import { unsafeNormalizeEvents } from './unsafe-generated.js';

export function parseArguments(args) {
  if (args.includes('--help')) return { help: true };
  const options = { file: new URL('../data/events.json', import.meta.url) };
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === '--file' && args[index + 1]) options.file = args[++index];
    else throw new Error(`unknown or incomplete argument: ${args[index]}`);
  }
  return options;
}

// The command-line boundary arrives last, after students have met in-memory values and file-based input/output.
export function run(args = process.argv.slice(2), io = console) {
  try {
    const options = parseArguments(args);
    if (options.help) {
      io.log('Usage: npm run compare -- [--file path]');
      return 0;
    }

    const source = JSON.parse(readFileSync(options.file, 'utf8'));
    const unsafeInput = structuredClone(source);
    let safe;
    let safeError = null;
    try {
      safe = normalizeEvents(source);
    } catch (error) {
      safeError = error.message;
    }

    io.log(JSON.stringify({
      unsafe: unsafeNormalizeEvents(unsafeInput),
      unsafeChangedInputOrder: unsafeInput[0].id !== source[0].id,
      safe,
      safeError,
      summary: safe ? summarizeEvents(safe) : null
    }, null, 2));
    return 0;
  } catch (error) {
    io.error(error.message);
    return 1;
  }
}

if (process.argv[1] === new URL(import.meta.url).pathname) process.exitCode = run();
