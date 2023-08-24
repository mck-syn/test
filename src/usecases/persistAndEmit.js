/* eslint-disable no-restricted-syntax */
const { logHandler } = require('@anwr-media/error-handling');

async function process(dependencies, fileContents) {
  for (const row of fileContents) {
    const changed = await dependencies.merchantRepository.persist(row);
    if (changed) await dependencies.snsService.emit(row);
  }
}

module.exports = process;
