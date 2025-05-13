function detectarTipoChavePix(valor) {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexCpf = /^\d{11}$/;

    if (regexEmail.test(valor)) {
        return 'EMAIL';
    } else if (regexCpf.test(valor)) {
        return 'TELEFONE';
    } else {
        return 'INVALIDO';
    }
}

module.exports = { detectarTipoChavePix };