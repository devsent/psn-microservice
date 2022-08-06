
# PSN Microservice

Um microsserviço desenvolvido para lidar com requisições da [PSN API](https://psn-api.achievements.app) de forma elegante. Desafio de projeto para **Santander Bootcamp Fullstack Developer** na [Digital Innovation One](https://www.dio.me).

## Funcionalidades
- :chart: Retorna dados detalhados de usuários da PSN.
- :chart: Lista completa de jogos, troféus e estatísticas de perfil.
- :chart: Endpoints específicos para cada operação.

## Documentação
- [Começando](#Instalação)
- [Endpoints](#Endpoints)
- [Tecnologias](#Tecnologias)

## Instalação
Clone o repositório e execute os comandos:
```bash
# Clone este repositório
$ git clone https://github.com/devsent/psn-microservice

# Acesse a pasta do projeto no seu terminal preferido
$ cd psn-microservice

# Instale as dependências
$ npm install

# Execute a aplicação em modo de desenvolvimento
$ npm run dev

# O servidor inciará na porta:5000 - acesse <http://localhost:5000>
```
## Como autenticar
Para que os endpoints funcionem de fato, será necessário autenticar cada requisição com um **NPSSO token**. Para obtê-lo, siga os passos abaixo:
 1. Acesse [https://www.playstation.com/](https://www.playstation.com/), clique em "Iniciar sessão" e faça login ou cadastre-se caso não possua uma conta.
 2. Após realizar o processo de login, visite [https://ca.account.sony.com/api/v1/ssocookie](https://ca.account.sony.com/api/v1/ssocookie). Você receberá uma resposta com o **NPSSO** referente à conta atual em formato JSON:
```bash
{ "npsso": <token> }
```
3.  Crie um arquivo **.env** na pasta raiz do projeto.
4. Copie o NPSSO e crie uma variável de ambiente no arquivo **.env**:
```bash
NPSSO = "token";
```
**NÃO EXPONHA SEU NPSSO TOKEN!** Ele contém dados sensíveis relacionados à sua conta.

5.  Salve o arquivo, e pronto! Agora você já é capaz de realizar requisições para os servidores da PlayStation através da API.

## Endpoints

Todos os endpoints aceitam requisições com o método **GET** e retornam dados em formato **JSON**.

Verifique a origem das requisições no arquivo [/src/index.ts](https://github.com/devsent/psn-microservice/blob/main/src/index.ts) para evitar erros de CORS.

 - **/status**

> Retorna o status do servidor.
 
 - **/trophies/:game**

> Retorna a lista de troféus de um jogo com seus metadados e recebe "npCommunicationId" como parâmetro.

 - **/trophies/ps5/:game**

> Retorna a lista de troféus de um jogo de PS5 com seus metadados e recebe "npCommunicationId" como parâmetro.
 
 - **/trophies/:game/collection**

> Retorna a coleção de troféus de um jogo, principal e DLCs, e recebe "npCommunicationId" como parâmetro.
> 
 - **/trophies/ps5/:game/collection**

> Retorna a coleção de troféus de um jogo de PS5, principal e DLCs, e recebe "npCommunicationId" como parâmetro.

 - **/:id**

> Retorna uma lista de usuários correspondente ao "onlineId" enviado como parâmetro.

 - **/:id/summary**

> Retorna o progresso total do usuário enviado como parâmetro.

 - **/:id/games**

> Retorna a lista de jogos recentes do usuário enviado como parâmetro.

 - **/:id/games/all**

> Retorna a lista completa de jogos do usuário enviado como parâmetro.

 - **/:id/trophies**

> Retorna a lista completa de troféus do usuário enviado como parâmetro.

 - **/:id/trophies/:game**

> Retorna o progresso da lista de troféus de um jogo específico, do usuário e do jogo enviados como parâmetro.

 - **/:id/trophies/PS5/:game**

> Retorna o progresso da lista de troféus de um jogo específico de PS5, do usuário e do jogo enviados como parâmetro.

 - **/:id/trophies/:game/collection**

> Retorna o progresso da coleção de troféus de um jogo específico, principal e DLCs, do usuário e do jogo enviados como parâmetro.

 - **/:id/trophies/PS5/:game/collection**

> Retorna o progresso da coleção de troféus de um jogo específico de PS5, principal e DLCs, do usuário e do jogo enviados como parâmetro.

## Tecnologias
Ferramentas utilizadas durante o desenvolvimento:

 - [Cors](https://www.npmjs.com/package/cors)
 - [DotEnv](https://www.npmjs.com/package/dotenv)
 - [Express](https://www.npmjs.com/package/express)
 - [http-status-codes](https://www.npmjs.com/package/http-status-codes)
 - [lodash](https://lodash.com)
 - [NodeJS](https://nodejs.org)
 - [PSN API](https://www.npmjs.com/package/psn-api)
 - [ts-node-dev](https://www.npmjs.com/package/ts-node-dev)
 - [TypeScript](https://www.typescriptlang.org)

