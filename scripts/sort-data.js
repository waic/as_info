// Sort data/tests.yaml by test ID (lex ascending)
// Sort data/techs.yaml by prefix groups (in existing file order), numeric ascending within each group
const fs = require('fs');
const yaml = require('js-yaml');

function readYaml(path) {
  const src = fs.readFileSync(path, 'utf8');
  return yaml.load(src);
}

function writeYaml(path, obj) {
  const out = yaml.dump(obj, { lineWidth: 1000, noRefs: true, sortKeys: false });
  fs.writeFileSync(path, out, 'utf8');
}

function sortTestsYaml(path) {
  const data = readYaml(path);
  const keys = Object.keys(data).sort(); // zero-padded IDs sort lexicographically
  const sorted = {};
  for (const k of keys) sorted[k] = data[k];
  writeYaml(path, sorted);
}

function getPrefix(id) {
  const m = String(id).match(/^[A-Za-z]+/);
  return m ? m[0] : '';
}

function getNumber(id) {
  const m = String(id).match(/(\d+)/);
  return m ? parseInt(m[1], 10) : Number.MAX_SAFE_INTEGER;
}

function sortTechsYaml(path) {
  const data = readYaml(path);
  const entries = Object.entries(data);
  // Preserve existing prefix group order (first appearance wins)
  const groupOrder = [];
  const seen = new Set();
  for (const [k] of entries) {
    const p = getPrefix(k);
    if (!seen.has(p)) { seen.add(p); groupOrder.push(p); }
  }
  const groups = new Map(groupOrder.map(p => [p, []]));
  for (const [k, v] of entries) {
    const p = getPrefix(k);
    if (!groups.has(p)) groups.set(p, []);
    groups.get(p).push([k, v]);
  }
  // Sort each group by numeric part of ID
  Array.from(groups.entries()).forEach(([p, arr]) => {
    arr.sort((a, b) => getNumber(a[0]) - getNumber(b[0]));
  });
  // Reassemble in group order
  const sorted = {};
  for (const p of groupOrder) {
    for (const [k, v] of groups.get(p) || []) {
      sorted[k] = v;
    }
  }
  writeYaml(path, sorted);
}

function main() {
  sortTestsYaml('data/tests.yaml');
  sortTechsYaml('data/techs.yaml');
}

if (require.main === module) {
  main();
}
