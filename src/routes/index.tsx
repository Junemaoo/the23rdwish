import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { OPENING, ROOMS } from "@/components/escape/config";
import { Room1 } from "@/components/escape/Room1";
import { Room2 } from "@/components/escape/Room2";
import { Room3 } from "@/components/escape/Room3";
import { Chapter } from "@/components/escape/Chapter";
import { Finale } from "@/components/escape/Finale";
import { Fade, ProgressDots } from "@/components/escape/ui";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "第23次许愿 · 定制线上密室逃脱" },
      {
        name: "description",
        content: "一间为生日准备的温暖小密室：三个房间，五件礼物，和一个只属于你的愿望。",
      },
      { property: "og:title", content: "第23次许愿 · 定制线上密室逃脱" },
      { property: "og:description", content: "为你定制的生日互动密室。推开门，慢慢走。" },
    ],
  }),
  component: Index,
});

type Stage =
  | "intro"
  | "chapter1" | "room1"
  | "chapter2" | "room2"
  | "chapter3" | "room3"
  | "final";

// 流程顺序，用于"下一步"与进度
const FLOW: Stage[] = [
  "intro",
  "chapter1", "room1",
  "chapter2", "room2",
  "chapter3", "room3",
  "final",
];

function Index() {
  const [stage, setStage] = useState<Stage>("intro");

  function go(next: Stage) {
    setStage(next);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // 当前进度（仅基于房间编号 1..3，加最终页）
  const roomNum =
    stage === "room1" || stage === "chapter1" ? 1 :
    stage === "room2" || stage === "chapter2" ? 2 :
    stage === "room3" || stage === "chapter3" ? 3 :
    stage === "final" ? 4 : 0;

  return (
    <main className="min-h-screen bg-background">
      {stage !== "intro" && (
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border/50 bg-background/85 px-4 py-3 backdrop-blur">
          <span className="font-serif text-sm text-foreground">
            第 23 次许愿\n
          </span>
          <ProgressDots step={roomNum} total={4} />
        </div>
      )}

      {stage === "intro" && (
        <Fade k="intro"><Opening onStart={() => go("chapter1")} /></Fade>
      )}

      {stage === "chapter1" && (
        <Fade k="ch1"><Chapter index={0} onEnter={() => go("room1")} /></Fade>
      )}
      {stage === "room1" && (
        <Fade k="r1"><Room1 onComplete={() => go("chapter2")} /></Fade>
      )}

      {stage === "chapter2" && (
        <Fade k="ch2"><Chapter index={1} onEnter={() => go("room2")} /></Fade>
      )}
      {stage === "room2" && (
        <Fade k="r2"><Room2 onComplete={() => go("chapter3")} /></Fade>
      )}

      {stage === "chapter3" && (
        <Fade k="ch3"><Chapter index={2} onEnter={() => go("room3")} /></Fade>
      )}
      {stage === "room3" && (
        <Fade k="r3"><Room3 onComplete={() => go("final")} /></Fade>
      )}

      {stage === "final" && (
        <Fade k="final"><Finale onRestart={() => go("intro")} /></Fade>
      )}

      {/* 触发未使用 ROOMS 变量类型检查 */}
      <span className="hidden">{ROOMS.length}</span>
    </main>
  );
}

function Opening({ onStart }: { onStart: () => void }) {
  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center"
      style={{
        background:
          "radial-gradient(ellipse at 50% 30%, oklch(0.32 0.05 250) 0%, oklch(0.20 0.04 250) 55%, oklch(0.13 0.03 250) 100%)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:48px_48px]" />
      <div className="relative z-10 mb-6 text-6xl drop-shadow-[0_0_24px_rgba(245,196,94,.7)]">
        ​
      </div>
      <h1 className="relative z-10 text-4xl text-[oklch(0.96_0.045_92)] shadow-sm rounded-none font-serif sm:text-7xl">
        {OPENING.title}
      </h1>
      <p className="relative z-10 mt-3 text-lg text-[oklch(0.80_0.135_80)]">
        {OPENING.subtitle}
      </p>
      <div className="relative z-10 mt-8 max-w-md space-y-6 text-sm leading-relaxed text-slate-300">
        {OPENING.intro.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
      <button
        onClick={onStart}
        className="relative z-10 mt-10 rounded-full bg-[oklch(0.80_0.135_80)] px-10 py-3.5 text-sm font-semibold text-[#3E2F2A] shadow-[0_0_30px_rgba(245,196,94,.4)] transition hover:scale-105 hover:bg-[oklch(0.85_0.135_80)]"
      >
        {OPENING.enterCta}
      </button>
    </section>
  );
}
