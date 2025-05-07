const { depositarRepository } = require("../repository/transacaoRepository")

async function transferir(ctx) {
    
}

async function depositarController(ctx) {
    const { id } = ctx.params;

    const deposito = await depositarRepository(id)

    return deposito
}

module.exports = { depositarController, transferir }