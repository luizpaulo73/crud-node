    const bancoDeDados = {
        contas: [],
        lastId: 0
    };
    
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
    
    function listarContaPorId(id) {
        return bancoDeDados.contas.find(conta => conta.id == id);
    }
    
    function listarContas() {
        return bancoDeDados.contas;
    }
    
    function depositar(id, valor) {
        if (valor <= 0) {
            console.log("Depósito falhou: Valor inválido.");
            return null;
        }
    
        const conta = listarContaPorId(id);
        if (conta) {
            conta.saldo += valor;
            return conta;
        }
        return null;
    }
    
    function sacar(id, valor) {
        if (valor <= 0) {
            console.log("Saque falhou: Valor inválido.");
            return null;
        }
    
        const conta = listarContaPorId(id);
        if (conta && conta.saldo >= valor) {
            conta.saldo -= valor;
            return conta;
        }
    
        console.log("Saque falhou: Saldo insuficiente ou conta não encontrada.");
        return null;
    }
    
    function transferir(idComprador, idVendedor, valor) {
        if (valor <= 0) {
            console.log("Transferência falhou: Valor inválido.");
            return null;
        }
    
        const contaComprador = listarContaPorId(idComprador);
        const contaVendedor = listarContaPorId(idVendedor);
    
        if (!contaComprador || !contaVendedor) {
            console.log("Transferência falhou: Conta(s) não encontrada(s).");
            return null;
        }
    
        if (contaComprador.saldo < valor) {
            console.log("Transferência falhou: Saldo insuficiente.");
            return null;
        }
    
        contaComprador.saldo -= valor;
        contaVendedor.saldo += valor;
        return { comprador: contaComprador, vendedor: contaVendedor };
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
    