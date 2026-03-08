# ハートフルクリーン LP — 魅了するLPへの最終診断

**診断基準**: Webデザインスキル（静寂モダン）§2・§4 品質ゲート ＋ 「人々を魅了する」感情設計  
**目的**: 3秒で信頼を感じ、スクロールで「この人に頼みたい」まで導くLPに仕上げる。

---

## 【設計宣言】再確認

```
アーキタイプ: 静寂モダン（Seijaku Modern）
トレンド: 静寂デザイン（余白に意味を持たせる）、ノイズは調味料レベル
配色: #FAFAF8 / #F5F3EF / #1A1A1A / #8A8480 / #5C6B5E（+ #2C3D32）
フォント: 見出し＝明朝（Shippori Mincho）／本文＝Noto Sans JP
余白感: ゆったり（セクション間 120〜200px、見出し下 48px）
アニメーション: 控えめ（フェードイン 1.0〜1.2s、ホバーは opacity のみ）
一言: 「余白が呼吸している。元警察官という一点の信頼が、静かに効いている。」
```

---

## 品質ゲート診断結果

| 項目 | 現状 | 判定 | 改善内容 |
|------|------|------|----------|
| **第一印象** | FVは2カラム・見出しはNoto Serif JP | △ | 見出しをShippori Minchoに。FVの「間」を少し広げ、視線の流れを明確に |
| **余白** | セクション間は100〜160px、見出し下は16px等 | △ | 見出し下を48pxに統一（静寂モダン推奨）。FV内の heading と heading-sub の間を明確に |
| **色** | 5色以内・アクセント1色で済んでいる | ◎ | 維持。残っている古い rgba(45,90,61) を accent 系に統一 |
| **フォント** | 見出し Noto Serif JP、本文 Noto Sans JP 400 | △ | 見出しをShippori Minchoに。本文は font-feature-settings: 'palt' 1 を追加 |
| **禁止事項** | 影は最小限、グラデーション削除済み | ◎ | .fv__badge--star の border が古い色参照 → accent に |
| **日本語** | line-height 1.9、letter-spacing 0.04em | ◎ | 維持。1行文字数は max-width で制御済み |

---

## 魅了するための改善（実行リスト）

1. **見出しフォントを Shippori Mincho に**
   - FVの「元警察官が行う 生前・遺品整理。」と全セクション見出しに適用。
   - 明朝の「格式・知性」で静寂モダンの本質に寄せる。

2. **FVの余白とタイポ**
   - .fv__heading の margin-bottom を 28px に（見出しとサブの「間」）。
   - .fv__heading の font-size を clamp(1.75rem, 3.5vw, 2.75rem) に（大きすぎない）。
   - .fv__heading-sub の margin-top を 0、margin-bottom を 24px にし、その後の .fv__sub との間を 20px で確保。

3. **セクション見出し**
   - .section-heading の margin-bottom を 48px に（patterns.md 準拠）。
   - 見出しフォントを var(--font-heading) にし、--font-heading: 'Shippori Mincho', 'Noto Serif JP', serif を :root に追加。

4. **日本語組版**
   - body に font-feature-settings: 'palt' 1 を追加。

5. **アニメーション**
   - .fade-in の transition を 1.2s ease に統一。
   - .reveal-up の translateY を 40px → 16px に（静寂モダン「最大16px」）。

6. **細部の色統一**
   - .fv__badge--star の border を rgba(92,107,94,0.3) に。
   - その他、primary の古い HEX 参照が残っていれば accent に統一済みの変数のみ使用。

7. **引き算レビュー**
   - 未使用の .fv__identity スタイルは残しても害なし。必要なら削除。
   - box-shadow は現状 3 箇所（service-card, pricing, flow）のみで許容範囲。

---

## 感情設計（魅了の流れ）

- **FV**: 「元警察官が行う 生前・遺品整理。」＋ 代表の顔 → **「この人なら信頼できる」** を一瞬で。
- **Problem**: 「不安は、当然です。」→ **共感**。
- **Reasons**: 追加料金ゼロ・礼節とスピード・買取 → **納得**。
- **Message**: なぜ元警察官が遺品整理を始めたか → **ストーリーで信頼を深める**。
- **Support / Voice**: 第三者・お客様の声 → **社会的証明**。
- **CTA**: 電話・LINE を低ハードルで提示 → **行動**。

上記の流れは既にできている。**見た目の品格（明朝・余白・アニメーション速度）** を静寂モダンに揃えることで、「魅了」が完成する。

---

以上を実装済みとする。

---

## 実装ログ（魅了するLP改善）

- **フォント**: Google Fonts に Shippori Mincho を追加。`:root` に `--font-heading`, `--font-body` を定義。FV見出し・heading-sub・全 `.section-heading` に `var(--font-heading)` を適用。
- **日本語組版**: `body` に `font-feature-settings: 'palt' 1` を追加。
- **FV**: `.fv__heading` を `clamp(28px, 3.5vw, 44px)`・`margin-bottom: 28px`・`letter-spacing: 0.08em` に。`.fv__heading-sub` の `margin-top: 0` で「間」を整理。
- **セクション見出し**: `.section-heading` に `margin-bottom: 48px` を付与。各 `__heading-area` の `margin-bottom` は 0 にし、見出し下余白を 48px に統一。
- **アニメーション**: `.fade-in` を `translateY(16px)`・`1200ms`、`.reveal-up` を `translateY(16px)`・`1000ms` に変更（静寂モダン推奨の控えめな動き）。
- **色統一**: `.fv__badge--star` の border を `rgba(92,107,94,0.3)`、色を `var(--accent-dark)` に。`.problem__num` の背景を `rgba(92,107,94,0.12)` に（オレンジ廃止）。
