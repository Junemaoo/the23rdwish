import { useState } from "react";
import { FINALE } from "./config";
import { Modal } from "./ui";
import { IsoGiftBox, IsoCake } from "./iso";

export function Finale({ onRestart }: { onRestart: () => void }) {
  const [giftOpen, setGiftOpen] = useState(false);
  const [giftModal, setGiftModal] = useState(false);
  const [candlesLit, setCandlesLit] = useState(true);
  const [wish, setWish] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div
      className="min-h-screen px-4 py-10"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, oklch(0.91 0.055 5) 0%, oklch(0.96 0.045 92) 60%)",
      }}
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10">
        {/* 信纸 */}
        <article
          className="rounded-2xl border border-[#F5C45E]/60 p-8 shadow-xl"
          style={{
            background:
              "repeating-linear-gradient(transparent 0 31px, oklch(0.85 0.05 80 / 0.45) 31px 32px), #FFF8EC",
          }}
        >
          <h2 className="mb-4 font-serif text-2xl text-[#3E2F2A]">
            {FINALE.letterTitle}
          </h2>
          <div className="whitespace-pre-line font-serif text-base leading-8 text-[#3E2F2A]/90">
            {FINALE.letter.join("\n")}
          </div>
        </article>

        {/* 礼物盒 */}
        <section className="flex flex-col items-center gap-3">
          <p className="text-sm text-[#3E2F2A]/70">{FINALE.giftHint}</p>
          <button
            onClick={() => {
              setGiftOpen(true);
              setTimeout(() => setGiftModal(true), 450);
            }}
            className="w-48 transition hover:scale-105"
            aria-label="打开礼物盒"
          >
            <IsoGiftBox open={giftOpen} />
          </button>
        </section>

        {/* 蛋糕 */}
        <section className="flex flex-col items-center gap-3">
          <p className="text-sm text-[#3E2F2A]/70">{FINALE.cakeHint}</p>
          <button
            onClick={() => setCandlesLit(false)}
            className="w-64 transition hover:scale-105"
            aria-label="吹蜡烛"
          >
            <IsoCake lit={candlesLit} />
          </button>
          {candlesLit ? (
            <p className="text-xs text-[#B9825A]">（蜡烛在跳……点一下吹灭）</p>
          ) : (
            <p className="text-xs font-semibold text-[#5D8A66]">
              呼——蜡烛灭了。烟还在飘。 🎉 Happy Birthday!
            </p>
          )}
        </section>

        {/* 许愿 */}
        <section className="rounded-2xl border border-[#F5C45E]/40 bg-white/70 p-6 backdrop-blur">
          <p className="mb-3 text-sm font-medium text-[#3E2F2A]">
            {FINALE.wishPrompt}
          </p>
          {submitted ? (
            <p className="whitespace-pre-line text-sm leading-relaxed text-[#B9825A]">
              {FINALE.finalText}
            </p>
          ) : (
            <>
              <textarea
                value={wish}
                onChange={(e) => setWish(e.target.value)}
                placeholder={FINALE.wishPlaceholder}
                rows={4}
                className="w-full resize-none rounded-lg border border-[#F5C45E]/50 bg-white p-3 text-sm outline-none focus:border-[#B9825A]"
              />
              <button
                onClick={() => wish.trim() && setSubmitted(true)}
                className="mt-3 w-full rounded-full bg-[#3E2F2A] px-4 py-3 text-sm font-medium text-[#FFDFA3] transition hover:opacity-90"
              >
                许下第 23 个愿望 ✨
              </button>
            </>
          )}
        </section>

        {submitted && (
          <button
            onClick={onRestart}
            className="mx-auto text-xs text-[#3E2F2A]/60 underline hover:text-[#3E2F2A]"
          >
            再玩一遍
          </button>
        )}
      </div>

      <Modal
        open={giftModal}
        onClose={() => setGiftModal(false)}
        title="🎁 打开礼物盒"
      >
        {FINALE.giftReveal}
      </Modal>
    </div>
  );
}
