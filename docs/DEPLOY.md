# 🚀 Guia de Deploy — FastFlow

Este guia contém o passo a passo completo para colocar o **FastFlow** em produção com **custo zero** ou muito baixo.

---

## 🏗️ Arquitetura de Produção

- **Banco de Dados:** PostgreSQL na nuvem (**Supabase** ou **Neon** ou **Railway**)
- **Backend:** Node.js + Express + Prisma (**Render** ou **Railway**)
- **Frontend:** React + Vite + Tailwind (**Vercel**)

---

## Passo 1: Criar o Banco PostgreSQL na Nuvem

Recomendamos o **[Supabase](https://supabase.com/)** ou **[Neon](https://neon.tech/)** (ambos possuem plano gratuito excelente).

1. Crie uma conta no [Supabase](https://supabase.com/) ou [Neon](https://neon.tech/).
2. Crie um novo projeto chamado `festflow`.
3. Copie a **Connection String (URI)** no formato:
   ```env
   postgresql://postgres:[SUA-SENHA]@[HOST]:5432/postgres?sslmode=require
   ```
4. No seu terminal local, rode as migrations para criar as tabelas no banco da nuvem:
   ```bash
   # Dentro de services/api
   npx prisma migrate deploy
   ```

---

## Passo 2: Fazer o Deploy do Backend (API)

Recomendamos o **[Render](https://render.com/)** ou **[Railway](https://railway.app/)**:

### Opção A: Render (Grátis)
1. Crie uma conta no [Render](https://render.com/) e conecte com seu GitHub.
2. Clique em **New +** > **Web Service**.
3. Selecione o repositório `Fast-Flow`.
4. Configure os campos:
   - **Name:** `festflow-api`
   - **Root Directory:** `services/api`
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
5. Em **Environment Variables**, adicione:
   - `DATABASE_URL`: *(sua URL do PostgreSQL na nuvem obtida no Passo 1)*
   - `JWT_SECRET`: *(uma chave secreta longa, ex: `super_secret_festflow_key_2026`)*
   - `CLIENT_URL`: *(a URL do frontend na Vercel que você criará no Passo 3, ex: `https://festflow.vercel.app`)*
   - `STRIPE_SECRET_KEY`: *(sua chave `sk_test_...` da Stripe)*
   - `STRIPE_PUBLIC_KEY`: *(sua chave `pk_test_...` da Stripe)*
6. Clique em **Deploy Web Service**.
7. Copie a URL gerada (ex: `https://festflow-api.onrender.com`).

---

## Passo 3: Fazer o Deploy do Frontend (Client)

1. Crie uma conta na **[Vercel](https://vercel.com/)** e conecte seu GitHub.
2. Clique em **Add New...** > **Project**.
3. Importe o repositório `Fast-Flow`.
4. Em **Root Directory**, clique em **Edit** e selecione a pasta `apps/client`.
5. Em **Environment Variables**, adicione:
   - `VITE_API_URL`: `https://festflow-api.onrender.com` *(a URL da sua API do Passo 2 sem a barra no final)*
6. Clique em **Deploy**.
7. A Vercel gerará o link da sua aplicação (ex: `https://festflow.vercel.app`).

---

## Passo 4: Sincronizar o CLIENT_URL no Backend

Volte no painel do seu backend (Render ou Railway) e atualize a variável:
- `CLIENT_URL`: `https://festflow.vercel.app` *(a URL gerada pela Vercel)*

Isso garante que o CORS e os redirecionamentos do Stripe Checkout voltem diretamente para o seu site no ar!

---

## 🧪 Verificação Final

1. Acesse o site na Vercel.
2. Crie uma conta de teste.
3. Alterne o idioma entre 🇧🇷 PT e 🇺🇸 EN.
4. Navegue pelos eventos e simule um pagamento com o cartão de teste do Stripe.
5. Verifique a emissão do ingresso com QR Code em **Meus Pedidos**!
