const koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const contasController = require('./controller/contasController.js');
const transacaoController = require('./controller/transacaoController.js')

const app = new koa();
const router = new Router();

router
    .get("/contas", contasController.getContas)
    .get("/contas/:id", contasController.getContaPorId)
    .post("/conta", contasController.criarConta)
    .delete("/contas/:id", contasController.deletarConta)
    .post("/contas/:id/transferir", transacaoController.transferir)
    .post("/deposito/:id", transacaoController.depositarController)

app
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(3000);