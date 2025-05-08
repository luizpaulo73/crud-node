const koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const contasController = require('./controller/contasController.js');
const transacaoController = require('./controller/transacaoController.js')

const app = new koa();
const router = new Router();

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: 'local',
  endpoint: 'http://localhost:8000',
  accessKeyId: 'user123',
  secretAccessKey: 'pass123'
});


router
    .get("/contas", contasController.getContas)
    .get("/contas/:id", contasController.getContaPorId)
    .post("/conta", contasController.criarConta)
    .delete("/contas/:id", contasController.deletarConta)
    .put("/contas/transferir", transacaoController.transferirController)
    .put("/deposito/:id", transacaoController.depositarController)
    .put("/saque/:id", transacaoController.sacarController)

app
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(3000);