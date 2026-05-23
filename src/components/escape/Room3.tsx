import { useEffect, useMemo, useState } from "react";
import { ROOM_3_DATA, type Room3Item } from "./config";
import { Modal } from "./ui";

const norm = (s: string) => s.replace(/\s+/g, "").toLowerCase();

/**
 * 房间 3：未来的一日行程单
 * - 桌面 5 个物件，乱序点击 → 弹窗答题 → 答对获得碎片
 * - 5 碎片收齐后，许愿瓶亮起；玩家需按"生→日→快→乐→呀"顺序拖入
 * - 顺序错：碎片回到原位 + 提示
 * - 全部就位 → 亮灯 + 星星 + 进入结算页按钮
 */
export function Room3({ onComplete }: { onComplete: () => void }) {
  const { meta, items, fragmentOrder } = ROOM_3_DATA;

  const [openItem, setOpenItem] = useState<Room3Item | null>(null);
  /** 已答对的物件 id */
  const [solvedItems, setSolvedItems] = useState<Set<string>>(new Set());
  /** 已收集的碎片字（按获得顺序） */
  const [collected, setCollected] = useState<string[]>([]);
  /** 已正确放入瓶中的碎片字（按顺序） */
  const [placed, setPlaced] = useState<string[]>([]);
  /** 瓶口错误提示 */
  const [bottleMsg, setBottleMsg] = useState("");
  /** 拖拽中的碎片 */
  const [dragging, setDragging] = useState<string | null>(null);
  /** 移动端：拾取的碎片 */
  const [picked, setPicked] = useState<string | null>(null);

  const allCollected = collected.length === fragmentOrder.length;
  const allPlaced = placed.length === fragmentOrder.length;

  function onItemSolved(item: Room3Item) {
    if (solvedItems.has(item.id)) return;
    setSolvedItems(new Set(solvedItems).add(item.id));
    setCollected([...collected, item.fragment]);
  }

  /** 待放入瓶中的碎片池（已收集 - 已放入） */
  const poolFragments = useMemo(
    () => collected.filter((f) => !placed.includes(f)),
    [collected, placed],
  );

  function tryPlace(fragment: string) {
    if (!fragment) return;
    const expected = fragmentOrder[placed.length];
    if (fragment === expected) {
      setPlaced([...placed, fragment]);
      setBottleMsg("");
    } else {
      setBottleMsg(meta.bottleWrongOrder);
    }
    setDragging(null);
    setPicked(null);
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6">
      <header className="text-center">
        <p className="text-xs tracking-[0.3em] text-muted-foreground">
          房间 {meta.index} / {meta.total}
        </p>
        <h2 className="mt-1 font-serif text-3xl text-foreground sm:text-4xl">
          《{meta.name}》
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{meta.subtitle}</p>
      </header>

      {/* 桌面场景 */}
      <div
        className="relative w-full overflow-hidden rounded-3xl border border-border shadow-2xl"
        style={{
          aspectRatio: "16 / 9",
          background:
            "radial-gradient(ellipse at 50% 30%, oklch(0.97 0.01 90) 0%, oklch(0.90 0.02 80) 70%, oklch(0.78 0.03 75) 100%)",
        }}
      >
        {/* 桌面光晕 */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-96 -translate-x-1/2 rounded-full bg-amber-200/40 blur-3xl" />

        {/* 5 个桌面物件 */}
        {items.map((it) => {
          const done = solvedItems.has(it.id);
          return (
            <button
              key={it.id}
              onClick={() => setOpenItem(it)}
              style={{ left: `${it.x}%`, top: `${it.y}%` }}
              className="group absolute -translate-x-1/2 -translate-y-1/2"
            >
              <div
                className={`flex h-20 w-20 items-center justify-center rounded-xl border-2 text-4xl shadow-lg transition ${
                  done
                    ? "border-emerald-500/50 bg-emerald-50/80 opacity-70"
                    : "border-amber-300 bg-white hover:scale-110"
                }`}
              >
                {it.icon}
                {!done && (
                  <span className="absolute inset-0 -z-10 animate-ping rounded-xl border-2 border-amber-300" />
                )}
                {done && (
                  <span className="absolute -right-1 -top-1 rounded-full bg-emerald-500 px-1 text-[10px] text-white">
                    ✓
                  </span>
                )}
              </div>
              <div className="mt-1 rounded bg-slate-900/70 px-1.5 py-0.5 text-center text-[10px] text-white">
                {it.label}
              </div>
            </button>
          );
        })}

        {/* 通往下一关的门 + 柜子 + 许愿瓶 */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-end gap-2">
          <Bottle
            placed={placed.length}
            total={fragmentOrder.length}
            ready={allCollected}
            allPlaced={allPlaced}
            onDropFragment={(f) => tryPlace(f)}
            onClick={() => picked && tryPlace(picked)}
          />
          <div className="flex flex-col items-center">
            <div className="h-24 w-12 rounded-t-md border-2 border-amber-900 bg-gradient-to-b from-amber-800 to-amber-950 shadow-2xl">
              <div className="absolute right-2 top-12 h-1.5 w-1.5 rounded-full bg-yellow-300" />
            </div>
            <span className="mt-1 text-[10px] text-slate-700">最终页 →</span>
          </div>
        </div>

        {/* 氛围文字 */}
        <p className="pointer-events-none absolute left-3 bottom-2 max-w-xs text-[10px] italic text-slate-700/80">
          {meta.ambient}
        </p>
      </div>

      {/* 碎片收集面板 */}
      <section className="rounded-2xl border border-border bg-card/80 p-5 backdrop-blur">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium text-card-foreground">
            愿望碎片 {collected.length} / {fragmentOrder.length}
          </p>
          <p className="text-xs text-muted-foreground">
            {!allCollected
              ? meta.bottleHintEmpty
              : !allPlaced
                ? "把碎片拖进瓶子（或点选碎片 → 点瓶子）"
                : "全部就位 ✨"}
          </p>
        </div>

        {/* 碎片池 */}
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-border bg-background/50 p-3">
          {collected.length === 0 && (
            <span className="text-xs text-muted-foreground">
              还没有碎片，去桌面上点点看～
            </span>
          )}
          {poolFragments.map((f, i) => (
            <button
              key={`${f}-${i}`}
              draggable
              onDragStart={(e) => {
                setDragging(f);
                e.dataTransfer.setData("text/plain", f);
              }}
              onDragEnd={() => setDragging(null)}
              onClick={() => setPicked(picked === f ? null : f)}
              className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 font-serif text-2xl shadow-sm transition ${
                picked === f
                  ? "border-primary bg-primary/10 scale-110"
                  : "border-amber-300 bg-white hover:scale-105"
              } ${dragging === f ? "opacity-40" : ""}`}
              title="拖入许愿瓶，或点选后点瓶子"
            >
              {f}
            </button>
          ))}
          {/* 已放入的显示在右侧灰色区 */}
          {placed.length > 0 && (
            <>
              <span className="mx-2 text-xs text-muted-foreground">已就位 →</span>
              {placed.map((f, i) => (
                <span
                  key={`p-${i}`}
                  className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-emerald-400 bg-emerald-50 font-serif text-2xl text-emerald-700"
                >
                  {f}
                </span>
              ))}
            </>
          )}
        </div>

        {bottleMsg && (
          <p className="mt-3 text-xs text-destructive">{bottleMsg}</p>
        )}

        {allPlaced && (
          <button
            onClick={onComplete}
            className="mt-4 w-full rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-lg transition hover:opacity-90"
          >
            {meta.nextCta} →
          </button>
        )}
      </section>

      {/* 答题弹窗 */}
      <ItemModal
        item={openItem}
        alreadyDone={openItem ? solvedItems.has(openItem.id) : false}
        onClose={() => setOpenItem(null)}
        onCorrect={(it) => {
          onItemSolved(it);
        }}
      />

      {/* 成功通关 toast */}
      <Modal open={allPlaced} onClose={onComplete} title="✨ 许愿瓶亮了">
        {meta.successText}
      </Modal>
    </div>
  );
}

/** 许愿瓶（含放置/亮灯/星星动效） */
function Bottle({
  placed,
  total,
  ready,
  allPlaced,
  onDropFragment,
  onClick,
}: {
  placed: number;
  total: number;
  ready: boolean;
  allPlaced: boolean;
  onDropFragment: (f: string) => void;
  onClick: () => void;
}) {
  const [over, setOver] = useState(false);
  const lit = ready || placed > 0;

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        const f = e.dataTransfer.getData("text/plain");
        if (f) onDropFragment(f);
      }}
      onClick={onClick}
      className={`relative flex h-32 w-20 cursor-pointer flex-col items-center justify-end rounded-t-3xl rounded-b-xl border-2 transition ${
        over
          ? "border-primary"
          : allPlaced
            ? "border-amber-400"
            : "border-amber-200/70"
      }`}
      style={{
        background: lit
          ? "linear-gradient(180deg, rgba(255,236,170,.6), rgba(255,200,120,.45))"
          : "linear-gradient(180deg, rgba(200,200,210,.35), rgba(120,120,140,.35))",
        boxShadow: allPlaced
          ? "0 0 30px 4px rgba(251,191,36,.7)"
          : lit
            ? "0 0 16px 2px rgba(251,191,36,.35)"
            : "0 4px 12px rgba(0,0,0,.2)",
      }}
      title={ready ? "把碎片放进来" : "还需要更多碎片"}
    >
      {/* 瓶口 */}
      <div className="absolute -top-2 left-1/2 h-3 w-8 -translate-x-1/2 rounded-t-md border-2 border-amber-700 bg-amber-800" />
      {/* 进度 */}
      <div className="mb-2 text-center text-[10px] font-semibold text-amber-900">
        {placed} / {total}
      </div>
      {/* 星星 */}
      {allPlaced && (
        <>
          <span className="absolute -top-4 left-1 animate-bounce text-lg">✨</span>
          <span className="absolute -top-6 right-0 animate-pulse text-lg">⭐</span>
          <span className="absolute -top-3 -right-3 animate-bounce text-lg">🌟</span>
        </>
      )}
    </div>
  );
}

/** 答题弹窗：多字段输入 + 自定义错误提示 + 获得碎片反馈 */
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

  // 切换 item 时重置
  const key = item?.id ?? "none";
  useMemo(() => {
    setValues(item ? item.fields.map(() => "") : []);
    setWrong(0);
    setMsg("");
    setJustSolved(false);
  }, [key]);

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
      {/* 物件视觉 */}
      <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 p-3 font-mono text-xs leading-6 text-amber-900">
        {item.visual.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>

      {alreadyDone || justSolved ? (
        <div className="rounded-lg bg-emerald-50 p-3 text-center text-sm text-emerald-700">
          ✓ 已获得碎片：
          <span className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded border-2 border-emerald-500 bg-white font-serif text-xl">
            {item.fragment}
          </span>
        </div>
      ) : (
        <>
          <p className="mb-3 text-sm font-medium">{item.question}</p>
          <div className="flex flex-wrap items-center gap-2">
            {item.fields.map((f, i) => (
              <div key={i} className="flex items-center gap-1">
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
            ))}
            <button
              onClick={submit}
              className="ml-auto rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              确认
            </button>
          </div>
          {msg && <p className="mt-3 text-xs text-destructive">{msg}</p>}
        </>
      )}
    </Modal>
  );
}
