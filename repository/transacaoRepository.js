const db = require("../db.js")

async function depositarRepository(id, valor) {
    deposito = await db.depositar(id, valor);
    return deposito;
}

async function sacarRepository(id, valor) {
    saque = await db.sacar(id, valor);
    return saque;
}

async function transferirRepository(idComprador, idVendedor, valor) {
    const transferencia = await db.transferir(idComprador, idVendedor, valor);
    return transferencia;
}

module.exports = { depositarRepository, sacarRepository, transferirRepository }