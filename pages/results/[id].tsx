import React from 'react'
import Logo from '../../components/Logo'
import H1 from '../../components/H1'
import { useRouter } from 'next/router'
import { Metadata } from '../../types/metadata';
import metadataRaw from '../../data/metadata.yaml'
const metadata = metadataRaw as Metadata;
import { TestData } from '../../types/test';
import testsRaw from '../../data/tests.yaml';
const tests = testsRaw as Record<string, TestData>;
import { CriterionData } from '../../types/criterion';
import criteriaRaw from '../../data/criteria.yaml';
const criteria = criteriaRaw as Record<string, CriterionData>;
import { TechData } from '../../types/tech';
import techsRaw from '../../data/techs.yaml';
const techs = techsRaw as Record<string, TechData>;
import { ResultContent, ResultData } from '../../types/result';
import resultsRaw from '../../data/results.yaml';
const results: ResultData[] = resultsRaw;
import { NextSeo } from 'next-seo'
import SEO from '../../next-seo.config'
import Image from 'next/image';
import Link from 'next/link'
import { getCriterionLevel } from '../../functions/getCriterionLevel'

const larger_th_style: React.CSSProperties = { minWidth: '6em', maxWidth: '10em', overflowWrap: 'break-word' };
const list_item_style: React.CSSProperties = { overflowWrap: 'break-word' };

const nl2br = (source: string) => {
  if (source === null || typeof source === 'undefined') {
    return <></>;
  }
  return <div>{source.split('\n').map((line, index) => {
    return <p key={index}>{line}</p>;
  })}</div>;
};

const getTesterName = (result: ResultData) => {
  if (typeof result.tester !== 'undefined') {
    return result.tester;
  }
  return '不明';
};

const getDate = (result: ResultData) => {
  if (typeof result.date !== 'undefined' && result.date != null) {
    return result.date;
  }
  return '不明';
};

function Comment(props: { result: ResultData; }) {
  const result = props.result;
  let comments = '';
  if (typeof result.comment !== 'undefined' && result.comment != null) {
    comments += result.comment;
  }
  if (typeof result.reviewer_comment !== 'undefined' && result.reviewer_comment != null) {
    if (comments.length > 0) {
      comments += '\n';
    }
    comments += result.reviewer_comment;
  }
  return nl2br(comments);
}

const lastReviewedResultId = 439;

const InReview = ({ resultId }: { resultId: number }) => {
  return resultId > lastReviewedResultId ? <span>[WAICレビュー作業中]</span> : null;
};

function Judgment(props: { resultContent: ResultContent; }) {
  const { judgment } = props.resultContent;
  switch (judgment) {
    case '満たしている':
      return <>○</>;
    case '満たしていない':
      return <>×</>;
    default:
      return <>{judgment}</>;
  }
};

const ResultTableRow = (props: { result: ResultData; }) => {
  const result = props.result;
  const contents = result.contents;
  if (contents.length === 1) {
    return (
      <tr>
        <th scope="row">{result.id}</th>
        <td style={larger_th_style}><ul>
          <li style={list_item_style}>{result.os}</li>
          <li style={list_item_style}>{result.user_agent}</li>
          {result.assistive_tech && (<li style={list_item_style}>{result.assistive_tech}</li>)}
          {result.assistive_tech_config && (<li style={list_item_style}>{nl2br(result.assistive_tech_config)}</li>)}
        </ul></td>
        <td>
          <Judgment resultContent={contents[0]}/>
        </td>
        <td style={larger_th_style}>
          {nl2br(contents[0].procedure)}
        </td>
        <td style={larger_th_style}>
          {nl2br(contents[0].actual)}
        </td>
        <td style={larger_th_style}>{getTesterName(result)}</td>
        <td style={larger_th_style}>{getDate(result)}</td>
        <td style={larger_th_style}>
          <InReview resultId={result.id} />
          <Comment result={result} />
        </td>
      </tr>
    );
  }
  return (
    <>
      {contents.map((item: ResultContent, index: React.Key) => (
        <tr key={index}>
          {index === 0 && (
            <>
              <th rowSpan={contents.length} scope="rowgroup">{result.id}</th>
              <td rowSpan={contents.length} style={larger_th_style}><ul>
                <li style={list_item_style}>{result.os}</li>
                <li style={list_item_style}>{result.user_agent}</li>
                {result.assistive_tech && (<li style={list_item_style}>{result.assistive_tech}</li>)}
                {result.assistive_tech_config && (<li style={list_item_style}>{nl2br(result.assistive_tech_config)}</li>)}
              </ul></td>
            </>
          )}
          <td>
            <Judgment resultContent={item} />
          </td>
          <td style={larger_th_style}>
            {nl2br(item.procedure)}
          </td>
          <td style={larger_th_style}>
            {nl2br(item.actual)}
          </td>
          {index === 0 && (
            <>
              <td rowSpan={contents.length} style={larger_th_style}>{getTesterName(result)}</td>
              <td rowSpan={contents.length} style={larger_th_style}>{getDate(result)}</td>
              <td rowSpan={contents.length} style={larger_th_style}>
                <InReview resultId={result.id} />
                <Comment result={result} />
              </td>
            </>
          )}
        </tr>
      ))}
    </>
  )
};

const sortByOS = (a: ResultData, b: ResultData) => {
  let a_env = (typeof a.os === 'undefined') ? '' : a.os.toLowerCase();
  let b_env = (typeof b.os === 'undefined') ? '' : b.os.toLowerCase();
  if (a_env > b_env) {
    return 1;
  } else if (a_env == b_env) {
    return 0;
  }
  return -1;
};

const sortByResultId = (a: ResultData, b: ResultData) => {
  return a.id - b.id;
};

const Result = ({ query }) => {
  const router = useRouter()
  if (router.isFallback) {
    return <div>Loading...</div>
  }
  const { id } = router.query
  if (typeof id !== 'string') {
    throw new Error("id is an array");
  }
  const true_id = id.replace(/.html$/, '') // '.html' is appended to the routing path when exporting, so remove it.
  const test = tests[true_id];
  const criterion_ids = test.criteria;
  const tech_ids = test.techs;
  const result_ids = results.filter(result => result.test === true_id).sort(sortByResultId);
  return (
    <>
      <NextSeo {...Object.assign(SEO, { title: 'テスト' + true_id })} />
      <Logo />
      <main id="main">
        <H1
          first='アクセシビリティ サポーテッド (AS) 情報：テストケース'
          second={`${true_id}: ${test.title}`}
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
                &nbsp;
                に関連するAS情報
              </Link>
            </li>
          ))}
        </ul>
        <h2>関連する達成方法</h2>
        {tech_ids.length > 0 ? (
          <ul>
            {tech_ids.map(tech_id => (
              <li key={tech_id}>
                <Link href={'../techs/' + tech_id + '.html'}>{tech_id}:「{techs[tech_id].title}」に関連するAS情報</Link>
              </li>
            ))}
          </ul>
        ) : (
          <div>なし</div>
        )}
        <h2>テスト詳細</h2>
        <ul>
          <li><a href={test.document}>テストケース {true_id} の詳細を表示</a></li>
          <li>
            {typeof test.code === 'string' ?
              <a href={test.code}>テストコード {true_id} をユーザーエージェントで表示</a>
              :
              <>
                <div>テストコード {true_id} をユーザーエージェントで表示</div>
                <ul>
                  {test.code.map((item, index) => (
                    <li key={index}><a href={item}>{item.split("/").slice(-1)[0]}</a></li>
                  ))}
                </ul>
              </>
            }
          </li>
        </ul>
        <h2>検証結果一覧</h2>
        <ul>
          <li>テスト結果の件数: {result_ids.length}件</li>
        </ul>
        {result_ids.length > 0 && (<>
          <h3>テスト結果の詳細</h3>
          <table tabIndex={0}>
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">環境</th>
                <th scope="col">判断</th>
                <th scope="col">操作内容</th>
                <th scope="col">得られた結果</th>
                <th scope="col">テスト実施者</th>
                <th scope="col">実施日</th>
                <th scope="col">備考</th>
              </tr>
            </thead>
            <tbody>
              {result_ids.map((result, index) => (
                <ResultTableRow result={result} key={index} />
              ))}
            </tbody>
          </table>
        </>)}
        <h2>ライセンス</h2>
        <p>各検証結果は、それぞれの作成者を原著作者とし、クリエイティブ・コモンズ・ライセンスの下でライセンスされています。原著作者名は、それぞれの検証結果をご覧ください。また、ご利用になる前に利用許諾条項を必ずご確認ください。</p>
        <p><a href="https://creativecommons.org/licenses/by-sa/4.0/deed.ja"><Image src="https://mirrors.creativecommons.org/presskit/buttons/88x31/png/by-sa.png" alt="by-sa" width="88" height="31" /> 利用許諾条項（表示 – 継承 4.0 国際）の確認</a></p>
      </main>
      <nav>
        <h2>リンク</h2>
        <ul className="related_link">
          <li><Link href="../">アクセシビリティ サポーテッド（AS）情報のホーム</Link></li>
        </ul>
      </nav>
    </>
  )
}

export default Result;
