/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */

require('dotenv').config();
const { logHandler, IError, GeneralError } = require('@anwr-media/error-handling');
const MapperController = require('./controller/mappingController');
const s3repository = require('./repositories/s3reader');
const persistAndEmit = require('./usecases/persistAndEmit');
const readCSVFile = require('./usecases/readCSVFile');
const snsService = require('./services/snsService');

const merchantRepository = require('./repositories/merchantsRepository');

// dev mode
if (process.env.AWS_PROFILE && process.env.AWS_PROFILE === 'localdev') {
};

const dependencies = {
  s3repository,
  snsService,
  merchantRepository,
};

const usecases = {
  readCSVFile,
  persistAndEmit,
};

const mappingController = new MapperController(dependencies, usecases);

module.exports.handler = async (event, context) => {
  try {
    // do stuff
    await mappingController.processEvent(event, context);
    return {
      statusCode: 200,
      body: 'Successfully finished',
    };
  } catch (error) {
    if (error instanceof IError) {
      logHandler.error(error);
    } else {
      logHandler.error(new GeneralError(GeneralError.UNKNOWN_ERROR, 'Error during processing event', error));
    }
    return {
      statusCode: 500,
      body: 'Finished with errors',
    };
  }
};
