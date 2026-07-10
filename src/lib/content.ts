import { getCollection, type CollectionEntry } from 'astro:content';

export type Memory = CollectionEntry<'memories'>;

/** همه‌ی خاطرات، مرتب‌شده از جدید به قدیم. */
export async function getSortedMemories(): Promise<Memory[]> {
  const memories = await getCollection('memories');
  return memories.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** تاریخ کامل فارسی، مثل «۴ تیر ۱۴۰۵». */
export function formatFaDate(date: Date): string {
  return date.toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** ماه و سال فارسی برای گروه‌بندی آرشیو. */
export function formatFaMonthYear(date: Date): string {
  return date.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long' });
}

/** کلید پایدار گروه‌بندی ماهانه (بر اساس تقویم میلادی، نمایش فارسی). */
export function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth()).padStart(2, '0')}`;
}

/** خلاصه‌ی کوتاه از متن Markdown یک خاطره. */
export function excerpt(body: string | undefined, max = 140): string {
  if (!body) return '';
  const text = body
    .replace(/^---[\s\S]*?---/, '') // frontmatter (محض احتیاط)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // تصاویر
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // لینک‌ها → متن
    .replace(/[#>*_`~]/g, ' ') // نشانه‌های md
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= max) return text;
  return text.slice(0, max).trim() + '…';
}

export type TagCount = { tag: string; count: number };

/** فهرست برچسب‌های یکتا همراه با تعداد، مرتب بر اساس بیشترین. */
export function collectTags(memories: Memory[]): TagCount[] {
  const map = new Map<string, number>();
  for (const m of memories) {
    for (const t of m.data.tags ?? []) {
      map.set(t, (map.get(t) ?? 0) + 1);
    }
  }
  return [...map.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'fa'));
}

/** خاطرات دارای یک برچسب مشخص. */
export function memoriesByTag(memories: Memory[], tag: string): Memory[] {
  return memories.filter((m) => (m.data.tags ?? []).includes(tag));
}

export type Photo = { src: string; slug: string; alt: string };

/** تصاویر برجسته (کاور + گالری) از میان خاطرات، برای بخش «لحظه‌های ناب». */
export function collectPhotos(memories: Memory[], max = 8): Photo[] {
  const photos: Photo[] = [];
  for (const m of memories) {
    if (m.data.cover) photos.push({ src: m.data.cover, slug: m.id, alt: m.data.title });
    for (const g of m.data.gallery ?? []) {
      photos.push({ src: g.src, slug: m.id, alt: g.alt ?? m.data.title });
    }
    if (photos.length >= max) break;
  }
  return photos.slice(0, max);
}
