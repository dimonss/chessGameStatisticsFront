/**
 * Нормализует путь к изображению с учетом окружения
 * Если путь относительный, добавляет правильный префикс API
 */
export function getImageUrl(path: string | undefined | null): string | undefined {
  if (!path) return undefined;
  // Получаем базовый URL API
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  if (API_BASE_URL) {
    // Production: используем полный URL из VITE_API_URL
    return `${API_BASE_URL}${path}`;
  } else {
    // Development: используем относительный путь с /api
    return path;
  }
}

