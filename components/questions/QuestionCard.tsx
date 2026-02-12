import Link from 'next/link'
import { Question } from '@/lib/types/database'

interface QuestionCardProps {
  question: Question
}

export default function QuestionCard({ question }: QuestionCardProps) {
  // 本文を100文字に制限
  const truncatedBody = question.body.length > 100
    ? question.body.substring(0, 100) + '...'
    : question.body

  // 相対時間を計算
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInMinutes < 1) {
      return 'たった今'
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}分前`
    } else if (diffInHours < 24) {
      return `${diffInHours}時間前`
    } else if (diffInDays < 7) {
      return `${diffInDays}日前`
    } else {
      return date.toLocaleDateString('ja-JP')
    }
  }

  return (
    <Link href={`/questions/${question.id}`}>
      <div className="bg-white shadow-md rounded-lg px-6 py-5 hover:shadow-lg transition cursor-pointer">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {question.title}
        </h3>
        <p className="text-gray-600 mb-3 whitespace-pre-wrap">
          {truncatedBody}
        </p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>匿名</span>
          <span>{getRelativeTime(question.created_at)}</span>
        </div>
      </div>
    </Link>
  )
}
