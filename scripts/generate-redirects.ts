/**
 * リダイレクトルール生成スクリプト
 *
 * 旧サイト（Next.js 実装、公開版 2022-10-03）の URL を
 * 新URL（waic.github.io/as_info/）へリダイレクトするための
 * .htaccess ルールと、旧URL→新URL の対応表（CSV）を生成する。
 *
 * 旧サイトと新サイトはパス構造が同一（/docs/as/info/ → /as_info/）のため、
 * .html 付き URL をプレフィックス置換でリダイレクトする。
 * .html なし URL は対象外とする（既存の別ルールで処理されるため）。
 *
 * 使い方:
 *   npx tsx scripts/generate-redirects.ts
 *
 * 出力:
 *   - redirects/.htaccess   （リダイレクトルール）
 *   - redirects/redirects.csv （旧URL→新URL の対応表、参考用）
 */
import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const OLD_COMMIT = '5f11954'; // 公開版（2022-10-03）のビルド元コミット
const OLD_BASE = 'https://waic.jp/docs/as/info/';
const NEW_BASE = 'https://waic.github.io/as_info/'; // 新サイトの URL

/** git show で指定コミットのファイル内容を取得する */
function gitShow(commit: string, path: string): string {
  return execSync(`git show ${commit}:${path}`, { encoding: 'utf8' });
}

/** YAML のトップレベルキー（行頭のキー）を抽出する */
function extractYamlKeys(yaml: string): string[] {
  return yaml
    .split('\n')
    .map((line) => line.match(/^([A-Za-z0-9][A-Za-z0-9.\-]*):/)?.[1])
    .filter((k): k is string => !!k);
}

// 旧サイトのデータからキーを取得
const criteriaKeys = extractYamlKeys(gitShow(OLD_COMMIT, 'data/criteria.yaml'));
const testsKeys = extractYamlKeys(gitShow(OLD_COMMIT, 'data/tests.yaml'));
const techsKeys = extractYamlKeys(gitShow(OLD_COMMIT, 'data/techs.yaml'));

// 旧サイトの URL パスを列挙（exportPathMap と同じ規則）
// - / → index.html
// - /criteria/{key}.html
// - /results/{key}.html
// - /techs/{key}.html
// 注: 404.html は Next.js が生成するが、新サイト（Astro）には存在しないため除外する
const oldPaths: string[] = [
  'index.html',
  ...criteriaKeys.map((k) => `criteria/${k}.html`),
  ...testsKeys.map((k) => `results/${k}.html`),
  ...techsKeys.map((k) => `techs/${k}.html`),
];

// --- .htaccess ルール生成 ---
// - 旧サイトの /docs/as/info/ 配下の .html 付き URL を新サイトへ 301 リダイレクト
// - ディレクトリパス（/docs/as/info/）と index.html もカバー
// - 注: .html なし URL（criteria/1.1.1 など）は対象外とする。
//   （既存の別ルールで処理されるため、ここでは触れない）
// - 注: このルールは .htaccess をサイトルート（/）に置く場合のパターン。
//   .htaccess を /docs/as/info/ ディレクトリ内に置く場合は
//   RewriteRule ^(.*\.html)$ https://waic.github.io/as_info/$1 [R=301,L]
//   に変更する。
const htaccess = `# アクセシビリティ サポーテッド（AS）情報 の URL 移転に伴うリダイレクト
# 旧: https://waic.jp/docs/as/info/
# 新: https://waic.github.io/as_info/
#
# 対象: .html 付き URL（およびディレクトリパス）
# 注: .html なし URL（criteria/1.1.1 など）は対象外とする。
#   （既存の別ルールで処理されるため、ここでは触れない）
#
# 使い方:
#   - この .htaccess をサイトルート（/）に置く場合: このまま使用
#   - /docs/as/info/ ディレクトリ内に置く場合:
#       RewriteRule ^(.*\\.html)$ https://waic.github.io/as_info/$1 [R=301,L]
#     に変更する

RewriteEngine On
# ディレクトリパス（index.html を配信）
RewriteRule ^docs/as/info/?$ ${NEW_BASE} [R=301,L]
# .html 付きの全ページ
RewriteRule ^docs/as/info/(.*\\.html)$ ${NEW_BASE}$1 [R=301,L]
`;

writeFileSync('redirects/.htaccess', htaccess, 'utf8');

// --- CSV 生成（参考用） ---
// 旧URL→新URL の対応表。ディレクトリパス（/docs/as/info/）も含める。
const csvLines = ['old_url,new_url'];
csvLines.push(`${OLD_BASE},${NEW_BASE}`); // ディレクトリパス
for (const p of oldPaths) {
  csvLines.push(`${OLD_BASE}${p},${NEW_BASE}${p}`);
}

writeFileSync('redirects/redirects.csv', csvLines.join('\n') + '\n', 'utf8');

console.log('出力: redirects/.htaccess');
console.log('出力: redirects/redirects.csv');
console.log(`旧サイトの URL: ${oldPaths.length + 1} 件（ディレクトリパス含む）`);
console.log('--- .htaccess ---');
console.log(htaccess);
console.log('--- redirects.csv 先頭 5 行 ---');
console.log(csvLines.slice(0, 5).join('\n'));
