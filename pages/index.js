import React from 'react'
import Logo from '../components/Logo'
import metadata from '../data/metadata.yaml'
import tests from '../data/tests.yaml'
import criteria from '../data/criteria.yaml'
import NextSeo from 'next-seo'
import SEO from '../next-seo.config'

export default () => 
<>
  <NextSeo config={Object.assign(SEO, {title:'ホーム'})}/>
  <Logo/>
  <h1>アクセシビリティ サポーテッド（AS）情報：{metadata.edition}</h1>
  <ul>
    <li>公開日：{metadata.pub_date}</li>
    <li>作成者：{metadata.author}</li>
    <li>前のバージョン：<a href="https://waic.jp/docs/as/info/201406/index.html">2014年6月版（2014年7月4日公開）</a></li>
  </ul>
  <h2>検証結果を含む達成基準</h2>
  <ul>
    {Object.keys(criteria).map(
      key => <li key={key}>
        <a href={'criteria/' + key + '.html'}>{key} {criteria[key].title}</a>
      </li>
    )}
  </ul>
  <h2>テストの一覧</h2>
  <ul>
    {Object.keys(tests).map(
      key => <li key={key}>
        <a href={'results/' + key + '.html'}>{key}: {tests[key].title}</a>
      </li>
    )}
  </ul>
</>
