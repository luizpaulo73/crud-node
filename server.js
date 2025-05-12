const koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const contasController = require('./controller/contasController.js');
const transacaoController = require('./controller/transacaoController.js')

const app = new koa();
const router = new Router();

const tabela = require("./setup/setupDynamoDB.js")
tabela.verificarOuCriarTabela();

router
    .get("/contas", contasController.getContas)
    .get("/contas/:id", contasController.getContaPorId)
    .post("/conta", contasController.criarConta)
    .delete("/contas/:id", contasController.deletarConta)
    .put("/contas/transferir", transacaoController.transferirController)
    .put("/deposito/:id", transacaoController.depositarController)
    .put("/saque/:id", transacaoController.sacarController)
    // .post("/cadastro/pix", transacaoController.cadastrarPixController)

app
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(3000);