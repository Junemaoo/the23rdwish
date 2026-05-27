/**
 * 章节过场页：Chapter N + 房间标题 + 一两句引子 + 进入按钮
 */
import { CHAPTERS } from "./config";

export function Chapter({
  index,
  onEnter,
}: {
  index: 0 | 1 | 2;
  onEnter: () => void;
}) {
  const ch = CHAPTERS[index];
  // 不同章节使用不同色调
  const themes = [
    {
      // 章节 1：暖蓝夜 + 暖灯
      bg: "radial-gradient(ellipse at 50% 30%, oklch(0.40 0.05 250) 0%, oklch(0.22 0.04 250) 60%, oklch(0.15 0.03 250) 100%)",
      accent: "text-[oklch(0.92_0.075_85)]",
    },
    {
      // 章节 2：博物馆暖棕
      bg: "radial-gradient(ellipse at 50% 35%, oklch(0.55 0.08 55) 0%, oklch(0.36 0.06 50) 60%, oklch(0.22 0.04 45) 100%)",
      accent: "text-[oklch(0.80_0.135_80)]",
    },
    {
      // 章节 3：晨光米白
      bg: "radial-gradient(ellipse at 50% 35%, oklch(0.96 0.045 92) 0%, oklch(0.88 0.06 80) 60%, oklch(0.72 0.07 70) 100%)",
      accent: "text-[oklch(0.45_0.10_45)]",
    },
  ];
  const t = themes[index];
  const dark = index !== 2;

  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center"
      style={{ background: t.bg }}
    >
      {/* 星点装饰 */}
      {dark && (
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:60px_60px]" />
      )}
      {/* 章节大字 */}
      <p
        className={`relative z-10 font-serif text-[120px] leading-none tracking-wider ${t.accent} opacity-30 sm:text-[180px]`}
      >
        Ch.{index + 1}
        {(index === 0 || index === 1 || index === 2) && <span className="block h-8" />}
      </p>
      <div className={`relative z-10 -mt-16 text-xs tracking-[0.4em] ${t.accent}`}>
        {(index === 0 || index === 1 || index === 2) && <span className="block h-8" />}
        CHAPTER {index + 1}
      </div>
      <h2
        className={`relative z-10 mt-4 font-serif text-3xl sm:text-5xl ${
          dark ? "text-slate-50" : "text-[#3E2F2A]"
        }`}
      >
        《{ch.title}》
      </h2>
      <p
        className={`relative z-10 mt-4 max-w-md text-sm leading-relaxed ${
          dark ? "text-slate-300" : "text-[#5a4a3f]"
        }`}
      >
        {ch.intro}
      </p>
      <button
        onClick={onEnter}
        className={`relative z-10 ${(index === 0 || index === 1 || index === 2) ? 'mt-36' : 'mt-10'} rounded-full px-10 py-3.5 text-sm font-medium shadow-[0_0_30px_rgba(245,196,94,.4)] transition hover:scale-105 ${
          dark
            ? "bg-[oklch(0.80_0.135_80)] text-[#3E2F2A] hover:bg-[oklch(0.85_0.135_80)]"
            : "bg-[#3E2F2A] text-[oklch(0.92_0.075_85)] hover:opacity-90"
        }`}
      >
        {ch.cta}
      </button>
    </section>
  );
}
