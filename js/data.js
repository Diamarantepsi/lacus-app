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

  // Aulas por dia (0=Dom ... 6=Sáb)
  const SCHEDULE = [
    { dia: 1, hora: '06:30', dur: '60min', nome: 'Fundamentos',      tipo: 'gi',   prof: 'Prof. Rafael' },
    { dia: 1, hora: '19:00', dur: '90min', nome: 'Gi Avançado',      tipo: 'gi',   prof: 'Prof. Rafael' },
    { dia: 1, hora: '20:30', dur: '60min', nome: 'No-Gi',            tipo: 'nogi', prof: 'Prof. Bruno' },
    { dia: 2, hora: '07:00', dur: '60min', nome: 'Drilling Matinal', tipo: 'gi',   prof: 'Prof. Bruno' },
    { dia: 2, hora: '17:30', dur: '60min', nome: 'Kids & Teens',     tipo: 'kids', prof: 'Profa. Marina' },
    { dia: 2, hora: '19:00', dur: '90min', nome: 'Gi Todos os Níveis', tipo: 'gi', prof: 'Prof. Rafael' },
    { dia: 3, hora: '06:30', dur: '60min', nome: 'Fundamentos',      tipo: 'gi',   prof: 'Prof. Rafael' },
    { dia: 3, hora: '19:00', dur: '90min', nome: 'Competição',       tipo: 'gi',   prof: 'Prof. Rafael' },
    { dia: 3, hora: '20:30', dur: '60min', nome: 'No-Gi',            tipo: 'nogi', prof: 'Prof. Bruno' },
    { dia: 4, hora: '07:00', dur: '60min', nome: 'Drilling Matinal', tipo: 'gi',   prof: 'Prof. Bruno' },
    { dia: 4, hora: '17:30', dur: '60min', nome: 'Kids & Teens',     tipo: 'kids', prof: 'Profa. Marina' },
    { dia: 4, hora: '19:00', dur: '90min', nome: 'Gi Avançado',      tipo: 'gi',   prof: 'Prof. Rafael' },
    { dia: 5, hora: '06:30', dur: '60min', nome: 'Fundamentos',      tipo: 'gi',   prof: 'Prof. Rafael' },
    { dia: 5, hora: '19:00', dur: '90min', nome: 'Gi Todos os Níveis', tipo: 'gi', prof: 'Prof. Bruno' },
    { dia: 5, hora: '20:30', dur: '90min', nome: 'Open Mat',         tipo: 'open', prof: 'Livre' },
    { dia: 6, hora: '09:00', dur: '90min', nome: 'Open Mat',         tipo: 'open', prof: 'Livre' },
    { dia: 6, hora: '10:30', dur: '60min', nome: 'No-Gi',            tipo: 'nogi', prof: 'Prof. Bruno' },
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
