const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const documentClient = new AWS.DynamoDB.DocumentClient({
    region: 'us-east-1',
    endpoint: 'http://dynamodb-local:8000',
    accessKeyId: 'fakeMyKeyId',
    secretAccessKey: 'fakeSecretAccessKey',
});

    /**
    * Cria uma nova conta no Dynamodb
    * @param {string} nomeUsuario
    * @param {string} email
    * @returns {Promise<Object>}  
    */

async function depositarRepository(id, valor) {
    if (valor <= 0 ) {
        console.log("Depósito falhou: Valor inválido.");
        return null;
    }
    if (!id) {
        console.log("Depósito falhou: ID inválido.");
    }

    const tempoAtual = new Date();
    const data = tempoAtual.toLocaleDateString('pt-BR', {timeZone: 'America/Sao_Paulo'});
    const hora = tempoAtual.toLocaleTimeString('pt-BR', {timeZone: 'America/Sao_Paulo'});

    const paramsConta = {
        TableName: 'Conta',
        Key: {
            PK: `CLIENTE#${id}`,
            SK: `CONTA#CORRENTE`
        },
        UpdateExpression: 'set saldo = saldo + :valor',
        ExpressionAttributeValues: {
            ':valor': valor
        },
        ReturnValues: 'ALL_NEW' // retorna oq mudou
    }

    const paramsExtrato = {
        PK: `CLIENTE#${id}`,
        SK: `EXTRATO#DEPOSITO#${uuidv4()}`,
        tipo: 'DEPOSITO',
        valor,
        data,
        hora
    }

    try {
        const data = await documentClient.update(paramsConta).promise();
        await documentClient.put({TableName: 'Conta', Item: paramsExtrato}).promise();
        return {
            status: "success",
            message: "Depósito realizado com sucesso",
            data: {
                id: data.Attributes.PK.split('#')[1],
                conta: data.Attributes.SK.split('#')[1],
                novoSaldo: data.Attributes.saldo
            }
        };
        
    } catch (err) {
        if (err.code === 'ConditionalCheckFailedException') {
            return {mensagem: "Depósito falhou: Saldo insuficiente"};
        }
        return {mensagem: "Erro ao sacar"};
    }
}

async function sacarRepository(id, valor) {
    if (valor <= 0 ) {
        console.log("Saque falhou: Valor inválido.");
        return null;
    }
    if (!id) {
        console.log("Saque falhou: ID inválido.");
    }

    const agora = new Date();
    const data = agora.toLocaleDateString('pt-BR', {timeZone: 'America/Sao_Paulo'});
    const hora = agora.toLocaleTimeString('pt-BR', {timeZone: 'America/Sao_Paulo'});

    const paramsConta = {
        TableName: 'Conta',
        Key: {
            PK: `CLIENTE#${id}`,
            SK: `CONTA#CORRENTE`
        },
        UpdateExpression: 'set saldo = saldo - :valor',
        ConditionExpression: 'saldo >= :valor',
        ExpressionAttributeValues: {
            ':valor': valor
        },
        ReturnValues: 'ALL_NEW' // retorna oq mudou
    }

    const paramsExtrato = {
        PK: `CLIENTE#${id}`,
        SK: `EXTRATO#SAQUE#${uuidv4()}`,
        tipo: 'SAQUE',
        valor,
        data,
        hora
    }

    try {
        const data = await documentClient.update(paramsConta).promise();
        await documentClient.put({TableName: 'Conta', Item: paramsExtrato}).promise();
        return {
            status: "success",
            message: "Saque realizado com sucesso.",
            data: {
                id: data.Attributes.PK.split('#')[1],
                conta: data.Attributes.SK.split('#')[1],
                novoSaldo: data.Attributes.saldo
            }
        };
        
    } catch (err) {
        return null;
    }
}

async function transferirRepository(idPagador, idRecebedor, valor) {
    if (valor <= 0 ) {
        console.log("Depósito falhou: Valor inválido.");
        return null;
    }

    const agora = new Date();
    const data = agora.toLocaleDateString('pt-BR', {timeZone: 'America/Sao_Paulo'});
    const hora = agora.toLocaleTimeString('pt-BR', {timeZone: 'America/Sao_Paulo'});

    const paramsPagador = {
        TableName: 'Conta',
        Key: {
            PK: `CLIENTE#${idPagador}`,
            SK: `CONTA#CORRENTE`
        },
        UpdateExpression: 'set saldo = saldo - :valor',
        ConditionExpression: 'saldo >= :valor',
        ExpressionAttributeValues: {
            ':valor': valor
        },
        ReturnValues: 'ALL_NEW' // retorna oq mudou
    }

    const paramsRecebedor = {
        TableName: 'Conta',
        Key: {
            PK: `CLIENTE#${idRecebedor}`,
            SK: `CONTA#CORRENTE`
        },
        UpdateExpression: 'set saldo = saldo + :valor',
        ExpressionAttributeValues: {
            ':valor': valor
        },
        ReturnValues: 'ALL_NEW' // retorna oq mudou
    }

    const paramsExtratoPagador = {
        PK: `CLIENTE#${idPagador}`,
        SK: `EXTRATO#SAIDA#${uuidv4()}`,
        tipo: 'TRANSFERENCIA',
        valor,
        data,
        hora,
        recebedor: idRecebedor
    }

    const paramsExtratoRecebedor = {
        PK: `CLIENTE#${idRecebedor}`,
        SK: `EXTRATO#ENTRADA#${uuidv4()}`,
        tipo: 'TRANSFERENCIA',
        valor,
        data,
        hora,
        pagador: idPagador
    }

    try {
        const dataPagador = await documentClient.update(paramsPagador).promise();
        const dataRecebedor = await documentClient.update(paramsRecebedor).promise();
        await documentClient.put({TableName: 'Conta', Item: paramsExtratoPagador}).promise();
        await documentClient.put({TableName: 'Conta', Item: paramsExtratoRecebedor}).promise();
        return {
            status: "success",
            message: "Transferência realizada com sucesso",
            data: {
                dataPagador: {
                    id: dataPagador.Attributes.PK.split('#')[1],
                    conta: dataPagador.Attributes.SK.split('#')[1],
                    saldo: dataPagador.Attributes.saldo
                },
                dataRecebedor: {
                    id: dataRecebedor.Attributes.PK.split('#')[1],
                    conta: dataRecebedor.Attributes.SK.split('#')[1],
                    saldo: dataRecebedor.Attributes.saldo
                }
            }
        };
        
        
    } catch (err) {
        if (err.code === 'ConditionalCheckFailedException') {
            return {mensagem: "Depósito falhou: Saldo insuficiente"};
        }
        return {mensagem: "Erro ao sacar"};
    }
}

module.exports = { depositarRepository, sacarRepository, transferirRepository }