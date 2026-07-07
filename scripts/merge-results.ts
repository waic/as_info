// Merge individual per-id result YAML files back into a single results.yaml.
// Inverse of split-results.ts. Reads src/content/results/{NNNN}/{NNNN}.yaml
// and writes src/content/results/results.yaml (sorted by id ascending).
//
// Usage: npx tsx scripts/merge-results.ts
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const SRC_DIR = 'src/content/results';
const OUT = 'src/content/results/results.yaml';

interface ResultEntry {
  id: number;
  [key: string]: unknown;
}

function pad4(n: number): string {
  return String(n).padStart(4, '0');
}

function main(): void {
  const entries: ResultEntry[] = [];

  const folders = fs
    .readdirSync(SRC_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && /^\d{4}$/.test(d.name))
    .map((d) => d.name)
    .sort();

  for (const folder of folders) {
    const folderPath = path.join(SRC_DIR, folder);
    const files = fs
      .readdirSync(folderPath)
      .filter((f) => f.endsWith('.yaml') && /^\d{4}\.yaml$/.test(f))
      .sort();
    for (const file of files) {
      const raw = fs.readFileSync(path.join(folderPath, file), 'utf8');
      const entry = yaml.load(raw) as ResultEntry;
      if (typeof entry.id !== 'number') {
        throw new Error(`${file} missing numeric id`);
      }
      entries.push(entry);
    }
  }

  entries.sort((a, b) => a.id - b.id);

  const out = yaml.dump(entries, {
    lineWidth: 1000,
    noRefs: true,
    sortKeys: false,
    nullStr: '',
  });
  // js-yaml still emits "key: null" for null values; normalize to bare "key:"
  const normalized = out.replace(/^(\s*[\w-]+): null$/gm, '$1:');
  fs.writeFileSync(OUT, normalized, 'utf8');
  console.log(`Merged ${entries.length} entries into ${OUT}`);
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.includes('merge-results')) {
  main();
}