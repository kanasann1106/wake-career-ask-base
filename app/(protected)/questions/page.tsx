import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import QuestionCard from '@/components/questions/QuestionCard'
import Link from 'next/link'

export default async function QuestionsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 質問一覧を取得（新しい順）
  const { data: questions, error } = await supabase
    .from('questions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching questions:', error)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">質問一覧</h1>
          <Link
            href="/questions/new"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            質問を投稿
          </Link>
        </div>

        <div className="space-y-4">
          {questions && questions.length > 0 ? (
            questions.map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))
          ) : (
            <div className="bg-white shadow-md rounded-lg px-8 py-12 text-center">
              <p className="text-gray-600 mb-4">まだ質問が投稿されていません</p>
              <Link
                href="/questions/new"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                最初の質問を投稿する
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
