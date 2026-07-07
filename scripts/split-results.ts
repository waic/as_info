// Split src/content/results/results.yaml into individual YAML files per id.
// Each entry is written to src/content/results/{NNNN}/{NNNN}.yaml
// where NNNN is the zero-padded 4-digit id. Folders are grouped by 100 ids.
//
// Usage: npx tsx scripts/split-results.ts
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const SRC = 'src/content/results/results.yaml';
const OUT_DIR = 'src/content/results';

interface ResultEntry {
  id: number;
  [key: string]: unknown;
}

function pad4(n: number): string {
  return String(n).padStart(4, '0');
}

function folderFor(id: number): string {
  // id 1..100 -> 0001, id 101..200 -> 0101, ...
  const start = Math.floor((id - 1) / 100) * 100 + 1;
  return pad4(start);
}

function main(): void {
  const raw = fs.readFileSync(SRC, 'utf8');
  const entries = yaml.load(raw) as ResultEntry[];
  if (!Array.isArray(entries)) {
    throw new Error('Expected results.yaml to contain an array');
  }

  let count = 0;
  for (const entry of entries) {
    const id = entry.id;
    if (typeof id !== 'number') {
      throw new Error(`Entry missing numeric id: ${JSON.stringify(entry).slice(0, 100)}`);
    }
    const folder = path.join(OUT_DIR, folderFor(id));
    fs.mkdirSync(folder, { recursive: true });
    const filePath = path.join(folder, `${pad4(id)}.yaml`);
    const out = yaml.dump(entry, {
      lineWidth: 1000,
      noRefs: true,
      sortKeys: false,
      // keep null values as bare keys (key:) to match existing style
      nullStr: '',
    });
    // js-yaml still emits "key: null" for null values; normalize to bare "key:"
    const normalized = out.replace(/^(\s*[\w-]+): null$/gm, '$1:');
    fs.writeFileSync(filePath, normalized, 'utf8');
    count++;
  }
  console.log(`Split ${count} entries into ${OUT_DIR}/*/`);
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.includes('split-results')) {
  main();
}