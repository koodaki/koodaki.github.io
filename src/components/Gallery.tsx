import { useCallback, useEffect, useState } from 'react';

export type GalleryImage = { src: string; alt?: string };

/**
 * گالری تعاملی با لایت‌باکس — یک React island.
 * چیدمان «پولاروید» نامتقارن، ناوبری کیبورد (Esc/فلش‌ها)، قبلی/بعدی، کپشن.
 */
export default function Gallery({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const prev = useCallback(
    () => setActive((i) => (i === null ? i : (i - 1 + images.length) % images.length)),
    [images.length]
  );
  const next = useCallback(
    () => setActive((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') prev(); // RTL: راست = قبلی
      else if (e.key === 'ArrowLeft') next();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [active, close, prev, next]);

  if (images.length === 0) return null;
  const current = active !== null ? images[active] : null;

  return (
    <div className="mt-12">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={img.alt ?? `عکس ${i + 1}`}
            className={`group overflow-hidden rounded-lg bg-sand shadow-[0_4px_20px_rgba(142,151,117,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              i % 2 === 1 ? 'sm:mt-8' : ''
            }`}
          >
            <img
              src={img.src}
              alt={img.alt ?? ''}
              loading="lazy"
              className="aspect-square size-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </button>
        ))}
      </div>

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={close}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
        >
          <img
            src={current.src}
            alt={current.alt ?? ''}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-[92vw] rounded-lg object-contain shadow-2xl"
          />

          {current.alt && (
            <p className="absolute inset-x-0 bottom-5 text-center text-sm text-white/80">
              {current.alt}
            </p>
          )}

          <button
            type="button"
            aria-label="بستن"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            className="absolute left-4 top-4 grid size-10 place-items-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20"
          >
            ×
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                aria-label="قبلی"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="absolute right-4 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-3xl text-white transition hover:bg-white/20"
              >
                ›
              </button>
              <button
                type="button"
                aria-label="بعدی"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="absolute left-4 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-3xl text-white transition hover:bg-white/20"
              >
                ‹
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
