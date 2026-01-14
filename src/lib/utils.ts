/**
 * ユーティリティ関数
 * 元のNext.js版 functions/ ディレクトリの関数を移植
 */

import type { CollectionEntry } from 'astro:content';

// 達成基準のデータ型
type CriterionData = {
  title: string;
  level: 'A' | 'AA' | 'AAA';
  wcag20url?: string;
  wcag21url?: string;
  wcag22url?: string;
  wcag22note?: string;
  asinfo201406?: boolean;
};

// テストデータ型
type TestData = {
  title: string;
  code: string | string[];
  document: string;
  criteria: string[];
  techs: string[];
};

// 結果データ型
type ResultData = {
  id: number;
  test: string;
  os: string;
  user_agent: string;
  environment_type?: string | string[] | null;
  assistive_tech?: string | null;
  assistive_tech_config?: string | null;
  contents: ResultContent[];
  comment?: string | null;
  reviewer_comment?: string | null;
  tester: string;
  date: string;
};

type ResultContent = {
  expected?: string | null;
  procedure?: string | null;
  actual?: string | null;
  judgment?: string | null;
};

/**
 * 達成基準のレベル表示を生成
 */
export function getCriterionLevel(criterion: CriterionData): string {
  if (criterion.wcag22url === 'tbd') {
    return `(WCAG 2.2 レベル${criterion.level})`;
  }
  if (criterion.wcag22note) {
    return `(レベル${criterion.level}) (WCAG 2.2 ${criterion.wcag22note})`;
  }
  if (typeof criterion.wcag20url === 'undefined') {
    return `(WCAG 2.1 レベル${criterion.level})`;
  }
  return `(レベル${criterion.level})`;
}

/**
 * 達成方法のディレクトリを取得
 */
const techDirMap: { [key: string]: string } = {
  'ARIA': 'aria',
  'C': 'css',
  'SCR': 'client-side-script',
};

export function getTechDir(techId: string): string {
  for (const prefix in techDirMap) {
    if (techId.startsWith(prefix)) {
      return techDirMap[prefix];
    }
  }
  return 'html';
}

/**
 * 特定のテストIDに対する結果の数を取得
 */
export function getResultsCount(
  results: ResultData[],
  testId: string
): number {
  return results.filter((result) => result.test === testId).length;
}

/**
 * 特定の達成基準に対するテストの数を取得
 */
export function getTestsCount(
  tests: Record<string, TestData>,
  criterionId: string
): number {
  return Object.keys(tests).filter((key) =>
    tests[key].criteria.includes(criterionId)
  ).length;
}

/**
 * テスト結果がある達成基準のリストを取得
 */
export function queryCriteriaWithTests(
  criteria: Record<string, CriterionData>,
  tests: Record<string, TestData>
): string[] {
  return Object.keys(criteria).filter(
    (key) => getTestsCount(tests, key) > 0
  );
}

/**
 * 特定の達成基準に関連する達成方法のリストを取得
 */
export function queryTechs(
  tests: Record<string, TestData>,
  criterionId: string
): string[] {
  const techs: string[] = [];
  Object.keys(tests).forEach((test) => {
    if (tests[test].criteria.includes(criterionId)) {
      tests[test].techs.forEach((tech: string) => {
        if (!techs.includes(tech)) {
          techs.push(tech);
        }
      });
    }
  });
  techs.sort();
  return techs;
}

/**
 * 特定のテストIDリストと達成方法に関連する達成基準のリストを取得
 */
export function queryCriteria(
  tests: Record<string, TestData>,
  testIds: string[],
  techId: string
): string[] {
  const criteria: string[] = [];
  testIds.forEach((test) => {
    if (tests[test].techs.includes(techId)) {
      tests[test].criteria.forEach((criterion: string) => {
        if (!criteria.includes(criterion)) {
          criteria.push(criterion);
        }
      });
    }
  });
  criteria.sort();
  return criteria;
}

/**
 * 結果をID順にソート
 */
export function sortByResultId(a: ResultData, b: ResultData): number {
  return a.id - b.id;
}

// 型のエクスポート
export type { CriterionData, TestData, ResultData, ResultContent };
