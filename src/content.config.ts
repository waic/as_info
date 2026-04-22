import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';

/**
 * WCAG 達成基準 (Success Criteria) スキーマ
 */
const criteriaSchema = z.object({
  title: z.string().describe('達成基準のタイトル（日本語）'),
  level: z.enum(['A', 'AA', 'AAA']).describe('WCAG 適合レベル'),
  wcag20url: z.string().optional().describe('WCAG 2.0 仕様書へのリンク'),
  wcag21url: z.string().optional().describe('WCAG 2.1 仕様書へのリンク'),
  wcag22url: z.string().optional().describe('WCAG 2.2 仕様書へのリンク'),
  wcag22note: z.string().optional().describe('WCAG 2.2 に関する注記'),
  asinfo201406: z.boolean().optional().describe('2014年6月版のAS情報に含まれるか'),
});

/**
 * 達成方法 (Techniques) スキーマ
 */
const techsSchema = z.object({
  title: z.string().describe('達成方法のタイトル（日本語）'),
  target: z.string().nullable().describe('対象となる要素・属性'),
  skip_wcag20link: z.boolean().optional().describe('WCAG 2.0 リンクをスキップするか'),
});

/**
 * テストケース (Tests) スキーマ
 */
const testsSchema = z.object({
  title: z.string().describe('テストケースのタイトル（日本語）'),
  code: z
    .union([z.string(), z.array(z.string())])
    .describe('テストコードのURL（単一または複数）'),
  document: z.string().describe('テストドキュメントのURL'),
  criteria: z.array(z.string()).describe('関連する達成基準のID'),
  techs: z.array(z.string()).describe('適用される達成方法のID'),
});

/**
 * テスト結果のコンテンツ (Result Content) スキーマ
 */
const resultContentSchema = z.object({
  expected: z.string().optional().nullable().describe('期待される結果'),
  procedure: z.string().optional().nullable().describe('テスト手順'),
  actual: z.string().optional().nullable().describe('実際の結果'),
  judgment: z.string().optional().nullable().describe('判定結果（満たしている/満たしていない）'),
});

/**
 * テスト結果 (Results) スキーマ
 */
const resultsSchema = z.object({
  id: z.number().describe('テスト結果の一意識別子'),
  test: z.string().describe('対応するテストケースのID'),
  os: z.string().describe('テスト環境のOS'),
  user_agent: z.string().describe('テストに使用したブラウザ'),
  environment_type: z.union([z.string(), z.array(z.string())]).optional().nullable().describe('環境の種別'),
  assistive_tech: z.string().optional().nullable().describe('使用した支援技術'),
  assistive_tech_config: z.string().optional().nullable().describe('支援技術の設定'),
  contents: z.array(resultContentSchema).describe('テスト結果の詳細'),
  comment: z.string().optional().nullable().describe('テスターのコメント'),
  reviewer_comment: z.string().optional().nullable().describe('レビュアーのコメント'),
  tester: z.string().describe('テスター名'),
  date: z.string().describe('テスト実施日'),
});

/**
 * メタデータ (Metadata) スキーマ
 */
const metadataSchema = z.object({
  author: z.string().describe('著者/組織名'),
  pub_date: z.string().describe('公開日'),
  mod_date: z.string().describe('最終更新日'),
  last_reviewed_result_id: z.number().describe('最後にレビューされた結果ID'),
  status: z.string().describe('ステータスメッセージ'),
});

export const collections = {
  criteria: defineCollection({
    loader: file('src/content/criteria/criteria.yaml'),
    schema: criteriaSchema,
  }),
  techs: defineCollection({
    loader: file('src/content/techs/techs.yaml'),
    schema: techsSchema,
  }),
  tests: defineCollection({
    loader: file('src/content/tests/tests.yaml'),
    schema: testsSchema,
  }),
  results: defineCollection({
    loader: file('src/content/results/results.yaml'),
    schema: resultsSchema,
  }),
  metadata: defineCollection({
    loader: file('src/content/metadata/metadata.yaml'),
    schema: z.union([z.string(), z.number()]),
  }),
};

