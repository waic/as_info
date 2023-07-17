import React from 'react'
import Logo from '../../components/Logo'
import H1 from '../../components/H1'
import { useRouter } from 'next/router'
import metadata from '../../data/metadata.yaml'
import criteria from '../../data/criteria.yaml'
import techs from '../../data/techs.yaml'
import { NextSeo } from 'next-seo'
import SEO from '../../next-seo.config'
import { queryTechs } from '../../functions/queryTechs'

const Criterion = ({ query }) => {
  const router = useRouter()
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
      <main>
        <H1
          first='アクセシビリティ サポーテッド（AS）情報：達成基準'
          second={`${true_id} ${criterion.title} (レベル ${criterion.level})`}
        />
        <ul>
          <li>作成者：{metadata.author}</li>
        </ul>
        <h2>検証結果を含む達成方法</h2>
        <ul>
          {queryTechs(true_id).map(tech_id => {
            const tech = techs[tech_id];
            return (
              <li key={tech_id}>
                {tech ? (
                  <a href={'../techs/' + tech_id + '.html'}>{tech_id}: {tech.title}</a>
                ) : tech_id}
              </li>
            );
          })}
        </ul>
        <hr />
        <ul>
          <li><a href="../">アクセシビリティ サポーテッド（AS）情報のホームへ</a></li>
        </ul>
      </main>
    </>
  )
}

export default Criterion;
