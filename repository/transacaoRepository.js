const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const documentClient = new AWS.DynamoDB.DocumentClient({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000',
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

    const params = {
        TableName: 'Conta',
        Key: {
            PK: `CLIENTE#${id}`,
            SK: `CONTA#CORRENTE`
        },
        UpdateExpression: 'set saldo = saldo + :valor',
        ConditionExpression: 'saldo >= :valor',
        ExpressionAttributeValues: {
            ':valor': valor
        },
        ReturnValues: 'ALL_NEW' // retorna oq mudou
    }

    try {
        const data = await documentClient.update(params).promise();;
        return data.Attributes; // retorna os dados atualizados
        
        
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

    const params = {
        TableName: 'Conta',
        Key: {
            PK: `CLIENTE#${id}`,
            SK: `CONTA#CORRENTE`
        },
        UpdateExpression: 'set saldo = saldo - :valor',
        ExpressionAttributeValues: {
            ':valor': valor
        },
        ReturnValues: 'ALL_NEW' // retorna oq mudou
    }

    try {
        const data = await documentClient.update(params).promise();;
        return data.Attributes; // retorna os dados atualizados
        
        
    } catch (err) {
        return null;
    }
}

async function transferirRepository(idComprador, idVendedor, valor) {
    if (valor <= 0 ) {
        console.log("Depósito falhou: Valor inválido.");
        return null;
    }

    const paramsComprador = {
        TableName: 'Conta',
        Key: {
            PK: `CLIENTE#${idComprador}`,
            SK: `CONTA#CORRENTE`
        },
        UpdateExpression: 'set saldo = saldo - :valor',
        ConditionExpression: 'saldo >= :valor',
        ExpressionAttributeValues: {
            ':valor': valor
        },
        ReturnValues: 'ALL_NEW' // retorna oq mudou
    }

    const paramsVendedor = {
        TableName: 'Conta',
        Key: {
            PK: `CLIENTE#${idVendedor}`,
            SK: `CONTA#CORRENTE`
        },
        UpdateExpression: 'set saldo = saldo + :valor',
        ExpressionAttributeValues: {
            ':valor': valor
        },
        ReturnValues: 'ALL_NEW' // retorna oq mudou
    }

    try {
        const dataComprador = await documentClient.update(paramsComprador).promise();
        const dataVendedor = await documentClient.update(paramsVendedor).promise();
        return {dataComprador, dataVendedor}; // retorna os dados atualizados
        
        
    } catch (err) {
        if (err.code === 'ConditionalCheckFailedException') {
            return {mensagem: "Depósito falhou: Saldo insuficiente"};
        }
        return {mensagem: "Erro ao sacar"};
    }
}

module.exports = { depositarRepository, sacarRepository, transferirRepository }