const db = require('../db.js');

async function getContasRepository() {
    const contas = await db.listarContas();
    return contas;
}

async function getContaPorIdRepository(id) {
    const conta = await db.listarContaPorId(id);
    if (!conta) {
        throw new Error('Conta não encontrada');
    }
    return conta;
}

async function criarContaRepository(nomeUsuario, email) {
    if (!nomeUsuario || !email) {
        throw new Error('Nome de usuário e email são obrigatórios');
    }
    const conta = await db.criarConta(nomeUsuario, email);
    if (!conta) {
        throw new Error('Erro ao criar conta');
    }
    return conta;
}

async function deletarContaRepository(id) {
    const conta = await db.excluirConta(id)
    if (!conta) {
        throw new Error('Conta não encontrada')
    }
    return `Conta com id: ${id} deletada`
}

module.exports = { getContasRepository, criarContaRepository, getContaPorIdRepository, deletarContaRepository };