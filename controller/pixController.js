const { cadastrarPixRepository, buscarPixRepository } = require("../repository/pixRepository");
const { detectarTipoChavePix } = require("../utils/validarPix");

async function cadastrarPixController(ctx) {
    try {
        const { chave, idCliente } = ctx.request.body;

        if (!chave) {
            ctx.status = 400;
            ctx.body = { message: 'Chave Pix não informada' };
            return
        }

        const tipoPix = detectarTipoChavePix(chave)
        if (tipoPix === 'INVALIDO') {
            ctx.status = 400;
            ctx.body = { message: 'Chave Pix inválida' };
            return
        }
        const pix = cadastrarPixRepository(chave, tipoPix, idCliente)
        ctx.status = 201;
        ctx.body = pix;

    } catch (error) {
        ctx.status = 500;
        ctx.body = { message: 'Erro ao cadastrar Pix' };
    }
}

async function buscarPixController(ctx) {
    const { id } = ctx.params;

    if (!id) {
        ctx.status = 400;
        ctx.body = { message: 'Id não informado' };
        return
    }

    const chavesPix = await buscarPixRepository(id);
    if (!chavesPix) {
        ctx.status = 404;
        ctx.body = { message: 'Chaves Pix não encontrada' };
        return
    }
    ctx.status = 200;
    ctx.body = chavesPix;
}

async function realizarPixController(ctx) {
    
}

module.exports = { cadastrarPixController, buscarPixController };