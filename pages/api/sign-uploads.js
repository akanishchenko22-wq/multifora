// pages/api/sign-uploads.js
// Принимает список путей на Яндекс.Диске, возвращает подписанные upload-URL
// для прямой загрузки из браузера (минуя наш сервер).
//
// Зачем: Vercel Hobby ограничивает тело запроса 4.5 MB и время функции 10 сек.
// Значит файлы нельзя гнать через /api/* — надо отдавать клиенту подписанные
// href'ы и пусть он сам делает PUT в uploader*.disk.yandex.net.

const YANDEX_API = 'https://cloud-api.yandex.net/v1/disk';
const TOKEN      = process.env.YANDEX_DISK_TOKEN;

// Лимит — защита от абьюза (паспорт до 20 + остальные документы).
const MAX_PATHS = 80;

async function signOne(path) {
  const url = `${YANDEX_API}/resources/upload?path=${encodeURIComponent(path)}&overwrite=true`;
  const r = await fetch(url, { headers: { Authorization: `OAuth ${TOKEN}` } });
  if (!r.ok) {
    const text = await r.text();
    throw new Error(`sign ${path} (${r.status}): ${text}`);
  }
  const { href } = await r.json();
  return { path, href };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!TOKEN) return res.status(500).json({ error: 'YANDEX_DISK_TOKEN is not set' });

  const { paths } = req.body ?? {};
  if (!Array.isArray(paths) || paths.length === 0) {
    return res.status(400).json({ error: 'paths: non-empty array required' });
  }
  if (paths.length > MAX_PATHS) {
    return res.status(400).json({ error: `paths too many (max ${MAX_PATHS})` });
  }
  if (paths.some(p => typeof p !== 'string' || !p)) {
    return res.status(400).json({ error: 'each path must be a non-empty string' });
  }

  try {
    const links = await Promise.all(paths.map(signOne));
    return res.status(200).json({ links });
  } catch (err) {
    console.error('[sign-uploads]', err.message);
    return res.status(500).json({ error: err.message });
  }
}
