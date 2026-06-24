/* ============================================================
   LACUS · app — router, views, interactions
   ============================================================ */
(function () {
  const D = window.LACUS_DATA;
  const S = window.LACUS_STORE;

  const view = document.getElementById('view');
  const tabbar = document.getElementById('tabbar');
  const toastEl = document.getElementById('toast');
  const modalRoot = document.getElementById('modal-root');

  const MAIN_ROUTES = ['inicio', 'agenda', 'checkin', 'evolucao', 'perfil'];
  const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const DIAS_LONG = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  /* ---------------- inline icons ---------------- */
  const I = {
    bell: '<path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    flame: '<path d="M12 2c1 4 4 5 4 9a4 4 0 0 1-8 0c0-2 1-3 1-3 1 2 2 2 2 2 .5-3-1-5 1-8z"/>',
    calendar: '<path d="M7 2v3M17 2v3M3 8h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    chart: '<path d="M3 21h18M6 21V9m5 12V4m5 17v-8"/>',
    book: '<path d="M4 4h12a2 2 0 0 1 2 2v14H6a2 2 0 0 1-2-2z"/><path d="M18 6h2v14H6"/>',
    trophy: '<path d="M8 3h8v4a4 4 0 0 1-8 0z"/><path d="M8 5H5v2a3 3 0 0 0 3 3M16 5h3v2a3 3 0 0 1-3 3M9 13h6M10 17h4M9 21h6"/>',
    mega: '<path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z"/><path d="M16 9a3 3 0 0 1 0 6"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    card: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5 15.4 17.5M15.4 6.5 8.6 10.5"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>',
    chevron: '<path d="m9 6 6 6-6 6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4-4"/>',
    star: '<path d="M12 3l2.5 5.5 6 .5-4.5 4 1.5 6L12 16l-5 3 1.5-6L4 9l6-.5z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.5v.5"/>',
    arrowLeft: '<path d="m15 18-6-6 6-6"/>',
    map: '<path d="M9 3 3 6v15l6-3 6 3 6-3V3l-6 3z"/><path d="M9 3v15M15 6v15"/>',
    dumbbell: '<path d="M6 6v12M3 9v6M18 6v12M21 9v6M6 12h12"/>',
    whistle: '<path d="M4 13a5 5 0 1 0 5-5h7l-2-3M14 8l5 2"/>',
    lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    users: '<circle cx="9" cy="8" r="3.2"/><path d="M2.8 20a6.2 6.2 0 0 1 12.4 0"/><path d="M16 5.2a3.2 3.2 0 0 1 0 6.1M21.2 20a6.2 6.2 0 0 0-4.2-5.4"/>',
    send: '<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/>',
    clipboard: '<rect x="7" y="4" width="10" height="17" rx="2"/><path d="M9 4h6v3H9z"/><path d="M9.5 11h5M9.5 15h3"/>',
    medal: '<circle cx="12" cy="14" r="6"/><path d="M8.5 9 6 3h4l2 4M15.5 9 18 3h-4l-2 4M12 12v4M10 14h4"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
  };
  const svg = (k, cls) => `<svg viewBox="0 0 24 24" ${cls ? `class="${cls}"` : ''} fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${I[k] || ''}</svg>`;

  /* ---------------- helpers ---------------- */
  const beltById = id => D.BELTS.find(b => b.id === id) || D.BELTS[0];
  const beltIndex = id => D.BELTS.findIndex(b => b.id === id);

  function greetingWord() {
    const h = new Date().getHours();
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
  }
  function fmtDateLong(d) {
    d = d || new Date();
    return `${DIAS_LONG[d.getDay()]}, ${d.getDate()} de ${['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'][d.getMonth()]}`;
  }
  function relDate(iso) {
    const today = S.todayISO();
    const y = new Date(); y.setDate(y.getDate() - 1);
    if (iso === today) return 'Hoje';
    if (iso === S.todayISO(y)) return 'Ontem';
    const d = new Date(iso + 'T00:00');
    return `${DIAS[d.getDay()]} ${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`;
  }

  function toast(msg, icon) {
    toastEl.innerHTML = `${svg(icon || 'check')}<span>${msg}</span>`;
    toastEl.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toastEl.classList.remove('show'), 2400);
  }

  function openModal(html) {
    modalRoot.innerHTML = `<div class="modal-back"><div class="modal"><div class="grip"></div>${html}</div></div>`;
    const back = modalRoot.firstElementChild;
    requestAnimationFrame(() => back.classList.add('show'));
    back.addEventListener('click', e => { if (e.target === back) closeModal(); });
    return back;
  }
  function closeModal() {
    const back = modalRoot.firstElementChild;
    if (!back) return;
    back.classList.remove('show');
    setTimeout(() => (modalRoot.innerHTML = ''), 280);
  }

  /* ---------------- belt visual (orientado a dados) ---------------- */
  function beltGradient(c) { return `linear-gradient(180deg, ${c} 0%, ${c} 52%, rgba(0,0,0,0.22) 100%)`; }
  function beltDot(b) {
    return `<span class="belt-dot" style="background:${b.color};box-shadow:inset 0 0 0 1px rgba(255,255,255,0.22)"></span>`;
  }
  // Ponta vermelha só na faixa preta; faixas infantis têm barra central (branca/preta).
  function beltBar(beltId, graus) {
    const b = beltById(beltId);
    const isBlack = beltId === 'black';
    const stripes = Array.from({ length: graus }, () => '<i></i>').join('');
    const fill = `background:${beltGradient(b.color)}`;
    const mid = b.bar ? `<span class="belt-mid" style="background:${b.bar === 'white' ? '#f2efe9' : '#0c0c0c'}"></span>` : '';
    const tip = isBlack ? 'background:linear-gradient(180deg,#b3221b,#7e120c)' : '';
    return `
      <div class="belt-bar">
        <div class="belt-fill" style="${fill}">${mid}</div>
        <div class="belt-tip" style="${tip}">${stripes}</div>
        <div class="belt-end" style="${fill}">${mid}</div>
      </div>`;
  }

  /* ---------------- trilhas de graduação ---------------- */
  function ladderFor(beltId, categoria) {
    if (beltId === 'white') return categoria === 'kids' ? D.BELTS_KIDS : D.BELTS_ADULT;
    const inKids = D.BELTS_KIDS.some(b => b.id === beltId);
    const inAdult = D.BELTS_ADULT.some(b => b.id === beltId);
    if (inKids && !inAdult) return D.BELTS_KIDS;
    return D.BELTS_ADULT;
  }
  function deriveCategoria(beltId, fallback) {
    if (beltId === 'white') return fallback || 'adulto';
    return D.BELTS_KIDS.some(b => b.id === beltId) ? 'kids' : 'adulto';
  }
  function beltOptionsGrouped(sel) {
    const opt = b => `<option value="${b.id}" ${b.id === sel ? 'selected' : ''}>${b.nome}</option>`;
    return `<optgroup label="Adulto (16+)">${D.BELTS_ADULT.map(opt).join('')}</optgroup>
            <optgroup label="Infantojuvenil (4–15 anos)">${D.BELTS_KIDS.filter(b => b.id !== 'white').map(opt).join('')}</optgroup>`;
  }
  function grausOptions(beltId, sel) {
    const max = (beltById(beltId) || { graus: 4 }).graus;
    return Array.from({ length: max + 1 }, (_, i) => `<option value="${i}" ${i === sel ? 'selected' : ''}>${i} ${i === 1 ? 'grau' : 'graus'}</option>`).join('');
  }

  /* ================================================================
     VIEW: INÍCIO
     ================================================================ */
  function viewInicio() {
    const p = S.state.perfil;
    const b = beltById(p.belt);
    const mes = S.checkinsThisMonth();
    const seq = S.streak();
    const total = S.totalCheckins();
    const horas = S.totalHoras();
    const degProg = Math.round(((total % 60) / 60) * 100);
    const pills = Array.from({ length: b.graus }, (_, i) => `<i class="${i < p.graus ? 'on' : ''}"></i>`).join('');
    const next = nextClass();

    return `
    <div class="stagger">
      <div class="topbar">
        <div class="brand">
          ${logoSVG(40)}
          <div>
            <div class="wordmark"><b>LA</b>CUS</div>
            <div class="sub">Jiu-Jitsu · Maceió</div>
          </div>
        </div>
        <button class="icon-btn" data-go="avisos" aria-label="Avisos">${svg('bell')}<span class="dot"></span></button>
      </div>

      <div class="greeting">
        <div class="hi">${greetingWord()}, <b>${firstName(p.nome)}</b></div>
        <div class="date">${fmtDateLong()}</div>
      </div>

      <div class="card belt-card">
        <div class="belt-top">
          <div class="belt-name-wrap">
            <div class="label">Sua graduação</div>
            <div class="belt-name">${b.nome}</div>
          </div>
          <div class="degree-pills">${pills}</div>
        </div>
        ${beltBar(p.belt, p.graus)}
        <div class="belt-progress">
          <div class="pr-top">
            <span class="lbl">Progresso rumo ao ${p.graus >= b.graus ? 'próximo nível' : (p.graus + 1) + 'º grau'}</span>
            <span class="val">${degProg}%</span>
          </div>
          <div class="bar gold"><span style="width:${degProg}%"></span></div>
        </div>
      </div>

      <div class="stat-grid">
        ${stat('flame', 'green', seq, 'Sequência', seq === 1 ? 'dia' : 'dias')}
        ${stat('calendar', 'teal', mes, 'Treinos no mês', '/ ' + p.metaMensal)}
        ${stat('dumbbell', 'gold', total, 'Total de treinos')}
        ${stat('clock', 'purple', horas, 'Horas no tatame', 'h')}
      </div>

      <div class="card" style="margin-top:14px">
        <div class="card-head">
          <span class="section-title">Próxima aula</span>
          <button class="see-all" data-go="agenda">Ver agenda</button>
        </div>
        ${next ? `
        <div class="nextclass">
          <div class="time"><div class="h">${next.hora}</div><div class="m">${next.quando}</div></div>
          <div class="sep"></div>
          <div class="info">
            <div class="t">${next.nome}</div>
            <div class="d">${[next.nivel, next.prof, next.dur].filter(Boolean).join(' · ')}</div>
          </div>
          <span class="tag ${next.tipo}">${tipoLabel(next.tipo)}</span>
        </div>` : `<div class="muted">Sem aulas próximas cadastradas.</div>`}
      </div>

      <div class="divider-label"><span class="section-title">Atalhos</span></div>
      <div class="qa-grid">
        <button class="qa" data-go="tecnicas"><span class="qi">${svg('book')}</span><span>Técnicas</span></button>
        <button class="qa" data-go="avisos"><span class="qi">${svg('mega')}</span><span>Avisos</span></button>
        <button class="qa" data-go="eventos"><span class="qi">${svg('trophy')}</span><span>Eventos</span></button>
        <button class="qa" data-go="evolucao"><span class="qi">${svg('chart')}</span><span>Evolução</span></button>
      </div>

      <div class="spacer"></div>
      <button class="btn btn--green btn--block" data-go="checkin">${svg('check')} Fazer check-in de hoje</button>
    </div>`;
  }

  function stat(icon, color, val, key, suffix) {
    return `<div class="stat">
      <div class="ic ${color}">${svg(icon)}</div>
      <div class="v">${val}${suffix ? ` <small>${suffix}</small>` : ''}</div>
      <div class="k">${key}</div>
    </div>`;
  }

  /* ================================================================
     VIEW: AGENDA
     ================================================================ */
  let agendaDay = new Date().getDay();
  function viewAgenda() {
    const days = [];
    const today = new Date().getDay();
    for (let i = 0; i < 7; i++) {
      const dow = (today + i) % 7;
      const d = new Date(); d.setDate(d.getDate() + i);
      days.push({ dow, dnum: d.getDate(), isToday: i === 0 });
    }
    const chips = days.map(x => `
      <button class="day-chip ${x.dow === agendaDay ? 'active' : ''} ${x.isToday ? 'today' : ''}" data-day="${x.dow}">
        <div class="dn">${DIAS[x.dow]}</div>
        <div class="dd">${x.dnum}</div>
      </button>`).join('');

    const aulas = D.SCHEDULE.filter(s => s.dia === agendaDay).sort((a, b) => a.hora.localeCompare(b.hora));
    const rows = aulas.length ? aulas.map(a => classRow(a)).join('') : emptyState('Sem aulas neste dia', 'Aproveite para descansar e recuperar.');

    return `
    <div class="phead">
      <span class="eyebrow">Programação semanal</span>
      <h1 class="page-title">Agenda</h1>
      <p>${aulas.length} ${aulas.length === 1 ? 'aula' : 'aulas'} · ${DIAS_LONG[agendaDay]}</p>
    </div>
    <div class="day-strip">${chips}</div>
    <div class="stagger" id="agenda-list">${rows}</div>`;
  }
  function classRow(a) {
    const colors = { fund: 'var(--teal)', pro: 'var(--gold)', open: 'var(--green)', fem: '#f06ba8' };
    const meta = [a.nivel, a.prof].filter(Boolean).join(' · ');
    return `
    <div class="class-row" data-class='${JSON.stringify({nome:a.nome,hora:a.hora}).replace(/'/g,"&#39;")}'>
      <span class="accent" style="background:${colors[a.tipo] || 'var(--teal)'}"></span>
      <div class="ctime"><div class="h">${a.hora}</div>${a.dur ? `<div class="dur">${a.dur}</div>` : ''}</div>
      <div class="cinfo">
        <div class="nm">${a.nome}</div>
        <div class="meta"><span>${meta}</span></div>
      </div>
      <span class="tag ${a.tipo}">${tipoLabel(a.tipo)}</span>
    </div>`;
  }

  /* ================================================================
     VIEW: CHECK-IN
     ================================================================ */
  function viewCheckin() {
    const mes = S.checkinsThisMonth();
    const meta = S.state.perfil.metaMensal;
    const pct = Math.min(100, Math.round((mes / meta) * 100));
    const C = 2 * Math.PI * 78; // r=78
    const off = C * (1 - pct / 100);
    const done = S.checkedToday();

    return `
    <div class="phead">
      <span class="eyebrow">Frequência</span>
      <h1 class="page-title">Check-in</h1>
    </div>

    <div class="stagger">
      <div class="card">
        <div class="checkin-hero">
          <div class="checkin-ring">
            <svg class="ring" viewBox="0 0 180 180">
              <defs><linearGradient id="cg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#25d366"/><stop offset="1" stop-color="#6fd5e7"/>
              </linearGradient></defs>
              <circle class="ring-bg" cx="90" cy="90" r="78"/>
              <circle class="ring-fg" cx="90" cy="90" r="78" stroke-dasharray="${C}" stroke-dashoffset="${off}"/>
            </svg>
            <div class="rc"><div class="big">${mes}</div><div class="small">de ${meta} no mês</div></div>
          </div>
        </div>
        <button class="bigcheck ${done ? 'done' : ''}" id="bigcheck">
          ${svg('check')} ${done ? 'Treino de hoje registrado' : 'Registrar treino de hoje'}
        </button>
      </div>

      <div class="card">
        <div class="card-head"><span class="section-title">Este mês</span></div>
        ${heatmap()}
        <div class="heat-legend">menos
          <i style="background:rgba(255,255,255,0.04)"></i>
          <i style="background:rgba(37,211,102,0.22)"></i>
          <i style="background:rgba(37,211,102,0.45)"></i>
          <i style="background:rgba(37,211,102,0.75)"></i> mais
        </div>
      </div>

      <div class="card">
        <div class="card-head"><span class="section-title">Últimos check-ins</span></div>
        ${recentLog()}
      </div>
    </div>`;
  }

  function heatmap() {
    const now = new Date();
    const y = now.getFullYear(), m = now.getMonth();
    const days = new Date(y, m + 1, 0).getDate();
    const first = new Date(y, m, 1).getDay();
    const set = {};
    S.state.checkins.forEach(c => {
      const d = new Date(c.date + 'T00:00');
      if (d.getFullYear() === y && d.getMonth() === m) set[d.getDate()] = (set[d.getDate()] || 0) + 1;
    });
    let cells = '';
    for (let i = 0; i < first; i++) cells += `<div class="hd" style="visibility:hidden"></div>`;
    for (let day = 1; day <= days; day++) {
      const n = set[day] || 0;
      const lvl = n >= 2 ? 'l3' : n === 1 ? 'l2' : 0;
      const isToday = day === now.getDate();
      cells += `<div class="hd ${lvl || ''} ${isToday ? 'today' : ''}">${day}</div>`;
    }
    return `<div class="heat">${cells}</div>`;
  }

  function recentLog() {
    const items = S.state.checkins.slice(0, 6);
    if (!items.length) return emptyState('Nenhum check-in ainda', 'Registre seu primeiro treino!');
    return items.map(c => `
      <div class="log-row">
        <div class="ld">${svg('check')}</div>
        <div class="li"><div class="t">${c.aula}</div><div class="d">${relDate(c.date)}${c.hora ? ' · ' + c.hora : ''}</div></div>
        <div class="lx">${svg('flame')}</div>
      </div>`).join('');
  }

  /* ================================================================
     VIEW: EVOLUÇÃO
     ================================================================ */
  function viewEvolucao() {
    const p = S.state.perfil;
    const categoria = p.categoria || deriveCategoria(p.belt, 'adulto');
    const ladder = ladderFor(p.belt, categoria);
    const curIdx = ladder.findIndex(b => b.id === p.belt);
    const counts = S.monthlyCounts();
    const maxC = Math.max(1, ...counts.map(c => c.count));

    const journey = ladder.map((b, idx) => {
      let stateCls = 'upcoming';
      if (idx < curIdx) stateCls = 'done';
      else if (idx === curIdx) stateCls = 'current';
      const badge = idx === curIdx
        ? `<span class="badge cur">Atual · ${p.graus} ${p.graus === 1 ? 'grau' : 'graus'}</span>`
        : idx < curIdx ? `<span class="badge dn">Conquistada</span>`
        : `<span class="jidade">${b.idade}</span>`;
      return `
      <div class="jstep ${stateCls}">
        <div class="rail"><div class="node" style="${idx < curIdx ? `background:${b.color};border-color:${b.color}` : ''}"></div><div class="line"></div></div>
        <div class="jbody">
          <div class="bn">${b.short || b.nome.replace('Faixa ', '')}</div>
          <div class="bd">${beltDesc(b.id)}</div>
          ${badge}
        </div>
      </div>`;
    }).join('');
    const trilhaLabel = categoria === 'kids' ? 'Trilha infantojuvenil' : 'Trilha adulta';

    const chart = counts.map(c => {
      const h = Math.round((c.count / maxC) * 100);
      const peak = c.count === maxC && c.count > 0;
      return `<div class="col ${peak ? 'peak' : ''}">
        <div class="cnt">${c.count}</div>
        <div class="bar-v" style="height:${Math.max(4,h)}%"></div>
        <div class="lab">${c.label}</div>
      </div>`;
    }).join('');

    const goals = renderGoals();

    // Feedback do professor (mensagens no caminho das faixas + avaliações de treino)
    const fb = S.feedbackForMe();
    const msgs = (fb.mensagens || []).slice(0, 4);
    const avs = (fb.avaliacoes || []).slice(0, 4);
    const msgCard = msgs.length ? `
      <div class="card">
        <div class="card-head"><span class="section-title">Mensagens do professor</span></div>
        ${msgs.map(m => `
          <div class="coach-msg">
            <div class="cm-top"><span class="cm-from">${svg('whistle')} Professor</span><span class="nd">${relDate(m.date)}</span></div>
            <div class="cm-body">${m.texto}</div>
          </div>`).join('')}
      </div>` : '';
    const avCard = avs.length ? `
      <div class="card">
        <div class="card-head"><span class="section-title">Avaliações de treino</span></div>
        ${avs.map(a => `
          <div class="coach-eval">
            <div class="ce-top"><span class="ce-aula">${a.aula || 'Treino'}</span><span class="nd">${relDate(a.date)}</span></div>
            ${a.execucao ? `<div class="ce-line"><b>Execução:</b> ${a.execucao}</div>` : ''}
            ${a.posicoes ? `<div class="ce-line"><b>Posições:</b> ${a.posicoes}</div>` : ''}
            ${a.destaques ? `<div class="ce-line"><b>Destaques:</b> ${a.destaques}</div>` : ''}
            ${a.melhorar ? `<div class="ce-line"><b>A desenvolver:</b> ${a.melhorar}</div>` : ''}
          </div>`).join('')}
      </div>` : '';

    return `
    <div class="phead">
      <span class="eyebrow">Sua jornada</span>
      <h1 class="page-title">Evolução</h1>
    </div>

    <div class="stagger">
      <div class="card">
        <div class="card-head"><span class="section-title">Frequência · 6 meses</span></div>
        <div class="chart">${chart}</div>
      </div>

      <div class="card">
        <div class="card-head"><span class="section-title">Metas</span></div>
        ${goals}
      </div>

      ${msgCard}
      ${avCard}

      <div class="card">
        <div class="card-head"><span class="section-title">Caminho das faixas</span><span class="see-all">${trilhaLabel}</span></div>
        <div class="journey">${journey}</div>
      </div>
    </div>`;
  }

  function renderGoals() {
    const p = S.state.perfil;
    const mes = S.checkinsThisMonth();
    const seq = S.streak();
    const tec = S.tecnicasAprendidas();
    const rows = [
      { nome: 'Treinos no mês', cur: mes, alvo: p.metaMensal },
      { nome: 'Sequência (dias)', cur: seq, alvo: 10 },
      { nome: 'Técnicas dominadas', cur: tec, alvo: 12 },
    ];
    return rows.map(g => {
      const pct = Math.min(100, Math.round((g.cur / g.alvo) * 100));
      const met = g.cur >= g.alvo;
      return `<div class="goal">
        <div class="gh"><span class="gt">${g.nome}</span><span class="gv ${met ? 'met' : ''}">${g.cur} / ${g.alvo}${met ? ' ✓' : ''}</span></div>
        <div class="bar ${met ? '' : 'gold'}"><span style="width:${pct}%"></span></div>
      </div>`;
    }).join('');
  }

  /* ================================================================
     VIEW: TÉCNICAS
     ================================================================ */
  let techFilter = 'Todas';
  let techQuery = '';
  function viewTecnicas() {
    return `
    ${subHeader('Currículo', 'Técnicas', `${S.tecnicasAprendidas()} de ${D.TECNICAS.length} dominadas`)}
    <div class="search">
      ${svg('search')}
      <input id="tech-search" type="text" placeholder="Buscar técnica…" value="${techQuery}" />
    </div>
    <div class="filter-row">
      ${D.POSICOES.map(p => `<button class="fchip ${p === techFilter ? 'active' : ''}" data-filter="${p}">${p}</button>`).join('')}
    </div>
    <div id="tech-list" class="stagger">${renderTechList()}</div>`;
  }
  function renderTechList() {
    let list = D.TECNICAS.slice();
    if (techFilter !== 'Todas') list = list.filter(t => t.pos === techFilter);
    if (techQuery.trim()) {
      const q = techQuery.toLowerCase();
      list = list.filter(t => t.nome.toLowerCase().includes(q) || t.pos.toLowerCase().includes(q));
    }
    if (!list.length) return emptyState('Nada encontrado', 'Tente outra posição ou busca.');
    return list.map((t, i) => {
      const b = beltById(t.belt);
      const learned = !!S.state.tecnicas[t.id];
      return `
      <div class="tech ${learned ? 'learned' : ''}" data-tech="${t.id}">
        <div class="tnum">${String(i + 1).padStart(2, '0')}</div>
        <div class="tinfo">
          <div class="nm">${t.nome}</div>
          <div class="meta">${beltDot(b)}<span class="pos">${t.pos} · ${b.short || b.nome.replace('Faixa ','')}</span></div>
        </div>
        <div class="check">${svg('check')}</div>
      </div>`;
    }).join('');
  }

  /* ================================================================
     VIEW: PERFIL
     ================================================================ */
  function viewPerfil() {
    const p = S.state.perfil;
    const b = beltById(p.belt);
    const fin = S.state.financeiro;
    return `
    <div class="profile-hero stagger">
      <div class="avatar">${initials(p.nome)}<div class="belt-ring"></div></div>
      <div class="pn">${p.nome}</div>
      <div class="pm">${b.nome} · ${p.graus} ${p.graus === 1 ? 'grau' : 'graus'} · desde ${p.desde}</div>
    </div>

    <div class="spacer"></div>

    <div class="stat-grid stagger">
      ${stat('dumbbell', 'teal', S.totalCheckins(), 'Treinos totais')}
      ${stat('book', 'gold', S.tecnicasAprendidas(), 'Técnicas')}
    </div>

    <div class="divider-label"><span class="section-title">Conta</span></div>
    <div class="card list-card stagger">
      <button class="list-item" data-action="editar">
        <div class="lic">${svg('edit')}</div>
        <div class="lt"><div class="a">Editar perfil</div><div class="b">Nome, faixa, graus e metas</div></div>
        <span class="chev">${svg('chevron')}</span>
      </button>
      <button class="list-item" data-go="financeiro">
        <div class="lic">${svg('card')}</div>
        <div class="lt"><div class="a">Financeiro</div><div class="b">Mensalidade · vence ${fin.vence}</div></div>
        <span class="pill ${fin.status === 'em-dia' ? 'ok' : 'warn'}">${fin.status === 'em-dia' ? 'Em dia' : 'Pendente'}</span>
      </button>
      <button class="list-item" data-go="avisos">
        <div class="lic">${svg('mega')}</div>
        <div class="lt"><div class="a">Avisos da academia</div><div class="b">${D.AVISOS.length} novos</div></div>
        <span class="chev">${svg('chevron')}</span>
      </button>
      <button class="list-item" data-go="eventos">
        <div class="lic">${svg('trophy')}</div>
        <div class="lt"><div class="a">Eventos & competições</div><div class="b">${D.EVENTOS.length} próximos</div></div>
        <span class="chev">${svg('chevron')}</span>
      </button>
    </div>

    <div class="divider-label"><span class="section-title">Equipe</span></div>
    <div class="card list-card stagger">
      <button class="list-item" data-action="professor">
        <div class="lic" style="color:var(--gold2);background:rgba(232,160,32,0.10)">${svg('lock')}</div>
        <div class="lt"><div class="a">Área do Professor</div><div class="b">Acesso restrito · avaliar alunos e enviar feedback</div></div>
        <span class="chev">${svg('chevron')}</span>
      </button>
    </div>

    <div class="divider-label"><span class="section-title">App</span></div>
    <div class="card list-card stagger">
      <button class="list-item" data-action="compartilhar">
        <div class="lic">${svg('share')}</div>
        <div class="lt"><div class="a">Compartilhar app</div><div class="b">Envie o link para um amigo testar</div></div>
        <span class="chev">${svg('chevron')}</span>
      </button>
      <button class="list-item" data-action="reset">
        <div class="lic" style="color:var(--danger)">${svg('refresh')}</div>
        <div class="lt"><div class="a">Redefinir dados</div><div class="b">Voltar ao estado inicial</div></div>
        <span class="chev">${svg('chevron')}</span>
      </button>
    </div>

    <div class="empty stagger" style="padding-top:26px">
      ${logoSVG(34)}
      <div style="font-family:var(--fm);font-size:10px;letter-spacing:.2em;text-transform:uppercase;margin-top:10px;color:var(--faint)">LACUS Jiu-Jitsu · v1.0</div>
      <div style="font-size:11px;margin-top:4px">Domine a arte. Modele o caráter.</div>
    </div>`;
  }

  /* ================================================================
     SUB-VIEWS: avisos / eventos / financeiro
     ================================================================ */
  function viewAvisos() {
    return `
    ${subHeader('Comunicados', 'Avisos', 'Direto da recepção LACUS')}
    <div class="card stagger">
      ${D.AVISOS.map(noticeRow).join('')}
    </div>`;
  }
  function viewEventos() {
    return `
    ${subHeader('Calendário', 'Eventos', 'Competições e seminários')}
    <div class="card stagger">
      ${D.EVENTOS.map(noticeRow).join('')}
    </div>`;
  }
  function noticeRow(n) {
    const isEvt = n.tipo === 'evento';
    return `<div class="notice">
      <div class="nh"><span class="nt ${isEvt ? 'evt' : ''}">${isEvt ? 'Evento' : 'Aviso'}</span><span class="nd">${n.data}</span></div>
      <div class="ntitle">${n.titulo}</div>
      <div class="nbody">${n.texto}</div>
    </div>`;
  }
  function viewFinanceiro() {
    const fin = S.state.financeiro;
    const ok = fin.status === 'em-dia';
    return `
    ${subHeader('Mensalidade', 'Financeiro', '')}
    <div class="card stagger">
      <div class="card-head"><span class="section-title">Situação atual</span>
        <span class="pill ${ok ? 'ok' : 'warn'}">${ok ? 'Em dia' : 'Pendente'}</span></div>
      <div class="nextclass">
        <div class="time"><div class="h" style="color:${ok ? 'var(--green)' : 'var(--gold2)'}">${fin.vence}</div><div class="m">Vencimento</div></div>
        <div class="sep"></div>
        <div class="info">
          <div class="t">Plano mensal ilimitado</div>
          <div class="d">${ok ? 'Pagamento confirmado este mês' : 'Aguardando pagamento'}</div>
        </div>
      </div>
    </div>
    <div class="spacer"></div>
    <button class="btn btn--ghost btn--block" data-action="info-pagamento">${svg('info')} Como pagar</button>`;
  }

  /* ================================================================
     ÁREA DO PROFESSOR (restrita por PIN)
     ================================================================ */
  let selectedAluno = null;

  function viewProf() {
    const alunos = S.getAlunos();
    return `
    <div class="prof-top">
      <span class="prof-badge">${svg('lock')} Modo Professor</span>
      <button class="icon-btn" data-action="prof-exit" aria-label="Sair do modo professor">${svg('x')}</button>
    </div>
    <div class="phead">
      <span class="eyebrow">Turma LACUS</span>
      <h1 class="page-title">Alunos</h1>
      <p>${alunos.length} ${alunos.length === 1 ? 'aluno' : 'alunos'} · toque para avaliar</p>
    </div>
    <button class="btn btn--gold btn--block" data-action="add-aluno">${svg('plus')} Adicionar aluno</button>
    <div class="spacer"></div>
    <div class="stagger">${alunos.map(profAlunoRow).join('')}</div>`;
  }

  function profAlunoRow(a) {
    const b = beltById(a.belt);
    const last = (a.avaliacoes && a.avaliacoes[0]);
    const lastTxt = last ? ('Última avaliação · ' + relDate(last.date)) : 'Sem avaliações ainda';
    const nMsg = (a.mensagens || []).length;
    const isMe = a.id === 'me';
    return `
    <button class="prof-row" data-aluno="${a.id}">
      <div class="prow-av">${initials(a.nome)}</div>
      <div class="prow-info">
        <div class="nm">${a.nome}${isMe ? ' <span class="me-chip">você</span>' : ''}</div>
        <div class="meta">${beltDot(b)}${b.short || b.nome.replace('Faixa ', '')} · ${a.graus} ${a.graus === 1 ? 'grau' : 'graus'}</div>
        <div class="last">${lastTxt}${nMsg ? ' · ' + nMsg + ' msg' : ''}</div>
      </div>
      <span class="chev">${svg('chevron')}</span>
    </button>`;
  }

  function viewProfAluno() {
    const a = S.getAluno(selectedAluno);
    if (!a) return viewProf();
    const b = beltById(a.belt);
    const items = []
      .concat((a.avaliacoes || []).map(x => Object.assign({ _t: 'av' }, x)))
      .concat((a.mensagens || []).map(x => Object.assign({ _t: 'msg' }, x)))
      .sort((x, y) => (x.date < y.date ? 1 : -1));
    const timeline = items.length ? items.map(profTimelineItem).join('')
      : emptyState('Sem registros ainda', 'Avalie o treino ou envie uma mensagem.');
    return `
    <div class="prof-top">
      <button class="icon-btn" data-back-prof="1" aria-label="Voltar">${svg('arrowLeft')}</button>
      <span class="prof-badge">${svg('lock')} Modo Professor</span>
      <span style="width:42px"></span>
    </div>
    <div class="prof-aluno-hero">
      <div class="avatar" style="width:74px;height:74px;font-size:28px">${initials(a.nome)}</div>
      <div class="pn">${a.nome}</div>
      <div class="pm">${b.nome} · ${a.graus} ${a.graus === 1 ? 'grau' : 'graus'}</div>
    </div>
    <div style="margin:18px 0 16px">${beltBar(a.belt, a.graus)}</div>
    <div class="prof-actions">
      <button class="btn btn--teal" data-action="nova-avaliacao">${svg('clipboard')} Avaliar treino</button>
      <button class="btn btn--ghost" data-action="nova-mensagem">${svg('send')} Mensagem</button>
    </div>
    <button class="btn btn--gold btn--block" style="margin-top:10px" data-action="promover">${svg('medal')} Graduar / dar grau</button>
    <div class="divider-label"><span class="section-title">Histórico de treinos</span></div>
    <div class="stagger">${timeline}</div>`;
  }

  function profTimelineItem(it) {
    if (it._t === 'msg') {
      return `<div class="card msg-card">
        <div class="ce-top"><span class="nt-msg">${svg('send')} Mensagem · caminho das faixas</span><span class="nd">${relDate(it.date)}</span></div>
        <div class="cm-body">${it.texto}</div>
      </div>`;
    }
    return `<div class="card av-card">
      <div class="ce-top"><span class="nt-av">${svg('clipboard')} ${it.aula || 'Treino'}</span><span class="nd">${relDate(it.date)}</span></div>
      ${avField('Execução dos golpes', it.execucao)}
      ${avField('Posições / transições', it.posicoes)}
      ${avField('Destaques do dia', it.destaques)}
      ${avField('Pontos a desenvolver', it.melhorar)}
    </div>`;
  }
  function avField(label, val) {
    if (!val) return '';
    return `<div class="av-field"><div class="avl">${label}</div><div class="avv">${val}</div></div>`;
  }

  /* ---------------- shared bits ---------------- */
  function subHeader(eyebrow, title, sub) {
    return `
    <div class="topbar">
      <button class="icon-btn" data-back="1" aria-label="Voltar">${svg('arrowLeft')}</button>
    </div>
    <div class="phead">
      <span class="eyebrow">${eyebrow}</span>
      <h1 class="page-title">${title}</h1>
      ${sub ? `<p>${sub}</p>` : ''}
    </div>`;
  }
  function emptyState(t, s) {
    return `<div class="empty">${svg('info')}<div style="font-family:var(--fh);font-size:16px;color:var(--txt)">${t}</div><div style="font-size:12px;margin-top:4px">${s}</div></div>`;
  }
  function tipoLabel(t) { return { fund: 'Fund.', pro: 'Pro', open: 'Aberta', fem: 'Feminino' }[t] || t; }
  function beltDesc(id) {
    const map = {
      white: 'A base: sobrevivência, fugas e fundamentos.',
      blue: 'Repertório técnico em expansão. Defesa sólida.',
      purple: 'Jogo pessoal, criatividade e transições.',
      brown: 'Refinamento, pressão e tempo de jogo.',
      black: 'Maestria. A arte vira instinto.',
    };
    if (map[id]) return map[id];
    if (id.indexOf('gray') === 0) return 'Faixa cinza — coordenação, disciplina e os primeiros fundamentos.';
    if (id.indexOf('yellow') === 0) return 'Faixa amarela — técnica, controle postural e autoconfiança.';
    if (id.indexOf('orange') === 0) return 'Faixa laranja — repertório, tática e leitura de jogo.';
    if (id.indexOf('green') === 0) return 'Faixa verde — base avançada e preparação para o adulto.';
    return '';
  }
  function firstName(n) { return (n || '').trim().split(' ')[0] || 'Atleta'; }
  function initials(n) {
    const parts = (n || '').trim().split(' ').filter(Boolean);
    if (!parts.length) return 'A';
    return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
  }

  function nextClass() {
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const toMin = h => parseInt(h.slice(0, 2)) * 60 + parseInt(h.slice(3));
    for (let off = 0; off < 7; off++) {
      const dow = (now.getDay() + off) % 7;
      let aulas = D.SCHEDULE.filter(s => s.dia === dow).sort((a, b) => a.hora.localeCompare(b.hora));
      if (off === 0) aulas = aulas.filter(a => toMin(a.hora) > nowMin);
      if (aulas.length) {
        const a = aulas[0];
        return Object.assign({}, a, { quando: off === 0 ? 'Hoje' : off === 1 ? 'Amanhã' : DIAS[dow] });
      }
    }
    return null;
  }

  /* ---------------- logo ---------------- */
  function logoSVG(size) {
    return `<svg class="logo" width="${size}" height="${size}" viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="lg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6fd5e7"/><stop offset="1" stop-color="#3bb4c8"/></linearGradient>
        <linearGradient id="lg2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f5c050"/><stop offset="1" stop-color="#e8a020"/></linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" stroke="url(#lg1)" stroke-width="3"/>
      <circle cx="50" cy="50" r="38" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
      <path d="M37 28 v44 h28" stroke="url(#lg1)" stroke-width="7" stroke-linecap="square" fill="none"/>
      <path d="M37 28 v44 h28" stroke="url(#lg2)" stroke-width="2.5" stroke-linecap="square" fill="none" transform="translate(2,-2)" opacity="0.9"/>
      <circle cx="50" cy="50" r="46" stroke="url(#lg2)" stroke-width="1" opacity="0.5" stroke-dasharray="3 6"/>
    </svg>`;
  }

  /* ================================================================
     INTERACTIONS (event delegation on #view)
     ================================================================ */
  view.addEventListener('click', e => {
    const go = e.target.closest('[data-go]');
    if (go) { navigate(go.dataset.go); return; }
    const back = e.target.closest('[data-back]');
    if (back) { history.length > 1 ? navigate(lastMain) : navigate('inicio'); return; }

    // agenda day chips
    const day = e.target.closest('[data-day]');
    if (day) { agendaDay = parseInt(day.dataset.day); render('agenda'); return; }

    // class row -> quick checkin
    const cr = e.target.closest('[data-class]');
    if (cr) { const c = JSON.parse(cr.dataset.class.replace(/&#39;/g, "'")); promptCheckin(c.nome, c.hora); return; }

    // professor: abrir aluno
    const al = e.target.closest('[data-aluno]');
    if (al) { selectedAluno = al.dataset.aluno; navigate('prof-aluno'); return; }
    const bp = e.target.closest('[data-back-prof]');
    if (bp) { navigate('prof'); return; }

    // big check-in
    if (e.target.closest('#bigcheck')) { openCheckinModal(); return; }

    // technique toggle
    const tech = e.target.closest('[data-tech]');
    if (tech) {
      const id = tech.dataset.tech;
      const learned = S.toggleTecnica(id);
      tech.classList.toggle('learned', learned);
      if (learned) toast('Técnica dominada! 🥋', 'check');
      return;
    }

    // tech filters
    const filter = e.target.closest('[data-filter]');
    if (filter) {
      techFilter = filter.dataset.filter;
      document.querySelectorAll('.fchip').forEach(c => c.classList.toggle('active', c.dataset.filter === techFilter));
      document.getElementById('tech-list').innerHTML = renderTechList();
      return;
    }

    // profile actions
    const act = e.target.closest('[data-action]');
    if (act) { handleAction(act.dataset.action); return; }
  });

  view.addEventListener('input', e => {
    if (e.target.id === 'tech-search') {
      techQuery = e.target.value;
      document.getElementById('tech-list').innerHTML = renderTechList();
    }
  });

  function handleAction(a) {
    if (a === 'editar') return openEditModal();
    if (a === 'reset') return openResetModal();
    if (a === 'compartilhar') return shareApp();
    if (a === 'info-pagamento') return toast('Procure a recepção ou o PIX da academia', 'info');
    // professor
    if (a === 'professor') return openProfessorGate();
    if (a === 'prof-exit') { professorUnlocked = false; navigate('perfil'); return; }
    if (a === 'add-aluno') return openAddAlunoModal();
    if (a === 'nova-avaliacao') return openAvaliacaoModal();
    if (a === 'nova-mensagem') return openMensagemModal();
    if (a === 'promover') return openPromoverModal();
  }

  /* ---- check-in flows ---- */
  function openCheckinModal() {
    if (S.checkedToday()) { toast('Você já registrou hoje 💪', 'check'); return; }
    const today = new Date().getDay();
    const aulas = D.SCHEDULE.filter(s => s.dia === today);
    const opts = aulas.map(a => `
      <button class="opt" data-pick='${JSON.stringify({n:a.nome,h:a.hora}).replace(/'/g,"&#39;")}'>
        <div class="oi" style="background:rgba(37,211,102,0.12);color:var(--green)">${svg('check')}</div>
        <div class="ot"><div class="a">${a.nome}</div><div class="b">${[a.hora, a.nivel, a.prof].filter(Boolean).join(' · ')}</div></div>
      </button>`).join('') || `<button class="opt" data-pick='{"n":"Treino livre","h":""}'>
        <div class="oi" style="background:rgba(37,211,102,0.12);color:var(--green)">${svg('check')}</div>
        <div class="ot"><div class="a">Treino livre</div><div class="b">Registrar presença</div></div></button>`;
    const back = openModal(`
      <h3>Check-in de hoje</h3>
      <div class="msub">Qual aula você treinou?</div>
      <div class="opt-row">${opts}
        <button class="opt" data-pick='{"n":"Treino livre","h":""}'>
          <div class="oi" style="background:rgba(111,213,231,0.12);color:var(--teal)">${svg('dumbbell')}</div>
          <div class="ot"><div class="a">Outro / treino livre</div><div class="b">Open mat, particular…</div></div>
        </button>
      </div>`);
    back.querySelectorAll('[data-pick]').forEach(btn => btn.addEventListener('click', () => {
      const p = JSON.parse(btn.dataset.pick.replace(/&#39;/g, "'"));
      doCheckin(p.n, p.h);
    }));
  }
  function promptCheckin(nome, hora) {
    if (S.checkedToday()) { toast('Você já registrou hoje 💪', 'check'); return; }
    const back = openModal(`
      <h3>Registrar presença</h3>
      <div class="msub">${nome} · ${hora}</div>
      <button class="btn btn--green btn--block" id="confirm-ck">${svg('check')} Confirmar check-in</button>
      <div class="spacer"></div>
      <button class="btn btn--ghost btn--block" id="cancel-ck">Cancelar</button>`);
    back.querySelector('#confirm-ck').addEventListener('click', () => doCheckin(nome, hora));
    back.querySelector('#cancel-ck').addEventListener('click', closeModal);
  }
  function doCheckin(nome, hora) {
    S.addCheckin(nome, hora);
    closeModal();
    toast('Check-in registrado! 🔥 Bom treino!', 'check');
    if (currentRoute === 'checkin' || currentRoute === 'inicio') render(currentRoute);
  }

  /* ---- edit profile ---- */
  function openEditModal() {
    const p = S.state.perfil;
    const cat = p.categoria || deriveCategoria(p.belt, 'adulto');
    const back = openModal(`
      <h3>Editar perfil</h3>
      <div class="msub">Personalize seus dados</div>
      <div class="field"><label>Nome</label><input id="f-nome" type="text" value="${p.nome}" maxlength="40" /></div>
      <div class="field"><label>Categoria</label><select id="f-cat">
        <option value="adulto" ${cat === 'adulto' ? 'selected' : ''}>Adulto (16+)</option>
        <option value="kids" ${cat === 'kids' ? 'selected' : ''}>Infantojuvenil (4–15 anos)</option>
      </select></div>
      <div class="field"><label>Faixa</label><select id="f-belt">${beltOptionsGrouped(p.belt)}</select></div>
      <div class="field"><label>Graus</label><select id="f-graus">${grausOptions(p.belt, p.graus)}</select></div>
      <div class="field"><label>Meta de treinos / mês</label><input id="f-meta" type="number" min="1" max="40" value="${p.metaMensal}" /></div>
      <button class="btn btn--teal btn--block" id="f-save">${svg('check')} Salvar</button>`);
    // ao trocar a faixa, atualiza as opções de grau e a categoria
    back.querySelector('#f-belt').addEventListener('change', e => {
      const id = e.target.value;
      back.querySelector('#f-graus').innerHTML = grausOptions(id, 0);
      if (id !== 'white') back.querySelector('#f-cat').value = deriveCategoria(id);
    });
    back.querySelector('#f-save').addEventListener('click', () => {
      const belt = back.querySelector('#f-belt').value;
      S.updatePerfil({
        nome: back.querySelector('#f-nome').value.trim() || 'Atleta LACUS',
        categoria: deriveCategoria(belt, back.querySelector('#f-cat').value),
        belt: belt,
        graus: parseInt(back.querySelector('#f-graus').value) || 0,
        metaMensal: Math.max(1, parseInt(back.querySelector('#f-meta').value) || 16),
      });
      closeModal();
      toast('Perfil atualizado ✓', 'check');
      render('perfil');
    });
  }
  function openResetModal() {
    const back = openModal(`
      <h3>Redefinir dados</h3>
      <div class="msub">Isso apaga seus check-ins, técnicas e perfil deste dispositivo. Não dá para desfazer.</div>
      <button class="btn btn--ghost btn--block" id="r-yes" style="color:var(--danger);border-color:rgba(226,87,76,.4)">${svg('refresh')} Sim, redefinir</button>
      <div class="spacer"></div>
      <button class="btn btn--teal btn--block" id="r-no">Manter meus dados</button>`);
    back.querySelector('#r-yes').addEventListener('click', () => { S.reset(); closeModal(); toast('Dados redefinidos', 'refresh'); navigate('inicio'); });
    back.querySelector('#r-no').addEventListener('click', closeModal);
  }
  async function shareApp() {
    const url = location.href.split('#')[0];
    const data = { title: 'LACUS Jiu-Jitsu', text: 'Acompanhe sua evolução no Jiu-Jitsu com o app da LACUS 🥋', url };
    if (navigator.share) {
      try { await navigator.share(data); return; } catch (e) { /* cancelado */ }
    }
    try { await navigator.clipboard.writeText(url); toast('Link copiado! Cole para o amigo 📋', 'share'); }
    catch (e) { openModal(`<h3>Compartilhar app</h3><div class="msub">Copie e envie este link:</div><div class="field"><input type="text" value="${url}" readonly onclick="this.select()"/></div><button class="btn btn--teal btn--block" onclick="this.closest('.modal-back').classList.remove('show');setTimeout(()=>document.getElementById('modal-root').innerHTML='',280)">Fechar</button>`); }
  }

  /* ---- professor: PIN gate + modais ---- */
  function openProfessorGate() {
    if (professorUnlocked) { navigate('prof'); return; }
    if (!S.coachHasPin()) {
      const back = openModal(`
        <h3>Área do Professor</h3>
        <div class="msub">Crie um PIN para proteger o acesso. Só o professor deve conhecê-lo.</div>
        <div class="field"><label>Novo PIN (mín. 4 dígitos)</label><input id="p1" type="password" inputmode="numeric" maxlength="8" placeholder="••••"/></div>
        <div class="field"><label>Confirmar PIN</label><input id="p2" type="password" inputmode="numeric" maxlength="8" placeholder="••••"/></div>
        <button class="btn btn--gold btn--block" id="pset">${svg('lock')} Criar e entrar</button>`);
      back.querySelector('#pset').addEventListener('click', () => {
        const v = back.querySelector('#p1').value, c = back.querySelector('#p2').value;
        if (v.length < 4) return toast('O PIN precisa de ao menos 4 dígitos', 'info');
        if (v !== c) return toast('Os PINs não coincidem', 'info');
        S.coachSetPin(v); professorUnlocked = true; closeModal(); toast('Área do professor criada 🔐', 'lock'); navigate('prof');
      });
    } else {
      const back = openModal(`
        <h3>Área do Professor</h3>
        <div class="msub">Digite seu PIN para acessar a área restrita.</div>
        <div class="field"><label>PIN</label><input id="p1" type="password" inputmode="numeric" maxlength="8" placeholder="••••"/></div>
        <button class="btn btn--gold btn--block" id="pok">${svg('lock')} Entrar</button>`);
      const tryPin = () => {
        if (S.coachCheck(back.querySelector('#p1').value)) { professorUnlocked = true; closeModal(); navigate('prof'); }
        else toast('PIN incorreto', 'info');
      };
      back.querySelector('#pok').addEventListener('click', tryPin);
      back.querySelector('#p1').addEventListener('keydown', e => { if (e.key === 'Enter') tryPin(); });
    }
  }

  function openAddAlunoModal() {
    const back = openModal(`
      <h3>Adicionar aluno</h3>
      <div class="msub">Cadastre um novo aluno na turma.</div>
      <div class="field"><label>Nome</label><input id="al-nome" type="text" maxlength="40" placeholder="Nome do aluno"/></div>
      <div class="field"><label>Faixa</label><select id="al-belt">${beltOptionsGrouped('white')}</select></div>
      <div class="field"><label>Graus</label><select id="al-graus">${grausOptions('white', 0)}</select></div>
      <button class="btn btn--gold btn--block" id="al-save">${svg('plus')} Adicionar</button>`);
    back.querySelector('#al-belt').addEventListener('change', e => {
      back.querySelector('#al-graus').innerHTML = grausOptions(e.target.value, 0);
    });
    back.querySelector('#al-save').addEventListener('click', () => {
      const nome = back.querySelector('#al-nome').value.trim();
      if (!nome) return toast('Informe o nome', 'info');
      S.addAluno(nome, back.querySelector('#al-belt').value, parseInt(back.querySelector('#al-graus').value) || 0);
      closeModal(); toast('Aluno adicionado ✓', 'check'); render('prof');
    });
  }

  function openAvaliacaoModal() {
    const names = [...new Set(D.SCHEDULE.map(s => s.nome))];
    const opts = names.map(n => `<option>${n}</option>`).join('') + '<option>Treino livre</option>';
    const back = openModal(`
      <h3>Avaliar treino</h3>
      <div class="msub">O que você observou neste aluno hoje.</div>
      <div class="field"><label>Aula</label><select id="av-aula">${opts}</select></div>
      <div class="field"><label>Melhora na execução dos golpes</label><textarea id="av-exec" rows="2" placeholder="Ex.: armlock com o quadril mais alto..."></textarea></div>
      <div class="field"><label>Posições / transições</label><textarea id="av-pos" rows="2" placeholder="Ex.: reteve melhor a guarda..."></textarea></div>
      <div class="field"><label>Destaques do dia</label><textarea id="av-dest" rows="2" placeholder="O que o aluno fez no treino..."></textarea></div>
      <div class="field"><label>Pontos a desenvolver</label><textarea id="av-mel" rows="2" placeholder="Opcional"></textarea></div>
      <button class="btn btn--teal btn--block" id="av-save">${svg('check')} Salvar avaliação</button>`);
    back.querySelector('#av-save').addEventListener('click', () => {
      const exec = back.querySelector('#av-exec').value.trim();
      const pos = back.querySelector('#av-pos').value.trim();
      const dest = back.querySelector('#av-dest').value.trim();
      const mel = back.querySelector('#av-mel').value.trim();
      if (!exec && !pos && !dest && !mel) return toast('Escreva ao menos uma observação', 'info');
      S.addAvaliacao(selectedAluno, { aula: back.querySelector('#av-aula').value, execucao: exec, posicoes: pos, destaques: dest, melhorar: mel });
      closeModal(); toast('Avaliação registrada ✓', 'check'); render('prof-aluno');
    });
  }

  function openMensagemModal() {
    const a = S.getAluno(selectedAluno);
    const back = openModal(`
      <h3>Mensagem ao aluno</h3>
      <div class="msub">Aparece para ${firstName(a.nome)} no "Caminho das faixas".</div>
      <div class="field"><label>Mensagem</label><textarea id="msg-t" rows="4" placeholder="Escreva um incentivo, orientação ou meta..."></textarea></div>
      <button class="btn btn--teal btn--block" id="msg-save">${svg('send')} Enviar</button>`);
    back.querySelector('#msg-save').addEventListener('click', () => {
      const t = back.querySelector('#msg-t').value.trim();
      if (!t) return toast('Escreva a mensagem', 'info');
      S.addMensagem(selectedAluno, t); closeModal(); toast('Mensagem enviada ✓', 'send'); render('prof-aluno');
    });
  }

  function openPromoverModal() {
    const a = S.getAluno(selectedAluno);
    const back = openModal(`
      <h3>Graduar aluno</h3>
      <div class="msub">Atualize a faixa e os graus de ${firstName(a.nome)}.</div>
      <div class="field"><label>Faixa</label><select id="pr-belt">${beltOptionsGrouped(a.belt)}</select></div>
      <div class="field"><label>Graus</label><select id="pr-graus">${grausOptions(a.belt, a.graus)}</select></div>
      <button class="btn btn--gold btn--block" id="pr-save">${svg('medal')} Confirmar graduação</button>`);
    back.querySelector('#pr-belt').addEventListener('change', e => {
      back.querySelector('#pr-graus').innerHTML = grausOptions(e.target.value, 0);
    });
    back.querySelector('#pr-save').addEventListener('click', () => {
      const belt = back.querySelector('#pr-belt').value;
      const graus = parseInt(back.querySelector('#pr-graus').value) || 0;
      S.promover(selectedAluno, belt, graus);
      if (selectedAluno === 'me') S.updatePerfil({ categoria: deriveCategoria(belt, S.state.perfil.categoria) });
      closeModal(); toast('Graduação atualizada 🥋', 'check'); render('prof-aluno');
    });
  }

  /* ================================================================
     ROUTER
     ================================================================ */
  const VIEWS = {
    inicio: viewInicio, agenda: viewAgenda, checkin: viewCheckin,
    evolucao: viewEvolucao, perfil: viewPerfil,
    tecnicas: viewTecnicas, avisos: viewAvisos, eventos: viewEventos, financeiro: viewFinanceiro,
    prof: viewProf, 'prof-aluno': viewProfAluno,
  };
  const PROF_ROUTES = ['prof', 'prof-aluno'];
  let currentRoute = 'inicio';
  let lastMain = 'inicio';
  let professorUnlocked = false;

  function render(route) {
    const fn = VIEWS[route] || VIEWS.inicio;
    view.innerHTML = fn();
    document.body.classList.toggle('prof-mode', PROF_ROUTES.includes(route));
    view.scrollTop = 0;
    window.scrollTo(0, 0);
  }
  function navigate(route) {
    if (!VIEWS[route]) route = 'inicio';
    // área restrita: exige PIN
    if (PROF_ROUTES.includes(route) && !professorUnlocked) { openProfessorGate(); return; }
    currentRoute = route;
    if (MAIN_ROUTES.includes(route)) lastMain = route;
    render(route);
    // tab active state
    tabbar.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.route === route));
    location.hash = route;
  }

  tabbar.addEventListener('click', e => {
    const tab = e.target.closest('.tab');
    if (tab) navigate(tab.dataset.route);
  });

  window.addEventListener('hashchange', () => {
    const r = location.hash.replace('#', '');
    if (r && VIEWS[r] && r !== currentRoute) navigate(r);
  });

  // boot
  const initial = location.hash.replace('#', '');
  navigate(VIEWS[initial] && !PROF_ROUTES.includes(initial) ? initial : 'inicio');

  // service worker (only over http/https; ignora em file://)
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
})();
