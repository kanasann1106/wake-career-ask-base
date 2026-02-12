import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import AnswerForm from '@/components/questions/AnswerForm'
import AnswerCard from '@/components/questions/AnswerCard'

export default async function QuestionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 質問を取得
  const { data: question, error } = await supabase
    .from('questions')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !question) {
    notFound()
  }

  // 回答を取得
  const { data: answers } = await supabase
    .from('answers')
    .select('*')
    .eq('question_id', id)
    .order('created_at', { ascending: false })

  // 投稿日時のフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <Link
            href="/questions"
            className="text-blue-600 hover:text-blue-800"
          >
            ← 質問一覧に戻る
          </Link>
        </div>

        <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {question.title}
          </h1>
          <div className="flex items-center justify-between text-sm text-gray-500 mb-6 pb-4 border-b">
            <span>投稿者: 匿名</span>
            <span>投稿日時: {formatDate(question.created_at)}</span>
          </div>
          <div className="prose max-w-none">
            <p className="text-gray-800 whitespace-pre-wrap text-lg leading-relaxed">
              {question.body}
            </p>
          </div>
        </div>

        {/* 回答セクション */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            回答（{answers?.length || 0}件）
          </h2>

          {/* 回答フォーム */}
          <AnswerForm questionId={id} />

          {/* 回答リスト */}
          <div className="space-y-4">
            {answers && answers.length > 0 ? (
              answers.map((answer) => (
                <AnswerCard key={answer.id} answer={answer} />
              ))
            ) : (
              <div className="bg-white shadow-md rounded-lg px-8 py-6 text-center">
                <p className="text-gray-600">まだ回答がありません</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
