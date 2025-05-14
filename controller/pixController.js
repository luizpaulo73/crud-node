const { cadastrarPixRepository, buscarPixRepository, realizarPixRepository } = require("../repository/pixRepository");
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
    const { idPagador, valor, chave } = ctx.request.body;

    if (!idPagador || !valor || !chave || valor <= 0) {
        ctx.status = 400;
        return ctx.body = {
            message: "Parâmetros inválidos. Certifique-se de enviar IDs válidos e um valor maior que zero."
        };
    }

    const transferenciaPix = await realizarPixRepository(idPagador, valor, chave);

    if (!transferenciaPix) {
        ctx.status = 400;
        return ctx.body = {
            status: "error",
            message: "Transferência não realizada. Verifique os IDs e o saldo do comprador."
        };
    }
    ctx.status = 200;
    return ctx.body = { transferenciaPix }
}

module.exports = { cadastrarPixController, buscarPixController, realizarPixController };