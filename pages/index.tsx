import React from 'react'
import Logo from '../components/Logo'
import { Metadata } from '../types/metadata';
import metadataRaw from '../data/metadata.yaml'
const metadata = metadataRaw as Metadata;
import { TestData } from '../types/test';
import testsRaw from '../data/tests.yaml'
const tests = testsRaw as Record<string, TestData>;
import { CriterionData } from '../types/criterion';
import criteriaRaw from '../data/criteria.yaml';
const criteria = criteriaRaw as Record<string, CriterionData>;
import { NextSeo } from 'next-seo'
import SEO from '../next-seo.config'
import Link from 'next/link'
import { getCriterionLevel } from '../functions/getCriterionLevel'
import { queryCriteriaWithTests } from '../functions/queryCriteriaWithTests'
import { getResultsCount } from '../functions/getResultsCount';

const Index = () =>
  <>
    <NextSeo {...Object.assign(SEO, { title: 'ホーム' })} />
    <Logo />
    <main>
      <h1>アクセシビリティ サポーテッド（AS）情報</h1>
      <ul>
        <li>公開日：{metadata.pub_date}</li>
        <li>更新日：{metadata.mod_date}</li>
        <li>作成者：{metadata.author}</li>
        {metadata.status && <li>注記：{metadata.status}</li>}
      </ul>
      <h2>検証結果を含む達成基準</h2>
      <ul>
        {queryCriteriaWithTests().map(
          key => <li key={key}>
            <Link href={'criteria/' + key + '.html'}>
              {key}
              &nbsp;
              {criteria[key].title}
              &nbsp;
              {getCriterionLevel(criteria[key])}
            </Link>
          </li>
        )}
      </ul>
      <h2>テストの一覧</h2>
      <ul>
        {Object.keys(tests).map(
          key => <li key={key}>
            <Link href={'results/' + key + '.html'}>{key}: {tests[key].title} (結果: {getResultsCount(key)}件)</Link>
          </li>
        )}
      </ul>
    </main>
    <nav>
      <h2>リンク</h2>
      <ul className="related_link">
        <li><Link href="criteria">達成基準の一覧</Link></li>
        <li><Link href="techs">達成方法の一覧</Link></li>
        <li>
          <Link href="https://waic.jp/guideline/as/#past_results">
            過去のアクセシビリティ サポーテッド検証結果
          </Link>
        </li>
        <li>
          <Link href="https://waic.jp/translations/WCAG22/">WCAG 2.2</Link>
        </li>
        <li>
          <Link href="https://waic.jp/translations/WCAG21/">WCAG 2.1</Link>
        </li>
        <li>
          <Link href="https://waic.jp/translations/WCAG20/">WCAG 2.0</Link>
        </li>
      </ul>
    </nav>
  </>

export default Index;