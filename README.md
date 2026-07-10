# دفترچه‌ی خاطرات فرزندم 🌱

سایت شخصی ثبت خاطرات (متن + عکس + صوت)، ساخته‌شده برای **ماندگاری ۵ تا ۱۰ ساله**.

**رویکرد معماری (الگو A):** سایت استاتیک مبتنی بر Git + CMS مبتنی بر Git.
همه‌چیز — متن، عکس، صوت و قالب — فایل ساده‌ای داخل همین مخزن Git است و کاملاً مال خودت می‌ماند.

- **فریم‌ورک:** [Astro](https://astro.build) + React islands
- **CMS:** [Sveltia CMS](https://github.com/sveltia/sveltia-cms) (مبتنی بر Git، موبایل‌فرندلی)
- **میزبانی:** GitHub Pages (از طریق GitHub Actions)
- **محتوا:** فایل‌های Markdown در `src/content/memories/`، مدیا در `public/uploads/`

---

## پیش‌نیاز

- **Node.js نسخه ۲۲ یا بالاتر** (Astro 7 الزامی می‌داند). مدیریت نسخه با `nvm` توصیه می‌شود:
  ```bash
  nvm install 22
  nvm use 22
  ```

## اجرای محلی

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # خروجی استاتیک در dist/
```

برای کار با پنل مدیریت روی کامپیوتر خودت (بدون نیاز به OAuth):

```bash
# در یک ترمینال:
npm run dev
# در ترمینال دوم:
npx @sveltia/cms-server
```

سپس به `http://localhost:4321/admin/` برو. (چون `local_backend: true` در کانفیگ فعال است،
تغییرات مستقیم روی فایل‌های محلی نوشته می‌شوند.)

---

## راه‌اندازی روی GitHub Pages (یک‌بار)

1. **مخزن را بساز** و این کد را push کن.
2. در `astro.config.mjs` مقدار `site` را به دامنه‌ات تغییر بده.
   اگر دامنه‌ی شخصی نداری و روی مسیر پروژه منتشر می‌کنی، `base` را به `'/REPO/'` بگذار.
3. در GitHub → **Settings → Pages → Source = GitHub Actions**.
4. هر push روی `main` سایت را به‌صورت خودکار می‌سازد و منتشر می‌کند.

### دامنه‌ی شخصی (به‌شدت توصیه‌شده برای دوام)
داشتن دامنه‌ی شخصی یعنی اگر روزی خواستی از GitHub Pages مهاجرت کنی، فقط DNS را
به میزبان جدید می‌چرخانی و **هیچ لینکی نمی‌شکند**. در Settings → Pages → Custom domain تنظیمش کن.

---

## راه‌اندازی پنل مدیریت آنلاین (Sveltia + OAuth)

GitHub Pages بک‌اند ندارد، پس برای ورود به پنل، یک واسط کوچک OAuth لازم است.
ساده‌ترین و بادوام‌ترین راه: یک **Cloudflare Worker رایگانِ مال خودت**.

1. پروژه‌ی [`sveltia-cms-auth`](https://github.com/sveltia/sveltia-cms-auth) را روی Cloudflare Workers مستقر کن (رایگان).
2. در GitHub → Settings → Developer settings → **OAuth Apps** یک اپ بساز
   و `Client ID`/`Client Secret` را به Worker بده.
3. در `public/admin/config.yml`:
   - `repo` را به `نام‌کاربری/نام‌مخزن` تغییر بده.
   - `base_url` را به آدرس Worker خودت تغییر بده.
   - برای محیط واقعی، خط `local_backend: true` را حذف یا کامنت کن.

> **چرا این روش؟** Worker و Sveltia فقط «ابزار ویرایش» هستند. اگر روزی از کار بیفتند،
> سایت و همه‌ی خاطراتت سالم می‌مانند و می‌توانی فایل‌های Markdown را مستقیم در Git ویرایش کنی.

---

## افزودن خاطره

از طریق پنل `/admin` (توصیه‌شده) یا با ساختن دستی یک فایل `.md` در `src/content/memories/`
با این ساختار:

```markdown
---
title: عنوان خاطره
date: 2026-06-25T09:00:00.000Z
tags: [تگ۱, تگ۲]
cover: /uploads/my-photo.jpg
gallery:
  - { src: /uploads/photo1.jpg, alt: توضیح }
audio: /uploads/clip.mp3
---

متن خاطره اینجا...
```

---

## نکات دوام (Longevity)
- `package-lock.json` را کامیت‌شده نگه دار تا build در آینده تکرارپذیر بماند.
- مدیا را قبل از آپلود بهینه کن (عکس WebP/JPEG، صوت MP3/Opus).
- گاهی یک clone کامل از مخزن روی هارد خودت/درایو ابری به‌عنوان بکاپ نگه دار.
- از Git LFS برای مدیا استفاده **نکن** (GitHub Pages آن را درست سرو نمی‌کند).
