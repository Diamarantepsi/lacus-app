/* ============================================================
   LACUS · store — estado do aluno persistido em localStorage
   ============================================================ */
window.LACUS_STORE = (function () {
  const KEY = 'lacus.v1';

  function todayISO(d) { d = d || new Date(); return d.toISOString().slice(0, 10); }

  // Gera um histórico de presença plausível para os últimos ~70 dias
  function seedCheckins() {
    const list = [];
    const names = ['Fundamentos', 'Gi Avançado', 'No-Gi', 'Open Mat', 'Drilling Matinal', 'Competição'];
    const today = new Date();
    for (let i = 1; i <= 175; i++) {           // ~6 meses de histórico
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dow = d.getDay();
      if (dow === 0) continue;                 // sem treino no domingo
      // ~55% de chance de ter treinado
      if (Math.random() < 0.45) continue;
      list.push({
        date: todayISO(d),
        aula: names[Math.floor(Math.random() * names.length)],
        hora: ['06:30', '07:00', '19:00', '20:30'][Math.floor(Math.random() * 4)],
      });
    }
    return list.sort((a, b) => (a.date < b.date ? 1 : -1));
  }

  const DEFAULT = {
    perfil: {
      nome: 'Atleta LACUS',
      belt: 'blue',
      graus: 2,
      academia: 'LACUS Jiu-Jitsu — Maceió/AL',
      desde: '2023',
      pesoKg: 78,
      metaMensal: 16,        // treinos/mês
    },
    checkins: null,          // preenchido no init
    tecnicas: {},            // id -> true (aprendida)
    financeiro: { status: 'em-dia', vence: '10/07' },
    metas: [
      { id: 'g1', nome: 'Treinos no mês', tipo: 'mes' },
      { id: 'g2', nome: 'Sequência (dias consecutivos)', tipo: 'streak', alvo: 10 },
      { id: 'g3', nome: 'Técnicas dominadas', tipo: 'tecnicas', alvo: 12 },
    ],
  };

  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (!s.checkins) s.checkins = seedCheckins();
        return s;
      }
    } catch (e) { /* ignore */ }
    const fresh = JSON.parse(JSON.stringify(DEFAULT));
    fresh.checkins = seedCheckins();
    // marca algumas técnicas como aprendidas para faixa azul
    ['t01', 't02', 't03', 't05', 't06', 't08', 't09', 't11'].forEach(id => fresh.tecnicas[id] = true);
    save(fresh);
    return fresh;
  }

  function save(s) {
    try { localStorage.setItem(KEY, JSON.stringify(s || state)); } catch (e) {}
  }

  /* ---- derived metrics ---- */
  function checkinsThisMonth() {
    const now = new Date(); const y = now.getFullYear(), m = now.getMonth();
    return state.checkins.filter(c => {
      const d = new Date(c.date + 'T00:00');
      return d.getFullYear() === y && d.getMonth() === m;
    }).length;
  }

  function totalCheckins() { return state.checkins.length; }

  function totalHoras() {
    // estimativa: média 75min por treino
    return Math.round(state.checkins.length * 1.25);
  }

  function streak() {
    if (!state.checkins.length) return 0;
    const set = new Set(state.checkins.map(c => c.date));
    let count = 0;
    let d = new Date();
    // se ainda não treinou hoje, começa a contar de ontem
    if (!set.has(todayISO(d))) d.setDate(d.getDate() - 1);
    while (true) {
      const iso = todayISO(d);
      if (set.has(iso)) { count++; d.setDate(d.getDate() - 1); continue; }
      if (d.getDay() === 0) { d.setDate(d.getDate() - 1); continue; } // pula domingos
      break;
    }
    return count;
  }

  function checkedToday() { return state.checkins.some(c => c.date === todayISO()); }

  function tecnicasAprendidas() { return Object.values(state.tecnicas).filter(Boolean).length; }

  // contagem por mês (últimos 6 meses) -> [{label, count}]
  function monthlyCounts() {
    const out = [];
    const now = new Date();
    const ML = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const cnt = state.checkins.filter(c => {
        const cd = new Date(c.date + 'T00:00');
        return cd.getFullYear() === d.getFullYear() && cd.getMonth() === d.getMonth();
      }).length;
      out.push({ label: ML[d.getMonth()], count: cnt });
    }
    return out;
  }

  /* ---- mutations ---- */
  function addCheckin(aula, hora) {
    if (checkedToday()) return false;
    state.checkins.unshift({ date: todayISO(), aula: aula || 'Treino livre', hora: hora || '' });
    save();
    return true;
  }
  function toggleTecnica(id) {
    state.tecnicas[id] = !state.tecnicas[id];
    save();
    return !!state.tecnicas[id];
  }
  function updatePerfil(patch) { Object.assign(state.perfil, patch); save(); }
  function reset() { localStorage.removeItem(KEY); state = load(); }

  return {
    get state() { return state; },
    todayISO,
    checkinsThisMonth, totalCheckins, totalHoras, streak, checkedToday,
    tecnicasAprendidas, monthlyCounts,
    addCheckin, toggleTecnica, updatePerfil, reset, save,
  };
})();
