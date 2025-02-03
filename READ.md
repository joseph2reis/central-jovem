# 🚀 Projeto Full-Stack - Gerenciamento de Membros e Autenticação

Este projeto é uma aplicação full-stack desenvolvida para gerenciar membros e autenticação de usuários. O backend utiliza **Node.js**, **Express** e **MongoDB**, enquanto o frontend é construído com **React**. O sistema oferece funcionalidades como **cadastro, atualização, exclusão e busca de membros**, além de **registro e autenticação de usuários**.

## 🔧 Funcionalidades

### 🎯 Backend

#### 🏷️ MembroController
- **Cadastrar Membro**: Cadastra um novo membro no sistema.
  ```javascript
  POST /membros
  ```
- **Atualizar Membro**: Atualiza os dados de um membro existente.
  ```javascript
  PUT /membros/:id
  ```
- **Excluir Membro**: Remove um membro do sistema.
  ```javascript
  DELETE /membros/:id
  ```
- **Buscar Membro por ID**: Retorna os detalhes de um membro específico.
  ```javascript
  GET /membros/:id
  ```
- **Marcar Presença**: Atualiza o status de presença de um membro.
  ```javascript
  PATCH /membros/:id/presenca
  ```

#### 🔑 AuthController
- **Registrar Usuário**: Registra um novo usuário no sistema e gera um token JWT.
  ```javascript
  POST /auth/registrar
  ```

### 🎨 Frontend
- **Página de Login**: Permite que os usuários façam login no sistema.
- **Página de Registro**: Permite que novos usuários se registrem.
- **Listagem de Membros**: Exibe todos os membros cadastrados.
- **Detalhes do Membro**: Mostra os detalhes de um membro específico.
- **Formulário de Cadastro/Edição de Membro**: Permite cadastrar ou editar membros.
- **Marcar Presença**: Interface para marcar a presença de um membro.

## 📁 Estrutura do Projeto

### 📌 Backend
```
backend/
├── src/
│   ├── controllers/
│   │   ├── membroController.js
│   │   ├── authController.js
│   ├── models/
│   │   ├── Membro.js
│   │   ├── Usuario.js
│   ├── routes/
│   │   ├── membroRoutes.js
│   │   ├── authRoutes.js
│   ├── config/
│   │   ├── db.js
├── .env
├── package.json
├── README.md
```

### 📌 Frontend
```
frontend/
├── public/
│   ├── index.html
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   ├── Footer.js
│   ├── pages/
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Members.js
│   │   ├── MemberDetails.js
│   ├── services/
│   │   ├── api.js
│   ├── App.js
│   ├── index.js
├── package.json
├── README.md
```

## ✅ Pré-requisitos

### 🖥️ Backend
- Node.js (v14 ou superior)
- MongoDB (local ou Atlas)
- NPM ou Yarn

### 🖥️ Frontend
- Node.js (v14 ou superior)
- NPM ou Yarn

## 🚀 Como Executar o Projeto

### 🔙 Backend
1️⃣ Navegue até a pasta do backend:
   ```bash
   cd backend
   ```
2️⃣ Instale as dependências:
   ```bash
   npm install
   ```
3️⃣ Configure o arquivo **.env** com as variáveis de ambiente necessárias (ex: `JWT_SECRET`, `MONGO_URI`).
4️⃣ Inicie o servidor:
   ```bash
   npm start
   ```

### 🎨 Frontend
1️⃣ Navegue até a pasta do frontend:
   ```bash
   cd frontend
   ```
2️⃣ Instale as dependências:
   ```bash
   npm install
   ```
3️⃣ Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   ```

## 🔎 Testando a Aplicação
Você pode testar as rotas da API utilizando ferramentas como **Postman** ou **Insomnia**. Para o frontend, abra o navegador e acesse:
🔗 **http://localhost:3000**

## 🤝 Contribuição
Contribuições são bem-vindas! Siga os passos abaixo:
1. Faça um **fork** do projeto.
2. Crie uma branch para sua feature:
   ```bash
   git checkout -b feature/nova-feature
   ```
3. Commit suas mudanças:
   ```bash
   git commit -m 'Adicionando nova feature'
   ```
4. Faça **push** para a branch:
   ```bash
   git push origin feature/nova-feature
   ```
5. Abra um **Pull Request**.

## 📜 Licença
Este projeto está licenciado sob a **MIT License**.
