const { depositarRepository, sacarRepository, transferirRepository } = require("../repository/transacaoRepository")

async function transferirController(ctx) {
    const { idComprador, idVendedor, valor } = ctx.request.body;

    console.log("idComprador:", idComprador);
    console.log("idVendedor:", idVendedor);
    console.log("valor:", valor);

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

    const deposito = await depositarRepository(id, valor)

    ctx.body = {
        status: "success",
        message: "Deposito realizado com sucesso",
        data: deposito
    }
    ctx.status = 200;
}

async function sacarController(ctx) {
    const { id } = ctx.params;
    const { valor } = ctx.request.body;
    
    const saque = await sacarRepository(id, valor)



    ctx.body = {
        status: "success",
        message: "Saque realizado com sucesso",
        data: saque
    }
    ctx.status = 200;

}

module.exports = { depositarController, transferirController, sacarController }