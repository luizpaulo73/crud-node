const AWS = require('aws-sdk');

// Configura o DynamoDB local
const dynamodb = new AWS.DynamoDB({
  region: 'us-east-1',
  endpoint: 'http://localhost:8000',
  accessKeyId: 'fakeMyKeyId',
  secretAccessKey: 'fakeSecretKey'
});

const tableName = 'Conta';

async function verificarOuCriarTabela() {
  try {
    const tabelas = await dynamodb.listTables().promise();

    if (tabelas.TableNames.includes(tableName)) {
      console.log(`✅ Tabela "${tableName}" já existe.`);
      return;
    }

    const params = {
      TableName: tableName,
      KeySchema: [
        { AttributeName: 'PK', KeyType: 'HASH' },
        { AttributeName: 'SK', KeyType: 'RANGE' }
      ],
      AttributeDefinitions: [
        { AttributeName: 'PK', AttributeType: 'S' },
        { AttributeName: 'SK', AttributeType: 'S' }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      }
    };

    await dynamodb.createTable(params).promise();
    console.log(`✅ Tabela "${tableName}" criada com sucesso.`);

  } catch (error) {
    console.error('❌ Erro ao verificar ou criar tabela:', error);
  }
}

verificarOuCriarTabela();