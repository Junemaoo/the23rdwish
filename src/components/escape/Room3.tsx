import { useEffect, useMemo, useState } from "react";
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

export function Room3({ onComplete }: { onComplete: () => void }) {
  const { meta, items, fragmentOrder } = ROOM_3_DATA;

  const [openItem, setOpenItem] = useState<Room3Item | null>(null);
  const [solvedItems, setSolvedItems] = useState<Set<string>>(new Set());
  const [collected, setCollected] = useState<string[]>([]);
  const [bottleNudge, setBottleNudge] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [bottleLit, setBottleLit] = useState(false);

  const allCollected = collected.length === fragmentOrder.length;

  function onItemSolved(item: Room3Item) {
    if (solvedItems.has(item.id)) return;
    const next = new Set(solvedItems).add(item.id);
    setSolvedItems(next);
    setCollected((prev) => [...prev, item.fragment]);
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
      <FragmentBox collected={collected} total={fragmentOrder.length} />

      {/* 内层 stage */}
      <div className="relative h-full" style={{ aspectRatio: "1449 / 1086" }}>
        <img
          src={sceneImg}
          alt="未来的一日行程单 · 桌面场景"
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />

        {/* 5 个物件热点 */}
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

        {/* 许愿瓶热点 */}
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

        {/* 集齐但未点亮：瓶上方小字提示 */}
        {allCollected && !bottleLit && (
          <div
            style={{ left: `${SPOTS.bottle.x}%`, top: `${SPOTS.bottle.y - 10}%` }}
            className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-amber-200/90 px-3 py-1 text-[11px] font-medium text-amber-900 shadow animate-fade-in"
          >
            {meta.bottleHintReady}
          </div>
        )}

        {/* 门按钮：点亮后才出现 */}
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
        onClose={() => setOpenItem(null)}
        onCorrect={(it) => onItemSolved(it)}
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
    </div>
  );
}

/** 左上角碎片收集盒 */
function FragmentBox({ collected, total }: { collected: string[]; total: number }) {
  return (
    <div className="absolute left-3 top-3 z-30 rounded-xl border border-amber-200/60 bg-white/75 px-3 py-2 shadow-lg backdrop-blur">
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
  onClose,
  onCorrect,
}: {
  item: Room3Item | null;
  alreadyDone: boolean;
  onClose: () => void;
  onCorrect: (it: Room3Item) => void;
}) {
  const [values, setValues] = useState<string[]>([]);
  const [wrong, setWrong] = useState(0);
  const [msg, setMsg] = useState("");
  const [justSolved, setJustSolved] = useState(false);

  const key = item?.id ?? "none";
  useEffect(() => {
    setValues(item ? item.fields.map(() => "") : []);
    setWrong(0);
    setMsg("");
    setJustSolved(false);
  }, [key]);

  // 答对后短暂展示 ✓，然后自动关闭
  useEffect(() => {
    if (!justSolved) return;
    const t = setTimeout(() => onClose(), 900);
    return () => clearTimeout(t);
  }, [justSolved, onClose]);

  if (!item) return null;

  function submit() {
    if (!item) return;
    const ok = item.fields.every((_, i) =>
      item.answers[i].some((a) => norm(a) === norm(values[i] ?? "")),
    );
    if (ok) {
      setJustSolved(true);
      setMsg("");
      onCorrect(item);
    } else {
      const next = wrong + 1;
      setWrong(next);
      setMsg(item.errorMessages[Math.min(next - 1, item.errorMessages.length - 1)]);
    }
  }

  return (
    <Modal open={!!item} onClose={onClose} title={item.label}>
      <div className="mb-3 overflow-hidden rounded-lg border border-border bg-muted/30">
        <img
          src={item.image}
          alt={item.label}
          className="mx-auto block max-h-56 w-full object-contain"
          draggable={false}
        />
      </div>

      {alreadyDone ? (
        <div className="rounded-lg bg-amber-50 p-3 text-center text-sm text-amber-800">
          这个线索已经收集过啦～
        </div>
      ) : justSolved ? (
        <div className="rounded-lg bg-emerald-50 p-3 text-center text-sm text-emerald-700">
          ✓ 获得碎片：
          <span className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded border-2 border-emerald-500 bg-white font-serif text-xl">
            {item.fragment}
          </span>
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
            {msg ? (
              <p className="text-xs text-destructive">{msg}</p>
            ) : (
              <span />
            )}
            <button
              onClick={submit}
              className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              确认
            </button>
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
  fragments: string[]; // 玩家收集到的碎片（按答题顺序）
  correctOrder: string[]; // 正确顺序
  wrongMessage: string;
  successText: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  // 池：每个碎片用 index 标识（避免重复字符冲突）
  type Tile = { idx: number; ch: string };
  const pool = useMemo<Tile[]>(() => {
    if (!open) return [];
    const arr = fragments.map((ch, idx) => ({ idx, ch }));
    // 简单 shuffle
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

          {/* 空槽 */}
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

          {/* 可选碎片池 */}
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
