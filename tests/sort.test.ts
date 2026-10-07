// 並び順ユーティリティの回帰防止テスト
// 実行: npx tsx --test tests/sort.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  naturalCompare,
  techIdCompare,
  sortedKeys,
  sortedKeysWith,
} from '../src/lib/utils.ts';

test('naturalCompare: 数値入り文字列を数値順に比較する', () => {
  assert.ok(naturalCompare('ARIA2', 'ARIA10') < 0);
  assert.ok(naturalCompare('SCR2', 'SCR16') < 0);
  assert.ok(naturalCompare('H2', 'H102') < 0);
  assert.ok(naturalCompare('1.9.1', '1.10.1') < 0);
  assert.ok(naturalCompare('1.10.1', '1.11.1') < 0);
  assert.equal(naturalCompare('H2', 'H2'), 0);
});

test('techIdCompare: 系統順 H → C → ARIA → SCR を維持する', () => {
  const actual = [
    'SCR16',
    'ARIA10',
    'H2',
    'C6',
    'ARIA2',
    'SCR2',
    'H102',
    'C18',
  ].sort(techIdCompare);

  assert.deepEqual(actual, [
    'H2',
    'H102',
    'C6',
    'C18',
    'ARIA2',
    'ARIA10',
    'SCR2',
    'SCR16',
  ]);
});

test('techIdCompare: 系統内は数値順、欠番は詰めない', () => {
  const actual = ['ARIA24', 'ARIA1', 'ARIA10', 'ARIA4', 'ARIA2'].sort(
    techIdCompare
  );
  assert.deepEqual(actual, ['ARIA1', 'ARIA2', 'ARIA4', 'ARIA10', 'ARIA24']);
});

test('techIdCompare: 未知の系統は末尾に辞書順でまとめる', () => {
  const actual = ['foo3', 'H2', 'BAR1', 'ARIA10', 'ZZ9'].sort(techIdCompare);
  assert.deepEqual(actual, ['H2', 'ARIA10', 'BAR1', 'foo3', 'ZZ9']);
});

test('sortedKeys: Record のキーを自然順で返す', () => {
  const record = { '1.4.12': 1, '1.4.4': 2, '1.4.1': 3 };
  assert.deepEqual(sortedKeys(record), ['1.4.1', '1.4.4', '1.4.12']);
});

test('sortedKeysWith: 比較関数で Record のキーを並べる', () => {
  const record = { SCR16: 1, ARIA2: 2, H2: 3, SCR2: 4 };
  assert.deepEqual(sortedKeysWith(record, techIdCompare), [
    'H2',
    'ARIA2',
    'SCR2',
    'SCR16',
  ]);
});
