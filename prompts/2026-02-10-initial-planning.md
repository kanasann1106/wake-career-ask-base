# 会話履歴: 社内向け質問受付アプリの詳細設計

**日時**: 2026年2月10日
**トピック**: Next.js + Supabase 認証システムの詳細設計
**ステータス**: プランニング完了

## ユーザーの初期要求

```
社内向け質問受付アプリを作りたいです。
まずは詳細設計をしたいです。
- 技術スタック：Next.js、Supabase
- ログイン認証あり
- 質問登録と回答ができるシンプルなアプリ
```

## アシスタントの対応フロー

### 1. プロジェクト状態の調査
- Explore agentを起動してプロジェクトの現状を調査
- 結果: プロジェクトは完全に空（.gitディレクトリのみ存在）
- すべてをゼロから構築する必要があると判明

### 2. 技術的決定事項の確認

ユーザーに以下の質問を行い、技術スタックを確定：

**質問1: 言語選択**
- 回答: TypeScript（推奨）

**質問2: 認証方法**
- 回答: メール/パスワード（推奨）

**質問3: UIスタイリング**
- 回答: Tailwind CSS（推奨）

**質問4: 機能要件**
- 回答: 「機能は後で決めるので認証だけ作ってほしい」
- → 質問・回答機能は後回しにし、まず認証基盤を構築することを優先

### 3. 実装計画の策定

Plan agentを起動して、以下を含む詳細な実装計画を作成：

#### 技術選定
- Next.js 15（App Router）
- TypeScript
- Supabase（認証・データベース）
- Tailwind CSS
- `@supabase/ssr`パッケージ（Cookie ベース認証）

#### セキュリティ設計
- HTTP-only Cookieによるセッション管理
- 3種類のSupabaseクライアント（Browser/Server/Middleware）
- 多層防御アプローチ（Middleware + Server Componentで認証チェック）

#### プロジェクト構造
```
wake-career-ask-base/
├── app/
│   ├── (auth)/              # 認証ページ
│   ├── (protected)/         # 保護されたページ
│   ├── auth/confirm/        # メール確認
│   └── ...
├── components/auth/         # 認証コンポーネント
├── lib/supabase/           # Supabaseクライアント
├── types/                  # TypeScript型定義
└── middleware.ts           # ルート保護
```

#### 実装フェーズ
1. **Phase 1**: プロジェクト初期化（Next.js、Supabase）
2. **Phase 2**: Supabase設定（プロジェクト作成、メール認証設定）
3. **Phase 3**: Supabaseクライアント実装
4. **Phase 4**: Middleware実装
5. **Phase 5**: 認証コンポーネント実装
6. **Phase 6**: ページ実装
7. **Phase 7**: TypeScript型定義
8. **Phase 8**: 設定ファイル確認

### 4. 検証手順の策定

8つのテストシナリオを定義：
1. サインアップフロー
2. ログインフロー
3. ルート保護テスト
4. セッション永続性テスト
5. プロフィールページテスト
6. ログアウトテスト
7. セキュリティ確認
8. メール確認フロー

### 5. 将来の拡張計画

**Phase 2以降の機能**:
- パスワードリセット
- プロフィール編集
- Google OAuth連携

**Q&A機能**:
- データベーススキーマ設計（questions、answers、profiles テーブル）
- 質問投稿・回答投稿機能
- いいね/投票機能
- ベストアンサー選択機能

## 重要な技術的決定

### セキュリティベストプラクティス

1. **`getUser()`の使用**
   - `getSession()`ではなく`getUser()`を使用
   - 理由: トークンをSupabaseサーバーで再検証

2. **認証後のルーター更新**
   - ログイン/ログアウト後は`router.refresh()`を呼び出し
   - サーバー側の状態を確実に更新

3. **保護されたページでの認証チェック**
   - Middlewareだけに依存しない
   - Server Componentで必ず再検証

4. **適切なクライアントの使用**
   - Client Components: Browser Client
   - Server Components: Server Client
   - Middleware: Middleware Client

## 成果物

### ドキュメント
- [docs/authentication-implementation-plan.md](../docs/authentication-implementation-plan.md)
  - 完全な実装プラン
  - ステップバイステップのガイド
  - セキュリティベストプラクティス
  - トラブルシューティングガイド
  - 参考資料リンク

### 作成されるファイル（合計24ファイル）
- 設定ファイル: 8個
- ライブラリファイル: 4個
- コンポーネント: 3個
- ページ/レイアウト: 8個
- Middleware: 1個

## 次のステップ

1. ✅ 詳細設計完了
2. ⏭️ Next.jsプロジェクト初期化
3. ⏭️ Supabaseプロジェクト作成
4. ⏭️ 認証システム実装
5. ⏭️ テスト実施
6. ⏭️ Q&A機能の設計・実装（将来）

## 参考情報

### 使用したリソース
- [Supabase Server-Side Auth for Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [@supabase/ssr Package Docs](https://supabase.com/docs/guides/auth/server-side/creating-a-client)

### 主要な技術パッケージ
- `next` (15.x)
- `@supabase/supabase-js`
- `@supabase/ssr`
- `tailwindcss`
- `typescript`
