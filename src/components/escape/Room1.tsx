import { useEffect, useRef, useState } from "react";
import { BookOpen, X, Delete, Check } from "lucide-react";
import { ROOMS } from "./config";
import { Modal } from "./ui";

import room1Bg from "@/assets/room1-bg.jpg";
import room1Calendar from "@/assets/room1-calendar.jpg";
import room1Laptop from "@/assets/room1-laptop.png";
import room1Desktop from "@/assets/room1-desktop.png";

type ClueSpot = {
  id: string;
  title: string;
  image: string;
  left: number;
  top: number;
  w: number;
  h: number;
};

type FlyingClue = {
  src: string;
  from: { x: number; y: number; w: number; h: number };
  to: { x: number; y: number };
  phase: "start" | "end";
  id: string;
};

export function Room1({ onComplete }: { onComplete: () => void }) {
  const config = ROOMS[0];
  const [openClue, setOpenClue] = useState<ClueSpot | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [solved, setSolved] = useState(false);
  const [collected, setCollected] = useState<Set<string>>(new Set());
  const [showInventory, setShowInventory] = useState(false);
  const [flying, setFlying] = useState<FlyingClue | null>(null);
  const [popping, setPopping] = useState(false);

  const inventoryBtnRef = useRef<HTMLButtonElement | null>(null);
  const clueImgRef = useRef<HTMLImageElement | null>(null);

  const hotspots: ClueSpot[] = [
    { id: "pc-left",  title: "mjm 的电脑屏幕", image: room1Laptop,   left: 8,  top: 50, w: 14, h: 14 },
    { id: "calendar", title: "墙上的日历",     image: room1Calendar, left: 41, top: 27, w: 9,  h: 22 },
    { id: "pc-right", title: "zcx 的电脑屏幕", image: room1Desktop,  left: 70, top: 26, w: 14, h: 14 },
  ];

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      if (openClue) setOpenClue(null);
      else if (showInventory) setShowInventory(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openClue, showInventory]);

  function handleCollect() {
    if (!openClue || flying) return;
    const imgEl = clueImgRef.current;
    const btnEl = inventoryBtnRef.current;
    if (!imgEl || !btnEl) {
      // fallback：直接收集
      setCollected((p) => new Set(p).add(openClue.id));
      setOpenClue(null);
      return;
    }
    const a = imgEl.getBoundingClientRect();
    const b = btnEl.getBoundingClientRect();
    const fly: FlyingClue = {
      id: openClue.id,
      src: openClue.image,
      from: { x: a.left, y: a.top, w: a.width, h: a.height },
      to: { x: b.left + b.width / 2, y: b.top + b.height / 2 },
      phase: "start",
    };
    const collectedId = openClue.id;
    setFlying(fly);
    setOpenClue(null);

    // 触发 transition
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setFlying((f) => (f ? { ...f, phase: "end" } : f));
      });
    });

    // 中段：图标弹一下 + 写入 collected
    window.setTimeout(() => {
      setCollected((p) => new Set(p).add(collectedId));
      setPopping(true);
      window.setTimeout(() => setPopping(false), 500);
    }, 620);

    // 动画结束清理
    window.setTimeout(() => setFlying(null), 760);
  }

  return (
    <div className="relative w-full min-h-[100svh] overflow-hidden bg-black">
      <img
        src={room1Bg}
        alt=""
        className="absolute inset-0 h-full w-full select-none object-cover"
        draggable={false}
      />

      {/* 左上角：线索收集册 */}
      <button
        ref={inventoryBtnRef}
        onClick={() => setShowInventory(true)}
        className={`absolute left-4 top-4 z-30 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white shadow-lg backdrop-blur transition hover:bg-black/80 ${popping ? "animate-clue-pop" : ""}`}
        title="线索收集册"
        aria-label="线索收集册"
      >
        <BookOpen className="h-5 w-5" />
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
          {collected.size}/{hotspots.length}
        </span>
      </button>

      {hotspots.map((h) => (
        <button
          key={h.id}
          onClick={() => setOpenClue(h)}
          className="absolute cursor-pointer bg-transparent"
          style={{
            left: `${h.left}%`,
            top: `${h.top}%`,
            width: `${h.w}%`,
            height: `${h.h}%`,
          }}
          aria-label={h.title}
        />
      ))}

      {/* 密码锁 */}
      <button
        onClick={() => setShowAnswer(true)}
        className="absolute cursor-pointer bg-transparent"
        style={{ left: "50%", top: "48%", width: "6%", height: "14%" }}
        title="数字密码锁"
        aria-label="数字密码锁"
      />

      {/* 线索卡片 */}
      {openClue && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/85 px-4 animate-in fade-in"
          onClick={() => setOpenClue(null)}
        >
          <button
            onClick={() => setOpenClue(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white/80 transition hover:bg-white/20"
            aria-label="关闭"
          >
            <X className="h-5 w-5" />
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex w-full max-w-lg flex-col items-center gap-6 rounded-3xl bg-[#f5ede0] px-8 py-9 shadow-2xl"
          >
            <h3 className="text-center text-3xl font-semibold text-[#1a1a1a]">
              {openClue.title}
            </h3>
            <div className="flex w-full items-center justify-center">
              <img
                ref={clueImgRef}
                src={openClue.image}
                alt=""
                draggable={false}
                className="h-auto max-h-[55vh] w-[85%] select-none object-contain"
              />
            </div>
            <button
              onClick={handleCollect}
              disabled={collected.has(openClue.id)}
              className="w-[65%] rounded-full bg-[#c97259] px-6 py-3.5 text-lg font-medium text-white shadow-md transition hover:bg-[#b9614b] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {collected.has(openClue.id) ? "已收集 ✓" : "收集线索"}
            </button>
          </div>
        </div>
      )}

      {/* 飞行动画图层 */}
      {flying && (
        <img
          src={flying.src}
          alt=""
          draggable={false}
          className="pointer-events-none fixed z-50 object-contain"
          style={{
            left: 0,
            top: 0,
            width: flying.from.w,
            height: flying.from.h,
            transform:
              flying.phase === "start"
                ? `translate(${flying.from.x}px, ${flying.from.y}px) scale(1)`
                : `translate(${flying.to.x - flying.from.w / 2}px, ${flying.to.y - flying.from.h / 2}px) scale(0.12)`,
            opacity: flying.phase === "start" ? 1 : 0.2,
            transition: "transform 700ms cubic-bezier(.4,0,.2,1), opacity 700ms ease-out",
          }}
        />
      )}

      {/* 线索收集册 */}
      {showInventory && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/85 px-4 animate-in fade-in"
          onClick={() => setShowInventory(false)}
        >
          <div
            className="relative w-full max-w-xl rounded-2xl border border-white/10 bg-zinc-900/90 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowInventory(false)}
              className="absolute right-3 top-3 rounded-full p-2 text-white/70 transition hover:bg-white/10"
              aria-label="关闭"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="mb-4 text-base font-semibold text-white">
              线索收集册 · {collected.size}/{hotspots.length}
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {hotspots.map((h) => {
                const got = collected.has(h.id);
                return (
                  <div
                    key={h.id}
                    className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-[#f5ede0]/95 p-3"
                  >
                    <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-[#f5ede0]">
                      {got ? (
                        <img
                          src={h.image}
                          alt=""
                          className="h-full w-full object-contain"
                          draggable={false}
                        />
                      ) : (
                        <span className="text-3xl text-black/30">?</span>
                      )}
                    </div>
                    <span className={`text-center text-xs ${got ? "text-[#1a1a1a]" : "text-black/40"}`}>
                      {got ? h.title : "尚未发现"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <Modal open={showAnswer && !solved} onClose={() => setShowAnswer(false)} title="🔒 数字密码锁">
        <AnswerInput
          prompt={config.puzzlePrompt}
          hint={config.puzzleHint}
          answer={config.answer}
          errorMessages={config.errorMessages}
          onSolved={() => {
            setSolved(true);
            setShowAnswer(false);
          }}
        />
      </Modal>

      <Modal open={solved} onClose={onComplete} title="🔓 门开了">
        <div className="space-y-4">
          <p className="whitespace-pre-line">{config.successText}</p>
          <button
            onClick={onComplete}
            className="w-full rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-lg transition hover:opacity-90"
          >
            {config.nextCta} →
          </button>
        </div>
      </Modal>
    </div>
  );
}
