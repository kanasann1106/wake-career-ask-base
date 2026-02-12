'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface AnswerFormProps {
  questionId: string
  onAnswerSubmitted?: () => void
}

export default function AnswerForm({ questionId, onAnswerSubmitted }: AnswerFormProps) {
  const [body, setBody] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('認証が必要です')
        return
      }

      const { error } = await supabase
        .from('answers')
        .insert({
          question_id: questionId,
          body,
          user_id: user.id,
        })

      if (error) {
        setError(error.message)
      } else {
        setMessage('回答を投稿しました！')
        setBody('')
        router.refresh()
        if (onAnswerSubmitted) {
          onAnswerSubmitted()
        }
      }
    } catch (err) {
      setError('予期しないエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-8">
      <h3 className="text-xl font-bold mb-4 text-gray-800">回答を投稿</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {message && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {message}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="body">
          回答 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          rows={5}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-vertical"
          placeholder="回答を入力してください"
        />
      </div>

      <div className="flex items-center justify-between">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed w-full"
        >
          {loading ? '投稿中...' : '投稿する'}
        </button>
      </div>
    </form>
  )
}
