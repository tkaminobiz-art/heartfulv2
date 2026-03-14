# SP微調整 前準備メモ（#S1 / #S5 / #S8）

## #S1：写真とh1の間のスペース追加

### 現状
- `@media (max-width: 900px)` で `.hero` は `grid-template-rows: min(45vh, 260px) auto` の2行グリッド。
- `.hero-media`（写真）が order:1、`.hero-copy`（h1以下）が order:2。
- **グリッドに row-gap がなく、写真とコピーがぴったり接している。**

### 原因
- `.hero` に `gap` または `row-gap` の指定がないため、2行の間隔が 0。

### 修正方針
- **`.hero` に `row-gap` を追加する**（`margin-top` を `.hero-copy` に付けても可。ここではグリッドの row-gap で統一）。
- 対象：`@media (max-width: 900px)` 内の `.hero`。
- 追加：`row-gap: 20px;` または `gap: 20px 0;`（写真とコピー間に約20pxの余白）。

### 変更箇所
- ファイル：`ihin-seiri-award-b.html`
- ブロック：`@media (max-width: 900px)` 内の `.hero { ... }`
- 追加するプロパティ：`row-gap: 20px;`

---

## #S5：代表紹介セクションの本文テキスト幅が狭すぎる

### 現状
- 代表紹介（`.reassure`）内の本文は `.reason-copy p`。
- PCでは `.reason-stack { max-width: 640px; }` で左カラム幅を制限。
- **SPでは `@media (max-width: 900px)` で `.lead, .section-head .lead, .reason-copy p { max-width: 42ch; }` が一括指定されている。**
- 42ch は約42文字幅のため、393px 幅のスマホでもかなり狭く、「元大阪府警の代表が責任を持ってご対応しま / す。」のように不自然な位置で改行する。

### 原因
- SP用に `.reason-copy p` に `max-width: 42ch` が当たっており、代表紹介の本文だけ幅が絞られすぎている。

### 修正方針
- **SP時のみ `.reason-copy p` の max-width を緩める。**
- 選択肢：(A) `max-width: none;` で親（`.reason-stack`）の幅いっぱい使う、(B) `max-width: 58ch` や `65ch` で読みやすい幅に広げる。
- ここでは **(A) `max-width: none`** を採用。`.reason-stack` は SPで 1fr になりコンテナ幅いっぱいになるため、コンテナの padding だけで自然な幅になる。

### 変更箇所
- ファイル：`ihin-seiri-award-b.html`
- ブロック：`@media (max-width: 900px)` 内。
- 現行：`.lead, .section-head .lead, .reason-copy p { max-width: 42ch; }`
- 修正：`.reason-copy p` をこの一括指定から外し、別途 `.reason-copy p { max-width: none; }` を追加する。
  - つまり `.lead, .section-head .lead { max-width: 42ch; }` に変更し、次の行に `.reason-copy p { max-width: none; }` を追加。

---

## #S8：料金セクションのテキスト左寄り

### 現状
- 料金セクションは `.price-inner.price-inner--single` で1カラム構成。
- **`.price-inner--single { max-width: 56ch; }`** でブロック全体が 56ch に制限されている。
- **`.price-lead { max-width: 60ch; }** でリード文も幅制限。
- SPでは `.price-inner` が `grid-template-columns: 1fr` で1列になるが、**子ブロックの max-width: 56ch がそのまま効くため、画面幅いっぱい使えず左に寄った狭いカラムになる。**

### 原因
- 56ch / 60ch はPC用の読みやすい幅だが、SPではコンテナ幅が狭いのに同じ ch が効き、結果としてブロックが狭く左寄せになる。

### 修正方針
- **SP時のみ、料金ブロックとリード文の max-width を解除する。**
- `@media (max-width: 900px)` 内で以下を追加：
  - `.price-inner--single { max-width: none; }`
  - `.price-lead { max-width: none; }`
- これで料金セクションのテキストがコンテナ幅いっぱいに広がり、左寄り・幅不足が解消される。

### 変更箇所
- ファイル：`ihin-seiri-award-b.html`
- ブロック：`@media (max-width: 900px)` 内（`.reasons-grid` や `.price-inner` が並んでいるあたりに追加）。
- 追加するルール：
  - `.price-inner--single { max-width: none; }`
  - `.price-lead { max-width: none; }`

---

## まとめ

| 項目 | 原因 | 修正（すべて @media (max-width: 900px) 内） |
|------|------|---------------------------------------------|
| #S1 | 写真とコピー行の間に gap なし | `.hero { row-gap: 20px; }` を追加 |
| #S5 | `.reason-copy p` に 42ch が効いている | `.lead, .section-head .lead { max-width: 42ch; }` に変更し、`.reason-copy p { max-width: none; }` を追加 |
| #S8 | `.price-inner--single` / `.price-lead` の 56ch/60ch が SPでも効く | `.price-inner--single { max-width: none; }` と `.price-lead { max-width: none; }` を追加 |

以上のみを変更し、他セクション・クラス名・HTML 構造は変更しない。
