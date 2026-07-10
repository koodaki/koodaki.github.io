import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// مسیر پایه‌ی سایت روی GitHub Pages (زیرشاخه‌ی نام مخزن).
//  • اگر بعداً به دامنه‌ی شخصی یا <user>.github.io رفتی، این را به '/' برگردان.
const base = '/';

// عکس/لینک‌هایی که داخل متن Markdown به‌صورت /uploads/... هستند را با base
// هماهنگ می‌کند تا روی زیرشاخه نشکنند. (فیلدهای frontmatter جداگانه با withBase حل می‌شوند.)
function rehypeBaseUploads() {
  const prefix = base.replace(/\/$/, '');
  const walk = (node) => {
    if (node.type === 'element' && node.properties) {
      for (const attr of ['src', 'href']) {
        const value = node.properties[attr];
        if (typeof value === 'string' && value.startsWith('/uploads/')) {
          node.properties[attr] = prefix + value;
        }
      }
    }
    node.children?.forEach(walk);
  };
  return (tree) => walk(tree);
}

// https://astro.build/config
export default defineConfig({
  // برای کانونیکال/سایت‌مپ: نام اکانت گیت‌هاب تو.
  site: 'https://koodaki.github.io',
  base,

  integrations: [react()],

  markdown: {
    processor: unified({ rehypePlugins: [rehypeBaseUploads] }),
  },

  // Tailwind v4 از طریق پلاگین Vite.
  vite: {
    plugins: [tailwindcss()],
  },
});
