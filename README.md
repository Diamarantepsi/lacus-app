# LACUS · Jiu-Jitsu — App do Aluno

App web (PWA) leve e instalável para o aluno acompanhar seu desenvolvimento na academia
**LACUS Jiu-Jitsu** (Maceió/AL). Inspirado no BJJ Control, com a identidade visual do site
(preto profundo + teal + dourado, fontes Oswald / DM Sans / JetBrains Mono).

> *Domine a arte. Modele o caráter.*

## ✨ O que o app tem

- **Início** — saudação, graduação atual (faixa + graus), progresso para o próximo grau,
  cards de estatística (sequência, treinos no mês, total, horas no tatame), próxima aula e atalhos.
- **Agenda** — grade semanal de aulas por dia (Gi, No-Gi, Kids, Open Mat) com professor e horário.
- **Check-in** — registro de presença com anel de progresso da meta mensal, heatmap do mês
  e histórico dos últimos treinos. Toque numa aula da agenda para check-in rápido.
- **Evolução** — gráfico de frequência (6 meses), metas com barras de progresso e a
  linha do tempo das faixas (Branca → Preta).
- **Técnicas** — currículo por posição e faixa, com busca, filtros e marcação de "dominada".
- **Perfil** — avatar, estatísticas, **financeiro/mensalidade**, **avisos da academia**,
  **eventos/competições**, edição de perfil, redefinir dados e **compartilhar o app**.

Tudo é salvo no próprio aparelho (localStorage) — funciona offline e sem cadastro,
ideal para o seu amigo testar na hora.

## 🧱 Tecnologia

HTML + CSS + JavaScript puro, **sem build e sem dependências**. Service Worker para
funcionar offline e manifest para instalar como app no celular.

```
index.html            · shell do app
css/styles.css        · sistema de design da marca
js/data.js            · dados da academia (grade, técnicas, avisos, eventos)
js/store.js           · estado do aluno (localStorage)
js/app.js             · navegação + telas + interações
assets/               · logo e ícones (SVG)
manifest.webmanifest  · instalação PWA
sw.js                 · cache offline
```

## ▶️ Testar localmente

**Opção 1 — abrir direto:** dê duplo clique em `index.html`. Abre no navegador e já funciona.

**Opção 2 — com servidor (recomendado p/ testar PWA/offline):**
no PowerShell, dentro da pasta do projeto:

```powershell
powershell -ExecutionPolicy Bypass -File .claude/server.ps1
```

Depois abra **http://localhost:8080** no navegador. (Para sair: `Ctrl + C`.)

No celular, com o computador e o celular na mesma rede Wi-Fi, troque `localhost`
pelo IP do computador (ex.: `http://192.168.0.10:8080`).

## 🔗 Publicar e enviar o link para um amigo

A forma mais simples e gratuita é o **GitHub Pages** (link público, sem servidor ligado):

1. Crie um repositório no GitHub (ex.: `lacus-app`).
2. Envie todos os arquivos desta pasta para o repositório.
3. No GitHub: **Settings → Pages → Branch: `main` / `root` → Save**.
4. Em ~1 min o link fica no ar, algo como
   `https://SEU-USUARIO.github.io/lacus-app/` — é esse link que você manda para o amigo.

Dentro do app, **Perfil → Compartilhar app** já usa o compartilhamento nativo do
celular (ou copia o link) com a URL atual.

## 📲 Instalar como app no celular

Abra o link no Chrome/Safari → menu → **"Adicionar à tela inicial"**.
Abre em tela cheia, com ícone próprio, como um app nativo.
