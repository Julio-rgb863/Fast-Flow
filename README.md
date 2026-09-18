<div align="center">

<img src="https://img.shields.io/badge/Status-Em%20Desenvolvimento-9333EA?style=for-the-badge"/>
<img src="https://img.shields.io/badge/Versão-1.0.0-A855F7?style=for-the-badge"/>
<img src="https://img.shields.io/badge/Licença-MIT-7C3AED?style=for-the-badge"/>

# 🎪 FestFlow

### Plataforma Distribuída de Venda de Ingressos e Gestão de Festivais de Música

*Inspirado em grandes eventos como Lollapalooza e Tomorrowland*

---

[**🚀 Ver Demo**](#) · [**📖 Documentação**](#) · [**🐛 Reportar Bug**](#) · [**✨ Sugerir Feature**](#)

</div>

---

## 📌 Sobre o Projeto

O **FestFlow** é um ecossistema completo de software — não apenas uma aplicação, mas uma **plataforma distribuída** composta por múltiplos microsserviços, front-ends e bancos de dados que simulam uma plataforma real de venda de ingressos para festivais.

O projeto foi desenhado para demonstrar **visão arquitetural** e capacidade de tomar decisões técnicas em contextos modernos, legados, painéis internos e e-commerce de alta demanda.

> **Por que esse projeto é diferente?**
> A maioria dos projetos de portfólio é uma aplicação simples. O FestFlow é um **ecossistema** — com desafios reais como picos de tráfego, alta concorrência, atualizações em tempo real e observabilidade.

---

## ⚡ Funcionalidades

- 🎟️ **Venda de Ingressos** com prevenção de overbooking em alta concorrência
- 📊 **Dashboard Admin** com gráficos de vendas em tempo real via WebSockets
- 💬 **Chat ao Vivo** durante o festival via Socket.IO
- 🔐 **Autenticação Social** com Google e GitHub via Supabase
- 🔔 **Push Notifications** quando ingressos estão acabando via Firebase
- 🌐 **3 Front-ends** distintos: loja do cliente, painel admin e portal de fornecedores
- 📱 **API RESTful** documentada com Swagger

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONT-ENDS                               │
│  [ Next.js – Loja ]  [ Svelte – Admin ]  [ React – Fornecedor ] │
└────────────┬──────────────────┬──────────────────────────────────┘
             │ HTTP / REST       │ WebSocket (Socket.IO)
┌────────────▼──────────────────▼──────────────────────────────────┐
│                         BACK-END                                 │
│      [ API Node.js + Express ]      [ Microsserviço Java ]        │
└────────────┬──────────────────┬──────────────────────────────────┘
             │                  │
┌────────────▼──────────────────▼──────────────────────────────────┐
│                       BANCO DE DADOS                             │
│    [ PostgreSQL ]      [ MongoDB ]      [ MySQL – Legado ]        │
└────────────────────────────────┬─────────────────────────────────┘
                                 │
┌────────────────────────────────▼─────────────────────────────────┐
│                      INFRAESTRUTURA                              │
│   [ Docker ]  [ Vercel ]  [ Cloudflare ]  [ Datadog ]  [ BaaS ]  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Stack Tecnológica

### Front-end
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Svelte](https://img.shields.io/badge/Svelte-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Sass](https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white)

### Back-end
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socketdotio&logoColor=white)

### Banco de Dados
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

### DevOps & Infra
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)
![Datadog](https://img.shields.io/badge/Datadog-632CA6?style=for-the-badge&logo=datadog&logoColor=white)

---

## 📁 Estrutura do Projeto

```
festflow/
├── apps/
│   ├── client/          # Next.js — Loja do Cliente (B2C)
│   ├── admin/           # Svelte + Vite — Painel Administrativo (B2B)
│   └── suppliers/       # React — Portal de Fornecedores (Legado)
├── services/
│   ├── api/             # Node.js + Express + TypeScript
│   └── tickets/         # Java — Microsserviço de Alta Concorrência
├── infra/
│   └── docker-compose.yml
└── docs/                # Docusaurus
```

---

## 🚀 Como Rodar Localmente

### Pré-requisitos

- [Node.js 18+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Java 17+](https://www.oracle.com/java/technologies/downloads/)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/Julio-rgb863/Fast-Flow.git

# Entre na pasta
cd Fast-Flow

# Suba os bancos de dados
cd infra
docker compose up -d

# Instale as dependências da API
cd ../services/api
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Rode as migrations do banco
npx prisma migrate dev

# Inicie a API
npm run dev
```

A API estará disponível em `http://localhost:3000`

---

## 📡 Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/` | Status da API |
| GET | `/health` | Health check |
| GET | `/events` | Lista todos os eventos |
| GET | `/events/:id` | Busca evento por ID |
| POST | `/events` | Cria um novo evento |
| PUT | `/events/:id` | Atualiza um evento |
| DELETE | `/events/:id` | Remove um evento |

> Documentação completa disponível via Swagger em `/api-docs` *(em breve)*

---

## 📈 Roadmap

- [x] Estrutura do monorepo
- [x] Docker com PostgreSQL, MongoDB e MySQL
- [x] API Node.js + TypeScript
- [x] Prisma ORM + migrations
- [x] CRUD de eventos
- [ ] Autenticação JWT
- [ ] Rotas de usuários e pedidos
- [ ] Documentação Swagger
- [ ] Socket.IO para tempo real
- [ ] Microsserviço Java de ingressos
- [ ] Front-end Next.js (loja)
- [ ] Painel Admin em Svelte
- [ ] Portal de Fornecedores em React
- [ ] Deploy na Vercel + Cloudflare
- [ ] Monitoramento com Datadog

---

## 👨‍💻 Autor

**Julio Rolim Guimaraes Duarte**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-9333EA?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/júlio-rolim-b07522253/)
[![Gmail](https://img.shields.io/badge/Gmail-A855F7?style=for-the-badge&logo=gmail&logoColor=white)](mailto:juliorolimguimaraesduarte@gmail.com)
[![GitHub](https://img.shields.io/badge/GitHub-7C3AED?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Julio-rgb863)

---

<div align="center">

Feito com 💜 por **Julio Rolim**

</div>
