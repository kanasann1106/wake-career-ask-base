import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Ask Base
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          社内向け質問受付アプリケーション
        </p>

        {user ? (
          <div>
            <p className="text-gray-700 mb-6">
              ようこそ、<span className="font-semibold">{user.email}</span> さん
            </p>
            <div className="space-x-4">
              <a
                href="/dashboard"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                ダッシュボード
              </a>
              <a
                href="/profile"
                className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition"
              >
                プロフィール
              </a>
            </div>
          </div>
        ) : (
          <div className="space-x-4">
            <a
              href="/login"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              ログイン
            </a>
            <a
              href="/signup"
              className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition"
            >
              サインアップ
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
