import { useMemo, useState } from "react";
import { ROOM_2_DATA, type Exhibit } from "./config";
import { Modal } from "./ui";
import { IsoDisplayCase, IsoDoor } from "./iso";

/**
 * 房间 2：礼物档案室
 * - 10 个展品沿四面墙顺时针排列，点击查看
 * - 5 个待排序展品在底部托盘，可拖拽到 5 个时间卡槽
 * - 也支持点击拾取再点击卡槽放置（移动端兜底）
 * - "确认排序" → 比对 correctOrder
 */
export function Room2({ onComplete }: { onComplete: () => void }) {
  const { meta, exhibits, sortablePool, correctOrder, slotLabels, puzzlePrompt, errorMessages, successText, nextCta } =
    ROOM_2_DATA;

  const [openExhibit, setOpenExhibit] = useState<Exhibit | null>(null);
  const [solved, setSolved] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [wrong, setWrong] = useState(0);

  // 卡槽 5 个；pool 是未放入的待排序展品
  const [slots, setSlots] = useState<(string | null)[]>([null, null, null, null, null]);
  const inSlots = useMemo(() => new Set(slots.filter(Boolean) as string[]), [slots]);
  const pool = sortablePool.filter((id) => !inSlots.has(id));

  // 移动端：拾取的展品 id
  const [picked, setPicked] = useState<string | null>(null);

  const exhibitMap = useMemo(() => {
    const m = new Map<string, Exhibit>();
    exhibits.forEach((e) => m.set(e.id, e));
    return m;
  }, [exhibits]);

  // 展品在房间中的 % 坐标（顺时针绕墙：上→右→下→左）
  const wallPositions: { x: number; y: number }[] = [
    { x: 12, y: 12 }, { x: 32, y: 8 }, { x: 52, y: 8 }, { x: 72, y: 12 }, // 上墙
    { x: 88, y: 35 }, { x: 88, y: 62 }, // 右墙
    { x: 72, y: 85 }, { x: 28, y: 85 }, // 下墙
    { x: 12, y: 62 }, { x: 12, y: 35 }, // 左墙
  ];

  function placeIntoSlot(slotIdx: number, exId: string) {
    const next = [...slots];
    // 如果该 ex 已在别的槽，先清掉
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

      {/* 展览馆俯视 */}
      <div
        className="relative w-full overflow-hidden rounded-3xl border-2 border-[oklch(0.45_0.06_45)] shadow-2xl"
        style={{
          aspectRatio: "16 / 9",
          background:
            "radial-gradient(ellipse at 50% 30%, oklch(0.55 0.08 60) 0%, oklch(0.38 0.06 50) 60%, oklch(0.24 0.04 45) 100%)",
        }}
      >
        {/* 木地板 */}
        <div className="absolute inset-0 wood-floor opacity-95" />
        {/* 顶部聚光 */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-[90%] -translate-x-1/2 rounded-full bg-[oklch(0.92_0.075_85)] opacity-30 blur-3xl" />
        {/* 中央地毯 */}
        <div className="absolute left-1/2 top-1/2 h-[60%] w-[55%] -translate-x-1/2 -translate-y-1/2 rounded-lg border-2 border-[oklch(0.40_0.05_45)] bg-[oklch(0.86_0.07_80)]/30" />
        {/* 通往下一关的门 */}
        <div className="absolute right-2 top-1/2 w-[10%] -translate-y-1/2">
          <IsoDoor locked={!solved} />
          <p className="mt-1 text-center text-[10px] text-amber-50/80">下一间 →</p>
        </div>

        {/* 氛围文字 */}
        <p className="pointer-events-none absolute left-1/2 top-[88%] max-w-md -translate-x-1/2 text-center text-[11px] italic text-amber-100/70">
          {meta.ambient}
        </p>

        {/* 十个展柜 */}
        {exhibits.map((ex, i) => {
          const p = wallPositions[i];
          return (
            <button
              key={ex.id}
              onClick={() => setOpenExhibit(ex)}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              className="group absolute w-[9%] -translate-x-1/2 -translate-y-1/2 transition hover:scale-110 hover:z-10"
            >
              <IsoDisplayCase icon={ex.icon} no={ex.no} />
            </button>
          );
        })}
      </div>

      {/* 排序区 */}
      <section className="rounded-2xl border border-border bg-card/80 p-5 backdrop-blur">
        <p className="mb-1 text-sm font-medium text-card-foreground">{puzzlePrompt}</p>
        <p className="mb-4 text-xs text-muted-foreground">
          支持拖拽；移动端可"点选展品 → 点击卡槽"放置。
        </p>

        {/* 5 个卡槽 + 时间轴 */}
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

        {/* 待排序池 */}
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
      </section>

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
          className="mx-auto rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-lg transition hover:opacity-90"
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
