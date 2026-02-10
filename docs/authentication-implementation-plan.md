# 社内向け質問受付アプリ - 認証機能実装プラン

## Context（背景）

社内向け質問受付アプリを構築するための基盤として、まずNext.js + Supabaseによる認証システムを実装します。現在のプロジェクトは完全に空の状態（.gitディレクトリのみ存在）であり、ゼロからアプリケーションを構築する必要があります。

この段階では認証機能に焦点を当て、質問・回答機能は今後のフェーズで実装します。認証システムは以下を提供します：
- メール/パスワードによるユーザー登録とログイン
- セキュアなセッション管理（HTTP-only Cookie使用）
- 保護されたルートへのアクセス制御
- メール確認フロー

技術スタック：
- Next.js 15（App Router、TypeScript）
- Supabase（認証・データベース）
- Tailwind CSS（スタイリング）

## 実装アプローチ

### セキュリティ設計

**Cookie ベース認証**を採用し、`@supabase/ssr`パッケージを使用します：
- HTTP-only Cookieでセッションを管理（XSS攻撃から保護）
- Middlewareで自動セッションリフレッシュ
- 多層防御：Middleware + Server Componentの両方で認証チェック

**3種類のSupabaseクライアント**を使い分けます：
- Browser Client: Client Componentsで使用
- Server Client: Server Components、Route Handlers、Server Actionsで使用
- Middleware Client: Next.js middlewareで使用

### プロジェクト構造

```
wake-career-ask-base/
├── app/
│   ├── (auth)/                    # 認証ページグループ
│   │   ├── login/page.tsx         # ログインページ
│   │   └── signup/page.tsx        # サインアップページ
│   ├── (protected)/               # 保護されたページグループ
│   │   ├── dashboard/page.tsx     # ダッシュボード
│   │   └── profile/page.tsx       # プロフィールページ
│   ├── auth/confirm/route.ts      # メール確認ハンドラー
│   ├── layout.tsx                 # ルートレイアウト
│   ├── page.tsx                   # ホームページ
│   └── globals.css                # グローバルスタイル
├── components/auth/
│   ├── LoginForm.tsx              # ログインフォーム
│   ├── SignupForm.tsx             # サインアップフォーム
│   └── LogoutButton.tsx           # ログアウトボタン
├── lib/supabase/
│   ├── client.ts                  # Browserクライアント
│   ├── server.ts                  # Serverクライアント
│   └── middleware.ts              # Middlewareヘルパー
├── types/
│   └── supabase.ts                # TypeScript型定義
├── middleware.ts                  # Next.js middleware（ルート保護）
├── .env.local                     # 環境変数（gitignore）
├── .env.example                   # 環境変数テンプレート
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

## 実装ステップ

### Phase 1: プロジェクト初期化

1. **Next.jsプロジェクト初期化**
   ```bash
   npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"
   ```

2. **Supabase依存関係インストール**
   ```bash
   npm install @supabase/supabase-js @supabase/ssr
   ```

3. **環境変数ファイル作成**
   - `.env.local`: Supabase URLとANON KEYを設定（gitignore）
   - `.env.example`: 環境変数テンプレート（コミット）

### Phase 2: Supabase設定

1. **Supabaseプロジェクト作成**
   - https://supabase.com で新規プロジェクト作成
   - Settings > API からURLとanon keyを取得
   - `.env.local`に設定

2. **メール認証設定**
   - Authentication > Providers でEmailを有効化
   - Email Templates > Confirm signup を編集
   - Confirmation URLを `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email` に変更
   - Site URLを `http://localhost:3000` に設定

### Phase 3: Supabaseクライアント実装

**重要ファイル:**

1. **`/lib/supabase/client.ts`** - Browser Client
   - `createBrowserClient`を使用
   - Client Componentsから呼び出し

2. **`/lib/supabase/server.ts`** - Server Client
   - `createServerClient`を使用
   - Cookie管理を実装（`getAll`、`setAll`）
   - Server Components、Route Handlers、Server Actionsから呼び出し

3. **`/lib/supabase/middleware.ts`** - Middleware Helper
   - セッションリフレッシュロジック
   - 未認証ユーザーをログインページにリダイレクト
   - 認証・ログイン・サインアップパスは除外

### Phase 4: Middleware実装

**`/middleware.ts`**
- `updateSession`ヘルパーを呼び出し
- すべてのリクエストでセッションを自動更新
- 静的アセットは除外（matcher設定）

**セキュリティ注意:**
- Middlewareのみに依存しない
- Server Componentsで必ず`await supabase.auth.getUser()`で再検証

### Phase 5: 認証コンポーネント実装

**Client Components（'use client'）:**

1. **`/components/auth/SignupForm.tsx`**
   - メール/パスワード入力フォーム
   - `supabase.auth.signUp()`呼び出し
   - エラーハンドリング（既存アカウントチェック）
   - メール確認メッセージ表示

2. **`/components/auth/LoginForm.tsx`**
   - メール/パスワード入力フォーム
   - `supabase.auth.signInWithPassword()`呼び出し
   - ログイン成功後、ダッシュボードにリダイレクト
   - `router.refresh()`でサーバー状態を更新

3. **`/components/auth/LogoutButton.tsx`**
   - `supabase.auth.signOut()`呼び出し
   - ログインページにリダイレクト

### Phase 6: ページ実装

**Server Components（デフォルト）:**

1. **`/app/layout.tsx`** - ルートレイアウト
   - メタデータ設定
   - グローバルスタイル適用

2. **`/app/page.tsx`** - ホームページ
   - ユーザー認証状態をチェック
   - ログイン済み: ダッシュボード/プロフィールリンク表示
   - 未ログイン: ログイン/サインアップリンク表示

3. **`/app/(auth)/login/page.tsx`** - ログインページ
   - LoginFormコンポーネントを表示
   - サインアップページへのリンク

4. **`/app/(auth)/signup/page.tsx`** - サインアップページ
   - SignupFormコンポーネントを表示
   - ログインページへのリンク

5. **`/app/auth/confirm/route.ts`** - メール確認Route Handler
   - URLパラメータから`token_hash`と`type`を取得
   - `supabase.auth.verifyOtp()`で確認
   - 成功時: ダッシュボードにリダイレクト
   - 失敗時: エラーメッセージ付きでログインページにリダイレクト

6. **`/app/(protected)/dashboard/page.tsx`** - ダッシュボード
   - `await supabase.auth.getUser()`で認証チェック
   - 未認証の場合、ログインページにリダイレクト
   - ユーザーメール表示
   - LogoutButtonコンポーネント表示

7. **`/app/(protected)/profile/page.tsx`** - プロフィールページ
   - ユーザー情報表示（メール、ID、作成日時、メール確認状態）
   - ダッシュボードリンクとLogoutButton

### Phase 7: TypeScript型定義（オプション）

**`/types/supabase.ts`**
- Supabase CLIで型生成: `npx supabase gen types typescript --project-id "your-project-id" > types/supabase.ts`
- または手動で基本構造を作成

### Phase 8: 設定ファイル確認

1. **`next.config.ts`** - Next.js設定（デフォルトでOK）
2. **`tailwind.config.ts`** - Tailwind設定（自動生成）
3. **`.gitignore`** - `.env*.local`、`node_modules`、`.next`を含める

## 重要な実装ポイント

### セキュリティベストプラクティス

1. **`getUser()`を使用、`getSession()`は避ける**
   ```typescript
   // ❌ 使用しない
   const { data: { session } } = await supabase.auth.getSession()

   // ✅ 使用する
   const { data: { user } } = await supabase.auth.getUser()
   ```
   理由: `getUser()`はSupabaseサーバーでトークンを再検証

2. **認証後は必ず`router.refresh()`を呼ぶ**
   ```typescript
   router.push('/dashboard')
   router.refresh()  // サーバー側の状態を更新
   ```

3. **保護されたページで必ず認証チェック**
   ```typescript
   const { data: { user } } = await supabase.auth.getUser()
   if (!user) {
     redirect('/login')
   }
   ```

4. **適切なクライアントを使用**
   - Client Components: `@/lib/supabase/client`から
   - Server Components: `@/lib/supabase/server`から

### メール確認フロー

1. ユーザーがサインアップ
2. Supabaseが確認メールを送信
3. ユーザーがメール内のリンクをクリック
4. `/auth/confirm?token_hash=...&type=email`にアクセス
5. Route Handlerが`verifyOtp()`を呼び出し
6. 成功時、ダッシュボードにリダイレクト

## 検証手順（テスト方法）

### 1. 開発サーバー起動
```bash
npm run dev
```

### 2. サインアップフロー
- [ ] http://localhost:3000/signup にアクセス
- [ ] メールアドレスとパスワードを入力
- [ ] 「Check your email」メッセージが表示される
- [ ] メールを確認し、確認リンクをクリック
- [ ] ダッシュボードにリダイレクトされる
- [ ] メールアドレスが表示される

### 3. ログインフロー
- [ ] ログアウト
- [ ] http://localhost:3000/login にアクセス
- [ ] 認証情報を入力
- [ ] ダッシュボードにリダイレクトされる

### 4. ルート保護テスト
- [ ] ログアウト状態で http://localhost:3000/dashboard にアクセス
- [ ] 自動的にログインページにリダイレクトされる
- [ ] ログイン後、ダッシュボードにアクセスできる

### 5. セッション永続性テスト
- [ ] ログイン
- [ ] ブラウザをリフレッシュ
- [ ] ログイン状態が維持されている
- [ ] ブラウザを閉じて再度開く
- [ ] ログイン状態が維持されている

### 6. プロフィールページテスト
- [ ] ログイン後、http://localhost:3000/profile にアクセス
- [ ] ユーザー情報が正しく表示される
- [ ] メール確認状態が表示される

### 7. ログアウトテスト
- [ ] Logout ボタンをクリック
- [ ] ログインページにリダイレクトされる
- [ ] 保護されたページにアクセスできない

### 8. セキュリティ確認
- [ ] ブラウザDevTools > Application > Cookies
- [ ] Supabase認証Cookieに`HttpOnly`フラグがある
- [ ] ログアウト状態でミドルウェアが保護ルートをブロックする

## 今後の拡張（Phase 2以降）

### 追加の認証機能
- パスワードリセット機能
- プロフィール編集機能
- Google OAuth連携

### Q&A機能
- questionsテーブル作成
- answersテーブル作成
- 質問投稿・回答投稿機能
- いいね/投票機能
- ベストアンサー選択機能

### データベーススキーマ（将来）
```sql
-- プロフィールテーブル
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 質問テーブル
create table public.questions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  title text not null,
  content text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 回答テーブル
create table public.answers (
  id uuid default gen_random_uuid() primary key,
  question_id uuid references public.questions on delete cascade,
  user_id uuid references auth.users on delete cascade,
  content text not null,
  is_best_answer boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

## トラブルシューティング

### エラー: "Invalid API key"
- `.env.local`の環境変数を確認
- 開発サーバーを再起動

### メール確認リンクが動作しない
- Supabaseダッシュボードのメールテンプレートを確認
- `/auth/confirm/route.ts`が存在するか確認
- Site URLが正しいか確認

### セッションが維持されない
- ブラウザDevToolsでCookieを確認
- Middlewareが正しく動作しているか確認
- 正しいSupabaseクライアントを使用しているか確認

## 参考資料

- [Supabase Server-Side Auth for Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [@supabase/ssr Package Docs](https://supabase.com/docs/guides/auth/server-side/creating-a-client)
