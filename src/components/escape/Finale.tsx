import { useState } from "react";
import letterImg from "@/assets/finale/letter.png";
import cakeImg from "@/assets/finale/cake.png";

type Stage = "initial" | "gift1" | "gift2Box" | "cake";

function YellowButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative rounded-full bg-gradient-to-b from-[#FFD86B] to-[#F4B740] px-8 py-3.5 text-base font-semibold text-[#5A3A12] shadow-[0_8px_24px_-8px_rgba(244,183,64,0.7)] transition-all duration-200 hover:scale-[1.04] hover:shadow-[0_12px_32px_-8px_rgba(244,183,64,0.85)] active:scale-95"
    >
      <span className="relative z-10">{children}</span>
      <span className="pointer-events-none absolute inset-0 rounded-full bg-white/40 opacity-0 transition-opacity group-hover:opacity-30" />
    </button>
  );
}

function Sparkles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 12 }).map((_, i) => (
        <span
          key={i}
          className="absolute animate-pulse text-yellow-300"
          style={{
            left: `${(i * 37) % 100}%`,
            top: `${(i * 53) % 100}%`,
            fontSize: `${10 + (i % 4) * 4}px`,
            animationDelay: `${(i % 6) * 0.2}s`,
            animationDuration: `${1.5 + (i % 3) * 0.4}s`,
          }}
        >
          ✦
        </span>
      ))}
    </div>
  );
}

function GiftBox({ opened, onClick }: { opened: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={opened}
      aria-label="礼物盒"
      className={`relative h-56 w-56 transition-transform ${
        opened ? "" : "animate-[wiggle_2s_ease-in-out_infinite] hover:scale-105"
      }`}
    >
      <div className="absolute inset-x-4 bottom-2 top-16 rounded-xl bg-gradient-to-b from-[#F8B4C8] to-[#E48AA8] shadow-lg" />
      <div className="absolute bottom-2 top-16 left-1/2 w-6 -translate-x-1/2 bg-[#FFE36A]" />
      <div
        className={`absolute inset-x-1 top-12 h-12 rounded-lg bg-gradient-to-b from-[#FF9CBA] to-[#E37BA0] shadow-md transition-all duration-500 ${
          opened ? "-translate-y-10 -rotate-12 opacity-0" : ""
        }`}
      />
      <div
        className={`absolute left-1 right-1 top-[3.75rem] h-3 bg-[#FFE36A] transition-all duration-500 ${
          opened ? "-translate-y-10 opacity-0" : ""
        }`}
      />
      <div
        className={`absolute left-1/2 top-6 -translate-x-1/2 transition-all duration-500 ${
          opened ? "-translate-y-14 scale-150 opacity-0" : ""
        }`}
      >
        <div className="relative h-12 w-20">
          <div className="absolute left-0 top-1 h-10 w-8 -rotate-12 rounded-full bg-[#FFD43B] shadow-md" />
          <div className="absolute right-0 top-1 h-10 w-8 rotate-12 rounded-full bg-[#FFD43B] shadow-md" />
          <div className="absolute left-1/2 top-3 h-6 w-6 -translate-x-1/2 rounded-full bg-[#F4B740] shadow" />
        </div>
      </div>
      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
      `}</style>
    </button>
  );
}

export function Finale({ onRestart }: { onRestart: () => void }) {
  const [stage, setStage] = useState<Stage>("initial");
  const [boxOpened, setBoxOpened] = useState(false);
  const [letterFading, setLetterFading] = useState(false);

  const handleUnlockGift2 = () => {
    setLetterFading(true);
    setTimeout(() => setStage("gift2Box"), 600);
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden px-4 py-12"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, #FFE8EE 0%, #FFF4E0 45%, #FFF8EC 100%)",
      }}
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8 text-center">
        <header className="flex flex-col items-center gap-3">
          <h1 className="font-serif text-4xl font-bold text-[#C25B7C] drop-shadow-sm md:text-5xl">
            🎉 恭喜你！成功通关！
          </h1>
          <p className="max-w-xl text-base text-[#8A6A5C]">
            噜噜啦啦，下面是为你准备的两份精美礼品喔，请拆开吧！
          </p>
        </header>

        {stage === "initial" && (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <YellowButton onClick={() => setStage("gift1")}>
              🎁 解锁礼物1
            </YellowButton>
          </div>
        )}

        {stage === "gift1" && (
          <section
            className={`relative w-full transition-opacity duration-500 ${
              letterFading
                ? "opacity-0"
                : "opacity-100 animate-in fade-in slide-in-from-bottom-4 duration-700"
            }`}
          >
            <div className="relative mx-auto w-full max-w-[min(95vw,1100px)]">
              <img
                src={letterImg}
                alt="生日信"
                className="mx-auto w-full rounded-[18px] shadow-[0_30px_80px_-20px_rgba(120,80,50,0.55)]"
              />
            </div>

            <div className="mt-8 animate-in fade-in duration-500">
              <YellowButton onClick={handleUnlockGift2}>
                🎀 解锁礼物2
              </YellowButton>
            </div>
          </section>
        )}

        {stage === "gift2Box" && (
          <section className="relative flex min-h-[400px] flex-col items-center justify-center gap-4 animate-in fade-in zoom-in-95 duration-500">
            <GiftBox
              opened={boxOpened}
              onClick={() => {
                if (boxOpened) return;
                setBoxOpened(true);
                setTimeout(() => setStage("cake"), 700);
              }}
            />
            <p className="text-sm text-[#B9825A]">点击拆开礼物盒</p>
          </section>
        )}

        {stage === "cake" && (
          <section className="relative flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="relative">
              <Sparkles />
              <img
                src={cakeImg}
                alt="生日蛋糕"
                className="relative w-72 drop-shadow-[0_20px_30px_rgba(180,140,90,0.35)] md:w-80"
              />
            </div>
            <p className="text-sm text-[#8A6A5C]">请打开冰箱完成许愿吧！</p>
            <button
              onClick={onRestart}
              className="mt-4 text-xs text-[#B9825A]/70 underline hover:text-[#B9825A]"
            >
              再玩一遍
            </button>
          </section>
        )}
      </div>
    </div>
  );
}
