const { buscarExtratoRepository } = require("../repository/extratoRepository");

async function buscarExtratoController(ctx) {
    const { id, tipoTransferencia } = ctx.params

    if (!id) {
        ctx.status = 400;
        ctx.body = { message: 'Id do cliente não informado.' }
        return
    }

    const extratos = await buscarExtratoRepository(id, tipoTransferencia)
    if (!extratos) {
        ctx.status = 404;
        ctx.body = { message: 'Extratos não encontrados' }
        return
    }
    ctx.status = 200;
    ctx.body = extratos;
}

module.exports = { buscarExtratoController }