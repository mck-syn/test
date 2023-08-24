require('dotenv').config();
const { SNS } = require('@aws-sdk/client-sns');

const snsClient = new SNS();
exports.emit = async (message) => {
  const snsArn = process.env.AWS_SNS_ARN_MERCHANT_UPDATE;

  const params = {
    Message: JSON.stringify(message),
    MessageGroupId: 'processMerchantUpdate', // required for FIFO
    MessageDeduplicationId: Date.now(),
    TargetArn: snsArn,
  };
  const response = {
    topic: snsArn,
  };
  try {
    console.info(`Emitting Update for ${message.gln}`);
    const data = await snsClient.publish(params);
    response.data = data;
    response.status = 200;
  } catch (e) {
    console.log(e.stack);
    response.error = e;
    response.status = 500;
  }
  return response;
};
