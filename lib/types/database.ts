export interface Question {
  id: string
  title: string
  body: string
  user_id: string
  created_at: string
  updated_at: string
}

export interface Answer {
  id: string
  question_id: string
  body: string
  user_id: string
  created_at: string
  updated_at: string
}
