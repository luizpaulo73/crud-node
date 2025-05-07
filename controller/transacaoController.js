const { depositarRepository, sacarRepository, transferirRepository } = require("../repository/transacaoRepository")

async function transferirController(ctx) {
    const { idComprador, idVendedor, valor } = ctx.request.body;

    if (!idComprador || !idVendedor || !valor || valor <= 0) {
        ctx.status = 400;
        return ctx.body = {
            status: "error",
            message: "Parâmetros inválidos. Certifique-se de enviar IDs válidos e um valor maior que zero."
        };
    }

    const transferencia = await transferirRepository(idComprador, idVendedor, valor);

    if (!transferencia) {
        ctx.status = 400;
        return ctx.body = {
            status: "error",
            message: "Transferência não realizada. Verifique os IDs e o saldo do comprador."
        };
    }

    ctx.status = 200;
    return ctx.body = {
        status: "success",
        message: "Transferência realizada com sucesso",
        data: transferencia
    };
}


async function depositarController(ctx) {
    const { id } = ctx.params;
    const { valor } = ctx.request.body;

    if (!valor || valor <= 0) {
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
    return ctx.body = {
        status: "success",
        message: "Depósito realizado com sucesso",
        data: deposito
    };
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
    return ctx.body = {
        status: "success",
        message: "Saque realizado com sucesso",
        data: saque
    };
}

module.exports = { depositarController, transferirController, sacarController }