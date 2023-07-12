import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="ja">
        <Head>
          <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
          <meta name="robots" content="index, follow" />
          <meta name="copyright" content="This document is licensed under a Creative Commons 4.0" />
          <link rel="license" href="https://creativecommons.org/licenses/by/4.0/" />
          <meta name="author" content="ウェブアクセシビリティ基盤委員会（WAIC）" />
          <meta name="keywords" content="ウェブ,アクセシビリティ,基盤,委員会,WAIC,web,accessibility,infrastructure,committee,アクセシビリティ,サポーテッド,AS,情報" />
          <meta name="description" content="アクセシビリティ サポーテッド（AS）情報に関する解説文書" />
          <link rel="stylesheet" type="text/css" href="https://waic.jp/cmn/css/docs.css" />
          <style>
            {`
            table {
              empty-cells: show;
            }
            tr.warn {
              background: #ffd;
            }
            tr.ng {
                background: #fdd;
            }
            hr {
              display: block !important;
              margin: 2em 0 2em 0;
            }
            `}
          </style>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
