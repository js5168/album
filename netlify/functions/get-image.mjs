import { getStore } from '@netlify/blobs';

export const handler = async function (event) {
  try {
    const key = event.queryStringParameters && event.queryStringParameters.key;
    if (!key) {
      return { statusCode: 400, body: 'missing key' };
    }
    const store = getStore({ name: 'site-images' });
    const result = await store.getWithMetadata(key, { type: 'arrayBuffer' });
    if (!result) {
      return { statusCode: 404, body: 'not found' };
    }
    const contentType = (result.metadata && result.metadata.contentType) || 'application/octet-stream';
    const buffer = Buffer.from(result.data);
    return {
      statusCode: 200,
      headers: { 'Content-Type': contentType, 'Cache-Control': 'public, max-age=31536000, immutable' },
      body: buffer.toString('base64'),
      isBase64Encoded: true
    };
  } catch (e) {
    return { statusCode: 500, body: 'error: ' + e.message };
  }
};
