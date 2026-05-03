-- Enable pgvector extension for RAG / semantic search
create extension if not exists vector;

-- Documents table for client knowledge bases (policy manuals, QA frameworks, handbooks)
create table if not exists documents (
  id          uuid primary key default gen_random_uuid(),
  client_id   uuid references clients(id) on delete cascade,
  title       text not null,
  content     text not null,
  embedding   vector(768),           -- nomic-embed-text dimensions
  source_type text,                  -- 'manual', 'upload', 'url', 'generated'
  metadata    jsonb default '{}',
  created_at  timestamptz default now()
);

create index if not exists documents_embedding_idx
  on documents using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

create index if not exists documents_client_idx on documents(client_id);

-- Similarity search: find documents relevant to a query embedding
create or replace function match_documents(
  query_embedding vector(768),
  match_client_id uuid,
  match_threshold float default 0.7,
  match_count     int  default 5
)
returns table (
  id          uuid,
  title       text,
  content     text,
  source_type text,
  metadata    jsonb,
  similarity  float
)
language sql stable
as $$
  select
    d.id, d.title, d.content, d.source_type, d.metadata,
    1 - (d.embedding <=> query_embedding) as similarity
  from documents d
  where d.client_id = match_client_id
    and 1 - (d.embedding <=> query_embedding) > match_threshold
  order by d.embedding <=> query_embedding
  limit match_count;
$$;
