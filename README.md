# Personal Finance — Frontend (Angular) — v1.0.0

Frontend do projeto **Personal Finance**, um sistema de controle financeiro pessoal/família.

Este repositório contém a aplicação **Angular 19**, utilizando **Angular Material** e **TailwindCSS**, com build de produção servido via **Nginx** usando **Docker multi-stage**.

---

## 🧠 Stack

- Angular **19**
- Angular Material
- TailwindCSS
- Docker (multi-stage build)
- Nginx (SPA fallback para rotas Angular)
- CI/CD com GitHub Actions publicando imagem no **GHCR**

---

## 📦 Requisitos

### Rodar sem Docker (modo desenvolvimento)

- Node.js **20+**
- npm **9+**

### Rodar com Docker

- Docker Desktop (Windows/Mac) ou Docker Engine (Linux)
- Docker Compose

---

## 🚀 Rodar em modo desenvolvimento (local)

> Ideal para desenvolvimento do dia a dia (hot reload, debug, etc).

1. Instale as dependências:

   ```bash
   npm ci

   ```

2. Suba o servidor de desenvolvimento:

```bash
npm start

```

3. Acesse no navegador:

http://localhost:4200

4. Para parar o servidor:

CTRL + C

🐳 Rodar com Docker (build local)

Use este modo quando você clonou o projeto e quer buildar localmente via Docker.

1. Buildar e subir o container (na raiz do repositório):


docker compose up -d --build

2. Acessar a aplicação:

http://localhost:4200

3. Ver logs do container:

```bash
docker compose logs -f
```

4. Parar o container:

```bash
docker compose down
```

5. Rebuild forçado (sem cache), se necessário:

```bash
docker compose build --no-cache
docker compose up -d
```

🚀 Rodar no modo profissional (imagem pronta do GHCR)

Use este modo quando você quer rodar a aplicação SEM precisar buildar nada localmente.
O GitHub Actions já builda e publica a imagem no GHCR automaticamente após push na branch principal.

1. Faça login no GHCR (necessário se o repositório for privado):

Crie um Personal Access Token (PAT) no GitHub com permissão: read:packages

Depois faça login:

```bash
docker login ghcr.io -u rafafullenbach
```

Quando pedir senha, cole o seu PAT.

2. Baixe a imagem publicada:

```bash
docker pull ghcr.io/rafafullenbach/personal_finance_frontend/frontend:latest
```

3. Rode o container usando a imagem pronta:

```bash
docker run -d \
 --name pf-web \
 -p 4200:80 \
 ghcr.io/rafafullenbach/personal_finance_frontend/frontend:latest
 ```

4.  Acesse a aplicação:

http://localhost:4200

5. Ver logs do container:

```bash
docker logs -f pf-web
 ```

6. Parar e remover o container:

```bash
docker rm -f pf-web
 ```

🧪 Testes

1. Rodar testes:

```bash
npm test
 ```

2. Rodar testes com coverage:

```bash
ng test --code-coverage
 ```

O relatório HTML é gerado em:

coverage/<nome-do-projeto>/index.html

🏗️ Build de produção (sem Docker)

1. Gerar build de produção:

```bash
npm run build -- --configuration production
 ```

🧱 Estrutura do projeto (alto nível)

- src/ → código fonte Angular

- nginx.conf → configuração do Nginx com fallback SPA (rotas Angular)

- Dockerfile → build multi-stage (Node build + Nginx runtime)

- docker-compose.yml → execução local com Docker

⚙️ Como funciona o Dockerfile (resumo)

O build é feito em 2 estágios:

1. Build (Node)

- instala dependências com npm ci

- gera build de produção com npm run build -- --configuration production

2. Run (Nginx)

- usa nginx:alpine

- copia os arquivos buildados para /usr/share/nginx/html

- aplica fallback SPA via nginx.conf

🛠 Troubleshooting

Docker error: dockerDesktopLinuxEngine pipe not found

Normalmente significa que o Docker Desktop não está rodando.

Solução:

1. Abra o Docker Desktop

2. Aguarde ficar “Running”

3. Rode novamente o comando Docker

Erro ao puxar imagem do GHCR (pull access denied)

- Isso acontece quando:

- você não fez login no GHCR

- o token não tem permissão suficiente

- o repositório é privado

Solução:

1. Faça login:

```bash
- docker login ghcr.io -u rafafullenbach
```

Porta 4200 já está em uso

- Se a porta já estiver ocupada, rode com outra porta, por exemplo:

```bash
- docker run -d --name pf-web -p 4300:80 ghcr.io/rafafullenbach/personal_finance_frontend/frontend:latest
```

Acesse:

- http://localhost:4300

📌 Versão

- v1.0.0
