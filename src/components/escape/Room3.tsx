import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ROOM_3_DATA, type Room3Item } from "./config";
import { Modal } from "./ui";
import sceneImg from "@/assets/room3/scene.png";

const norm = (s: string) => s.replace(/\s+/g, "").toLowerCase();

/** 热点坐标（基于 scene.png 实际位置） */
const SPOTS: Record<string, { x: number; y: number; w: number; aspect: number }> = {
  noodles: { x: 37.8, y: 46.4, w: 26.5, aspect: 1 },
  popmart: { x: 27.4, y: 73.9, w: 11.0, aspect: 1 },
  ticket: { x: 42.9, y: 73.8, w: 14.0, aspect: 1 },
  coffee: { x: 59.2, y: 64.6, w: 11.0, aspect: 1 },
  map: { x: 72.0, y: 72.0, w: 14.9, aspect: 1 },
  bottle: { x: 65.0, y: 18.0, w: 8.0, aspect: 1 / 1.6 },
};

const DOOR_BTN_POS = { x: 40, y: 19 };

const FRAGMENT_POOL = ["生", "日", "快", "乐", "呀"];
function shuffleFragments() {
  const arr = [...FRAGMENT_POOL];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

type FlyState = {
  ch: string;
  from: { x: number; y: number; w: number; h: number };
  to: { x: number; y: number; w: number; h: number };
} | null;

export function Room3({ onComplete }: { onComplete: () => void }) {
  const { meta, items, fragmentOrder } = ROOM_3_DATA;

  // 本轮乱序碎片队列（一次性生成，玩家答对一题就按顺序取一个）
  const [shuffledFragments] = useState<string[]>(() => shuffleFragments());

  const [openItem, setOpenItem] = useState<Room3Item | null>(null);
  const [solvedItems, setSolvedItems] = useState<Set<string>>(new Set());
  const [collected, setCollected] = useState<string[]>([]);
  const [bottleNudge, setBottleNudge] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [bottleLit, setBottleLit] = useState(false);

  // 飞行碎片动效
  const [flying, setFlying] = useState<FlyState>(null);
  const [flyPhase, setFlyPhase] = useState<"start" | "end">("start");
  const [boxBounce, setBoxBounce] = useState(false);

  // 用于测量目标位置（左上角碎片盒下一个空槽）
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);

  const allCollected = collected.length === fragmentOrder.length;

  /** 玩家点 "知道了"：测量起点，开始飞行动画 */
  function handleAcknowledge(fromRect: DOMRect) {
    const ch = shuffledFragments[collected.length];
    if (!ch) return;
    const targetEl = slotRefs.current[collected.length];
    const toRect = targetEl?.getBoundingClientRect();
    if (!toRect) {
      // 退化：直接加入
      setCollected((p) => [...p, ch]);
      setOpenItem(null);
      return;
    }
    setOpenItem(null); // 关闭卡片
    setFlying({
      ch,
      from: { x: fromRect.left, y: fromRect.top, w: fromRect.width, h: fromRect.height },
      to: { x: toRect.left, y: toRect.top, w: toRect.width, h: toRect.height },
    });
    setFlyPhase("start");
    // 下一帧切换到终点位置，触发 transition
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setFlyPhase("end"));
    });
    // 动画结束后加入收集区
    window.setTimeout(() => {
      setCollected((prev) => [...prev, ch]);
      setFlying(null);
      setBoxBounce(true);
      window.setTimeout(() => setBoxBounce(false), 400);
    }, 750);
  }

  function onBottleClick() {
    if (bottleLit) return;
    if (!allCollected) {
      setBottleNudge(true);
      return;
    }
    setShowSort(true);
  }

  return (
    <div
      className="relative flex w-full items-center justify-center overflow-hidden bg-[#1a1410]"
      style={{ height: "calc(100vh - 49px)" }}
    >
      {/* 左上角碎片收集盒 */}
      <FragmentBox
        collected={collected}
        total={fragmentOrder.length}
        slotRefs={slotRefs}
        bounce={boxBounce}
      />

      {/* 内层 stage */}
      <div className="relative h-full" style={{ aspectRatio: "1449 / 1086" }}>
        <img
          src={sceneImg}
          alt="未来的一日行程单 · 桌面场景"
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />

        {items.map((it) => {
          const spot = SPOTS[it.id];
          if (!spot) return null;
          const done = solvedItems.has(it.id);
          return (
            <div
              key={it.id}
              onClick={() => setOpenItem(it)}
              style={{
                left: `${spot.x}%`,
                top: `${spot.y}%`,
                width: `${spot.w}%`,
                aspectRatio: `${spot.aspect}`,
              }}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              title={it.label}
            >
              {done && (
                <span className="absolute left-1/2 top-1/2 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-emerald-500 text-xs text-white shadow-lg">
                  ✓
                </span>
              )}
            </div>
          );
        })}

        <div
          onClick={onBottleClick}
          style={{
            left: `${SPOTS.bottle.x}%`,
            top: `${SPOTS.bottle.y}%`,
            width: `${SPOTS.bottle.w}%`,
            aspectRatio: `${SPOTS.bottle.aspect}`,
          }}
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
          title="许愿瓶"
        >
          {(allCollected || bottleLit) && (
            <>
              <span
                className={`pointer-events-none absolute inset-0 animate-pulse rounded-full blur-2xl ${
                  bottleLit ? "bg-amber-300/70" : "bg-amber-300/40"
                }`}
              />
              <span
                className={`pointer-events-none absolute inset-0 rounded-full ${
                  bottleLit
                    ? "shadow-[0_0_60px_18px_rgba(252,211,77,0.9)]"
                    : "shadow-[0_0_40px_12px_rgba(252,211,77,0.75)]"
                }`}
              />
              {bottleLit && (
                <>
                  <span className="pointer-events-none absolute -left-2 -top-3 animate-pulse text-lg">✨</span>
                  <span
                    className="pointer-events-none absolute -right-3 top-2 animate-pulse text-base"
                    style={{ animationDelay: "0.4s" }}
                  >
                    ✨
                  </span>
                  <span
                    className="pointer-events-none absolute -bottom-2 left-1/2 animate-pulse text-sm"
                    style={{ animationDelay: "0.8s" }}
                  >
                    ✨
                  </span>
                </>
              )}
            </>
          )}
        </div>

        {allCollected && !bottleLit && (
          <div
            style={{ left: `${SPOTS.bottle.x}%`, top: `${SPOTS.bottle.y - 10}%` }}
            className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-amber-200/90 px-3 py-1 text-[11px] font-medium text-amber-900 shadow animate-fade-in"
          >
            {meta.bottleHintReady}
          </div>
        )}

        {bottleLit && (
          <button
            onClick={onComplete}
            style={{ left: `${DOOR_BTN_POS.x}%`, top: `${DOOR_BTN_POS.y}%` }}
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2 animate-fade-in rounded-full bg-emerald-400/95 px-5 py-2 text-xs font-semibold text-emerald-950 shadow-[0_0_28px_8px_rgba(74,222,128,0.7)] ring-1 ring-emerald-200 transition hover:scale-105"
          >
            成功通关 →
          </button>
        )}
      </div>

      <ItemModal
        item={openItem}
        alreadyDone={openItem ? solvedItems.has(openItem.id) : false}
        nextFragment={shuffledFragments[collected.length]}
        onClose={() => setOpenItem(null)}
        onSolved={(it) => {
          if (!solvedItems.has(it.id)) {
            setSolvedItems((prev) => new Set(prev).add(it.id));
          }
        }}
        onAcknowledge={handleAcknowledge}
      />

      <Modal open={bottleNudge} onClose={() => setBottleNudge(false)} title="许愿瓶未点亮">
        {`还差 ${fragmentOrder.length - collected.length} 片碎片，先去桌上找找～`}
      </Modal>

      <SortModal
        open={showSort}
        fragments={collected}
        correctOrder={fragmentOrder}
        wrongMessage={meta.bottleWrongOrder}
        successText={meta.successText}
        onClose={() => setShowSort(false)}
        onSuccess={() => {
          setBottleLit(true);
          setShowSort(false);
        }}
      />

      {/* 飞行中的碎片 */}
      {flying &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="pointer-events-none fixed z-[200] flex items-center justify-center rounded-lg border-2 border-amber-400 bg-amber-50 font-serif text-amber-900 shadow-[0_0_24px_6px_rgba(252,211,77,0.65)]"
            style={{
              left: flyPhase === "start" ? flying.from.x : flying.to.x,
              top: flyPhase === "start" ? flying.from.y : flying.to.y,
              width: flyPhase === "start" ? flying.from.w : flying.to.w,
              height: flyPhase === "start" ? flying.from.h : flying.to.h,
              fontSize: flyPhase === "start" ? 32 : 16,
              transform: flyPhase === "start" ? "rotate(0deg)" : "rotate(360deg)",
              transition:
                "left 0.75s cubic-bezier(0.4,0,0.2,1), top 0.75s cubic-bezier(0.4,0,0.2,1), width 0.75s, height 0.75s, font-size 0.75s, transform 0.75s",
            }}
          >
            {flying.ch}
          </div>,
          document.body,
        )}
    </div>
  );
}

/** 左上角碎片收集盒 */
function FragmentBox({
  collected,
  total,
  slotRefs,
  bounce,
}: {
  collected: string[];
  total: number;
  slotRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  bounce: boolean;
}) {
  return (
    <div
      className={`absolute left-3 top-3 z-30 rounded-xl border border-amber-200/60 bg-white/75 px-3 py-2 shadow-lg backdrop-blur transition-transform ${
        bounce ? "scale-110" : "scale-100"
      }`}
    >
      <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-amber-900">
        <span>🧩</span>
        <span>愿望碎片</span>
        <span className="text-amber-700/70">
          {collected.length}/{total}
        </span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: total }).map((_, i) => {
          const ch = collected[i];
          return (
            <div
              key={i}
              ref={(el) => {
                slotRefs.current[i] = el;
              }}
              className={`flex h-8 w-8 items-center justify-center rounded-md border text-base font-serif ${
                ch
                  ? "animate-in zoom-in border-amber-400 bg-amber-50 text-amber-900 shadow-sm"
                  : "border-dashed border-amber-300/60 bg-white/40 text-transparent"
              }`}
            >
              {ch ?? "·"}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** 答题弹窗 */
function ItemModal({
  item,
  alreadyDone,
  nextFragment,
  onClose,
  onSolved,
  onAcknowledge,
}: {
  item: Room3Item | null;
  alreadyDone: boolean;
  nextFragment: string | undefined;
  onClose: () => void;
  onSolved: (it: Room3Item) => void;
  onAcknowledge: (fromRect: DOMRect) => void;
}) {
  const [values, setValues] = useState<string[]>([]);
  const [wrong, setWrong] = useState(0);
  const [msg, setMsg] = useState("");
  const [solved, setSolved] = useState(false);
  const [awardedFragment, setAwardedFragment] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fragmentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!previewImage) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreviewImage(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [previewImage]);

  const key = item?.id ?? "none";
  useEffect(() => {
    setValues(item ? item.fields.map(() => "") : []);
    setWrong(0);
    setMsg("");
    setSolved(false);
    setAwardedFragment(null);
  }, [key]);

  if (!item) return null;

  function submit() {
    if (!item) return;
    const ok = item.fields.every((_, i) =>
      item.answers[i].some((a) => norm(a) === norm(values[i] ?? "")),
    );
    if (ok) {
      setSolved(true);
      setMsg("");
      setAwardedFragment(nextFragment ?? null);
      onSolved(item);
    } else {
      const next = wrong + 1;
      setWrong(next);
      setMsg(item.errorMessages[Math.min(next - 1, item.errorMessages.length - 1)]);
    }
  }

  function acknowledge() {
    const el = fragmentRef.current;
    if (!el) {
      onClose();
      return;
    }
    onAcknowledge(el.getBoundingClientRect());
  }

  return (
    <Modal open={!!item} onClose={solved ? () => {} : onClose} title={item.label} hideClose>
      <div
        className="group relative mb-3 cursor-zoom-in overflow-hidden rounded-lg border border-border bg-muted/30"
        onClick={() => setPreviewImage(item.image)}
        title="点击图片放大查看"
      >
        <img
          src={item.image}
          alt={item.label}
          className="mx-auto block max-h-56 w-full object-contain"
          draggable={false}
        />
        <span className="pointer-events-none absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/55 text-xs text-white shadow">
          🔍
        </span>
        <span className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] text-white opacity-0 transition group-hover:opacity-100">
          点击图片放大查看
        </span>
      </div>

      {previewImage &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 p-4 animate-fade-in"
            onClick={() => setPreviewImage(null)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPreviewImage(null);
              }}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-lg text-black shadow-lg transition hover:bg-white"
              aria-label="关闭预览"
            >
              ✕
            </button>
            <img
              src={previewImage}
              alt={item.label}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] max-w-[92vw] object-contain"
              draggable={false}
            />
          </div>,
          document.body,
        )}

      {solved ? null : alreadyDone ? (
        <div className="rounded-lg bg-amber-50 p-3 text-center text-sm text-amber-800">
          这个线索已经收集过啦～
        </div>
      ) : null}
      {solved ? (
        <div className="space-y-4">
          <div className="rounded-lg bg-emerald-50 p-4 text-center">
            <p className="mb-3 text-sm font-medium text-emerald-700">
              回答正确，获得一个碎片
            </p>
            <div className="flex justify-center">
              <div
                ref={fragmentRef}
                className="relative flex h-16 w-16 items-center justify-center rounded-lg border-2 border-amber-400 bg-gradient-to-br from-amber-50 to-amber-200 font-serif text-3xl text-amber-900 shadow-[0_0_18px_4px_rgba(252,211,77,0.6)]"
                style={{
                  clipPath:
                    "polygon(0% 0%, 60% 0%, 65% 10%, 75% 10%, 80% 0%, 100% 0%, 100% 60%, 90% 65%, 90% 75%, 100% 80%, 100% 100%, 0% 100%)",
                }}
              >
                {awardedFragment ?? "?"}
              </div>
            </div>
          </div>
          <button
            onClick={acknowledge}
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            知道了
          </button>
        </div>
      ) : (
        <>
          <p className="mb-3 text-sm font-medium">{item.question}</p>
          <div className="flex flex-wrap items-end gap-3">
            {item.fields.map((f, i) => (
              <div key={i} className="flex flex-col gap-1">
                {f.label && (
                  <span className="text-xs text-muted-foreground">{f.label}</span>
                )}
                <div className="flex items-center gap-1">
                  {f.prefix && (
                    <span className="text-sm text-muted-foreground">{f.prefix}</span>
                  )}
                  <input
                    value={values[i] ?? ""}
                    onChange={(e) => {
                      const next = [...values];
                      next[i] = e.target.value;
                      setValues(next);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && submit()}
                    placeholder={f.placeholder}
                    className={`rounded-md border border-input bg-background px-2 py-1.5 text-sm outline-none focus:border-primary ${f.width ?? "w-24"}`}
                  />
                  {f.suffix && (
                    <span className="text-sm text-muted-foreground">{f.suffix}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            {msg ? <p className="text-xs text-destructive">{msg}</p> : <span />}
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="rounded-md border border-border bg-background px-3 py-1.5 text-sm transition hover:bg-muted"
              >
                关闭
              </button>
              <button
                onClick={submit}
                className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                确认
              </button>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}

/** 许愿瓶排序弹窗 */
function SortModal({
  open,
  fragments,
  correctOrder,
  wrongMessage,
  successText,
  onClose,
  onSuccess,
}: {
  open: boolean;
  fragments: string[];
  correctOrder: string[];
  wrongMessage: string;
  successText: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  type Tile = { idx: number; ch: string };
  const pool = useMemo<Tile[]>(() => {
    if (!open) return [];
    const arr = fragments.map((ch, idx) => ({ idx, ch }));
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const [slots, setSlots] = useState<(Tile | null)[]>([]);
  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      setSlots(Array(correctOrder.length).fill(null));
      setMsg("");
      setSuccess(false);
    }
  }, [open, correctOrder.length]);

  if (!open) return null;

  const usedIdx = new Set(slots.filter((s): s is Tile => !!s).map((s) => s.idx));
  const available = pool.filter((t) => !usedIdx.has(t.idx));
  const filled = slots.every((s) => s !== null);

  function placeTile(tile: Tile) {
    const next = [...slots];
    const empty = next.findIndex((s) => s === null);
    if (empty === -1) return;
    next[empty] = tile;
    setSlots(next);
    setMsg("");
  }

  function takeOut(i: number) {
    const next = [...slots];
    next[i] = null;
    setSlots(next);
    setMsg("");
  }

  function confirm() {
    if (!filled) return;
    const seq = slots.map((s) => s!.ch).join("");
    const correct = correctOrder.join("");
    if (seq === correct) {
      setSuccess(true);
      setMsg("");
    } else {
      setMsg(wrongMessage);
      setSlots(Array(correctOrder.length).fill(null));
    }
  }

  return (
    <Modal
      open={open}
      onClose={success ? onSuccess : onClose}
      title={success ? successText : "放入碎片开始点亮许愿瓶吧！"}
      hideClose
    >
      {success ? (
        <div className="space-y-4">
          <div className="rounded-lg bg-amber-50 p-4 text-center text-base text-amber-900">
            <div className="mb-2 text-2xl">🌟</div>
            {correctOrder.join(" · ")}
            <div className="mt-2 text-xs text-amber-700">许愿瓶被点亮了。</div>
          </div>
          <button
            onClick={onSuccess}
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            知道了
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            按正确顺序点击下方碎片，依次放入上方空槽。点击已放入的槽可以取出。
          </p>

          <div className="flex justify-center gap-2">
            {slots.map((s, i) => (
              <button
                key={i}
                onClick={() => s && takeOut(i)}
                className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 font-serif text-2xl transition ${
                  s
                    ? "border-amber-500 bg-amber-50 text-amber-900 hover:bg-amber-100"
                    : "border-dashed border-muted-foreground/40 bg-muted/30 text-transparent"
                }`}
              >
                {s?.ch ?? "·"}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-2 rounded-lg bg-muted/40 p-3">
            {available.length === 0 ? (
              <span className="text-xs text-muted-foreground">全部已放入</span>
            ) : (
              available.map((t) => (
                <button
                  key={t.idx}
                  onClick={() => placeTile(t)}
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-amber-300 bg-white font-serif text-xl text-amber-900 shadow-sm transition hover:scale-110 hover:bg-amber-50"
                >
                  {t.ch}
                </button>
              ))
            )}
          </div>

          {msg && <p className="text-center text-xs text-destructive">{msg}</p>}

          <button
            onClick={confirm}
            disabled={!filled}
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            确认放入
          </button>
        </div>
      )}
    </Modal>
  );
}
