const bancoDeDados = {
    contas: [],
    lastId: 0
  };
  
  // Criar uma nova conta
  function criarConta(nomeUsuario, email) {
    const novaConta = {
      id: ++bancoDeDados.lastId,
      nomeUsuario,
      email,
      saldo: 0
    };
    
    bancoDeDados.contas.push(novaConta);
    return novaConta;
  }
  
  // Buscar conta por ID
  function listarContaPorId(id) {
    return bancoDeDados.contas.find(conta => conta.id == id);
  }
  
  // Listar todas as contas
  function listarContas() {
    return bancoDeDados.contas;
  }
  
  // Depositar valor
  function depositar(id, valor) {
    const conta = listarContaPorId(id);
    if (conta) {
      conta.saldo += valor;
      return conta;
    }
    return null;
  }
  function sacar(id, valor) {
    const conta = listarContaPorId(id);
    if (conta && conta.saldo >= valor) {
      conta.saldo -= valor;
      return conta;
    }
    return null;
  }

  function transferir(idComprador, idVendedor, valor) {
    const contaComprador = listarContaPorId(idComprador);
    const contaVendedor = listarContaPorId(idVendedor);

    console.log("Conta Comprador:", contaComprador);
    console.log("Conta Vendedor:", contaVendedor);
    console.log("Valor da transferência:", valor);

    if (contaComprador && contaVendedor && contaComprador.saldo >= valor) {
        contaComprador.saldo -= valor;
        contaVendedor.saldo += valor;
        return { comprador: contaComprador, vendedor: contaVendedor };
    }

    console.log("Transferência falhou: Verifique os IDs ou o saldo.");
    return null;
}
  
  function excluirConta(id) {
    const index = bancoDeDados.contas.findIndex(conta => conta.id == id);
    if (index !== -1) {
      bancoDeDados.contas.splice(index, 1);
      return true;
    }
    return false;
  }

module.exports = {
    criarConta,
    listarContaPorId,
    listarContas,
    depositar,
    sacar,
    excluirConta,
    transferir
  };
