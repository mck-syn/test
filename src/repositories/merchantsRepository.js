require('dotenv');

const { DynamoDBDocument } = require('@aws-sdk/lib-dynamodb');
const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const { GeneralError } = require('@anwr-media/error-handling');

const docClient = DynamoDBDocument.from(new DynamoDB());

async function get(id) {
  const params = {
    TableName: process.env.DDB_MERCHANT_TO_MARKETPLACE,
    Key: {
      gln: id,
    },
  };
  let response = {};
  try {
    ({ Item: response } = await docClient.get(params));
  } catch (error) {
    throw new GeneralError(GeneralError.COLOR_TABLE_NO_ACCESS, `for id: ${id}`, null, error);
  }
  return response;
}
async function update(item) {
  const params = {
    TableName: process.env.DDB_MERCHANT_TO_MARKETPLACE,
    Key: { gln: `${item.gln}` },
    UpdateExpression: 'set marketplaces = :m',
    ExpressionAttributeValues: {
      ':m': item.marketplaces,
    },
    ReturnValues: 'ALL_NEW',
  };
  let response = {};
  try {
    ({ Attributes: response } = await docClient.update(params));
  } catch (error) {
    throw new GeneralError(GeneralError.UNKNOWN_ERROR, `merchant-to-marketplaces-assignments ERROR: ${item.id}`, null, error);
  }
  return response;
}

async function persist(row) {
  const object = await get(row.gln);
  if (object && object.marketplaces.toString() === row.marketplaces.toString()) {
    return false;
  }
  await update(row);
  return true;
}

async function put(id, item) {
  const codes = {
    code: item.newCode,
    parent: item.parentNew,
    name: item.name,
  };
  return update({ id, codes });
}

module.exports = {
  get,
  put,
  persist,
};
