# 再起動後用 引き継ぎメモ

**作成日:** 2026年3月13日（再起動前のセッションから）

---

## プロジェクト概要

- **サイト:** ハートフルクリーン（遺品整理・生前整理・特殊清掃／奈良・関西）
- **主な対象ファイル:** `ihin-seiri-award-b.html`（B案のLP・1ファイル完結のHTML）
- **リポジトリ:** 作業後は必ず `git commit` と `git push` を行う（`.cursor/rules/push-after-work.mdc`）
- **口コミ表記:** Google口コミに統一。エキテン表記は使わない（`.cursor/rules/reviews-google.mdc`）
- **スキルファイル（SKILL.md 等）の書き換えは禁止**（依頼で繰り返し指定されている）

---

## 2026-04-17: Google広告コンバージョン（電話 / LINE / 30秒以上滞在）引き継ぎ

### 状況まとめ（結論）

- Google Ads 側で **コンバージョンアクション3つ（電話 / LINE / 30秒以上滞在）は作成済み**。一覧上は「無効」のまま。
- **GTM（GTM-XXXX）ではなく Googleタグ（GT-...）構成**で進める前提に確定。
- 現ワークスペース（`/Users/takahirokamino/Downloads/ハートフルクリーン`）には **Next.jsソースが存在しない**（`package.json` / `app/` / `pages/` が見つからず、静的 `index.html` 等のみ）。
- ユーザー申告では本番は **Vercel**。**Vercel側で別プロジェクト／別リポジトリを参照している可能性**が高く、現時点で「本番へタグ反映」できていないのが「無効」継続の主因。

### Google Ads で確認できたコンバージョン情報（確定値）

- **GoogleタグID**: `GT-WP5Q4854`
- **Google広告タグID（AW）**: `AW-18031574489`

コンバージョン（send_to）:

- **電話**: `AW-18031574489/MmIMC0vHsJ0cENn7j5ZD`
- **LINE**: `AW-18031574489/D0vqCJCQyZ0cENn7j5ZD`
- **30秒以上滞在**: `AW-18031574489/5GPICIzLsJ0cENn7j5ZD`

### このリポジトリで行った変更（注意：本番反映とは別）

Next.jsの場所が特定できなかったため、暫定で静的 `index.html` に直書き実装を追加した。

- head: `gtag.js` を追加（`GT-WP5Q4854` と `AW-18031574489` を `config`）
- body末尾の既存 `<script>` 冒頭:
  - 全クリック監視で `href` 判定
    - `tel:` → 電話CV
    - `page.line.me` / `lin.ee` → LINE CV
  - ページ表示から30秒で一度だけ 30秒滞在CV

該当ファイル:

- `index.html`

### 次にやるべきこと（本番で計測を有効化する最短手順）

1. **Vercelで正しいプロジェクトを特定**
   - Vercel → 対象プロジェクト → `Settings` → `Git`
   - 接続されている GitHub リポジトリ（`owner/repo`）とブランチを確認
   - 想定と違う場合は、正しいリポジトリに付け替える / 正しいプロジェクトに切り替える

2. **本番（Next.js）に Googleタグ（gtag.js）を導入**
   - `app/layout.tsx`（App Router）または `pages/_app.tsx`（Pages Router）へ導入
   - `gtag('config', 'GT-WP5Q4854')` と `gtag('config','AW-18031574489')`

3. **ボタンが複数あっても漏れない計測**
   - 個別の `onClick` を全箇所へ付けるのではなく、**document click を捕捉して href で判定**する方式が安全
   - 条件：
     - `tel:` で始まる → 電話CV
     - `https://page.line.me/...` または `https://lin.ee/...` → LINE CV
   - 30秒はページロード後 `setTimeout(30000)` で1回だけ送信

4. **確認**
   - 広告ブロッカーをOFFにしてテスト
   - Tag Assistant で `GT-WP5Q4854` と `AW-18031574489` が検出されることを確認
   - Google Ads の「無効」→「（記録中/未確認）」への反映は数時間〜24時間程度かかる場合あり

---

## 直近までの作業（完了済み）

1. **FV・画像・ビフォーアフター**
   - FV h1: 「元警察官の代表が、<br>誠実な整理を<br>お約束します。」（3行構成）
   - 代表紹介・選ばれる理由・ビフォーアフター3組目の画像パス修正済み
   - ビフォーアフター2組目（ゴミ屋敷）は削除し、残り2組はフル幅表示＋説明文強化
2. **スマホ対応（#S1〜#S2, #S5, #S8 等）**
   - FVで写真を上・テキストを下に変更（order）、情報量整理（オレンジ帯非表示等）
   - 写真とh1の重なり防止で `.hero-copy` の `padding-top: 40px`
   - 代表紹介の本文幅（SPで `.reassure .reason-stack` / `.reason-copy p` の max-width 解除）
   - 料金セクションの幅（PCで 780px、SPで 100%、料金 h2 は「ための、」で改行）
3. **バッチA**
   - 代表紹介SPで reason-stack 幅解除、料金コンテナ 780px / SP 100%、料金 h2 の `<br>` 位置修正

---

## 実施済み（2026年3月・続きセッション）

- **LPセクション順の変更** ✅ 実装済み
  - 報告書: `LP_SECTION_ORDER_REPORT.md`、計画書: `LP_SECTION_ORDER_PLAN.md`
  - 証拠（WORKS・REVIEWS）を料金の前に配置。現在の順: … POLICY → **WORKS** → **REVIEWS** → CTA-bar オレンジ → **PRICE** → **PAYMENT** → FLOW → FAQ → FINAL CTA。
  - 各セクションの id ・中身は変更していない（`#price` 等のアンカーはそのまま有効）。

---

## 依頼時のルール（繰り返し指定されている）

- 「指示された箇所のみ修正する」「記載されていない箇所は一切変更しない」
- 画像パス・h1の font-size／テキスト・他セクション・スキルファイルは**明示的に依頼されない限り変更しない**
- 修正後は必要に応じて 1440px / 393px 等で表示確認を促す

---

## ファイル配置の目安

- **LP本体:** `ihin-seiri-award-b.html`
- **画像:** `バナー/`、`ハートフルクリーンサイト画像/heartful画像/`、`ハートフルクリーンサイト画像/people/`、`ハートフルクリーンサイト画像/before-after/`、ルートの `談笑するチーム_青空屋外.png` 等
- **ドキュメント:** `SP_FIX_S1_S5_S8_PREP.md`、`LP_SECTION_ORDER_REPORT.md`、`LP_SECTION_ORDER_PLAN.md`

---

再起動後のあなたへ：上記を踏まえ、依頼内容にだけ従って修正し、必要ならこのメモを更新してください。
