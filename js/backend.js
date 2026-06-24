/* ============================================================
   LACUS · backend.js — camada de nuvem (Supabase)
   Exposto como window.LACUS_API. Se não houver config, fica desabilitado
   e o app roda em modo local (localStorage), como antes.
   ============================================================ */
window.LACUS_API = (function () {
  const cfg = window.LACUS_CONFIG || {};
  const hasCfg = !!(cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY);
  const enabled = hasCfg && !!(window.supabase && window.supabase.createClient);

  const sb = enabled ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
  }) : null;

  function need() { if (!enabled) throw new Error('Back-end não configurado'); }
  function unwrap({ data, error }) { if (error) throw error; return data; }

  /* ---------------- auth ---------------- */
  const auth = {
    async getUser() { if (!enabled) return null; const { data } = await sb.auth.getUser(); return data ? data.user : null; },
    async getSession() { if (!enabled) return null; const { data } = await sb.auth.getSession(); return data ? data.session : null; },
    onChange(cb) { if (!enabled) return; sb.auth.onAuthStateChange((_e, session) => cb(session)); },

    async signIn(email, password) {
      need();
      return unwrap(await sb.auth.signInWithPassword({ email: email.trim(), password }));
    },
    // role: 'aluno' | 'responsavel' | 'professor'
    async signUp(email, password, meta) {
      need();
      return unwrap(await sb.auth.signUp({
        email: email.trim(), password,
        options: { data: meta || {} },
      }));
    },
    async signOut() { if (enabled) await sb.auth.signOut(); },

    async profile() {
      need();
      const u = await auth.getUser(); if (!u) return null;
      let { data, error } = await sb.from('profiles').select('*').eq('id', u.id).maybeSingle();
      if (error) throw error;
      // fallback: se o gatilho não criou o profile, cria a partir dos metadados
      if (!data) {
        const m = u.user_metadata || {};
        const ins = await sb.from('profiles').insert({
          id: u.id, role: m.role || 'aluno', nome: m.nome || null, email: u.email, telefone: m.telefone || null,
        }).select('*').single();
        data = unwrap(ins);
      }
      return data;
    },
  };

  /* ---------------- students ---------------- */
  const students = {
    async listForProfessor() { need(); return unwrap(await sb.from('students').select('*').order('nome')); },
    async getMine() { need(); const u = await auth.getUser(); return unwrap(await sb.from('students').select('*').eq('account_id', u.id).order('created_at')); },
    async getForGuardian() {
      need();
      // alunos vinculados ao responsável (via student_guardians + RLS)
      const links = unwrap(await sb.from('student_guardians').select('student_id'));
      if (!links.length) return [];
      const ids = links.map(l => l.student_id);
      return unwrap(await sb.from('students').select('*').in('id', ids).order('nome'));
    },
    async get(id) { need(); return unwrap(await sb.from('students').select('*').eq('id', id).single()); },
    async create(payload) { need(); return unwrap(await sb.from('students').insert(payload).select('*').single()); },
    async update(id, patch) { need(); return unwrap(await sb.from('students').update(patch).eq('id', id).select('*').single()); },
  };

  const guardians = {
    async link(studentId, guardianAccountId, parentesco) {
      need();
      return unwrap(await sb.from('student_guardians').insert({ student_id: studentId, guardian_account_id: guardianAccountId, parentesco }).select('*').single());
    },
  };

  /* ---------------- treino: avaliações, mensagens, graduações, check-ins ---------------- */
  const evaluations = {
    async list(studentId) { need(); return unwrap(await sb.from('evaluations').select('*').eq('student_id', studentId).order('data', { ascending: false })); },
    async add(studentId, professorId, e) { need(); return unwrap(await sb.from('evaluations').insert({ student_id: studentId, professor_id: professorId, ...e }).select('*').single()); },
  };
  const messages = {
    async list(studentId) { need(); return unwrap(await sb.from('messages').select('*').eq('student_id', studentId).order('data', { ascending: false })); },
    async add(studentId, professorId, texto) { need(); return unwrap(await sb.from('messages').insert({ student_id: studentId, professor_id: professorId, texto }).select('*').single()); },
  };
  const graduations = {
    async add(studentId, professorId, belt, graus) { need(); return unwrap(await sb.from('graduations').insert({ student_id: studentId, professor_id: professorId, belt, graus }).select('*').single()); },
  };
  const checkins = {
    async list(studentId) { need(); return unwrap(await sb.from('checkins').select('*').eq('student_id', studentId).order('data', { ascending: false })); },
    async add(studentId, aula, hora) {
      need();
      const { data, error } = await sb.from('checkins').insert({ student_id: studentId, aula, hora }).select('*').single();
      if (error) { if (error.code === '23505') return null; throw error; } // já tem check-in hoje
      return data;
    },
  };
  const payments = {
    async list(studentId) { need(); return unwrap(await sb.from('payments').select('*').eq('student_id', studentId).order('created_at', { ascending: false })); },
  };

  /* ---------------- avisos & eventos ---------------- */
  const announcements = {
    async list() { need(); return unwrap(await sb.from('announcements').select('*').order('data', { ascending: false })); },
    async create(professorId, a) { need(); return unwrap(await sb.from('announcements').insert({ professor_id: professorId, ...a }).select('*').single()); },
    async update(id, patch) { need(); return unwrap(await sb.from('announcements').update(patch).eq('id', id).select('*').single()); },
    async remove(id) { need(); unwrap(await sb.from('announcements').delete().eq('id', id)); },
  };
  const events = {
    async list() { need(); return unwrap(await sb.from('events').select('*').order('data', { ascending: false })); },
    async create(professorId, e) { need(); return unwrap(await sb.from('events').insert({ professor_id: professorId, ...e }).select('*').single()); },
    async update(id, patch) { need(); return unwrap(await sb.from('events').update(patch).eq('id', id).select('*').single()); },
    async remove(id) { need(); unwrap(await sb.from('events').delete().eq('id', id)); },
  };

  /* ---------------- solicitações de acesso ---------------- */
  const requests = {
    async create(r) { need(); const u = await auth.getUser(); return unwrap(await sb.from('access_requests').insert({ requester_id: u ? u.id : null, ...r }).select('*').single()); },
    async listPending() { need(); return unwrap(await sb.from('access_requests').select('*').eq('status', 'pendente').order('created_at', { ascending: false })); },
    async setStatus(id, status) { need(); return unwrap(await sb.from('access_requests').update({ status }).eq('id', id).select('*').single()); },
  };

  return {
    enabled, sb, auth, students, guardians, evaluations, messages, graduations,
    checkins, payments, announcements, events, requests,
  };
})();
