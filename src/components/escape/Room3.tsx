import { useEffect, useRef, useState } from "react";
import { ROOM_3_DATA, type Room3Item } from "./config";
import { Modal } from "./ui";
import sceneImg from "@/assets/room3/scene.png";

const norm = (s: string) => s.replace(/\s+/g, "").toLowerCase();

type Spot = { x: number; y: number; w: number; aspect: number };

/** 热点坐标（基于 scene.png 实际位置，可微调） */
const DEFAULT_SPOTS: Record<string, Spot> = {
  noodles: { x: 12, y: 80, w: 22, aspect: 1 },
  popmart: { x: 25, y: 78, w: 11, aspect: 1 },
  ticket: { x: 45, y: 75, w: 14, aspect: 1 },
  coffee: { x: 56, y: 67, w: 11, aspect: 1 },
  map: { x: 80, y: 72, w: 24, aspect: 1 },
  bottle: { x: 65, y: 18, w: 8, aspect: 1 / 1.6 },
};

const DOOR_BTN_POS = { x: 40, y: 19 };

export function Room3({ onComplete }: { onComplete: () => void }) {
  const { meta, items, fragmentOrder } = ROOM_3_DATA;

  const [openItem, setOpenItem] = useState<Room3Item | null>(null);
  const [solvedItems, setSolvedItems] = useState<Set<string>>(new Set());
  const [collected, setCollected] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bottleNudge, setBottleNudge] = useState(false);

  // ---- 编辑模式 ----
  const [editMode, setEditMode] = useState(false);
  const [spots, setSpots] = useState<Record<string, Spot>>(DEFAULT_SPOTS);
  const [selected, setSelected] = useState<string | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

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

  function startDrag(
    e: React.PointerEvent,
    id: string,
    mode: "move" | "resize",
  ) {
    if (!editMode) return;
    e.preventDefault();
    e.stopPropagation();
    setSelected(id);
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const start = spots[id];
    const startX = e.clientX;
    const startY = e.clientY;

    function onMove(ev: PointerEvent) {
      const dxPct = ((ev.clientX - startX) / rect.width) * 100;
      const dyPct = ((ev.clientY - startY) / rect.height) * 100;
      setSpots((prev) => {
        const cur = prev[id];
        if (mode === "move") {
          return {
            ...prev,
            [id]: {
              ...cur,
              x: clamp(start.x + dxPct, 0, 100),
              y: clamp(start.y + dyPct, 0, 100),
            },
          };
        }
        return {
          ...prev,
          [id]: { ...cur, w: clamp(start.w + dxPct * 2, 1, 100) },
        };
      });
    }
    function onUp() {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  function exportConfig() {
    const lines = [
      "const HOTSPOTS = {",
      ...["noodles", "popmart", "ticket", "coffee", "map"].map((id) => {
        const s = spots[id];
        return `  ${id}: { x: ${s.x.toFixed(1)}, y: ${s.y.toFixed(1)}, w: ${s.w.toFixed(1)} },`;
      }),
      "};",
      `const BOTTLE_POS = { x: ${spots.bottle.x.toFixed(1)}, y: ${spots.bottle.y.toFixed(1)}, w: ${spots.bottle.w.toFixed(1)} };`,
    ].join("\n");
    navigator.clipboard?.writeText(lines);
    return lines;
  }

  return (
    <div
      className="relative flex w-full items-center justify-center overflow-hidden bg-[#1a1410]"
      style={{ height: "calc(100vh - 49px)" }}
    >
      {/* 编辑模式工具条 */}
      <div className="absolute right-3 top-3 z-50 flex items-center gap-2">
        <button
          onClick={() => setEditMode((v) => !v)}
          className={`rounded-md px-3 py-1.5 text-xs font-semibold shadow ${
            editMode
              ? "bg-yellow-400 text-black"
              : "bg-black/60 text-white hover:bg-black/80"
          }`}
        >
          {editMode ? "退出编辑" : "编辑热点"}
        </button>
        {editMode && (
          <button
            onClick={() => {
              const txt = exportConfig();
              console.log(txt);
              alert("已复制到剪贴板：\n\n" + txt);
            }}
            className="rounded-md bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-emerald-600"
          >
            复制配置
          </button>
        )}
        {editMode && (
          <button
            onClick={() => setSpots(DEFAULT_SPOTS)}
            className="rounded-md bg-black/60 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-black/80"
          >
            重置
          </button>
        )}
      </div>

      {/* 内层 stage */}
      <div
        ref={stageRef}
        className="relative h-full"
        style={{ aspectRatio: "1449 / 1086" }}
      >
        <img
          src={sceneImg}
          alt="未来的一日行程单 · 桌面场景"
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />

        {/* 5 个物件热点 */}
        {items.map((it) => {
          const spot = spots[it.id];
          if (!spot) return null;
          const done = solvedItems.has(it.id);
          const isSel = selected === it.id;
          return (
            <div
              key={it.id}
              onPointerDown={(e) => editMode && startDrag(e, it.id, "move")}
              onClick={() => !editMode && setOpenItem(it)}
              style={{
                left: `${spot.x}%`,
                top: `${spot.y}%`,
                width: `${spot.w}%`,
                aspectRatio: `${spot.aspect}`,
              }}
              className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 ${
                editMode
                  ? `cursor-move border-2 ${isSel ? "border-pink-500 bg-pink-500/20" : "border-yellow-400 bg-yellow-400/15"}`
                  : "cursor-pointer border-2 border-dashed border-yellow-400 bg-yellow-400/15"
              }`}
              title={it.label}
            >
              <span className="pointer-events-none absolute left-1 top-1 rounded bg-yellow-400 px-1 text-[10px] font-bold text-black">
                {it.id}
              </span>
              {editMode && (
                <div
                  onPointerDown={(e) => startDrag(e, it.id, "resize")}
                  className="absolute -bottom-2 -right-2 h-4 w-4 cursor-nwse-resize rounded-sm border-2 border-white bg-pink-500"
                />
              )}
              {done && !editMode && (
                <span className="absolute left-1/2 top-1/2 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-emerald-500 text-xs text-white shadow-lg">
                  ✓
                </span>
              )}
            </div>
          );
        })}

        {/* 许愿瓶热点 */}
        <div
          onPointerDown={(e) => editMode && startDrag(e, "bottle", "move")}
          onClick={() => {
            if (editMode) return;
            if (allCollected) setShowSuccess(true);
            else setBottleNudge(true);
          }}
          style={{
            left: `${spots.bottle.x}%`,
            top: `${spots.bottle.y}%`,
            width: `${spots.bottle.w}%`,
            aspectRatio: `${spots.bottle.aspect}`,
          }}
          className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 ${
            editMode
              ? `cursor-move border-2 ${selected === "bottle" ? "border-pink-500 bg-pink-500/20" : "border-amber-300 bg-amber-300/15"}`
              : "cursor-pointer border-2 border-dashed border-amber-300 bg-amber-300/15"
          }`}
          title="许愿瓶"
        >
          <span className="pointer-events-none absolute left-1 top-1 rounded bg-amber-300 px-1 text-[10px] font-bold text-black">
            bottle
          </span>
          {editMode && (
            <div
              onPointerDown={(e) => startDrag(e, "bottle", "resize")}
              className="absolute -bottom-2 -right-2 h-4 w-4 cursor-nwse-resize rounded-sm border-2 border-white bg-pink-500"
            />
          )}
          {allCollected && !editMode && (
            <>
              <span className="pointer-events-none absolute inset-0 animate-pulse rounded-full bg-amber-300/40 blur-2xl" />
              <span className="pointer-events-none absolute inset-0 rounded-full shadow-[0_0_40px_12px_rgba(252,211,77,0.75)]" />
            </>
          )}
        </div>

        {allCollected && !editMode && (
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

      {/* 当前选中坐标显示 */}
      {editMode && selected && (
        <div className="absolute bottom-3 left-3 z-50 rounded-md bg-black/80 px-3 py-2 font-mono text-xs text-white shadow">
          <div className="mb-1 font-bold text-yellow-300">{selected}</div>
          <div>x: {spots[selected].x.toFixed(1)}</div>
          <div>y: {spots[selected].y.toFixed(1)}</div>
          <div>w: {spots[selected].w.toFixed(1)}</div>
        </div>
      )}

      <ItemModal
        item={openItem}
        alreadyDone={openItem ? solvedItems.has(openItem.id) : false}
        onClose={() => setOpenItem(null)}
        onCorrect={(it) => onItemSolved(it)}
      />

      <Modal open={showSuccess} onClose={() => setShowSuccess(false)} title="✨ 许愿瓶亮了">
        {meta.successText}
      </Modal>

      <Modal open={bottleNudge} onClose={() => setBottleNudge(false)} title="许愿瓶未点亮">
        {`还差 ${fragmentOrder.length - collected.length} 片碎片，先去桌上找找～`}
      </Modal>
    </div>
  );
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
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
