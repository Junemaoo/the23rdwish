import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { OPENING, ROOMS } from "@/components/escape/config";
import { Room1 } from "@/components/escape/Room1";
import { Room2 } from "@/components/escape/Room2";
import { Room3 } from "@/components/escape/Room3";
import { Finale } from "@/components/escape/Finale";
import { Fade, ProgressDots } from "@/components/escape/ui";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "小毛子独家定制密室 · 第23次许愿" },
      {
        name: "description",
        content:
          "一间为生日准备的温暖小密室：三个房间，五件礼物，和一个只属于你的愿望。",
      },
      { property: "og:title", content: "小毛子独家定制密室 · 第23次许愿" },
      {
        property: "og:description",
        content: "为你定制的生日互动密室。推开门，慢慢走。",
      },
    ],
  }),
  component: Index,
});

type Stage = "opening" | "room" | "finale";

function Index() {
  const [stage, setStage] = useState<Stage>("opening");
  const [roomIdx, setRoomIdx] = useState(0);

  function start() {
    setRoomIdx(0);
    setStage("room");
  }
  function nextRoom() {
    if (roomIdx + 1 < ROOMS.length) setRoomIdx(roomIdx + 1);
    else setStage("finale");
  }
  function restart() {
    setStage("opening");
  }

  return (
    <main className="min-h-screen bg-background">
      {/* 顶部进度 */}
      {stage !== "opening" && (
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border/50 bg-background/80 px-4 py-3 backdrop-blur">
          <span className="font-serif text-sm text-foreground">
            小毛子 · 第 23 次许愿
          </span>
          <ProgressDots
            step={stage === "finale" ? ROOMS.length + 1 : roomIdx + 1}
            total={ROOMS.length + 1}
          />
        </div>
      )}

      {stage === "opening" && (
        <Fade k="opening">
          <Opening onStart={start} />
        </Fade>
      )}

      {stage === "room" && (
        <Fade k={`room-${roomIdx}`}>
          {roomIdx === 0 ? (
            <Room1 onComplete={nextRoom} />
          ) : roomIdx === 1 ? (
            <Room2 onComplete={nextRoom} />
          ) : (
            <Room3 onComplete={nextRoom} />
          )}
        </Fade>
      )}

      {stage === "finale" && (
        <Fade k="finale">
          <Finale onRestart={restart} />
        </Fade>
      )}
    </main>
  );
}

function Opening({ onStart }: { onStart: () => void }) {
  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center"
      style={{
        background:
          "radial-gradient(ellipse at 50% 30%, oklch(0.28 0.05 250) 0%, oklch(0.18 0.03 250) 50%, oklch(0.12 0.02 250) 100%)",
      }}
    >
      {/* 星点 */}
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:48px_48px]" />
      <div className="relative z-10 mb-8 text-6xl drop-shadow-[0_0_20px_rgba(251,191,36,.6)]">
        🕯️
      </div>
      <h1 className="relative z-10 font-serif text-4xl text-slate-50 sm:text-5xl">
        {OPENING.title}
      </h1>
      <p className="relative z-10 mt-3 text-lg text-amber-300">
        {OPENING.subtitle}
      </p>
      <div className="relative z-10 mt-8 max-w-md space-y-2 text-sm leading-relaxed text-slate-300">
        {OPENING.intro.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
      <button
        onClick={onStart}
        className="relative z-10 mt-10 rounded-full bg-amber-400 px-10 py-3.5 text-sm font-medium text-slate-900 shadow-[0_0_30px_rgba(251,191,36,.4)] transition hover:scale-105 hover:bg-amber-300"
      >
        {OPENING.enterCta}
      </button>
      <p className="relative z-10 mt-6 text-xs text-slate-400">
        建议在桌面浏览器中游玩 · 全程约 5–10 分钟
      </p>
    </section>
  );
}
