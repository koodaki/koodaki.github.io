const BASE = import.meta.env.BASE_URL;

/**
 * مسیر یک فایل مدیا (مثل /uploads/x.jpg) را با base سایت ترکیب می‌کند تا
 * روی زیرشاخه‌ی GitHub Pages هم درست کار کند.
 * مسیرهای کامل (http/https/data) دست‌نخورده برمی‌گردند.
 *
 * مزیت دوام: مسیرها در محتوا base-agnostic می‌مانند؛ تغییر base فقط همین‌جا اثر می‌کند.
 */
export function withBase(path: string): string {
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path;
  const prefix = BASE.endsWith('/') ? BASE : BASE + '/';
  return prefix + path.replace(/^\//, '');
}
