const { handler } = require('./index');

// for CSV Update
const readCSV = {
  Records: [
    {
      s3: {
        bucket: {
          name: 'dev-merchant-csv-bucket',
        },
        object: {
          key: 'merchants.csv',
        },
      },
      body: '{"Message" : "{\\"id\\":155,\\"productId\\":108411,\\"type\\":\\"readCSV\\",\\"processed\\":0,\\"modelId\\":\\"31333523333130373030\\",\\"previousModelId\\":null,\\"full\\":null}"}',
      eventSource: 'devtest',
    },
  ],
};

handler(readCSV).then((result) => {
  console.log(result);
});
