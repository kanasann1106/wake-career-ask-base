# Ask Base - 社内質問受付アプリ

社内向け質問受付アプリケーションです。現在は認証システムが実装されており、質問・回答機能は今後追加予定です。

## 技術スタック

- **Next.js 15** - App Router、TypeScript
- **Supabase** - 認証・データベース
- **Tailwind CSS** - スタイリング

## 機能

### 実装済み（Phase 1-6）

- ✅ メール/パスワードによるユーザー登録
- ✅ ログイン/ログアウト機能
- ✅ メール確認フロー
- ✅ セッション管理（HTTP-only Cookie）
- ✅ 保護されたルートへのアクセス制御
- ✅ ダッシュボード
- ✅ プロフィールページ

### 今後の実装予定

- パスワードリセット機能
- プロフィール編集機能
- 質問投稿機能
- 回答投稿機能
- いいね/投票機能

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Supabaseプロジェクトの作成

1. [https://supabase.com](https://supabase.com) にアクセス
2. 新規プロジェクトを作成
3. Settings > API から以下を取得:
   - Project URL
   - Anon/Public Key

### 3. 環境変数の設定

`.env.local` ファイルを作成し、Supabaseの認証情報を設定:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Supabaseメール認証の設定

Supabaseダッシュボードで以下を設定:

1. **Authentication > Providers** で Email を有効化
2. **Email Templates > Confirm signup** を編集:
   - Confirmation URL: `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email`
3. **Authentication > URL Configuration** で Site URL を設定:
   - 開発: `http://localhost:3000`
   - 本番: 実際のドメイン

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開く

## プロジェクト構造

```
wake-career-ask-base/
├── app/
│   ├── (auth)/              # 認証ページグループ
│   │   ├── login/           # ログインページ
│   │   └── signup/          # サインアップページ
│   ├── (protected)/         # 保護されたページグループ
│   │   ├── dashboard/       # ダッシュボード
│   │   └── profile/         # プロフィールページ
│   ├── auth/confirm/        # メール確認ハンドラー
│   ├── layout.tsx           # ルートレイアウト
│   ├── page.tsx             # ホームページ
│   └── globals.css          # グローバルスタイル
├── components/auth/         # 認証コンポーネント
│   ├── LoginForm.tsx        # ログインフォーム
│   ├── SignupForm.tsx       # サインアップフォーム
│   └── LogoutButton.tsx     # ログアウトボタン
├── lib/supabase/            # Supabaseクライアント
│   ├── client.ts            # Browserクライアント
│   ├── server.ts            # Serverクライアント
│   └── middleware.ts        # Middlewareヘルパー
├── middleware.ts            # Next.js middleware
├── .env.local               # 環境変数（gitignore）
└── .env.example             # 環境変数テンプレート
```

## セキュリティ機能

- **HTTP-only Cookie** - セッショントークンをJavaScriptからアクセス不可能に（XSS対策）
- **自動セッションリフレッシュ** - Middlewareでセッションを自動更新
- **多層防御** - Middleware + Server Componentの両方で認証チェック
- **保護されたルート** - 未認証ユーザーは自動的にログインページにリダイレクト

## 使い方

### サインアップ

1. [http://localhost:3000/signup](http://localhost:3000/signup) にアクセス
2. メールアドレスとパスワードを入力
3. メールを確認し、確認リンクをクリック
4. ダッシュボードにリダイレクトされる

### ログイン

1. [http://localhost:3000/login](http://localhost:3000/login) にアクセス
2. 認証情報を入力
3. ダッシュボードにリダイレクトされる

### ログアウト

- ダッシュボードまたはプロフィールページの「ログアウト」ボタンをクリック

## ビルド

```bash
# 本番ビルド
npm run build

# 本番サーバー起動
npm start
```

## トラブルシューティング

### エラー: "Invalid API key"

- `.env.local` の環境変数を確認
- 開発サーバーを再起動

### メール確認リンクが動作しない

- Supabaseダッシュボードのメールテンプレートを確認
- Site URLが正しいか確認

### セッションが維持されない

- ブラウザDevToolsでCookieを確認
- Middlewareが正しく動作しているか確認

## 参考資料

- [実装プラン](docs/authentication-implementation-plan.md)
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Next.js 15 Documentation](https://nextjs.org/docs)

## ライセンス

MIT
