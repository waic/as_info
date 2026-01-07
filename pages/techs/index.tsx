import React from 'react'
import Logo from '../../components/Logo'
import { Metadata } from '../../types/metadata';
import metadataRaw from '../../data/metadata.yaml'
const metadata = metadataRaw as Metadata;
import { TechData } from '../../types/tech';
import techsRaw from '../../data/techs.yaml';
const techs = techsRaw as Record<string, TechData>;
import { NextSeo } from 'next-seo'
import SEO from '../../next-seo.config'
import Link from 'next/link'

const Index = () =>
  <>
    <NextSeo {...Object.assign(SEO, { title: '達成方法(テクニック)の一覧' })} />
    <Logo />
    <main id="main">
      <h1>アクセシビリティ サポーテッド（AS）情報</h1>
      <ul>
        <li>作成者：{metadata.author}</li>
        {metadata.status && <li>注記：{metadata.status}</li>}
      </ul>
      <h2>達成方法(テクニック)の一覧</h2>
      <ul>
        {Object.keys(techs).map(
          key => <li key={key}>
            <Link href={'techs/' + key + '.html'}>{key} {techs[key].title}</Link>
          </li>
        )}
      </ul>
    </main>
    <nav>
      <h2>リンク</h2>
      <ul className="related_link">
        <li><Link href="../criteria">達成基準の一覧</Link></li>
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

export default Index;