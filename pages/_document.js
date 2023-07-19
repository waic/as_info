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
              width: 100%;
              empty-cells: show;
            }
            @media (max-width: 600px) {
              table {
                  overflow-x: auto;
                  display: block;
              }
            }
            tr.warn {
              background: #ffd;
            }
            tr.ng {
              background: #fdd;
            }
            #main .related_link {
              margin: 0;
              padding: 3em 0 3em 0;
            }
            #main .related_link:after {
              content: "";
              display: block;
              clear: both;
              height: 0;
              visibility: hidden;
            }
            #main .related_link li {
              list-style: none;
              float: right;
              clear: right;
            }
            #main .related_link a {
              display: inline-block;
              padding-left: 21px;
              background: url(https://waic.jp/wp-content/themes/waic/images/icon_related_link.png) no-repeat 1px .4em;
              background-size: 11px 17px;
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
