export default function Maintenance() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ink px-4 text-center">
      {/* خلفية متدرجة عائمة - blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 animate-pulse rounded-full bg-ember/20 blur-3xl" />
        <div
          className="absolute -bottom-32 -right-32 h-96 w-96 animate-pulse rounded-full bg-purple-500/20 blur-3xl"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-blue-500/10 blur-3xl"
          style={{ animationDelay: '2s' }}
        />
      </div>

      {/* نقط زخرفية */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative z-10 flex flex-col items-center">
        {/* الأيقونة بتدرج لوني وحركة */}
        <div className="relative mb-8">
          <div className="absolute inset-0 animate-ping rounded-full bg-gradient-to-tr from-ember to-orange-400 opacity-20" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-ember to-orange-400 shadow-lg shadow-ember/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="44"
              height="44"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-[spin_6s_linear_infinite]"
            >
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </div>
        </div>

        {/* شارة صغيرة فوق العنوان */}
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-ember/30 bg-ember/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-ember">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ember" />
          Under Maintenance
        </span>

        <h1 className="max-w-xl bg-gradient-to-br from-white via-white to-white/70 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
          الموقع تحت الصيانة حاليًا
        </h1>

        <p className="mt-5 max-w-md text-lg text-white/60">
          بنشتغل على تحسينات جديدة عشان نقدملك خدمة أفضل.
          <br />
          هنرجع قريبًا جدًا، شكرًا لصبرك 🙏
        </p>

        {/* شريط تحميل متحرك */}
        <div className="mt-10 h-1.5 w-48 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-1/3 animate-[loading_1.8s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-ember to-orange-400" />
        </div>

        {/* روابط تواصل اختياري */}
        <p className="mt-10 text-sm text-white/40">
          محتاج تتواصل معانا؟{' '}
          <a
            href="https://wa.me/201025334335"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-ember underline underline-offset-2 hover:text-orange-400"
          >
            راسلنا على واتساب
          </a>
        </p>
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(150%); }
          100% { transform: translateX(150%); }
        }
      `}</style>
    </div>
  );
}