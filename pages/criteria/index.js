import React from 'react'
import Logo from '../../components/Logo'
import criteria from '../../data/criteria.yaml'
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
      <ul className="related_link">
        <li><Link href="../">アクセシビリティ サポーテッド（AS）情報のホームへ</Link></li>
      </ul>
    </main>
  </>

export default Index;