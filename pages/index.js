import React from 'react'
import Logo from '../components/Logo'
import metadata from '../data/metadata.yaml'
import tests from '../data/tests.yaml'
import criteria from '../data/criteria.yaml'
import { NextSeo } from 'next-seo'
import SEO from '../next-seo.config'
import Link from 'next/link'

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
        <li><a href="https://waic.jp/guideline/as/#past_results">過去のアクセシビリティ サポーテッド検証結果</a></li>
      </ul>
      <h2>検証結果を含む達成基準</h2>
      <ul>
        {Object.keys(criteria).map(
          key => <li key={key}>
            <Link href={'criteria/' + key + '.html'}>{key} {criteria[key].title}</Link>
          </li>
        )}
      </ul>
      <h2>テストの一覧</h2>
      <ul>
        {Object.keys(tests).map(
          key => <li key={key}>
            <Link href={'results/' + key + '.html'}>{key}: {tests[key].title}</Link>
          </li>
        )}
      </ul>
    </main>
  </>

export default Index;