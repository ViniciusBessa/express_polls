# express_polls

> Um site que permite a criação de votações.

Nesse site o usuário pode:

- Cadastrar uma conta
- Entrar em sua conta
- Criar votações
- Votar em uma das opções das votações
- Pesquisar por votações através do título
- Finalizar suas votações

## Tecnologias utilizadas

**HTML, CSS, Javascript, Node.js, Express.js e PostgreSQL.**

## Instalando as dependências

Para instalar todos os pacotes, basta executar o comando:

```sh
npm install
```

## Configurações

Para conseguir executar o programa é necessário ter um banco de dados PostgreSQL para
armazenar os dados dos usuários, votações, sessões, etc. Para conectar o site ao banco de dados
basta criar um arquivo .env e colocar nele as variáveis:

- DB_DATABASE: Nome do banco de dados.
- DB_USER: Usuário que irá se conectar.
- DB_PASSWORD: A senha do usuário no banco de dados.

Após isso, utilize o comando a seguir para criar as tabelas no banco de dados:

```sh
npx knex migrate:latest
```

Além disso é necessário criar uma variável chamada SECRET no .env, que irá ser utilizada
pelo pacote express-session, é recomendado que seja uma longa sequência de caracteres aleatórios.

## Executando os testes

Para executar os testes criados com jest e supertest, basta digitar o comando:

```sh
npm test
```

## Executando o servidor

Para executar o servidor, use o comando:

```sh
npm run start-dev
```
