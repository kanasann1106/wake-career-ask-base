import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from '@/components/auth/LogoutButton'

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">プロフィール</h1>

          <div className="space-y-4">
            <div className="border-b pb-4">
              <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">メールアドレス</h2>
              <p className="mt-1 text-lg text-gray-900">{user.email}</p>
            </div>

            <div className="border-b pb-4">
              <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">ユーザーID</h2>
              <p className="mt-1 text-sm text-gray-700 font-mono">{user.id}</p>
            </div>

            <div className="border-b pb-4">
              <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">作成日時</h2>
              <p className="mt-1 text-gray-700">
                {new Date(user.created_at).toLocaleString('ja-JP')}
              </p>
            </div>

            <div className="border-b pb-4">
              <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">メール確認状態</h2>
              <p className="mt-1">
                {user.email_confirmed_at ? (
                  <span className="text-green-600 font-semibold">✓ 確認済み</span>
                ) : (
                  <span className="text-orange-600 font-semibold">未確認</span>
                )}
              </p>
            </div>
          </div>

          <div className="border-t pt-6 mt-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">ナビゲーション</h2>
            <div className="space-x-4">
              <a
                href="/questions"
                className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                質問一覧
              </a>
              <a
                href="/dashboard"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                ダッシュボード
              </a>
              <a
                href="/"
                className="inline-block bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
              >
                ホーム
              </a>
            </div>
          </div>

          <div className="border-t pt-6 mt-6">
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  )
}
