Projeto criado para a disciplina de Frameworks Web, da faculdade SENAC-RS.

## Pré-requisitos

- Node.js 18+ e npm
- Backend rodando em `http://localhost:3000`

## Como Executar

O backend deve estar rodando **antes** do frontend.

### Instalar dependências

```bash
cd mercado-backend
npm install
```

### Iniciar servidor

```bash
npm run start:dev
```

O backend estará disponível em:
- API: `http://localhost:3000`
- Swagger (documentação): `http://localhost:3000/api`

**Banco de dados:** O arquivo `mercado.db` (SQLite) será criado automaticamente na raiz do projeto backend na primeira execução.

## 2. Executar o Frontend

Em outro terminal:

### Instalar dependências

```bash
cd mercado-frontend
npm install
```

### Iniciar aplicação

```bash
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

## 3. Usar o Sistema

Abra o navegador em `http://localhost:5173`
