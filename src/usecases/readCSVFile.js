/* eslint-disable no-restricted-syntax */
const { logHandler } = require('@anwr-media/error-handling');

async function process(dependencies, fileKey) {
  let data = await dependencies.s3repository.getCSV(fileKey);
  const out = [];
  data = data.split('\n');
  for (let row of data) {
    row = row.replaceAll('\r', '').replaceAll(' ', '');
    const rowArray = row.split(',');
    const gln = rowArray[0];
    const marketplaces = rowArray.splice(1);

    const outObject = {
      gln,
      marketplaces,
    };
    out.push(outObject);
  }
  return out;
}

module.exports = process;
