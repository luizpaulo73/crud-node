const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const documentClient = new AWS.DynamoDB.DocumentClient({
    region: 'us-east-1',
    endpoint: 'http://dynamodb-local:8000',
    accessKeyId: 'fakeMyKeyId',
    secretAccessKey: 'fakeSecretAccessKey',
});

async function buscarExtratoRepository(idCliente, tipoTransferencia) {
    if (!idCliente) {
        throw new Error('O id do cliente é obrigatório.');
    }

    const tipoSk = tipoTransferencia ? `EXTRATO#${tipoTransferencia.toUpperCase()}` 
        :`EXTRATO#`

    const params = {
        TableName: 'Conta',
        KeyConditionExpression: 'PK = :idCliente and begins_with(SK, :sk)',
        ExpressionAttributeValues: {
            ':idCliente': `CLIENTE#${idCliente}`,
            ':sk': tipoSk
        }
    }

    try {
        const data = await documentClient.query(params).promise();

        if (data.Items.length === 0) {
            throw new Error('Nenhum extrato encontrado.');
        }

        return {
            idCliente,
            extrato: data.Items.map((item) => ({
                id: item.SK.split('#')[2],
                tipo: item.tipo,
                valor: item.valor,
                data: item.data,
                hora: item.hora,
                ...(item.recebedor && { recebedor: item.recebedor}),
                ...(item.pagador && { pagador: item.pagador})
            }))
        }
    } catch (error) {
        throw new Error('Erro ao buscar Extrato.');
    }
}

module.exports = { buscarExtratoRepository };