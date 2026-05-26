import { useEffect, useState } from "react";
import { ROOM_3_DATA, type Room3Item } from "./config";
import { Modal } from "./ui";
import sceneImg from "@/assets/room3/scene.png";

const norm = (s: string) => s.replace(/\s+/g, "").toLowerCase();

/** 热点坐标（基于 scene.png 实际位置，可微调） */
const HOTSPOTS: Record<string, { x: number; y: number; w: number }> = {
  noodles: { x: 12, y: 80, w: 22 },
  popmart: { x: 25, y: 78, w: 11 },
  ticket: { x: 45, y: 75, w: 14 },
  coffee: { x: 56, y: 67, w: 11 },
  map: { x: 80, y: 72, w: 24 },
};

const BOTTLE_POS = { x: 65, y: 18, w: 8 };
const DOOR_BTN_POS = { x: 40, y: 19 };

export function Room3({ onComplete }: { onComplete: () => void }) {
  const { meta, items, fragmentOrder } = ROOM_3_DATA;

  const [openItem, setOpenItem] = useState<Room3Item | null>(null);
  const [solvedItems, setSolvedItems] = useState<Set<string>>(new Set());
  const [collected, setCollected] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bottleNudge, setBottleNudge] = useState(false);

  const allCollected = collected.length === fragmentOrder.length;

  function onItemSolved(item: Room3Item) {
    if (solvedItems.has(item.id)) return;
    const next = new Set(solvedItems).add(item.id);
    setSolvedItems(next);
    const nextCollected = [...collected, item.fragment];
    setCollected(nextCollected);
    if (nextCollected.length === fragmentOrder.length) {
      setTimeout(() => setShowSuccess(true), 600);
    }
  }

  return (
    <div
      className="relative flex w-full items-center justify-center overflow-hidden bg-[#1a1410]"
      style={{ height: "calc(100vh - 49px)" }}
    >
      {/* 内层 stage：固定 4:3 比例，所有热点坐标都对齐这里 */}
      <div
        className="relative h-full"
        style={{ aspectRatio: "1449 / 1086" }}
      >
        {/* 背景图 */}
        <img
          src={sceneImg}
          alt="未来的一日行程单 · 桌面场景"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* 5 个物件热点（透明） */}
        {items.map((it) => {
          const spot = HOTSPOTS[it.id];
          if (!spot) return null;
          const done = solvedItems.has(it.id);
          return (
            <button
              key={it.id}
              onClick={() => setOpenItem(it)}
              style={{
                left: `${spot.x}%`,
                top: `${spot.y}%`,
                width: `${spot.w}%`,
                aspectRatio: "1 / 1",
              }}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer border-2 border-dashed border-yellow-400 bg-yellow-400/15"
              title={it.label}
              aria-label={it.label}
            >
              <span className="pointer-events-none absolute left-1 top-1 rounded bg-yellow-400 px-1 text-[10px] font-bold text-black">
                {it.id}
              </span>
              {done && (
                <span className="absolute left-1/2 top-1/2 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-emerald-500 text-xs text-white shadow-lg">
                  ✓
                </span>
              )}
            </button>
          );
        })}

        {/* 许愿瓶热点（柜子上） */}
        <button
          onClick={() => {
            if (allCollected) setShowSuccess(true);
            else setBottleNudge(true);
          }}
          style={{
            left: `${BOTTLE_POS.x}%`,
            top: `${BOTTLE_POS.y}%`,
            width: `${BOTTLE_POS.w}%`,
            aspectRatio: "1 / 1.6",
          }}
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer border-2 border-dashed border-amber-300 bg-amber-300/15"
          title={allCollected ? "许愿瓶被点亮了" : `还差 ${fragmentOrder.length - collected.length} 片`}
          aria-label="许愿瓶"
        >
          {allCollected && (
            <>
              <span className="pointer-events-none absolute inset-0 animate-pulse rounded-full bg-amber-300/40 blur-2xl" />
              <span className="pointer-events-none absolute inset-0 rounded-full shadow-[0_0_40px_12px_rgba(252,211,77,0.75)]" />
            </>
          )}
        </button>

        {/* 集齐后：门上发光按钮"进入下一关" */}
        {allCollected && (
          <button
            onClick={onComplete}
            style={{
              left: `${DOOR_BTN_POS.x}%`,
              top: `${DOOR_BTN_POS.y}%`,
            }}
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2 animate-fade-in rounded-full bg-amber-300/90 px-5 py-2 text-xs font-semibold text-amber-950 shadow-[0_0_24px_6px_rgba(252,211,77,0.75)] ring-1 ring-amber-200 transition hover:scale-105"
          >
            进入下一关 →
          </button>
        )}
      </div>

      {/* 答题弹窗 */}
      <ItemModal
        item={openItem}
        alreadyDone={openItem ? solvedItems.has(openItem.id) : false}
        onClose={() => setOpenItem(null)}
        onCorrect={(it) => onItemSolved(it)}
      />

      {/* 集齐成功提示 */}
      <Modal open={showSuccess} onClose={() => setShowSuccess(false)} title="✨ 许愿瓶亮了">
        {meta.successText}
      </Modal>

      {/* 未集齐时点瓶子的提示 */}
      <Modal open={bottleNudge} onClose={() => setBottleNudge(false)} title="许愿瓶未点亮">
        {`还差 ${fragmentOrder.length - collected.length} 片碎片，先去桌上找找～`}
      </Modal>
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

  const key = item?.id ?? "none";
  useEffect(() => {
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
