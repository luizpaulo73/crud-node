function detectarTipoChavePix(valor) {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexTelefone = /^\+?[1-9]{1}[0-9]{7,14}$/;
    const regexCpf = /^\d{11}$/;
    const regexCnpj = /^\d{14}$/;

    if (regexEmail.test(valor)) {
        return 'EMAIL';
    } else if (regexTelefone.test(valor)) {
        return 'TELEFONE';
    } else if (regexCpf.test(valor)) {
        return 'CPF';
    } else if (regexCnpj.test(valor)) {
        return 'CNPJ';
    } else {
        return 'INVALIDO';
    }
}

module.exports = { detectarTipoChavePix };