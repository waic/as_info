# Content Collections ディレクトリ

このディレクトリには、AS情報の公開用データが YAML 形式で格納されています。

AstroのContent Collections機能を使用して、YAMLデータを厳密な型定義とバリデーションで管理します。

## ファイル一覧

- `results/` - テスト結果データ（id ごとに分割、100件ごとにフォルダ分割）
- `tests.yaml` - テストケース情報
- `criteria.yaml` - WCAG 達成基準情報
- `techs.yaml` - テクニック集情報
- `metadata.yaml` - メタデータ

## results/ の構造

テスト結果データは `results/` ディレクトリ内で、id ごとに個別の YAML ファイルに分割して管理しています。100件ごとにサブフォルダに整理されます。

```
results/
├── 0001/          # id 1〜100
│   ├── 0001.yaml  # id: 1
│   ├── 0002.yaml  # id: 2
│   └── ...
├── 0101/          # id 101〜200
│   ├── 0101.yaml
│   └── ...
└── ...
```

各ファイルは単一のテスト結果エントリ（オブジェクト）を含みます。書式を統一することで、差分を最小化し、メンテナンス性を向上させています。

### 分割・結合ツール

- **分割**: `npx tsx scripts/split-results.ts` — `results.yaml` から個別ファイルに分割
- **結合**: `npx tsx scripts/merge-results.ts` — 個別ファイルから `results.yaml` に結合

### 書式ルール

#### 1. 空フィールドの表記

空のフィールドは `key:` 形式（値なし）で記述します。

```yaml
assistive_tech:
comment:
```

`key: null` や `key: ''` ではなく、`key:` とします。

#### 2. 改行を含む文字列

改行を含む文字列は、リテラルブロック（`|-`）形式で記述します。

```yaml
comment: |-
  イメージマップ上で待っていると「このWeb領域を終了するには〜」とヒントが読み上げられるので、VOキー＋シフトキー＋下矢印キーでなにか操作ができそうなことは分かりました。

  VOキー＋Aキーで自動読み上げをさせた場合は、area要素のalt属性も順に読み上げられました。ただし、イメージマップであることは分かりません。
```

- `|-` は末尾の改行を削除するリテラルブロック形式です
- ダブルクォート（`"..."`）やシングルクォート（`'...'`）内の改行は使用しません

#### 3. 単一行の文字列

改行を含まない文字列は、クォートなしで記述します（特殊文字がない場合）。

```yaml
procedure: ブラウザを画像非表示に設定変更し、表示内容を確認した
actual: リンクテキスト「ウェブアクセシビリティ基盤委員会公開サイト」のみが表示され、画像のファイル名や URL 等は表示されなかった。
```

#### 4. 単一の文字列または配列

単一の文字列または配列を許容する項目は、次の形式で記述できます。

```yaml
environment_type: 音声閲覧環境
```

```yaml
environment_type:
  - 視覚閲覧環境
  - 音声閲覧環境
```

```yaml
code: https://waic.github.io/as_test/WAIC-CODE/WAIC-CODE-0001-01.html
```

```yaml
code:
  - https://waic.github.io/as_test/WAIC-CODE/WAIC-CODE-0001-01.html
  - https://waic.github.io/as_test/WAIC-CODE/WAIC-CODE-0001-02.html
```

### 正規化

`results/` 内の各ファイルの書式を統一するため、`as_info_publish` リポジトリの `normalize_results_yaml.py` を使用して正規化できます。分割後のファイルに対しては、結合→正規化→再分割の手順で適用します。

```bash
# 結合して単一ファイルに
npx tsx scripts/merge-results.ts
# 正規化
cd ../as_info_publish
uv run normalize_results_yaml.py ../as_info/src/content/results/results.yaml
# 再分割
cd ../as_info
npx tsx scripts/split-results.ts
```

正規化スクリプトは以下の処理を行います：

1. **空文字列の変換**: `key: ''` や `key: null` → `key:`
2. **エスケープされた改行の変換**: `\n`（文字列）→ 実際の改行文字
3. **改行を含む文字列の統一**: ダブルクォートやシングルクォート内の改行 → リテラルブロック（`|-`）形式

### データの追加・更新

`results/` へのデータ追加は、`as_info_publish` リポジトリのツールを使用します。

詳細は `as_info_publish/README.md` および `as_info_publish/AGENTS.md` を参照してください。
