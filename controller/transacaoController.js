const { depositarRepository, sacarRepository, transferirRepository } = require("../repository/transacaoRepository")

async function transferirController(ctx) {
    const { idPagador, idRecebedor, valor } = ctx.request.body;

    if (!idPagador || !idRecebedor || !valor || valor <= 0) {
        ctx.status = 400;
        return ctx.body = {
            status: "error",
            message: "Parâmetros inválidos. Certifique-se de enviar IDs válidos e um valor maior que zero."
        };
    }

    const transferencia = await transferirRepository(idPagador, idRecebedor, valor);

    if (!transferencia) {
        ctx.status = 400;
        return ctx.body = {
            status: "error",
            message: "Transferência não realizada. Verifique os IDs e o saldo do comprador."
        };
    }

    ctx.status = 200;
    return ctx.body = {transferencia};
}


async function depositarController(ctx) {
    const { id } = ctx.params;
    const { valor } = ctx.request.body;

    if (!valor) {
        ctx.status = 400;
        return ctx.body = {
            status: "error",
            message: "Valor inválido. O depósito deve ser maior que zero."
        };
    }

    const deposito = await depositarRepository(id, valor);

    if (!deposito) {
        ctx.status = 400;
        return ctx.body = {
            status: "error",
            message: "Depósito não realizado. Verifique o ID da conta."
        };
    }

    ctx.status = 200;
    return ctx.body = {deposito};
}

async function sacarController(ctx) {
    const { id } = ctx.params;
    const { valor } = ctx.request.body;

    if (!valor || valor <= 0) {
        ctx.status = 400;
        return ctx.body = {
            status: "error",
            message: "Valor inválido. O saque deve ser maior que zero."
        };
    }

    const saque = await sacarRepository(id, valor);

    if (!saque) {
        ctx.status = 400;
        return ctx.body = {
            status: "error",
            message: "Saque não realizado. Verifique o ID da conta ou o saldo disponível."
        };
    }

    ctx.status = 200;
    return ctx.body = {saque};
}

module.exports = { depositarController, transferirController, sacarController }