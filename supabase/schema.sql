-- ============================================================
-- LACUS Jiu-Jitsu · Esquema do banco (Supabase / PostgreSQL)
-- Rode este arquivo inteiro no SQL Editor do Supabase (Run).
-- Inclui tabelas, gatilhos e regras de segurança (RLS).
-- ============================================================

-- ---------- Perfis (1 por conta logada) ----------
-- Papéis: 'professor', 'aluno' (adulto), 'responsavel' (pai/mãe de menor)
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        text not null default 'aluno' check (role in ('professor','aluno','responsavel')),
  nome        text,
  email       text,
  telefone    text,
  created_at  timestamptz not null default now()
);

-- Cria o profile automaticamente quando uma conta é criada (lê metadados do cadastro)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, role, nome, email, telefone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'aluno'),
    new.raw_user_meta_data->>'nome',
    new.email,
    new.raw_user_meta_data->>'telefone'
  )
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Alunos ----------
-- account_id: conta de login do PRÓPRIO aluno (adulto). Fica NULL para menores
--             (quem loga é o responsável, via student_guardians).
create table if not exists public.students (
  id                       uuid primary key default gen_random_uuid(),
  professor_id             uuid not null references auth.users(id),   -- dono/professor responsável
  account_id               uuid references auth.users(id),            -- login do próprio aluno (adulto)
  nome                     text not null,
  data_nascimento          date,
  sexo                     text,
  foto_url                 text,
  categoria                text default 'adulto' check (categoria in ('adulto','kids')),
  -- graduação
  belt                     text default 'white',
  graus                    int  default 0,
  ultima_graduacao         date,
  data_matricula           date default current_date,
  modalidades              text[] default '{}',
  -- contato
  telefone                 text,
  email                    text,
  cidade                   text,
  cpf                      text,
  -- saúde & segurança
  cond_medicas             text,
  contato_emergencia_nome  text,
  contato_emergencia_fone  text,
  autoriza_imagem          boolean default false,
  observacoes              text,
  -- financeiro (resumo; histórico fica em payments)
  plano                    text,
  mensalidade_valor        numeric(10,2),
  vencimento_dia           int,
  pagamento_status         text default 'pendente' check (pagamento_status in ('em_dia','pendente','vencido')),
  -- ciclo de vida
  status                   text default 'ativo' check (status in ('ativo','pendente','inativo')),
  created_at               timestamptz not null default now()
);
create index if not exists students_professor_idx on public.students(professor_id);
create index if not exists students_account_idx on public.students(account_id);

-- ---------- Vínculo responsável → aluno (menores) ----------
create table if not exists public.student_guardians (
  student_id           uuid not null references public.students(id) on delete cascade,
  guardian_account_id  uuid not null references auth.users(id) on delete cascade,
  parentesco           text,
  principal            boolean default true,
  created_at           timestamptz not null default now(),
  primary key (student_id, guardian_account_id)
);
create index if not exists guardians_account_idx on public.student_guardians(guardian_account_id);

-- ---------- Graduações (histórico) ----------
create table if not exists public.graduations (
  id            uuid primary key default gen_random_uuid(),
  student_id    uuid not null references public.students(id) on delete cascade,
  professor_id  uuid references auth.users(id),
  belt          text,
  graus         int,
  data          date default current_date,
  obs           text,
  created_at    timestamptz not null default now()
);

-- ---------- Avaliações de treino ----------
create table if not exists public.evaluations (
  id            uuid primary key default gen_random_uuid(),
  student_id    uuid not null references public.students(id) on delete cascade,
  professor_id  uuid references auth.users(id),
  data          date default current_date,
  aula          text,
  execucao      text,
  posicoes      text,
  destaques     text,
  melhorar      text,
  created_at    timestamptz not null default now()
);
create index if not exists evaluations_student_idx on public.evaluations(student_id);

-- ---------- Mensagens (caminho das faixas) ----------
create table if not exists public.messages (
  id            uuid primary key default gen_random_uuid(),
  student_id    uuid not null references public.students(id) on delete cascade,
  professor_id  uuid references auth.users(id),
  texto         text not null,
  data          date default current_date,
  created_at    timestamptz not null default now()
);
create index if not exists messages_student_idx on public.messages(student_id);

-- ---------- Check-ins (frequência) ----------
create table if not exists public.checkins (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null references public.students(id) on delete cascade,
  data        date not null default current_date,
  aula        text,
  hora        text,
  created_at  timestamptz not null default now()
);
create index if not exists checkins_student_idx on public.checkins(student_id);
create unique index if not exists checkins_unique_day on public.checkins(student_id, data);

-- ---------- Pagamentos (histórico) ----------
create table if not exists public.payments (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null references public.students(id) on delete cascade,
  competencia text,                 -- ex.: '2026-06'
  valor       numeric(10,2),
  status      text default 'pendente' check (status in ('em_dia','pendente','vencido')),
  pago_em     date,
  created_at  timestamptz not null default now()
);
create index if not exists payments_student_idx on public.payments(student_id);

-- ---------- Avisos da academia ----------
create table if not exists public.announcements (
  id            uuid primary key default gen_random_uuid(),
  professor_id  uuid not null references auth.users(id),
  titulo        text not null,
  texto         text,
  data          date default current_date,
  created_at    timestamptz not null default now()
);

-- ---------- Eventos & competições ----------
create table if not exists public.events (
  id            uuid primary key default gen_random_uuid(),
  professor_id  uuid not null references auth.users(id),
  titulo        text not null,
  texto         text,
  data          date,
  tipo          text default 'evento',
  created_at    timestamptz not null default now()
);

-- ---------- Solicitações de acesso (aluno/responsável -> professor) ----------
create table if not exists public.access_requests (
  id               uuid primary key default gen_random_uuid(),
  requester_id     uuid references auth.users(id),  -- conta que pediu (se já logada)
  nome             text,
  email            text,
  tipo             text default 'aluno' check (tipo in ('aluno','responsavel')),
  professor_email  text,                            -- e-mail do professor (como na tela de registro)
  mensagem         text,
  status           text default 'pendente' check (status in ('pendente','aprovado','recusado')),
  created_at       timestamptz not null default now()
);

-- ============================================================
-- Funções auxiliares de segurança
-- ============================================================
create or replace function public.is_professor()
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role = 'professor');
$$;

-- O usuário atual pode VER este aluno? (professor dono, próprio aluno adulto, ou responsável vinculado)
create or replace function public.can_view_student(sid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists(
    select 1 from public.students s
    where s.id = sid
      and (
        s.professor_id = auth.uid()
        or s.account_id = auth.uid()
        or exists(select 1 from public.student_guardians g
                  where g.student_id = s.id and g.guardian_account_id = auth.uid())
      )
  );
$$;

-- O usuário atual é o PROFESSOR dono deste aluno? (para escrever)
create or replace function public.is_my_student(sid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.students s where s.id = sid and s.professor_id = auth.uid());
$$;

-- ============================================================
-- RLS — habilitar e definir políticas
-- ============================================================
alter table public.profiles          enable row level security;
alter table public.students          enable row level security;
alter table public.student_guardians enable row level security;
alter table public.graduations       enable row level security;
alter table public.evaluations       enable row level security;
alter table public.messages          enable row level security;
alter table public.checkins          enable row level security;
alter table public.payments          enable row level security;
alter table public.announcements     enable row level security;
alter table public.events            enable row level security;
alter table public.access_requests   enable row level security;

-- profiles: cada um lê/edita o seu; professor pode ler perfis (para vincular)
create policy profiles_self_select on public.profiles for select using (id = auth.uid() or public.is_professor());
create policy profiles_self_update on public.profiles for update using (id = auth.uid());

-- students
create policy students_select on public.students for select using (
  professor_id = auth.uid()
  or account_id = auth.uid()
  or exists(select 1 from public.student_guardians g where g.student_id = id and g.guardian_account_id = auth.uid())
);
create policy students_write_prof on public.students for all
  using (professor_id = auth.uid() and public.is_professor())
  with check (professor_id = auth.uid() and public.is_professor());

-- student_guardians: professor do aluno gerencia; o próprio responsável vê o seu vínculo
create policy guardians_select on public.student_guardians for select using (
  guardian_account_id = auth.uid() or public.is_my_student(student_id)
);
create policy guardians_write_prof on public.student_guardians for all
  using (public.is_my_student(student_id)) with check (public.is_my_student(student_id));

-- Tabelas filhas do aluno: VER se pode ver o aluno; ESCREVER se é o professor dono
create policy grad_select on public.graduations for select using (public.can_view_student(student_id));
create policy grad_write  on public.graduations for all using (public.is_my_student(student_id)) with check (public.is_my_student(student_id));

create policy eval_select on public.evaluations for select using (public.can_view_student(student_id));
create policy eval_write  on public.evaluations for all using (public.is_my_student(student_id)) with check (public.is_my_student(student_id));

create policy msg_select on public.messages for select using (public.can_view_student(student_id));
create policy msg_write  on public.messages for all using (public.is_my_student(student_id)) with check (public.is_my_student(student_id));

create policy pay_select on public.payments for select using (public.can_view_student(student_id));
create policy pay_write  on public.payments for all using (public.is_my_student(student_id)) with check (public.is_my_student(student_id));

-- check-ins: ver quem pode ver o aluno; inserir/editar o professor dono OU o próprio aluno adulto
create policy ck_select on public.checkins for select using (public.can_view_student(student_id));
create policy ck_write  on public.checkins for all
  using (
    public.is_my_student(student_id)
    or exists(select 1 from public.students s where s.id = student_id and s.account_id = auth.uid())
  )
  with check (
    public.is_my_student(student_id)
    or exists(select 1 from public.students s where s.id = student_id and s.account_id = auth.uid())
  );

-- avisos & eventos: qualquer logado lê; só professor escreve
create policy ann_select on public.announcements for select using (auth.role() = 'authenticated');
create policy ann_write  on public.announcements for all using (professor_id = auth.uid() and public.is_professor()) with check (professor_id = auth.uid());
create policy evt_select on public.events for select using (auth.role() = 'authenticated');
create policy evt_write  on public.events for all using (professor_id = auth.uid() and public.is_professor()) with check (professor_id = auth.uid());

-- solicitações de acesso: qualquer um cria; professor lê/atualiza
create policy req_insert on public.access_requests for insert with check (true);
create policy req_select on public.access_requests for select using (public.is_professor() or requester_id = auth.uid());
create policy req_update on public.access_requests for update using (public.is_professor());

-- ============================================================
-- Fim do esquema. Depois: Authentication > Providers > Email (habilitar).
-- ============================================================
