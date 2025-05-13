# API CRUD em Node.js com Docker e DynamoDB

Esta é uma API RESTful desenvolvida com Node.js que realiza operações CRUD em um banco de dados DynamoDB. O projeto utiliza Docker para containerização e foi criado com foco em aprendizado e boas práticas de desenvolvimento backend.

## 📦 Tecnologias Utilizadas

- ⚙️ **Node.js** – Ambiente de execução JavaScript no backend  
- 🚀 **Koa.js** – Framework web para Node.js  
- ☁️ **DynamoDB** – Banco de dados não relacional  
- 🐳 **Docker** – Containerização da aplicação  

## ⚙️ Requisitos

- [Docker](https://www.docker.com/) instalado
- [Git](https://git-scm.com/downloads) instalado

## 🚀 Como executar

1. Abra o terminal

2. Clone o repositório:

```bash
git clone https://github.com/luizpaulo73/crud-node.git
cd crud-node
```

3. Suba os containers com Docker Compose:

```bash
docker-compose up --build
```

A API estará disponível em: http://localhost:3000

## 📮 Endpoints da API

### Contas

- Buscar conta por ID
  
  ```bash
  GET /contas/:id
  ```
  
- Criar nova conta
  
  ```bash
  POST /conta
  Content-Type: application/json
  {
    "nomeUsuario": "luiz",
    "email": "luiz@email.com"
  }
  ```

- Deletar conta
  
  ```bash
  DELETE /contas/:id
  ```

### Transações

- Transferir entre contas
  
  ```bash
  PUT /contas/transferir
  Content-Type: application/json
  {
    "idPagador": "ba2c342a-683b-4f4c-913f-531dc1c73ad2",
    "idRecebedor": "c71787eb-359b-4908-9465-6669807bf9d9",
    "valor": 1000
  }
  ```
  
- Depositar em uma conta
  
  ```bash
  PUT /deposito/:id
  Content-Type: application/json
  {
    "valor": 500
  }
  ```
  
- Sacar de uma conta
  
  ```bash
  PUT /saque/:id
  Content-Type: application/json
  {
    "valor": 300
  }
  ```

### PIX

- Buscar Chaves PIX cadastradas

  ```bash
  GET /pix/:id
  ```

- Cadastrar Chave PIX
  
  ```bash
  POST /cadastro/pix
  Content-Type: application/json
  {
    "chave": "luiz@email.com",
    "idCliente": "ba2c342a-683b-4f4c-913f-531dc1c73ad2"
  }
  ```

- Realizar transferência via PIX
  
  ```bash
  PUT /realizar/pix
  Content-Type: application/json
  {
    "idPagador": "ba2c342a-683b-4f4c-913f-531dc1c73ad2",
    "valor": 500,
    "chave": "roberto@email.com"
  }
  ```

### Extrato

- Buscar extrato completo
  
  ```bash
  GET /extrato/:id
  ```

- Buscar extrato por tipo de transferência (ex: "saida", "entrada", "pix", "deposito" ou "saque"

  ```bash
  GET /extrato/:id/:tipoTransferencia
  ```
