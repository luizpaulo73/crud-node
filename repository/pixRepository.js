const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const { detectarTipoChavePix } = require("../utils/validarPix");

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

async function realizarPixRepository(idPagador, valor, chave) {
    if (valor <= 0) {
        throw new Error('Valor inválido.');
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
    // PK: `PIX#${tipoPix}#${chave}`,
    // SK: `CLIENTE#${idCliente}`,
    const idRecebedor = await buscarIdPorChavePix(chave)
    

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
        tipo: 'PIX',
        valor,
        data,
        hora,
        recebedor: idRecebedor
    }

    const paramsExtratoRecebedor = {
        PK: `CLIENTE#${idRecebedor}`,
        SK: `EXTRATO#ENTRADA#${uuidv4()}`,
        tipo: 'PIX',
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
            message: "Transferência realizada com sucesso.",
            data: {
                pagador: {
                    id: idPagador,
                    conta: dataPagador.Attributes.SK.split('#')[1],
                    novoSaldo: dataPagador.Attributes.saldo
                },
                recebedor: {
                    id: idRecebedor,
                    conta: dataRecebedor.Attributes.SK.split('#')[1],
                    novoSaldo: dataRecebedor.Attributes.saldo
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

async function buscarIdPorChavePix(chave) {

    const tipoPix = detectarTipoChavePix(chave)
        if (tipoPix === 'INVALIDO') {
            throw new Error('Chave inválida')
        }
    

    const params = {
        TableName: 'Conta',
        KeyConditionExpression: 'PK = :PK and begins_with(SK, :SK)', // PK = :PK and begins
        ExpressionAttributeValues: {
            ':PK': `PIX#${tipoPix}#${chave}`,
            ':SK': `CLIENTE#`
        }
    }

    try {
        const idCliente = await documentClient.query(params).promise();
        
        return idCliente.Items[0].SK.split('#')[1]
    } catch (error) {
        throw new Error('Chave não encontrada')
    }
}

module.exports = { cadastrarPixRepository, buscarPixRepository, realizarPixRepository };