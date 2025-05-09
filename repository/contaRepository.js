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

async function getContasRepository() {
    const params = {
        TableName: 'Conta',
    }

    try {
        const data = await documentClient.scan(params).promise();
        return data.Items;
    } catch (err) {
        console.error(err);
    }
}

async function getContaPorIdRepository(id) {
    if (!id) {
        throw new Error('ID inválido.');
    }

    const params = {
        TableName: 'Conta',
        KeyConditionExpression: 'PK = :id',
        ExpressionAttributeValues: {
            ':id': `CLIENTE#${id}`
        }
    }

    try {
        const data = await documentClient.query(params).promise();
        return data;
    } catch (err) {
        console.error(err);
    }
}

async function criarContaRepository(nomeUsuario, email) {
    if (!nomeUsuario || !email) {
        throw new Error('Nome de usuário e e-mail são obrigatórios');
    }

    const clienteId = uuidv4();

    const cliente = {
        PK: `CLIENTE#${clienteId}`,
        SK: `METADADOS`,
        nomeUsuario,
        email
    }

    const conta = {
        PK: `CLIENTE#${clienteId}`,
        SK: "CONTA#CORRENTE",
        saldo: 0
    }

    try {
        await documentClient.put({TableName: 'Conta', Item: cliente}).promise();
        await documentClient.put({TableName: 'Conta', Item: conta}).promise();
        return {cliente, conta};
    } catch (error) {
        console.log("Erro ao criar conta: ", error);
        throw new Error('Erro ao criar conta');
    }
}

async function deletarContaRepository(id) {
    if (!id) {
        throw new Error('ID inválido. O ID deve ser um número positivo.');
    }

    const params = {
        TableName: 'Conta',
        KeyConditionExpression: 'PK = :id',
        ExpressionAttributeValues: {
            ':id': `CLIENTE#${id}`
        }
    }

    try {
        const data = await documentClient.query(params).promise();
    
        if (data.Items.length === 0) {
            return {message: "Nenhum dado encontrado para esse cliente"}
        }

        for (const item of data.Items) {
            const paramsDelete = {
                TableName: 'Conta',
                Key: {
                    PK: item.PK,
                    SK: item.SK
                }
            }

            await documentClient.delete(paramsDelete).promise();
        }

    } catch (err) {
        console.log("Erro ao deletar conta: ", err);
    }
}

module.exports = { getContasRepository, criarContaRepository, getContaPorIdRepository, deletarContaRepository };