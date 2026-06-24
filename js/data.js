/* ============================================================
   LACUS · seed data (academia)
   Tudo editável; persistência do aluno fica no store (localStorage)
   ============================================================ */
window.LACUS_DATA = (function () {
  // Sistema de graduação BJJ (padrão IBJJF)
  // bar: faixa de cor central das faixas infantis ('white' | 'black' | null)
  const _white = { id: 'white', nome: 'Faixa Branca', short: 'Branca', color: '#e9e6e1', bar: null, graus: 4, idade: 'A partir de 4 anos' };

  // Trilha adulta (16+)
  const BELTS_ADULT = [
    _white,
    { id: 'blue',   nome: 'Faixa Azul',   short: 'Azul',   color: '#2f6ff0', bar: null, graus: 4, idade: 'A partir de 16 anos' },
    { id: 'purple', nome: 'Faixa Roxa',   short: 'Roxa',   color: '#8b46f0', bar: null, graus: 4, idade: 'A partir de 16 anos' },
    { id: 'brown',  nome: 'Faixa Marrom', short: 'Marrom', color: '#6b4423', bar: null, graus: 4, idade: 'A partir de 18 anos' },
    { id: 'black',  nome: 'Faixa Preta',  short: 'Preta',  color: '#161616', bar: null, graus: 6, idade: 'A partir de 19 anos' },
  ];

  // Trilha infantojuvenil (4–15 anos) — Cinza, Amarela, Laranja, Verde (cada uma: e-Branca, sólida, e-Preta)
  const BELTS_KIDS = [
    _white,
    { id: 'gray-white',   nome: 'Faixa Cinza e Branca',   short: 'Cinza-Branca',   color: '#8a8f96', bar: 'white', graus: 4, idade: '4 a 15 anos' },
    { id: 'gray',         nome: 'Faixa Cinza',            short: 'Cinza',          color: '#8a8f96', bar: null,    graus: 4, idade: '4 a 15 anos' },
    { id: 'gray-black',   nome: 'Faixa Cinza e Preta',    short: 'Cinza-Preta',    color: '#8a8f96', bar: 'black', graus: 4, idade: '4 a 15 anos' },
    { id: 'yellow-white', nome: 'Faixa Amarela e Branca', short: 'Amarela-Branca', color: '#f4c220', bar: 'white', graus: 4, idade: '7 a 15 anos' },
    { id: 'yellow',       nome: 'Faixa Amarela',          short: 'Amarela',        color: '#f4c220', bar: null,    graus: 4, idade: '7 a 15 anos' },
    { id: 'yellow-black', nome: 'Faixa Amarela e Preta',  short: 'Amarela-Preta',  color: '#f4c220', bar: 'black', graus: 4, idade: '7 a 15 anos' },
    { id: 'orange-white', nome: 'Faixa Laranja e Branca', short: 'Laranja-Branca', color: '#ef7d1a', bar: 'white', graus: 4, idade: '10 a 15 anos' },
    { id: 'orange',       nome: 'Faixa Laranja',          short: 'Laranja',        color: '#ef7d1a', bar: null,    graus: 4, idade: '10 a 15 anos' },
    { id: 'orange-black', nome: 'Faixa Laranja e Preta',  short: 'Laranja-Preta',  color: '#ef7d1a', bar: 'black', graus: 4, idade: '10 a 15 anos' },
    { id: 'green-white',  nome: 'Faixa Verde e Branca',   short: 'Verde-Branca',   color: '#2faa55', bar: 'white', graus: 4, idade: '13 a 15 anos' },
    { id: 'green',        nome: 'Faixa Verde',            short: 'Verde',          color: '#2faa55', bar: null,    graus: 4, idade: '13 a 15 anos' },
    { id: 'green-black',  nome: 'Faixa Verde e Preta',    short: 'Verde-Preta',    color: '#2faa55', bar: 'black', graus: 4, idade: '13 a 15 anos' },
  ];

  // Lista única para busca (white só uma vez)
  const BELTS = BELTS_ADULT.concat(BELTS_KIDS.filter(b => b.id !== 'white'));

  // Grade de horários — a mesma do site da LACUS (0=Dom ... 6=Sáb)
  // Professores ainda serão definidos pela academia (prof: '').
  const SCHEDULE = [
    // Segunda, Quarta e Sexta
    { dia: 1, hora: '19:00', dur: '1h30', nome: 'Fundamentos',     tipo: 'fund', nivel: 'Iniciantes', prof: '' },
    { dia: 1, hora: '20:30', dur: '1h30', nome: 'Performance Pro', tipo: 'pro',  nivel: 'Avançados',  prof: '' },
    { dia: 3, hora: '19:00', dur: '1h30', nome: 'Fundamentos',     tipo: 'fund', nivel: 'Iniciantes', prof: '' },
    { dia: 3, hora: '20:30', dur: '1h30', nome: 'Performance Pro', tipo: 'pro',  nivel: 'Avançados',  prof: '' },
    { dia: 5, hora: '19:00', dur: '1h30', nome: 'Fundamentos',     tipo: 'fund', nivel: 'Iniciantes', prof: '' },
    { dia: 5, hora: '20:30', dur: '1h30', nome: 'Performance Pro', tipo: 'pro',  nivel: 'Avançados',  prof: '' },
    // Terça e Quinta
    { dia: 2, hora: '08:30', dur: '2h30', nome: 'Aula Aberta',     tipo: 'open', nivel: 'Aberto',     prof: '' },
    { dia: 4, hora: '08:30', dur: '2h30', nome: 'Aula Aberta',     tipo: 'open', nivel: 'Aberto',     prof: '' },
    // Sábado
    { dia: 6, hora: '15:00', dur: '',     nome: 'Lacus Feminino',  tipo: 'fem',  nivel: 'Feminino',   prof: '' },
  ];

  // Biblioteca de técnicas (currículo)
  const POSICOES = ['Todas', 'Guarda', 'Passagem', 'Raspagem', 'Finalização', 'Quedas', 'Pegada'];
  const TECNICAS = [
    { id: 't01', nome: 'Armlock da guarda fechada',   pos: 'Finalização', belt: 'white' },
    { id: 't02', nome: 'Triângulo da guarda',         pos: 'Finalização', belt: 'white' },
    { id: 't03', nome: 'Raspagem de tesoura',         pos: 'Raspagem',    belt: 'white' },
    { id: 't04', nome: 'Raspagem de gancho (hook)',   pos: 'Raspagem',    belt: 'white' },
    { id: 't05', nome: 'Estrangulamento cruzado',     pos: 'Finalização', belt: 'white' },
    { id: 't06', nome: 'Fuga de montada (upa/elbow)', pos: 'Guarda',      belt: 'white' },
    { id: 't07', nome: 'Queda de quadril (O-goshi)',  pos: 'Quedas',      belt: 'white' },
    { id: 't08', nome: 'Double leg takedown',         pos: 'Quedas',      belt: 'blue' },
    { id: 't09', nome: 'Passagem de toreando',        pos: 'Passagem',    belt: 'blue' },
    { id: 't10', nome: 'Passagem de joelho no meio',  pos: 'Passagem',    belt: 'blue' },
    { id: 't11', nome: 'Kimura da guarda',            pos: 'Finalização', belt: 'blue' },
    { id: 't12', nome: 'Omoplata',                    pos: 'Finalização', belt: 'blue' },
    { id: 't13', nome: 'Guarda aranha — controle',    pos: 'Guarda',      belt: 'blue' },
    { id: 't14', nome: 'Raspagem da meia-guarda',     pos: 'Raspagem',    belt: 'blue' },
    { id: 't15', nome: 'Berimbolo — entrada',         pos: 'Guarda',      belt: 'purple' },
    { id: 't16', nome: 'Leg drag',                    pos: 'Passagem',    belt: 'purple' },
    { id: 't17', nome: 'Mata-leão (costas)',          pos: 'Finalização', belt: 'purple' },
    { id: 't18', nome: 'Guarda De La Riva',           pos: 'Guarda',      belt: 'purple' },
    { id: 't19', nome: 'Single leg X (ashi)',         pos: 'Guarda',      belt: 'purple' },
    { id: 't20', nome: 'Passagem de pressão (knee cut)', pos: 'Passagem', belt: 'brown' },
    { id: 't21', nome: 'Heel hook (No-Gi)',           pos: 'Finalização', belt: 'brown' },
    { id: 't22', nome: 'Lapela worm guard',           pos: 'Guarda',      belt: 'brown' },
    { id: 't23', nome: 'Crucifixo — finalização',     pos: 'Finalização', belt: 'brown' },
    { id: 't24', nome: 'Sistema de pegada (grip)',    pos: 'Pegada',      belt: 'black' },
  ];

  // Avisos da academia
  const AVISOS = [
    { tipo: 'aviso', titulo: 'Graduação de Inverno', data: '12 JUL', texto: 'Cerimônia de troca de faixas e entrega de graus. Presença confirmada até 05/07.' },
    { tipo: 'aviso', titulo: 'Reforma do tatame', data: '28 JUN', texto: 'No-Gi de sábado transferido para 10h durante a semana de reforma.' },
    { tipo: 'aviso', titulo: 'Novo horário matinal', data: '20 JUN', texto: 'Drilling matinal agora também às quintas, 07h. Vagas limitadas.' },
  ];

  // Eventos / competições
  const EVENTOS = [
    { tipo: 'evento', titulo: 'Copa LACUS Interna', data: '26 JUL', texto: 'Torneio interno por faixa e peso. Inscrições abertas na recepção.' },
    { tipo: 'evento', titulo: 'Seminário Faixa-Preta convidado', data: '09 AGO', texto: 'Workshop de passagem de guarda. 3h de treino técnico.' },
    { tipo: 'evento', titulo: 'Campeonato Alagoano', data: '14 SET', texto: 'Representação oficial da equipe. Time de competição em foco.' },
  ];

  return { BELTS, BELTS_ADULT, BELTS_KIDS, SCHEDULE, POSICOES, TECNICAS, AVISOS, EVENTOS };
})();
