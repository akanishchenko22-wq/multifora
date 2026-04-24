// pages/api/create-folders.js
// Шаг 1 → Шаг 2: создаёт структуру папок на Яндекс.Диске.
// Вызывается сразу после нажатия «Начать» на первом экране — в фоне.
// Клиент НЕ ждёт ответа: переход на экран 2 происходит немедленно.
// Резолвит Promise только после фактического создания всех папок (~5 сек).

export const config = {
  api: {
    bodyParser: { sizeLimit: '1mb' },
  },
};

const YANDEX_API = 'https://cloud-api.yandex.net/v1/disk';
const TOKEN     = process.env.YANDEX_DISK_TOKEN;

async function createFolder(path) {
  if (!TOKEN) return; // dev-mode: skip if no token
  const res = await fetch(
    `${YANDEX_API}/resources?path=${encodeURIComponent(path)}`,
    { method: 'PUT', headers: { Authorization: `OAuth ${TOKEN}` } }
  );
  // 409 = папка уже существует — это нормально
  if (!res.ok && res.status !== 409) {
    const text = await res.text();
    throw new Error(`Папка «${path}» (${res.status}): ${text}`);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fullName } = req.body ?? {};
  if (!fullName || fullName.trim().length < 3) {
    return res.status(400).json({ error: 'fullName обязателен' });
  }

  const name     = fullName.trim();
  const basePath = `disk:/Мультифора/${name}`;

  const folders = [
    'disk:/Мультифора',
    basePath,
    `${basePath}/1. Паспорт`,
    `${basePath}/2. СНИЛС`,
    `${basePath}/3. ИНН`,
    `${basePath}/4. Трудовая книжка`,
    `${basePath}/5. Образование`,
    `${basePath}/6. Уровень английского`,
    `${basePath}/7. Водительские права`,
    `${basePath}/8. Военный билет`,
    `${basePath}/9. О семье`,
  ];

  try {
    for (const folder of folders) {
      await createFolder(folder);
      console.log('[create-folders] ✓', folder);
    }
    console.log('[create-folders] Все папки созданы для:', name);
    return res.status(200).json({ basePath });
  } catch (err) {
    console.error('[create-folders] Ошибка:', err.message);
    // Всё равно возвращаем basePath — клиент продолжит работу,
    // а следующие загрузки повторно попытаются создать папки при необходимости.
    return res.status(200).json({ basePath, warning: err.message });
  }
}
