/**
 * Content Collections からデータを読み込むヘルパー
 */
import { getCollection } from 'astro:content';

/**
 * 達成基準データを取得
 */
export async function getCriteria() {
  const entries = await getCollection('criteria');
  return entries.reduce<Record<string, any>>((acc, entry) => {
    acc[entry.id] = entry.data;
    return acc;
  }, {});
}

/**
 * 達成方法データを取得
 */
export async function getTechs() {
  const entries = await getCollection('techs');
  return entries.reduce<Record<string, any>>((acc, entry) => {
    acc[entry.id] = entry.data;
    return acc;
  }, {});
}

/**
 * テストデータを取得
 */
export async function getTests() {
  const entries = await getCollection('tests');
  return entries.reduce<Record<string, any>>((acc, entry) => {
    acc[entry.id] = entry.data;
    return acc;
  }, {});
}

/**
 * 結果データを取得
 */
export async function getResults() {
  const entries = await getCollection('results');
  return entries.map((entry) => entry.data);
}

/**
 * メタデータを取得
 */
export async function getMetadata() {
  const entries = await getCollection('metadata');
  const defaults = {
    author: '',
    pub_date: '',
    mod_date: '',
    last_reviewed_result_id: 0,
    status: '',
  };

  const obj = entries.reduce<Record<string, any>>((acc, entry) => {
    acc[entry.id] = entry.data;
    return acc;
  }, {});

  return {
    author: typeof obj.author === 'string' ? obj.author : defaults.author,
    pub_date: typeof obj.pub_date === 'string' ? obj.pub_date : defaults.pub_date,
    mod_date: typeof obj.mod_date === 'string' ? obj.mod_date : defaults.mod_date,
    last_reviewed_result_id:
      typeof obj.last_reviewed_result_id === 'number'
        ? obj.last_reviewed_result_id
        : Number(obj.last_reviewed_result_id ?? defaults.last_reviewed_result_id),
    status: typeof obj.status === 'string' ? obj.status : defaults.status,
  };
}
