/* eslint-disable no-restricted-syntax */
require('dotenv').config();

const { logHandler, MessageError } = require('@anwr-media/error-handling');

function MappingController(dependencies, usecases) {
  async function processEvent(event, context) {
    for (const record of event.Records) {
      let messageType;
      let fileKey;
      try {
        const { s3 } = record;
        messageType = s3.bucket.name;
        fileKey = s3.object.key;
        console.log(s3);
        //const data = JSON.parse(s3);
        //console.log(data)
        //message = JSON.parse(data.Message);
      } catch (error) {
        throw new MessageError(MessageError.INVALID_MESSAGE, 'could not parse message in the event', null, error);
      }

      const fileContents = await usecases.readCSVFile(dependencies, fileKey);
      await usecases.persistAndEmit(dependencies, fileContents);
    }
  }
  return {
    processEvent,
  };
}

module.exports = MappingController;
