const { getStore } = require('@netlify/blobs');

/* 後台管理密碼：跟 upload-image.js、public/index.html 裡的 ADMIN_PW 要保持一致 */
const ADMIN_PW = 'admin123';

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  try {
    const body = JSON.parse(event.body || '{}');
    if (body.password !== ADMIN_PW) {
      return { statusCode: 401, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: '密碼錯誤' }) };
    }
    if (!body.data) {
      return { statusCode: 400, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: '缺少資料' }) };
    }
    const store = getStore({ name: 'site-data', consistency: 'strong' });
    await store.setJSON('catalog', body.data);
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true }) };
  } catch (e) {
    return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: e.message }) };
  }
};
