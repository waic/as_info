import React from 'react'
import Logo from '../../components/Logo'
import { Metadata } from '../../types/metadata';
import metadataRaw from '../../data/metadata.yaml'
const metadata = metadataRaw as Metadata;
import { CriterionData } from '../../types/criterion';
import criteriaRaw from '../../data/criteria.yaml';
const criteria = criteriaRaw as Record<string, CriterionData>;
import { NextSeo } from 'next-seo'
import SEO from '../../next-seo.config'
import Link from 'next/link'
import { getCriterionLevel } from '../../functions/getCriterionLevel'

const Index = () =>
  <>
    <NextSeo {...Object.assign(SEO, { title: '達成基準の一覧' })} />
    <Logo />
    <main id="main">
      <h1>アクセシビリティ サポーテッド（AS）情報</h1>
      <ul>
        <li>作成者：{metadata.author}</li>
        {metadata.status && <li>注記：{metadata.status}</li>}
      </ul>
      <h2>達成基準の一覧</h2>
      <ul>
      {Object.keys(criteria).map(
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
    </main>
    <nav>
      <h2>リンク</h2>
      <ul className="related_link">
        <li><Link href="../techs">達成方法の一覧</Link></li>
        <li><Link href="../">アクセシビリティ サポーテッド（AS）情報のホーム</Link></li>
      </ul>
    </nav>
  </>

export default Index;