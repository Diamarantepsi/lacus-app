# LACUS · Configuração do back-end (Supabase)

Este guia liga o app a um banco de dados real, com **login**, **aprovação de acesso
pelo professor** e **portal dos responsáveis** — funcionando entre celulares diferentes.
Tudo gratuito e sem servidor próprio (o app continua estático no GitHub Pages).

> Você faz os passos 1 a 4 (uns 10 minutos). No passo 5 me envia 2 valores e eu
> conecto o app, construo as telas de login/cadastro/aprovação e testo tudo.

## 1. Criar o projeto
1. Acesse **https://supabase.com** → entre com o GitHub (mesma conta é ok).
2. **New project** → nome `lacus` → defina uma **Database Password** (guarde-a) →
   Region: **South America (São Paulo)** → **Create new project** (aguarde ~2 min).

## 2. Criar as tabelas (rodar o esquema)
1. No projeto, menu lateral → **SQL Editor** → **+ New query**.
2. Abra o arquivo [`supabase/schema.sql`](supabase/schema.sql) deste repositório,
   **copie tudo** e cole no editor.
3. Clique em **Run**. Deve aparecer "Success. No rows returned".

## 3. Habilitar o login por e-mail
1. Menu → **Authentication** → **Providers** → **Email**: deixe **Enabled**.
2. (Opcional, facilita os testes) Em **Authentication → Providers → Email**, desligue
   **"Confirm email"** para não precisar confirmar e-mail durante os testes.

## 4. Pegar as credenciais
1. Menu → **Project Settings** (engrenagem) → **API**.
2. Copie dois valores:
   - **Project URL** (ex.: `https://abcd1234.supabase.co`)
   - **Project API keys → `anon` `public`** (uma chave longa começando com `eyJ...`)

## 5. Me enviar (ou colar você mesmo)
Cole esses dois valores em [`js/config.js`](js/config.js) **ou** me mande no chat:

```
SUPABASE_URL = ...
SUPABASE_ANON_KEY = ...  (a "anon public")
```

> ⚠️ **Só** esses dois. A chave `anon public` é segura para ficar no app (o banco é
> protegido pelas regras de segurança/RLS). **Nunca** compartilhe a `service_role`
> nem a senha do banco.

Assim que eu tiver esses dados, eu: conecto o app, crio as telas de **boas-vindas/login**,
**cadastro** (adulto e responsável de menor), **solicitação de acesso** e a **aprovação**
na área do professor — e testo o fluxo de ponta a ponta.

---

## O que o banco já contempla
- **profiles** — contas (professor / aluno adulto / responsável)
- **students** — ficha completa do aluno (dados, saúde, graduação, financeiro)
- **student_guardians** — vínculo responsável → filho(s) (menores)
- **graduations / evaluations / messages** — graduações, avaliações de treino e mensagens
- **checkins / payments** — frequência e histórico financeiro
- **announcements / events** — avisos e eventos/competições
- **access_requests** — pedidos de acesso para o professor aprovar
- **RLS** — cada um só vê o que pode: aluno vê o seu, responsável vê o do filho,
  professor vê a turma dele.
