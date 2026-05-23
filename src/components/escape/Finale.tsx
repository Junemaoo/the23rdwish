import { useState } from "react";
import { FINALE } from "./config";
import { Modal } from "./ui";

export function Finale({ onRestart }: { onRestart: () => void }) {
  const [giftOpen, setGiftOpen] = useState(false);
  const [candlesLit, setCandlesLit] = useState(true);
  const [wish, setWish] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-10">
      {/* 信纸 */}
      <article
        className="rounded-2xl border border-amber-200/60 p-8 shadow-xl"
        style={{
          background:
            "repeating-linear-gradient(transparent 0 31px, oklch(0.85 0.05 80 / 0.6) 31px 32px), oklch(0.97 0.03 85)",
        }}
      >
        <h2 className="mb-4 font-serif text-2xl text-foreground">
          {FINALE.letterTitle}
        </h2>
        <div className="whitespace-pre-line font-serif text-base leading-8 text-foreground/90">
          {FINALE.letter.join("\n")}
        </div>
      </article>

      {/* 礼物盒 */}
      <section className="flex flex-col items-center gap-3">
        <p className="text-sm text-muted-foreground">{FINALE.giftHint}</p>
        <button
          onClick={() => setGiftOpen(true)}
          className="text-7xl transition hover:scale-110"
        >
          🎁
        </button>
      </section>

      {/* 蛋糕 */}
      <section className="flex flex-col items-center gap-3">
        <p className="text-sm text-muted-foreground">{FINALE.cakeHint}</p>
        <button
          onClick={() => setCandlesLit(false)}
          className="relative text-7xl transition hover:scale-105"
        >
          {candlesLit ? "🎂" : "🍰"}
        </button>
        {candlesLit ? (
          <p className="text-xs text-amber-600">（蜡烛在跳……）</p>
        ) : (
          <p className="text-xs text-primary">呼——蜡烛灭了。烟还在飘。</p>
        )}
      </section>

      {/* 许愿 */}
      <section className="rounded-2xl border border-border bg-card/80 p-6 backdrop-blur">
        <p className="mb-3 text-sm font-medium text-card-foreground">
          {FINALE.wishPrompt}
        </p>
        {submitted ? (
          <p className="whitespace-pre-line text-sm leading-relaxed text-primary">
            {FINALE.finalText}
          </p>
        ) : (
          <>
            <textarea
              value={wish}
              onChange={(e) => setWish(e.target.value)}
              placeholder={FINALE.wishPlaceholder}
              rows={4}
              className="w-full resize-none rounded-lg border border-input bg-background p-3 text-sm outline-none focus:border-primary"
            />
            <button
              onClick={() => wish.trim() && setSubmitted(true)}
              className="mt-3 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              许下第 23 个愿望
            </button>
          </>
        )}
      </section>

      {submitted && (
        <button
          onClick={onRestart}
          className="mx-auto text-xs text-muted-foreground underline hover:text-foreground"
        >
          再玩一遍
        </button>
      )}

      <Modal
        open={giftOpen}
        onClose={() => setGiftOpen(false)}
        title="🎁 打开礼物盒"
      >
        {FINALE.giftReveal}
      </Modal>
    </div>
  );
}
