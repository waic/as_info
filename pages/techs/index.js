import React from 'react'
import Logo from '../../components/Logo'
import techs from '../../data/techs.yaml'
import { NextSeo } from 'next-seo'
import SEO from '../../next-seo.config'
import Link from 'next/link'

const Index = () =>
  <>
    <NextSeo {...Object.assign(SEO, { title: '達成方法の一覧' })} />
    <Logo />
    <main id="main">
      <h1>アクセシビリティ サポーテッド（AS）情報</h1>
      <h2>達成方法の一覧</h2>
      <ul>
        {Object.keys(techs).map(
          key => <li key={key}>
            <Link href={'techs/' + key + '.html'}>{key} {techs[key].title}</Link>
          </li>
        )}
      </ul>
      <ul className="related_link">
        <li><Link href="../">アクセシビリティ サポーテッド（AS）情報のホームへ</Link></li>
      </ul>
    </main>
  </>

export default Index;