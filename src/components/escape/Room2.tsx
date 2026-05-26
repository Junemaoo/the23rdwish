import { useEffect, useMemo, useState } from "react";
import { ROOM_2_DATA, type Exhibit } from "./config";
import { Modal } from "./ui";
import room2Bg from "@/assets/room2-hall.png";

/**
 * 房间 2：礼物档案室
 * - 等距展厅渲染图为底，10 个透明热区贴合实际展柜
 * - 后门 = 进入下一关的热区（需先完成排序）
 * - 下方时间排序面板保持原逻辑
 * - 按 D 切换调试网格 / 鼠标坐标 / 热区描边
 */
export function Room2({ onComplete }: { onComplete: () => void }) {
  const { meta, exhibits, sortablePool, correctOrder, slotLabels, puzzlePrompt, errorMessages, successText, nextCta } =
    ROOM_2_DATA;

  const [openExhibit, setOpenExhibit] = useState<Exhibit | null>(null);
  const [sortOpen, setSortOpen] = useState(false);
  const [solved, setSolved] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [wrong, setWrong] = useState(0);
  const [doorHint, setDoorHint] = useState(false);

  const [slots, setSlots] = useState<(string | null)[]>([null, null, null, null, null]);
  const inSlots = useMemo(() => new Set(slots.filter(Boolean) as string[]), [slots]);
  const pool = sortablePool.filter((id) => !inSlots.has(id));

  const [picked, setPicked] = useState<string | null>(null);

  const [debug, setDebug] = useState(false);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "d" || e.key === "D") setDebug((v) => !v);
      if (e.key === "Escape") setOpenExhibit(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const exhibitMap = useMemo(() => {
    const m = new Map<string, Exhibit>();
    exhibits.forEach((e) => m.set(e.id, e));
    return m;
  }, [exhibits]);

  // 10 个展柜在底图中的中心坐标（%）；热区为半透明按钮，hover 高亮
  const hotspots: { x: number; y: number; w: number; h: number }[] = [
    { x: 22, y: 38, w: 13, h: 22 }, // 0 水瓶 - 左后
    { x: 38, y: 30, w: 12, h: 24 }, // 1 电动牙刷 - 中后
    { x: 50, y: 40, w: 14, h: 22 }, // 2 男士护肤 - 中
    { x: 64, y: 28, w: 14, h: 22 }, // 3 乐高 - 右后
    { x: 76, y: 40, w: 13, h: 24 }, // 4 香水 - 右
    { x: 26, y: 56, w: 13, h: 22 }, // 5 AirPods - 左中
    { x: 47, y: 64, w: 13, h: 24 }, // 6 T恤 - 中前
    { x: 74, y: 60, w: 14, h: 24 }, // 7 蛋白粉 - 右中
    { x: 23, y: 78, w: 14, h: 22 }, // 8 腰包 - 左前
    { x: 78, y: 82, w: 14, h: 22 }, // 9 Omega-3 - 右前
  ];

  // 后门位置（图中正后方木门）
  const doorSpot = { x: 50, y: 16, w: 7, h: 18 };

  function placeIntoSlot(slotIdx: number, exId: string) {
    const next = [...slots];
    const prev = next.findIndex((v) => v === exId);
    if (prev >= 0) next[prev] = null;
    next[slotIdx] = exId;
    setSlots(next);
    setPicked(null);
    setErrMsg("");
  }

  function removeFromSlot(slotIdx: number) {
    const next = [...slots];
    next[slotIdx] = null;
    setSlots(next);
    setErrMsg("");
  }

  function handleConfirm() {
    if (slots.some((s) => s === null)) {
      setErrMsg("还有空着的卡槽哦，把五件都放进去再确认～");
      return;
    }
    const ok = slots.every((id, i) => id === correctOrder[i]);
    if (ok) {
      setSolved(true);
      setErrMsg("");
      setSortOpen(false);
    } else {
      const next = wrong + 1;
      setWrong(next);
      setErrMsg(errorMessages[Math.min(next - 1, errorMessages.length - 1)]);
    }
  }

  function resetSort() {
    setSlots([null, null, null, null, null]);
    setPicked(null);
    setErrMsg("");
  }

  function handleDoor() {
    if (solved) {
      onComplete();
    } else {
      setDoorHint(true);
      window.setTimeout(() => setDoorHint(false), 1800);
    }
  }

  return (
    <div className="fixed inset-0 z-0 flex h-screen w-screen items-center justify-center overflow-hidden bg-[#d4c4a0]">
      {/* 展览馆 — 内层固定宽高比，所有热区坐标基于底图 */}
      <div
        className="relative aspect-[1456/1080] h-full max-h-full w-auto max-w-full"
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
          src={room2Bg}
          alt="礼物档案室"
          draggable={false}
          className="absolute inset-0 h-full w-full select-none object-contain"
        />


        {/* 后门热区 */}
        <button
          onClick={handleDoor}
          aria-label={solved ? "进入下一关" : "门已锁"}
          title={solved ? "进入下一关" : "先完成展品排序"}
          className="absolute cursor-pointer bg-transparent transition hover:bg-amber-200/15 focus:outline-none"
          style={{
            left: `${doorSpot.x}%`,
            top: `${doorSpot.y}%`,
            width: `${doorSpot.w}%`,
            height: `${doorSpot.h}%`,
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* 布告板 — 覆盖墙上原告示牌，点击弹出排序面板 */}
        <button
          onClick={() => setSortOpen(true)}
          aria-label="展品排序布告板"
          title="展品排序"
          className="group absolute focus:outline-none"
          style={{
            left: "56.5%",
            top: "13.5%",
            width: "10%",
            height: "9%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <svg viewBox="0 0 100 110" preserveAspectRatio="xMidYMid meet" className="h-full w-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)] transition group-hover:scale-105">
            {/* 绳子 */}
            <line x1="50" y1="8" x2="20" y2="40" stroke="#3b2a20" strokeWidth="1.2" />
            <line x1="50" y1="8" x2="80" y2="40" stroke="#3b2a20" strokeWidth="1.2" />
            {/* 红色钉 */}
            <circle cx="50" cy="8" r="6" fill="#b8453a" stroke="#7a2a22" strokeWidth="0.8" />
            {/* 木板 */}
            <rect x="18" y="38" width="64" height="58" rx="2" fill="#6e4a32" stroke="#3b2a20" strokeWidth="0.8" />
            {/* 4 条纸 */}
            {[0, 1, 2, 3].map((i) => (
              <rect
                key={i}
                x={24 + i * 14}
                y={52}
                width={10}
                height={32}
                fill="#fbf3e6"
                className="transition group-hover:fill-[#fffbe8]"
              />
            ))}
          </svg>
          <span className="pointer-events-none absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-amber-100 opacity-0 transition group-hover:opacity-100">
            点击查看展品排序
          </span>
        </button>


        {/* 门锁提示 */}
        {doorHint && (
          <div className="pointer-events-none absolute left-1/2 top-[34%] -translate-x-1/2 rounded-full bg-black/70 px-4 py-1.5 text-xs text-amber-100">
            🔒 门锁着 · 先点击门旁的布告板完成展品排序
          </div>
        )}

        {/* 调试层 */}
        {debug && (
          <div className="pointer-events-none absolute inset-0 z-20">
            {Array.from({ length: 19 }).map((_, i) => (
              <div
                key={`v${i}`}
                className="absolute top-0 h-full border-l border-cyan-400/40"
                style={{ left: `${(i + 1) * 5}%` }}
              />
            ))}
            {Array.from({ length: 19 }).map((_, i) => (
              <div
                key={`h${i}`}
                className="absolute left-0 w-full border-t border-cyan-400/40"
                style={{ top: `${(i + 1) * 5}%` }}
              />
            ))}
            {hotspots.map((p, i) => (
              <div
                key={`hs${i}`}
                className="absolute border-2 border-pink-400/80"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: `${p.w}%`,
                  height: `${p.h}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <span className="absolute -top-4 left-0 bg-pink-500 px-1 text-[10px] text-white">
                  {i}
                </span>
              </div>
            ))}
            <div
              className="absolute border-2 border-yellow-400"
              style={{
                left: `${doorSpot.x}%`,
                top: `${doorSpot.y}%`,
                width: `${doorSpot.w}%`,
                height: `${doorSpot.h}%`,
                transform: "translate(-50%, -50%)",
              }}
            />
            {cursor && (
              <div className="absolute right-2 top-2 rounded bg-black/70 px-2 py-1 text-[11px] text-cyan-200">
                x: {cursor.x.toFixed(1)}% · y: {cursor.y.toFixed(1)}%
              </div>
            )}
          </div>
        )}
      </div>

      {/* 排序面板 — 由布告板触发的弹窗 */}
      <Modal open={sortOpen} onClose={() => setSortOpen(false)} title="🗂️ 展品时间排序">
        <div>


        <p className="mb-1 text-sm font-medium text-card-foreground">{puzzlePrompt}</p>
        <p className="mb-4 text-xs text-muted-foreground">
          支持拖拽；移动端可"点选展品 → 点击卡槽"放置。点击展厅中的展柜可查看详情。
        </p>

        <div className="relative mb-4 flex items-end justify-between gap-2">
          {slots.map((id, idx) => (
            <Slot
              key={idx}
              label={slotLabels[idx]}
              exhibit={id ? exhibitMap.get(id)! : null}
              onDropExhibit={(exId) => placeIntoSlot(idx, exId)}
              onClickEmpty={() => picked && placeIntoSlot(idx, picked)}
              onClickFilled={() => removeFromSlot(idx)}
              isTarget={picked !== null}
            />
          ))}
        </div>
        <div className="mb-4 flex items-center justify-between px-1 text-[10px] text-muted-foreground">
          <span>← 更早 2020</span>
          <span>2026 更晚 →</span>
        </div>

        <div className="rounded-lg border border-dashed border-border bg-background/50 p-3">
          <p className="mb-2 text-[11px] text-muted-foreground">
            待排序的五件礼物：
          </p>
          <div className="flex flex-wrap gap-2">
            {pool.length === 0 && (
              <span className="text-xs text-muted-foreground">
                都放进去了，点下方"确认排序"。
              </span>
            )}
            {pool.map((id) => {
              const ex = exhibitMap.get(id)!;
              const isPicked = picked === id;
              return (
                <button
                  key={id}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("text/plain", id)}
                  onClick={() => setPicked(isPicked ? null : id)}
                  className={`flex items-center gap-1 rounded-md border-2 px-3 py-2 text-sm shadow-sm transition ${
                    isPicked
                      ? "border-primary bg-primary/10 scale-105"
                      : "border-border bg-card hover:border-primary/60"
                  }`}
                >
                  <span className="text-lg">{ex.icon}</span>
                  <span className="text-xs">{ex.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {errMsg && <p className="mt-3 text-xs text-destructive">{errMsg}</p>}

        <div className="mt-4 flex gap-2">
          <button
            onClick={handleConfirm}
            className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            确认排序
          </button>
          <button
            onClick={resetSort}
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground transition hover:bg-muted"
          >
            重置
          </button>
        </div>
        </div>
      </Modal>

      <Modal
        open={!!openExhibit}
        onClose={() => setOpenExhibit(null)}
        title={openExhibit ? `展品 ${openExhibit.no} · ${openExhibit.name}` : ""}
      >
        <div className="space-y-3">
          <div className="text-5xl">{openExhibit?.icon}</div>
          <p>{openExhibit?.desc}</p>
        </div>
      </Modal>

      <Modal open={solved} onClose={onComplete} title="🗂️ 档案归档完成">
        {successText}
      </Modal>

      {solved && (
        <button
          onClick={onComplete}
          className="absolute left-1/2 top-6 z-30 -translate-x-1/2 rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-lg transition hover:opacity-90"

        >
          {nextCta} →
        </button>
      )}
    </div>
  );
}

function Slot({
  label,
  exhibit,
  onDropExhibit,
  onClickEmpty,
  onClickFilled,
  isTarget,
}: {
  label: string;
  exhibit: Exhibit | null;
  onDropExhibit: (id: string) => void;
  onClickEmpty: () => void;
  onClickFilled: () => void;
  isTarget: boolean;
}) {
  const [over, setOver] = useState(false);
  return (
    <div className="flex flex-1 flex-col items-center gap-1">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          const id = e.dataTransfer.getData("text/plain");
          if (id) onDropExhibit(id);
        }}
        onClick={() => (exhibit ? onClickFilled() : onClickEmpty())}
        className={`flex h-20 w-full min-w-0 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition ${
          over || (isTarget && !exhibit)
            ? "border-primary bg-primary/10"
            : exhibit
              ? "border-primary bg-card"
              : "border-border bg-background/40"
        }`}
        title={exhibit ? "点击移回" : "拖拽或点击放入"}
      >
        {exhibit ? (
          <>
            <span className="text-2xl">{exhibit.icon}</span>
            <span className="text-[10px] text-card-foreground">
              {exhibit.name}
            </span>
          </>
        ) : (
          <span className="text-xs text-muted-foreground">空</span>
        )}
      </div>
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  );
}
