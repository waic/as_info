/**
 * Content Collections からデータを読み込むヘルパー
 */
import { getCollection } from 'astro:content';
import type {
  AsInfoMetadata,
  CriterionData,
  ResultData,
  TechData,
  TestData,
} from './utils';

/**
 * 達成基準データを取得
 */
export async function getCriteria(): Promise<Record<string, CriterionData>> {
  const entries = await getCollection('criteria');
  return entries.reduce<Record<string, CriterionData>>((acc, entry) => {
    acc[entry.id] = entry.data;
    return acc;
  }, {});
}

/**
 * 達成方法データを取得
 */
export async function getTechs(): Promise<Record<string, TechData>> {
  const entries = await getCollection('techs');
  return entries.reduce<Record<string, TechData>>((acc, entry) => {
    acc[entry.id] = entry.data;
    return acc;
  }, {});
}

/**
 * テストデータを取得
 */
export async function getTests(): Promise<Record<string, TestData>> {
  const entries = await getCollection('tests');
  return entries.reduce<Record<string, TestData>>((acc, entry) => {
    acc[entry.id] = entry.data;
    return acc;
  }, {});
}

/**
 * 結果データを取得
 */
export async function getResults(): Promise<ResultData[]> {
  const entries = await getCollection('results');
  return entries.map((entry) => entry.data);
}

/**
 * メタデータを取得
 */
export async function getMetadata(): Promise<AsInfoMetadata> {
  const entries = await getCollection('metadata');
  const defaults: AsInfoMetadata = {
    author: '',
    pub_date: '',
    mod_date: '',
    last_reviewed_result_id: 0,
    status: '',
  };

  const obj = entries.reduce<Record<string, string | number>>((acc, entry) => {
    acc[entry.id] = entry.data;
    return acc;
  }, {});

  const rawLast = obj.last_reviewed_result_id;
  const parsedLast =
    typeof rawLast === 'number'
      ? rawLast
      : Number(rawLast ?? defaults.last_reviewed_result_id);
  const last_reviewed_result_id = Number.isFinite(parsedLast)
    ? parsedLast
    : defaults.last_reviewed_result_id;

  return {
    author: typeof obj.author === 'string' ? obj.author : defaults.author,
    pub_date: typeof obj.pub_date === 'string' ? obj.pub_date : defaults.pub_date,
    mod_date: typeof obj.mod_date === 'string' ? obj.mod_date : defaults.mod_date,
    last_reviewed_result_id,
    status: typeof obj.status === 'string' ? obj.status : defaults.status,
  };
}
