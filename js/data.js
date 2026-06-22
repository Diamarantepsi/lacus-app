/* ============================================================
   LACUS · seed data (academia)
   Tudo editável; persistência do aluno fica no store (localStorage)
   ============================================================ */
window.LACUS_DATA = (function () {
  // Faixas adultas BJJ
  const BELTS = [
    { id: 'white',  nome: 'Faixa Branca', cls: 'belt--white', dot: 'bd-white',  graus: 4 },
    { id: 'blue',   nome: 'Faixa Azul',   cls: 'belt--blue',  dot: 'bd-blue',   graus: 4 },
    { id: 'purple', nome: 'Faixa Roxa',   cls: 'belt--purple',dot: 'bd-purple', graus: 4 },
    { id: 'brown',  nome: 'Faixa Marrom', cls: 'belt--brown', dot: 'bd-brown',  graus: 4 },
    { id: 'black',  nome: 'Faixa Preta',  cls: 'belt--black', dot: 'bd-black',  graus: 6 },
  ];

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

  return { BELTS, SCHEDULE, POSICOES, TECNICAS, AVISOS, EVENTOS };
})();
