/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-restricted-syntax */
require('dotenv').config();

const { logHandler } = require('@anwr-media/error-handling');
const { GetObjectCommand, PutObjectCommand, S3Client } = require('@aws-sdk/client-s3');

const client = new S3Client({});

async function getObject(bucket, key) {
  try {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    const data = await client.send(command);

    return data.Body;
  } catch (e) {
    throw new Error(`Could not retrieve file from S3: ${e.message}`);
  }
}

class S3Bucket {
  // eslint-disable-next-line class-methods-use-this
  async getCSV(fileKey) {
    let data = await getObject(process.env.BUCKET_CSV, fileKey);
    data = await data.transformToString();
    return data;
  }

  // eslint-disable-next-line class-methods-use-this
  async writeObject(data) {
    return writeData(data);
  }
}

const s3bucket = new S3Bucket();
module.exports = s3bucket;
