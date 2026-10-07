/**
 * ユーティリティ関数
 * 元のNext.js版 functions/ ディレクトリの関数を移植
 */

/**
 * 自然順（natural sort）で文字列を比較する
 * 例: ARIA2 が ARIA10 より前に来る
 */
export function naturalCompare(a: string, b: string): number {
  return a.localeCompare(b, 'en', { numeric: true });
}

/**
 * Record のキーを自然順に並べて返す
 */
export function sortedKeys<T>(record: Record<string, T>): string[] {
  return Object.keys(record).sort(naturalCompare);
}

/**
 * Record のキーを比較関数で並べて返す
 */
export function sortedKeysWith<T>(
  record: Record<string, T>,
  compare: (a: string, b: string) => number
): string[] {
  return Object.keys(record).sort(compare);
}

/** 達成方法IDの系統（表示順を維持する） */
const TECH_SYSTEM_ORDER = ['H', 'C', 'ARIA', 'SCR'] as const;

/** 達成方法IDから系統を取り出す（例: ARIA10 → ARIA, H2 → H） */
function techSystem(techId: string): string {
  const m = techId.match(/^[A-Za-z]+/);
  return m ? m[0] : techId;
}

/**
 * 達成方法IDを「系統順（H → C → ARIA → SCR）→ 系統内は数値順」で比較する
 */
export function techIdCompare(a: string, b: string): number {
  const sa = techSystem(a);
  const sb = techSystem(b);
  if (sa !== sb) {
    const ia = TECH_SYSTEM_ORDER.indexOf(sa as (typeof TECH_SYSTEM_ORDER)[number]);
    const ib = TECH_SYSTEM_ORDER.indexOf(sb as (typeof TECH_SYSTEM_ORDER)[number]);
    // 未知の系統は末尾にまとめて辞書順
    if (ia === -1 && ib === -1) return naturalCompare(sa, sb);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  }
  return naturalCompare(a, b);
}

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

// 達成方法（テクニック）データ型
type TechData = {
  title: string;
  target: string | null;
  skip_wcag20link?: boolean;
};

/** サイト共通メタデータ（metadata コレクションから組み立てた形） */
export type AsInfoMetadata = {
  author: string;
  pub_date: string;
  mod_date: string;
  last_reviewed_result_id: number;
  status: string;
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
 * 達成基準IDの参照先を解決
 */
export function getCriterionLookupId(
  criteria: Record<string, CriterionData>,
  criterionId: string
): string | undefined {
  if (criteria[criterionId]) {
    return criterionId;
  }
  const normalizedId = criterionId.replace(/\s*(\(参考\)|（参考）)$/u, '');
  if (normalizedId !== criterionId && criteria[normalizedId]) {
    return normalizedId;
  }
  return undefined;
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
  return sortedKeys(criteria).filter((key) => getTestsCount(tests, key) > 0);
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
  techs.sort(techIdCompare);
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
  criteria.sort(naturalCompare);
  return criteria;
}

/**
 * 結果をID順にソート
 */
export function sortByResultId(a: ResultData, b: ResultData): number {
  return a.id - b.id;
}

// 型のエクスポート
export type { CriterionData, TestData, TechData, ResultData, ResultContent };
