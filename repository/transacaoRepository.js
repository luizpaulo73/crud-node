const db = require("../db.js")

async function depositarRepository(id) {
    deposito = await db.depositar(id);
    return deposito;
}

module.exports = { depositarRepository }