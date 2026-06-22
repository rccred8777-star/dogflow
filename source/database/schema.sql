-- DogFlow — Schema Supabase
-- Executar no SQL Editor do Supabase: https://supabase.com/dashboard/project/<project>/sql
-- Projeto: oardxsdiwaxmpomxhfls (São Paulo)

-- ============================================================
-- TABLES
-- ============================================================

create table if not exists purchases (
  id              uuid primary key default gen_random_uuid(),
  email           text not null,
  customer_name   text,
  customer_phone  text,  -- E.164 sem +, ex: 5511999999999
  user_id         uuid references auth.users(id) on delete set null,
  kiwify_order_id text unique,
  product         text not null default 'dogflow_7dias',
  status          text not null default 'active', -- active | refunded | chargeback | cancelled
  purchased_at    timestamptz not null default now()
);

create table if not exists subscriptions (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users(id) on delete cascade not null,
  plan            text not null, -- basico | premium | pro
  price_monthly   numeric not null,
  status          text not null default 'active', -- active | cancelled | past_due
  start_date      date not null default current_date,
  end_date        date,
  kiwify_sub_id   text unique
);

create table if not exists pets (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users(id) on delete cascade not null,
  name         text not null,
  breed        text,
  age_months   int,
  main_problem text, -- xixi | guia | latido | pulo | filhote | ansioso
  created_at   timestamptz not null default now()
);

create table if not exists training_modules (
  id            uuid primary key default gen_random_uuid(),
  product       text not null default 'dogflow_7dias',
  category      text,
  title         text not null,
  description   text,
  order_index   int not null,
  plan_required text not null default 'desafio', -- desafio | basico | premium | pro
  unlock_hours  int not null default 0
);

create table if not exists training_steps (
  id             uuid primary key default gen_random_uuid(),
  module_id      uuid references training_modules(id) on delete cascade not null,
  order_index    int not null,
  title          text not null,
  objective      text not null,
  explanation    text not null,
  training       text not null,
  common_error   text not null,
  practical_task text not null,
  checklist      jsonb not null default '[]'
);

create table if not exists training_progress (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users(id) on delete cascade not null,
  pet_id          uuid references pets(id) on delete cascade,
  module_id       uuid references training_modules(id) on delete cascade not null,
  completed_steps int not null default 0,
  status          text not null default 'in_progress', -- in_progress | completed
  last_activity   timestamptz not null default now(),
  unique (user_id, module_id)
);

-- ============================================================
-- INDEXES
-- ============================================================

create index if not exists idx_purchases_user_id  on purchases(user_id);
create index if not exists idx_purchases_email     on purchases(email);
create index if not exists idx_pets_user_id        on pets(user_id);
create index if not exists idx_progress_user_id    on training_progress(user_id);
create index if not exists idx_modules_product     on training_modules(product, order_index);
create index if not exists idx_steps_module        on training_steps(module_id, order_index);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table purchases         enable row level security;
alter table subscriptions     enable row level security;
alter table pets              enable row level security;
alter table training_modules  enable row level security;
alter table training_steps    enable row level security;
alter table training_progress enable row level security;

-- purchases: usuário vê só as suas; service_role gerencia tudo
create policy "users read own purchases"
  on purchases for select
  using (user_id = auth.uid());

-- subscriptions: usuário vê só as suas
create policy "users read own subscriptions"
  on subscriptions for select
  using (user_id = auth.uid());

-- pets: CRUD próprio
create policy "users manage own pets"
  on pets for all
  using (user_id = auth.uid());

-- training_modules: leitura pública (autenticado)
create policy "authenticated read modules"
  on training_modules for select
  to authenticated
  using (true);

-- training_steps: leitura pública (autenticado)
create policy "authenticated read steps"
  on training_steps for select
  to authenticated
  using (true);

-- training_progress: usuário gerencia próprio
create policy "users manage own progress"
  on training_progress for all
  using (user_id = auth.uid());

-- ============================================================
-- SEED — Módulos DogFlow 7 Dias
-- ============================================================
-- Inserir apenas se não existir (idempotente)

insert into training_modules (product, title, description, order_index, plan_required, unlock_hours) values
  ('dogflow_7dias', 'Boas-vindas e Preparação',         'Prepare o ambiente e entenda como o desafio funciona',            0, 'desafio', 0),
  ('dogflow_7dias', 'Foco e Contato Visual',             'Ensine seu cão a olhar para você quando chamado',                1, 'desafio', 0),
  ('dogflow_7dias', 'Sentando por Comando',              'O comando "senta" — base de toda a obediência',                  2, 'desafio', 24),
  ('dogflow_7dias', 'Mantendo a Posição (Fica)',         'Desenvolvendo paciência e autocontrole',                         3, 'desafio', 48),
  ('dogflow_7dias', 'Chamada de Retorno (Vem)',          'O comando mais importante — pode salvar a vida do seu cão',      4, 'desafio', 72),
  ('dogflow_7dias', 'Passeio Sem Puxar',                 'Caminhadas agradáveis com guia frouxa',                          5, 'desafio', 96),
  ('dogflow_7dias', 'Não Pular nas Pessoas',             'Ensinando a cumprimentar sem pular',                             6, 'desafio', 120),
  ('dogflow_7dias', 'Rotina Consolidada — Desafio Final','Revisão e celebração: seu cão de 7 dias atrás não existe mais', 7, 'desafio', 144)
on conflict do nothing;

-- ============================================================
-- NOTA: training_steps são inseridos via seed separado
-- Ver: docs/product/CONTEUDO_7_DIAS_DOGFLOW_V1.md
-- O conteúdo completo deve ser inserido após aprovação humana
-- ============================================================
