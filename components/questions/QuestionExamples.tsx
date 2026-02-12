'use client'

interface QuestionExample {
  title: string
  body: string
}

const QUESTION_EXAMPLES: QuestionExample[] = [
  {
    title: 'おすすめのランチスポットを教えてください',
    body: 'オフィス周辺で美味しいランチが食べられるお店を探しています。おすすめがあれば教えてください！',
  },
  {
    title: '休日の過ごし方について',
    body: '皆さんは休日をどのように過ごしていますか？趣味や好きなことなど、シェアしていただけると嬉しいです。',
  },
  {
    title: '最近読んだ本やおすすめの本',
    body: '最近面白かった本や、おすすめの書籍があれば教えてください。ジャンルは問いません。',
  },
  {
    title: 'リモートワークの工夫や環境について',
    body: 'リモートワークを快適にするために工夫していることや、デスク環境などを共有しませんか？',
  },
  {
    title: '社内の福利厚生の活用方法',
    body: '会社の福利厚生をどのように活用していますか？おすすめの使い方があれば教えてください。',
  },
]

interface QuestionExamplesProps {
  onExampleClick: (title: string, body: string) => void
}

export default function QuestionExamples({ onExampleClick }: QuestionExamplesProps) {
  return (
    <div className="bg-white shadow-md rounded-lg px-6 py-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">質問例</h3>
      <p className="text-sm text-gray-600 mb-4">
        こんな質問を投稿してみませんか？クリックするとフォームに反映されます。
      </p>
      <div className="space-y-3">
        {QUESTION_EXAMPLES.map((example, index) => (
          <button
            key={index}
            onClick={() => onExampleClick(example.title, example.body)}
            className="w-full text-left p-3 border border-gray-200 rounded hover:border-blue-400 hover:bg-blue-50 transition"
          >
            <h4 className="text-sm font-semibold text-gray-800 mb-1">
              {example.title}
            </h4>
            <p className="text-xs text-gray-600 line-clamp-2">{example.body}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
