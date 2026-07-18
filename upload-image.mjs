import { getStore } from '@netlify/blobs';

/* 後台管理密碼：跟 save-data.mjs、public/index.html 裡的 ADMIN_PW 要保持一致 */
const ADMIN_PW = 'admin123';

export const handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  try {
    const body = JSON.parse(event.body || '{}');
    if (body.password !== ADMIN_PW) {
      return { statusCode: 401, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: '密碼錯誤' }) };
    }
    if (!body.dataUrl || !body.key) {
      return { statusCode: 400, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: '缺少圖片資料' }) };
    }
    const match = /^data:(.+);base64,(.*)$/.exec(body.dataUrl);
    if (!match) {
      return { statusCode: 400, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: '圖片格式錯誤' }) };
    }
    const contentType = match[1];
    const buffer = Buffer.from(match[2], 'base64');
    const store = getStore({ name: 'site-images' });
    await store.set(body.key, buffer, { metadata: { contentType: contentType } });
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true, key: body.key }) };
  } catch (e) {
    return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: e.message }) };
  }
};
