import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from '@/components/auth/LogoutButton'

export default async function DashboardPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">ダッシュボード</h1>

          <div className="mb-6">
            <p className="text-gray-700 mb-2">
              ようこそ、<span className="font-semibold">{user.email}</span> さん！
            </p>
            <p className="text-gray-600 text-sm">
              ログインに成功しました。
            </p>
          </div>

          <div className="border-t pt-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">ナビゲーション</h2>
            <div className="space-x-4">
              <a
                href="/questions"
                className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                質問一覧
              </a>
              <a
                href="/profile"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                プロフィール
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
