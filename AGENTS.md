# AGENTS.md

このドキュメントは、AIエージェントがこのリポジトリを理解し、適切に作業するための技術的な情報をまとめています。

## プロジェクト概要

このプロジェクトは、アクセシビリティ サポーテッド（AS）情報を公開するための静的サイトジェネレーターです。

- **フレームワーク**: [Astro](https://astro.build/)
- **ビルド出力**: 静的HTMLファイル（`.html`拡張子付き）
- **デプロイ先**: Google App Engine
- **CI/CD**: GitHub Actions

## プロジェクト構造

```
.
├── src/                    # Astroのソースコード
│   ├── components/         # Astroコンポーネント
│   ├── layouts/           # レイアウトコンポーネント
│   ├── pages/             # ページファイル（ルーティング）
│   ├── lib/               # ユーティリティ関数
│   └── content/           # Content Collections（YAMLデータ）
├── public/                # 静的アセット
├── docs/                  # ビルド出力先（静的ファイル）
├── data/                  # データファイル（YAML）
├── scripts/               # ビルドスクリプト
├── astro.config.mjs       # Astro設定ファイル
├── app.yaml               # App Engine設定
└── package.json           # 依存関係とスクリプト
```

## ビルドプロセス

### 開発環境

```bash
npm install          # 依存関係のインストール
npm run dev          # 開発サーバー起動（http://localhost:4321）
```

詳細は [development.md](./development.md) を参照してください。

### 本番ビルド

```bash
npm run build        # 静的サイトを生成（./docs/ に出力）
```

- **出力形式**: `build.format: 'file'` により、`.html`拡張子付きファイルを生成
- **出力先**: `./docs/` ディレクトリ
- **base path**: 
  - App Engine環境: `/`（`GAE_APPLICATION`環境変数が設定されている場合）
  - 本番環境: `/docs/as/info/`

### ビルド設定

`astro.config.mjs`で以下の設定が行われています：

- `output: 'static'` - 静的サイト生成
- `build.format: 'file'` - `.html`拡張子付きファイルを生成（Next.js互換）
- `outDir: './docs'` - ビルド出力先
- `base` - 環境変数に応じて動的に設定

## デプロイフロー

### App Engineデプロイ

1. **GitHub Actions** (`.github/workflows/appengine-deploy.yml`)
   - PRが作成されると自動的に実行
   - `gcp-build`スクリプトでビルド
   - App Engineにデプロイ

2. **ビルドスクリプト** (`package.json`)
   ```json
   "gcp-build": "npm ci && GAE_APPLICATION=1 npm run build"
   ```
   - `GAE_APPLICATION=1`を設定して`base: '/'`でビルド

3. **起動スクリプト** (`package.json`)
   ```json
   "start": "npx http-server docs -p ${PORT:-8080} -a 0.0.0.0"
   ```
   - 静的ファイルを`http-server`で配信

### 設定ファイル

- **app.yaml**: App Engineの設定（Node.js 22ランタイム）
- **astro.config.mjs**: Astroのビルド設定
- **package.json**: 依存関係とスクリプト定義

## データ管理

### Content Collections

YAMLデータは`src/content/`ディレクトリに配置され、AstroのContent Collectionsとして管理されます：

- `src/content/criteria/` - 達成基準データ
- `src/content/techs/` - 達成方法データ
- `src/content/tests/` - テストケースデータ
- `src/content/results/` - テスト結果データ
- `src/content/metadata/` - メタデータ

### データファイルのソート

```bash
node scripts/sort-data.js
```

データファイルをソートして一貫性を保ちます。

## ページ構造

### ルーティング

Astroのファイルベースルーティングを使用：

- `src/pages/index.astro` → `/index.html`
- `src/pages/criteria/[id].astro` → `/criteria/{id}.html`
- `src/pages/techs/[id].astro` → `/techs/{id}.html`
- `src/pages/results/[id].astro` → `/results/{id}.html`

### リンク形式

すべてのリンクは`.html`拡張子付きで生成されます（Next.js互換）：

```astro
<a href={`${base}criteria/${key}.html`}>
```

## 技術スタック

- **Astro**: 静的サイトジェネレーター
- **React**: 一部のコンポーネントで使用（@astrojs/react）
- **TypeScript**: 型安全性（Astroで推奨、必須ではないが本プロジェクトでは使用）
- **ESLint**: コード品質チェック
- **Markuplint**: HTML/マークアップのリンティング

### 言語について

- AstroはJavaScriptとTypeScriptの両方をサポート
- TypeScriptは推奨だが必須ではない
- 本プロジェクトではTypeScriptを使用（`.ts`ファイル、`.astro`ファイル内のTypeScript）
- `tsconfig.json`は必須（ツールがプロジェクトを理解するために必要）

## 重要な注意事項

1. **base path**: 環境変数`GAE_APPLICATION`の有無で動的に変更される
2. **ファイル形式**: `build.format: 'file'`により、`.html`拡張子付きファイルを生成（既存のNext.js実装との互換性のため）
3. **ビルド出力**: `./docs/`ディレクトリに出力され、そのままApp Engineで配信される
4. **静的ファイル**: `public/`ディレクトリのファイルはそのまま`docs/`にコピーされる

## 関連ドキュメント

- [README.md](./README.md) - プロジェクト概要と利用者向け情報
- [development.md](./development.md) - 開発手順
- [data/README.md](./data/README.md) - データファイルの書式

## CI/CD

### GitHub Actions

- **checkdata**: データファイルの整合性チェック
- **gae-deploy**: App Engineへのデプロイ（PR時）
- **CodeQL**: セキュリティスキャン

### デプロイ条件

- PRが`master`ブランチに対して作成されると自動デプロイ
- デプロイ先: `https://waic-as-info.an.r.appspot.com/`
