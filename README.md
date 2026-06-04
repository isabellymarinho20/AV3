# AeroCode — AV3

Sistema de gerenciamento de montagem e manutenção de aeronaves. Este projeto integra o backend (API REST em Express + Prisma) com o frontend (React + Vite), persistindo todos os dados em um banco MySQL via Prisma ORM.

---

## Estrutura do Projeto

```
AV3/
├── src/
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── aeronaves.ts
│   │   ├── funcionarios.ts
│   │   ├── etapas.ts
│   │   ├── pecas.ts
│   │   └── testes.ts
│   └── server.ts
│
├── front/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
│
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
│
├── .env              ← NÃO está no git (crie manualmente, veja abaixo)
├── tsconfig.json
├── package.json
└── README.md
```

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- npm v9 ou superior
- [MySQL](https://dev.mysql.com/downloads/) v8 ou superior instalado e rodando

---

## Configurando o arquivo .env

> O arquivo `.env` é ignorado pelo Git por questão de segurança. Você precisa criá-lo manualmente na **raiz do projeto** (`AV3/`) antes de rodar o projeto.

Crie um arquivo chamado `.env` na raiz com o seguinte conteúdo:

```env
DATABASE_URL="mysql://SEU_USUARIO:SUA_SENHA@localhost:3306/aerocode"
PORT=3001
```

Exemplos comuns:

```env
# usuário root sem senha
DATABASE_URL="mysql://root:@localhost:3306/aerocode"

# usuário root com senha
DATABASE_URL="mysql://root:minhasenha@localhost:3306/aerocode"
```

---

## Instalação e Execução

### 1. Instalar dependências

Na raiz do projeto (`AV3/`):

```bash
npm install
```

Na pasta do frontend:

```bash
cd frontend
npm install
```

### 2. Criar o banco de dados

Abra o MySQL e execute:

```sql
CREATE DATABASE aerocode;
```

### 3. Configurar o banco

Na raiz do projeto (`AV3/`), rode:

```bash
npm run migrate
npm run seed
```

### 4. Rodar o projeto

Na raiz do projeto (`AV3/`), um único comando sobe tudo:

```bash
npm run dev
```

Acesse em: **http://localhost:5173**

---

## Banco de Dados

O banco é **MySQL** gerenciado pelo **Prisma ORM**.

### Modelos (schema.prisma)

| Modelo             | Descrição                                         |
|--------------------|---------------------------------------------------|
| `Funcionario`      | Usuários do sistema (admin, engenheiro, operador) |
| `Aeronave`         | Aeronaves cadastradas                             |
| `Peca`             | Peças associadas a uma aeronave                   |
| `Etapa`            | Etapas de produção de uma aeronave                |
| `EtapaFuncionario` | Relacionamento N:N entre etapa e funcionário      |
| `Teste`            | Testes realizados em uma aeronave                 |

### Abrir o Prisma Studio (visualizador do banco)

```bash
npx prisma studio --schema=prisma/schema.prisma
```

---

## Usuários de Acesso (Seed)

| Usuário      | Senha | Nível         |
|--------------|-------|---------------|
| `isa.admin`  | `123` | Administrador |
| `isa.eng`    | `456` | Engenheiro    |
| `operador01` | `789` | Operador      |
| `operador02` | `321` | Operador      |
| `eng01`      | `654` | Engenheiro    |
| `isa.op`     | `987` | Operador      |

---

## Endpoints da API

### Autenticação

| Método | Rota          | Descrição               |
|--------|---------------|-------------------------|
| POST   | `/auth/login` | Login com usuário/senha |

**Body:**
```json
{ "usuario": "isa.admin", "senha": "123" }
```

---

### Aeronaves

| Método | Rota             | Descrição                 |
|--------|------------------|---------------------------|
| GET    | `/aeronaves`     | Listar todas as aeronaves |
| GET    | `/aeronaves/:id` | Detalhe de uma aeronave   |
| POST   | `/aeronaves`     | Cadastrar aeronave        |

**Body (POST):**
```json
{
  "codigo": "A003",
  "modelo": "KC-390",
  "tipo": "Militar",
  "capacidade": 80,
  "alcance": 2800
}
```

---

### Funcionários

| Método | Rota                | Descrição             |
|--------|---------------------|-----------------------|
| GET    | `/funcionarios`     | Listar funcionários   |
| POST   | `/funcionarios`     | Cadastrar funcionário |
| DELETE | `/funcionarios/:id` | Deletar funcionário   |

**Validações (POST):**
- Nome, usuário e senha devem ser **únicos** — não é permitido cadastrar dois funcionários com o mesmo nome, mesmo usuário **ou** mesma senha.

---

### Peças

| Método | Rota                           | Descrição                |
|--------|--------------------------------|--------------------------|
| POST   | `/aeronaves/:id/pecas`         | Adicionar peça           |
| PATCH  | `/aeronaves/:id/pecas/:pecaId` | Atualizar status da peça |

---

### Etapas

| Método | Rota                                          | Descrição                    |
|--------|-----------------------------------------------|------------------------------|
| POST   | `/aeronaves/:id/etapas`                       | Adicionar etapa              |
| PATCH  | `/aeronaves/:id/etapas/:etapaId/iniciar`      | Iniciar etapa                |
| PATCH  | `/aeronaves/:id/etapas/:etapaId/concluir`     | Concluir etapa               |
| POST   | `/aeronaves/:id/etapas/:etapaId/funcionarios` | Associar funcionário à etapa |

**Regra de negócio:**
> Não é permitido adicionar uma nova etapa enquanto houver uma etapa com status **Pendente** na mesma aeronave.

---

### Testes

| Método | Rota                    | Descrição       |
|--------|-------------------------|-----------------|
| POST   | `/aeronaves/:id/testes` | Registrar teste |

---

## Regras de Negócio

| Regra | Descrição |
|-------|-----------|
| **Etapa Pendente** | Não é possível adicionar uma nova etapa enquanto houver etapa com status `Pendente`. |
| **Usuário duplicado** | Nome, usuário e senha devem ser únicos ao cadastrar um funcionário. |
| **Código de aeronave** | O código de cada aeronave deve ser único. |
| **Capacidade e alcance** | Devem ser maiores que zero. |
| **Funcionário duplicado em etapa** | Um funcionário não pode ser associado duas vezes à mesma etapa. |

---

## Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Sobe backend (porta 3001) e frontend (porta 5173) ao mesmo tempo |
| `npm run build` | Compila o backend para JavaScript |
| `npm start` | Executa a versão compilada do backend |
| `npm run migrate` | Aplica as migrations no banco de dados |
| `npm run seed` | Popula o banco com dados iniciais |
| `npm run setup` | Roda migrate + seed de uma vez (primeira execução) |

---

## Tecnologias Utilizadas

### Backend
- **Node.js** + **TypeScript**
- **Express** — framework HTTP
- **Prisma ORM** — mapeamento objeto-relacional
- **MySQL** — banco de dados

### Frontend
- **React 18** + **TypeScript**
- **Vite** — bundler e dev server
- **Lucide React** — ícones
- **Recharts** — gráficos no dashboard

---

## Autora

Isabelly — AV3 (2025)
