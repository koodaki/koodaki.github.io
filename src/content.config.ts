import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// هر «خاطره» یک فایل Markdown داخل src/content/memories است.
// این schema تضمین می‌کند داده‌ای که CMS می‌نویسد همیشه معتبر بماند (ضد خرابی در بلندمدت).
const memories = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/memories' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    // مسیرها به‌صورت /uploads/... ذخیره می‌شوند (همان چیزی که Sveltia می‌نویسد).
    cover: z.string().optional(),
    gallery: z
      .array(
        z.object({
          src: z.string(),
          alt: z.string().optional(),
        })
      )
      .default([]),
    audio: z.string().optional(),
  }),
});

export const collections = { memories };
