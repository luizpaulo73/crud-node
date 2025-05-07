const { getContasRepository,
        getContaPorIdRepository,
        criarContaRepository,
        deletarContaRepository } = require('../repository/contaRepository.js');

async function getContas(ctx) {
    const contas = await getContasRepository();
    if (!contas) {
        ctx.status = 404;
        ctx.body = { message: 'Contas não encontradas' };
        return;
    }
    ctx.body = contas;

}

async function getContaPorId(ctx) {
    const { id } = ctx.params;
    
    const conta = await getContaPorIdRepository(id);
    if (!conta) {
        ctx.status = 404;
        ctx.body = { message: 'Conta não encontrada' };
        return;
    }
    ctx.body = conta;
}

async function criarConta(ctx) {
    try {
        const { nomeUsuario, email } = ctx.request.body;

        if (!nomeUsuario || !email) {
            ctx.status = 400;
            ctx.body = { message: 'Nome de usuário e email são obrigatórios' };
            return;
        }

        const conta = await criarContaRepository(nomeUsuario, email);
        ctx.status = 201;
        ctx.body = conta;
    } catch (error) {
        ctx.status = 500;
        ctx.body = { message: error.message || 'Erro ao criar conta' };
    }
}

async function deletarConta(ctx) {
    const { id } = ctx.params;

    const contaDeletada = await deletarContaRepository(id);
    ctx.status = 204;
}

module.exports = { getContas, criarConta, getContaPorId, deletarConta };