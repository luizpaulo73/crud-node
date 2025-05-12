const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const documentClient = new AWS.DynamoDB.DocumentClient({
    region: 'us-east-1',
    endpoint: 'http://dynamodb-local:8000',
    accessKeyId: 'fakeMyKeyId',
    secretAccessKey: 'fakeSecretAccessKey',
});

async function cadastrarPixRepository(chave, tipoPix, idCliente) {
    if (!chave || !tipoPix || !idCliente) {
        throw new Error('Chave não informada.');
    }

    const params = {
        PK: `PIX#${tipoPix}#${chave}`,
        SK: `CLIENTE#${idCliente}`,
    }

    const existePix = await documentClient.get({ TableName: 'Conta', Key: params }).promise();

    if (existePix.Item) {
        throw new Error('Chave já cadastrada.');
    }

    const pixCliente = {
        PK: `CLIENTE#${idCliente}`,
        SK: `PIX#${tipoPix}#${chave}`,
        tipoPix,
        chave,
    }

    const indexPix = {
        PK: `PIX#${tipoPix}#${chave}`,
        SK: `CLIENTE#${idCliente}`,
    }

    try {
        await documentClient.put({ TableName: 'Conta', Item: pixCliente }).promise();
        await documentClient.put({ TableName: 'Conta', Item: indexPix }).promise();
        return {
            pix: {
                idCliente: pixCliente.PK.split("#")[1],
                tipoPix: pixCliente.tipoPix,
                chave: pixCliente.chave
            }
        }
    } catch (error) {
        throw new Error('Erro ao cadastrar Pix.');
    }
}

async function buscarPixRepository(idCliente) {
    if (!idCliente) {
        throw new Error('Id do cliente não informado.');
    }

    const params = {
        TableName: 'Conta',
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
        ExpressionAttributeValues: {
            ':pk': `CLIENTE#${idCliente}`,
            ':sk': 'PIX#',
        }
    }

    try {
        const data = await documentClient.query(params).promise();

        if (data.Items.length === 0) {
            throw new Error("Nenhuma Chave Pix encontrada.");
        }

        return {
            chavesPix: data.Items.map((item) => ({
                tipoPix: item.tipoPix,
                chave: item.chave
            }))
        }
    } catch (error) {
        throw new Error('Erro ao buscar Pix.');
    }
}

module.exports = { cadastrarPixRepository, buscarPixRepository };