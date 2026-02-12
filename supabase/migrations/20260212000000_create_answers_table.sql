-- answersテーブル作成
create table public.answers (
  id uuid default gen_random_uuid() primary key,
  question_id uuid not null references public.questions(id) on delete cascade,
  body text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- インデックス作成
create index idx_answers_question_id on public.answers(question_id);
create index idx_answers_created_at on public.answers(created_at desc);
create index idx_answers_question_created on public.answers(question_id, created_at desc);

-- RLS有効化とポリシー設定
alter table public.answers enable row level security;

create policy "Anyone can view answers"
  on public.answers for select
  using (true);

create policy "Authenticated users can create answers"
  on public.answers for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own answers"
  on public.answers for update
  using (auth.uid() = user_id);

create policy "Users can delete their own answers"
  on public.answers for delete
  using (auth.uid() = user_id);
