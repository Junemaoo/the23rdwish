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
  const [debug, setDebug] = useState(false);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);

  const inventoryBtnRef = useRef<HTMLButtonElement | null>(null);
  const clueImgRef = useRef<HTMLImageElement | null>(null);

  const hotspots: ClueSpot[] = [
    { id: "pc-left",  title: "mjm 的电脑屏幕", image: room1Laptop,   left: 8,  top: 50, w: 14, h: 14 },
    { id: "calendar", title: "墙上的日历",     image: room1Calendar, left: 41, top: 27, w: 9,  h: 22 },
    { id: "pc-right", title: "zcx 的电脑屏幕", image: room1Desktop,  left: 70, top: 26, w: 14, h: 14 },
  ];

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "d" || e.key === "D") setDebug((v) => !v);
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
    <div
      className="relative w-full min-h-[100svh] overflow-hidden bg-black"
      onMouseMove={(e) => {
        if (!debug) return;
        const r = e.currentTarget.getBoundingClientRect();
        setCursor({
          x: ((e.clientX - r.left) / r.width) * 100,
          y: ((e.clientY - r.top) / r.height) * 100,
        });
      }}
    >
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
          className="absolute cursor-pointer bg-transparent focus:outline-none focus-visible:outline-none"
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
        className="absolute cursor-pointer bg-transparent focus:outline-none focus-visible:outline-none"
        style={{ left: "56.5%", top: "27%", width: "4%", height: "9%" }}
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

      {showAnswer && !solved && (
        <PasscodePad
          prompt={config.puzzlePrompt}
          hint={config.puzzleHint}
          answer={config.answer}
          errorMessages={config.errorMessages}
          onClose={() => setShowAnswer(false)}
          onSolved={() => {
            setSolved(true);
            setShowAnswer(false);
          }}
        />
      )}


      {/* 解锁后：木门上浮出"进入下一关"按钮 */}
      {solved && (
        <button
          onClick={onComplete}
          className="absolute z-30 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-[0_0_30px_rgba(255,200,120,.85)] animate-in fade-in zoom-in duration-700 hover:opacity-90"
          style={{ left: "52%", top: "30%" }}
        >
          进入下一关 →
        </button>
      )}

      {/* 调试网格 (按 D 切换) */}
      {debug && (
        <div className="pointer-events-none absolute inset-0 z-40">
          {Array.from({ length: 19 }).map((_, i) => (
            <div
              key={`v${i}`}
              className="absolute top-0 h-full border-l border-cyan-400/30"
              style={{ left: `${(i + 1) * 5}%` }}
            />
          ))}
          {Array.from({ length: 19 }).map((_, i) => (
            <div
              key={`h${i}`}
              className="absolute left-0 w-full border-t border-cyan-400/30"
              style={{ top: `${(i + 1) * 5}%` }}
            />
          ))}
          {/* 密码锁标记 */}
          <div
            className="absolute border-2 border-pink-500"
            style={{ left: "56.5%", top: "27%", width: "4%", height: "9%" }}
          />
          {/* 当前按钮位置十字 */}
          <div
            className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-400 ring-2 ring-black"
            style={{ left: "52%", top: "30%" }}
          />
          {cursor && (
            <div
              className="absolute rounded bg-black/80 px-2 py-1 font-mono text-[11px] text-cyan-300"
              style={{ left: `${cursor.x}%`, top: `${cursor.y}%`, transform: "translate(8px, 8px)" }}
            >
              {cursor.x.toFixed(1)}% , {cursor.y.toFixed(1)}%
            </div>
          )}
          <div className="absolute right-2 top-2 rounded bg-black/80 px-2 py-1 font-mono text-[11px] text-cyan-300">
            DEBUG · 按 D 关闭 · 按钮 52% / 30%
          </div>
        </div>
      )}
    </div>
  );
}

function PasscodePad({
  prompt,
  hint,
  answer,
  errorMessages,
  onSolved,
  onClose,
}: {
  prompt: string;
  hint: string;
  answer: string;
  errorMessages?: string[];
  onSolved: () => void;
  onClose: () => void;
}) {
  const [value, setValue] = useState("");
  const [wrong, setWrong] = useState(0);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState(false);
  const [pressed, setPressed] = useState<string | null>(null);
  const maxLen = answer.length + 2;

  function press(key: string) {
    setPressed(key);
    window.setTimeout(() => setPressed((p) => (p === key ? null : p)), 120);
  }

  function input(d: string) {
    press(d);
    setMsg("");
    setError(false);
    setValue((v) => (v.length >= maxLen ? v : v + d));
  }

  function backspace() {
    press("back");
    setMsg("");
    setError(false);
    setValue((v) => v.slice(0, -1));
  }

  function submit() {
    press("ok");
    const v = value.trim().toLowerCase();
    const a = answer.trim().toLowerCase();
    if (!v) return;
    if (v === a) {
      setMsg("");
      onSolved();
      return;
    }
    const next = wrong + 1;
    setWrong(next);
    setError(true);
    window.setTimeout(() => setError(false), 220);
    if (errorMessages && errorMessages.length > 0) {
      setMsg(errorMessages[Math.min(next - 1, errorMessages.length - 1)]);
    } else if (next >= 3) {
      setMsg(`不对哦…… 小提示：${hint}`);
    } else {
      setMsg(`再想想（已尝试 ${next} 次）`);
    }
    setValue("");
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        submit();
        return;
      }
      if (e.key === "Backspace") {
        e.preventDefault();
        backspace();
        return;
      }
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        input(e.key);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, wrong]);

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-4 animate-in fade-in"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white/80 transition hover:bg-white/20"
        aria-label="关闭"
      >
        <X className="h-5 w-5" />
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xs select-none rounded-[28px] p-5 shadow-2xl"
        style={{
          background:
            "linear-gradient(145deg, #d8dde2 0%, #9aa1a8 40%, #c7ccd1 60%, #6e7378 100%)",
        }}
      >
        <div
          className="flex flex-col items-center gap-4 rounded-[20px] p-5"
          style={{ background: "linear-gradient(180deg, #0b0b0e 0%, #15161a 100%)" }}
        >
          <h3 className="text-center text-lg font-semibold tracking-wide text-white/90">
            请输入本关密码
          </h3>

          {/* 电子屏 */}
          <div
            className="flex h-14 w-full items-center justify-center rounded-md border border-white/10 transition-colors"
            style={{
              background: error ? "#2a0d0d" : "#0a1418",
              boxShadow:
                "inset 0 0 14px rgba(0,0,0,.8), inset 0 0 2px rgba(120,200,255,.15)",
            }}
          >
            <span
              className="font-mono text-3xl tracking-[0.45em]"
              style={{
                color: error ? "#ff6b6b" : "#7ee0ff",
                textShadow: error
                  ? "0 0 8px rgba(255,80,80,.7)"
                  : "0 0 8px rgba(120,220,255,.7)",
              }}
            >
              {value || "—".repeat(Math.max(answer.length, 4))}
            </span>
          </div>

          {/* 数字键盘 */}
          <div className="grid w-full grid-cols-3 gap-3">
            {keys.map((k) => (
              <PadButton
                key={k}
                active={pressed === k}
                onClick={() => input(k)}
              >
                {k}
              </PadButton>
            ))}
            <PadButton active={pressed === "back"} onClick={backspace} tone="muted">
              <Delete className="h-5 w-5" />
            </PadButton>
            <PadButton active={pressed === "0"} onClick={() => input("0")}>
              0
            </PadButton>
            <PadButton active={pressed === "ok"} onClick={submit} tone="accent">
              <Check className="h-5 w-5" />
            </PadButton>
          </div>

          {msg && (
            <p className="text-center text-xs text-red-400">{msg}</p>
          )}
          <p className="text-[10px] text-white/40">支持键盘 0-9 / Enter / Backspace</p>
        </div>

        {/* ACCESS 标签 */}
        <div className="mt-3 flex justify-center">
          <div
            className="rounded-md px-6 py-1.5 text-xs font-semibold tracking-[0.35em] text-white/80"
            style={{
              background:
                "linear-gradient(180deg, #2a2c30 0%, #15161a 100%)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,.08)",
            }}
          >
            ACCESS
          </div>
        </div>
      </div>
    </div>
  );
}

function PadButton({
  children,
  onClick,
  active,
  tone = "default",
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  tone?: "default" | "muted" | "accent";
}) {
  const colors =
    tone === "accent"
      ? "text-emerald-300"
      : tone === "muted"
        ? "text-white/60"
        : "text-cyan-200";
  return (
    <button
      onClick={onClick}
      className={`flex h-12 items-center justify-center rounded-xl border border-white/10 font-mono text-xl transition active:scale-95 ${colors} ${
        active ? "bg-white/15 shadow-[0_0_12px_rgba(120,220,255,.5)]" : "bg-white/[0.04] hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );
}

