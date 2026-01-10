/**
 * Content Collections からデータを読み込むヘルパー
 */
import { getEntry } from 'astro:content';

/**
 * 達成基準データを取得
 */
export async function getCriteria() {
  const entry = await getEntry('criteria', 'criteria');
  return entry?.data ?? {};
}

/**
 * 達成方法データを取得
 */
export async function getTechs() {
  const entry = await getEntry('techs', 'techs');
  return entry?.data ?? {};
}

/**
 * テストデータを取得
 */
export async function getTests() {
  const entry = await getEntry('tests', 'tests');
  return entry?.data ?? {};
}

/**
 * 結果データを取得
 */
export async function getResults() {
  const entry = await getEntry('results', 'results');
  return entry?.data ?? [];
}

/**
 * メタデータを取得
 */
export async function getMetadata() {
  const entry = await getEntry('metadata', 'metadata');
  return entry?.data ?? {
    author: '',
    pub_date: '',
    mod_date: '',
    last_reviewed_result_id: 0,
    status: '',
  };
}
