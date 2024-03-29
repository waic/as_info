import React from 'react'
import Logo from '../../components/Logo'
import H1 from '../../components/H1'
import { useRouter } from 'next/router'
import { Metadata } from '../../types/metadata';
import metadataRaw from '../../data/metadata.yaml'
const metadata = metadataRaw as Metadata;
import { TechData } from '../../types/tech';
import techsRaw from '../../data/techs.yaml';
const techs = techsRaw as Record<string, TechData>;
import { TestData } from '../../types/test';
import testsRaw from '../../data/tests.yaml'
const tests = testsRaw as Record<string, TestData>;
import { CriterionData } from '../../types/criterion';
import criteriaRaw from '../../data/criteria.yaml';
const criteria = criteriaRaw as Record<string, CriterionData>;
import { queryCriteria } from '../../functions/queryCriteria'
import { getResultsCount } from '../../functions/getResultsCount'
import { NextSeo } from 'next-seo'
import SEO from '../../next-seo.config'
import Link from 'next/link'
import { getCriterionLevel } from '../../functions/getCriterionLevel'
import { getTechDir } from '../../functions/getTechDir';

const Tech = ({ query }) => {
  const router = useRouter()
  if (router.isFallback) {
    return <div>Loading...</div>
  }
  const { id } = router.query
  if (typeof id !== 'string') {
    throw new Error("id is an array");
  }
  const true_id = id.replace(/.html$/, '') // '.html' is appended to the routing path when exporting, so remove it.
  const tech = techs[true_id];
  const test_ids = Object.keys(tests).filter(
    key => tests[key].techs.includes(true_id)
  );
  const tech_dir = getTechDir(true_id);
  const criterion_ids = queryCriteria(test_ids, true_id);
  return (
    <>
      <NextSeo {...Object.assign(SEO, { title: '達成方法' + true_id })} />
      <Logo />
      <main id="main">
        <H1
          first='アクセシビリティ サポーテッド（AS）情報：達成方法'
          second={`${true_id}: ${tech.title}`}
        />
        <ul>
          <li>作成者：{metadata.author}</li>
        </ul>
        <h2>テストの対象となる達成基準</h2>
        <ul>
          {criterion_ids.map(criterion_id => (
            <li key={criterion_id}>
              <Link href={'../criteria/' + criterion_id + '.html'}>
                {criterion_id}
                &nbsp;
                {criteria[criterion_id].title}
                &nbsp;
                {getCriterionLevel(criteria[criterion_id])}
              </Link>
            </li>
          ))}
        </ul>
        <h2>検証結果を含むテストケース</h2>
        <ul>
          {test_ids.map(test_id => (
            <li key={test_id}>
              <Link href={'../results/' + test_id + '.html'}>{test_id}: {tests[test_id].title} (結果:{getResultsCount(test_id)}件)</Link>
            </li>
          ))}
        </ul>
      </main>
      <nav>
        <h2>リンク</h2>
        <ul className="related_link">
          {tech.skip_wcag20link ||
            <li><Link href={`https://waic.jp/translations/WCAG-TECHS/${true_id}.html`}>WCAG 2.0 達成方法集 {true_id}</Link></li>
          }
          <li><Link href={`https://waic.jp/translations/WCAG21/Techniques/${tech_dir}/${true_id}`}>WCAG 2.1 達成方法集 {true_id}</Link></li>
          <li><Link href="../">アクセシビリティ サポーテッド（AS）情報のホーム</Link></li>
        </ul>
      </nav>
    </>
  )
}

export default Tech;
