const { buscarExtratoRepository } = require("../repository/extratoRepository");

async function buscarExtratoController(ctx) {
    const { id, tipoTransferencia } = ctx.params

    if (!id) {
        ctx.status = 400;
        ctx.body = { message: 'Id do cliente não informado.' }
        return
    }
    try {
        const extratos = await buscarExtratoRepository(id, tipoTransferencia);
        ctx.status = 200;
        ctx.body = extratos;
    } catch (error) {
        ctx.status = error.status || 500;
        ctx.body = { message: error.message || 'Erro ao buscar o extrato.' };
    }
}

module.exports = { buscarExtratoController }