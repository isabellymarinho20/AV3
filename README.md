# AeroCode — AV3

AV3 -  Técnicas de Programação I

Nome: Isabelly Pacheco Marinho -2DSM

---

Sistema de gerenciamento de montagem e manutenção de aeronaves. Este projeto integra o backend (Express) com o frontend (React + Vite), persistindo todos os dados em um banco MySQL via Prisma ORM.

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
├── .env              ← crie manualmente, veja abaixo
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

## Rodando no Linux (Ubuntu 24.04 ou superior)

> Válido para Ubuntu 24.04.03+ e distribuições derivadas.

### 1. Instalar o Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Verifique a instalação:

```bash
node -v
npm -v
```

### 2. Instalar o MySQL

```bash
sudo apt update
sudo apt install -y mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
```

Acesse o MySQL e defina uma senha para o root (se necessário):

```bash
sudo mysql
```

```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'sua_senha';
FLUSH PRIVILEGES;
EXIT;
```

Crie o banco de dados:

```bash
mysql -u root -p
```

```sql
CREATE DATABASE aerocode;
EXIT;
```

### 3. Clonar e instalar dependências

```bash
git clone <url-do-repositorio>
cd AV3
npm install
cd front && npm install && cd ..
```

### 4. Criar o arquivo .env

```bash
nano .env
```

Cole o conteúdo abaixo, ajustando usuário e senha:

```env
DATABASE_URL="mysql://root:sua_senha@localhost:3306/aerocode"
PORT=3001
```

Salve com `Ctrl+O`, `Enter` e saia com `Ctrl+X`.

### 5. Configurar o banco e rodar

```bash
npm run migrate
npm run seed
npm run dev
```

Acesse em: **http://localhost:5173**

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
cd front
npm install
cd ..
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
| `EtapaFuncionario` | Relacionamento entre etapa e funcionário      |
| `Teste`            | Testes realizados em uma aeronave                 |


## Usuários de Acesso (Seed)

| Usuário      | Senha | Nível         |
|--------------|-------|---------------|
| `isa.admin`  | `123` | Administrador |
| `isa.eng`    | `456` | Engenheiro    |
| `operador01` | `789` | Operador      |
| `operador02` | `321` | Operador      |
| `eng01`      | `654` | Engenheiro    |
| `isa.op`     | `987` | Operador      |


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


