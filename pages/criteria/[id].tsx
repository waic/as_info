import React from 'react'
import Logo from '../../components/Logo'
import H1 from '../../components/H1'
import { useRouter } from 'next/router'
import { Metadata } from '../../types/metadata';
import metadataRaw from '../../data/metadata.yaml'
const metadata = metadataRaw as Metadata;
import { CriterionData } from '../../types/criterion';
import criteriaRaw from '../../data/criteria.yaml';
const criteria = criteriaRaw as Record<string, CriterionData>;
import { TechData } from '../../types/tech';
import techsRaw from '../../data/techs.yaml';
const techs = techsRaw as Record<string, TechData>;
import { NextSeo } from 'next-seo'
import SEO from '../../next-seo.config'
import { queryTechs } from '../../functions/queryTechs'
import Link from 'next/link'
import { getCriterionLevel } from '../../functions/getCriterionLevel'

const Criterion = ({ query }) => {
  const router = useRouter()
  if (router.isFallback) {
    return <div>Loading...</div>
  }
  const { id } = router.query
  if (typeof id !== 'string') {
    throw new Error("id is an array");
  }
  const true_id = id.replace(/.html$/, '') // '.html' is appended to the routing path when exporting, so remove it.
  const criterion = criteria[true_id];
  return (
    <>
      <NextSeo {...Object.assign(SEO, { title: '達成基準' + true_id })} />
      <Logo />
      <main id="main">
        <H1
          first='アクセシビリティ サポーテッド（AS）情報：達成基準'
          second={`${true_id} ${criterion.title} ${getCriterionLevel(criterion)}`}
        />
        <ul>
          <li>作成者：{metadata.author}</li>
          {metadata.status && <li>注記：{metadata.status}</li>}
        </ul>
        <h2>検証結果を含む達成方法</h2>
        {queryTechs(true_id).length > 0 ? (
          <ul>
            {queryTechs(true_id).map(tech_id => {
              const tech = techs[tech_id];
              return (
                <li key={tech_id}>
                  {tech ? (
                    <Link href={'../techs/' + tech_id + '.html'}>{tech_id}: {tech.title}</Link>
                  ) : tech_id}
                </li>
              );
            })}
          </ul>
        ) : (
          <div>なし</div>
        )}
      </main>
      <nav>
        <h2>リンク</h2>
        <ul className="related_link">
          {criterion.asinfo201406 &&
            <li>
              <Link href={`https://waic.jp/docs/as/info/201406/7.${true_id}.html`}>
                達成基準{true_id}に関するアクセシビリティ・サポーテッド（AS）情報
                2014年版
              </Link>
            </li>
          }
          {criterion.wcag20url &&
            <li>
              <Link href={`https://waic.jp/translations/UNDERSTANDING-WCAG20/${criterion.wcag20url}`}>
                WCAG 2.0 解説書「達成基準 {true_id} を理解する」
              </Link>
            </li>
          }
          {criterion.wcag21url &&
            <li>
              <Link href={`https://waic.jp/translations/WCAG21/Understanding/${criterion.wcag21url}`}>
                WCAG 2.1 解説書「達成基準 {true_id} を理解する」
              </Link>
            </li>
          }
          <li>
            <Link href="https://waic.jp/translations/WCAG22/">WCAG 2.2</Link>
          </li>
          <li>
            <Link href="https://waic.jp/translations/WCAG21/">WCAG 2.1</Link>
          </li>
          <li>
            <Link href="https://waic.jp/translations/WCAG20/">WCAG 2.0</Link>
          </li>
          <li><Link href="../">アクセシビリティ サポーテッド（AS）情報のホーム</Link></li>
        </ul>
      </nav>
    </>
  )
}

export default Criterion;
