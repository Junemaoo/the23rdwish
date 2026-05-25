import { useEffect, useState } from "react";
import { BookOpen, X } from "lucide-react";
import { ROOMS } from "./config";
import { Modal, AnswerInput } from "./ui";
import room1Bg from "@/assets/room1-bg.jpg";
import room1Calendar from "@/assets/room1-calendar.jpg";
import room1Laptop from "@/assets/room1-laptop.jpg";
import room1Desktop from "@/assets/room1-desktop.jpg";

type ClueSpot = {
  id: string;
  label: string;
  image: string;
  left: number;
  top: number;
  w: number;
  h: number;
};

/**
 * 房间 1：沉浸式全屏，热点无视觉提示
 */
export function Room1({ onComplete }: { onComplete: () => void }) {
  const config = ROOMS[0];
  const [openClue, setOpenClue] = useState<ClueSpot | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [solved, setSolved] = useState(false);
  const [collected, setCollected] = useState<Set<string>>(new Set());
  const [showInventory, setShowInventory] = useState(false);

  const hotspots: ClueSpot[] = [
    { id: "pc-left",  label: "你的笔记本",      image: room1Laptop,   left: 8,  top: 50, w: 14, h: 14 },
    { id: "calendar", label: "走廊上的日历",    image: room1Calendar, left: 41, top: 27, w: 9,  h: 22 },
    { id: "pc-right", label: "我的台式机",      image: room1Desktop,  left: 70, top: 26, w: 14, h: 14 },
  ];

  // Esc 关闭弹层
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      if (openClue) setOpenClue(null);
      else if (showInventory) setShowInventory(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openClue, showInventory]);

  function collect(id: string) {
    setCollected((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    setOpenClue(null);
  }

  return (
    <div className="relative w-full min-h-[100svh] overflow-hidden bg-black">
      <img
        src={room1Bg}
        alt=""
        className="absolute inset-0 h-full w-full select-none object-cover"
        draggable={false}
      />

      {/* 左上角：线索收集册入口 */}
      <button
        onClick={() => setShowInventory(true)}
        className="absolute left-4 top-4 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white shadow-lg backdrop-blur transition hover:bg-black/80"
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
          aria-label={h.label}
        />
      ))}

      {/* 密码锁热点 → 打开答题框 */}
      <button
        onClick={() => setShowAnswer(true)}
        className="absolute cursor-pointer bg-transparent"
        style={{ left: "50%", top: "48%", width: "6%", height: "14%" }}
        title="数字密码锁"
        aria-label="数字密码锁"
      />

      {/* 物件特写：纯图 + 收集线索 */}
      {openClue && (
        <div
          className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-black/85 px-4 animate-in fade-in"
          onClick={() => setOpenClue(null)}
        >
          <button
            onClick={() => setOpenClue(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white/80 transition hover:bg-white/20"
            aria-label="关闭"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={openClue.image}
            alt=""
            onClick={(e) => e.stopPropagation()}
            className="max-h-[75vh] w-auto max-w-2xl rounded-2xl shadow-2xl"
            draggable={false}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!collected.has(openClue.id)) collect(openClue.id);
              else setOpenClue(null);
            }}
            disabled={collected.has(openClue.id)}
            className="mt-6 rounded-full bg-primary px-8 py-2.5 text-sm font-medium text-primary-foreground shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {collected.has(openClue.id) ? "已收集 ✓" : "收集线索"}
          </button>
        </div>
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
                    className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-black/40 p-3"
                  >
                    <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-black">
                      {got ? (
                        <img
                          src={h.image}
                          alt=""
                          className="h-full w-full object-cover"
                          draggable={false}
                        />
                      ) : (
                        <span className="text-3xl text-white/30">?</span>
                      )}
                    </div>
                    <span className={`text-xs ${got ? "text-white/90" : "text-white/40"}`}>
                      {got ? h.label : "尚未发现"}
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
