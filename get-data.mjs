import { getStore } from '@netlify/blobs';

function defaultData() {
  return { albums: [], products: [], settings: { siteTitle: '簡單相簿 Simple Album', logo: null } };
}

export const handler = async function (event) {
  try {
    const store = getStore({ name: 'site-data', consistency: 'strong' });
    const data = await store.get('catalog', { type: 'json' });
    const result = data || defaultData();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      body: JSON.stringify(result)
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message, stack: e.stack }) };
  }
};
