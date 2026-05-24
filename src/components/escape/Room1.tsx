import { useState } from "react";
import { ROOMS, type Hotspot as HotspotType } from "./config";
import { Modal, AnswerInput } from "./ui";
import {
  IsoFridge, IsoStove, IsoSink, IsoVeggies, IsoWardrobe, IsoBed, IsoDesk,
  IsoLaptop, IsoLamp, IsoWindow, IsoBlackboard, IsoCalendar, IsoMonitor,
  IsoLabubu, IsoTreadmill, IsoDumbbell, IsoBench, IsoDoor, HotspotRing,
} from "./iso";

/**
 * 房间 1：我们，在世界的两端
 * 2.5D dollhouse：左 = 伦敦公寓 / 中 = 长廊 + 密码门 + 日历 / 右 = 工位 + 健身房
 * 全部主体家具为 isometric SVG。
 */
export function Room1({ onComplete }: { onComplete: () => void }) {
  const config = ROOMS[0];
  const [foundIds, setFoundIds] = useState<string[]>([]);
  const [openClue, setOpenClue] = useState<HotspotType | null>(null);
  const [solved, setSolved] = useState(false);

  function openHotspot(h: HotspotType) {
    setOpenClue(h);
    if (!foundIds.includes(h.id)) setFoundIds([...foundIds, h.id]);
  }
  const found = (id: string) => foundIds.includes(id);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6">
      <header className="text-center">
        <p className="text-xs tracking-[0.3em] text-muted-foreground">房间 1 / 3</p>
        <h2 className="mt-1 font-serif text-3xl text-foreground sm:text-4xl">
          《{config.name}》
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{config.subtitle}</p>
      </header>

      <div
        className="relative w-full overflow-hidden rounded-3xl border border-[oklch(0.5_0.05_45)] shadow-2xl"
        style={{
          aspectRatio: "16 / 9",
          background:
            "linear-gradient(180deg, oklch(0.32 0.04 250) 0%, oklch(0.24 0.03 250) 55%, oklch(0.18 0.03 250) 100%)",
        }}
      >
        {/* 木地板 */}
        <div className="absolute inset-x-0 bottom-0 h-[44%] wood-floor" />

        {/* ===== 左侧：伦敦公寓 ===== */}
        <RoomBox side="left" tone="warm">
          <Badge className="left-2 top-2 bg-[#5B2B82]">UCL · 伦敦</Badge>
          <IsoWindow className="absolute left-[6%] top-[6%] w-[28%]" />
          <IsoFridge className="absolute left-[34%] top-[12%] w-[18%]" />
          <IsoStove className="absolute left-[55%] top-[14%] w-[22%]" />
          <IsoSink className="absolute left-[78%] top-[16%] w-[18%]" />
          <IsoVeggies className="absolute left-[42%] top-[34%] w-[28%]" />
          <IsoWardrobe className="absolute left-[6%] top-[36%] w-[18%]" />
          <IsoBed className="absolute left-[26%] top-[52%] w-[44%]" />
          <IsoDesk className="absolute left-[6%] bottom-[4%] w-[88%]" />
          <IsoLamp className="absolute left-[8%] bottom-[12%] w-[14%]" />
          <IsoBlackboard className="absolute left-[68%] top-[40%] w-[28%]" />
          {/* 电脑 — 热点 */}
          <button
            onClick={() => openHotspot(config.hotspots[0])}
            className="group absolute left-[38%] bottom-[10%] w-[22%]"
            title="你的笔记本"
          >
            <IsoLaptop time="05:20" />
            {!found("pc-left") && <HotspotRing />}
            {found("pc-left") && (
              <span className="absolute -right-1 -top-1 rounded-full bg-[oklch(0.58_0.08_145)] px-1.5 text-[10px] text-white">✓</span>
            )}
          </button>
        </RoomBox>

        {/* ===== 中间：走廊 + 门 + 日历 ===== */}
        <div className="absolute left-1/2 top-[8%] h-[80%] w-[22%] -translate-x-1/2">
          <div className="absolute inset-x-0 top-0 h-[36%] rounded-t-lg bg-[oklch(0.30_0.04_50)]" />
          <div className="absolute inset-x-0 bottom-0 top-[36%] bg-gradient-to-b from-[oklch(0.36_0.05_50)] to-[oklch(0.22_0.03_50)]" />
          <div className="pointer-events-none absolute left-1/2 top-[28%] h-40 w-40 -translate-x-1/2 rounded-full bg-[oklch(0.92_0.075_85)] opacity-40 blur-3xl" />
          {/* 日历 — 热点 */}
          <button
            onClick={() => openHotspot(config.hotspots[2])}
            className="group absolute left-1/2 top-[4%] w-[60%] -translate-x-1/2"
            title="走廊尽头的日历"
          >
            <IsoCalendar />
            {!found("calendar") && <HotspotRing />}
            {found("calendar") && (
              <span className="absolute -right-1 -top-1 rounded-full bg-[oklch(0.58_0.08_145)] px-1.5 text-[10px] text-white">✓</span>
            )}
          </button>
          {/* 密码门 */}
          <div className="absolute left-1/2 bottom-[2%] w-[72%] -translate-x-1/2">
            <IsoDoor locked={!solved} />
            <p className="mt-1 text-center text-[10px] text-[oklch(0.92_0.075_85)]">⌨ 4 位密码</p>
          </div>
        </div>

        {/* ===== 右侧：工位 + 健身房 ===== */}
        <RoomBox side="right" tone="cool">
          <Badge className="right-2 top-2 bg-slate-700">我的工位</Badge>
          {/* 工位区 */}
          <IsoDesk className="absolute left-[6%] top-[28%] w-[88%]" />
          <button
            onClick={() => openHotspot(config.hotspots[1])}
            className="group absolute left-[18%] top-[12%] w-[30%]"
            title="我的台式机"
          >
            <IsoMonitor time="14:20" />
            {!found("pc-right") && <HotspotRing />}
            {found("pc-right") && (
              <span className="absolute -right-1 -top-1 rounded-full bg-[oklch(0.58_0.08_145)] px-1.5 text-[10px] text-white">✓</span>
            )}
          </button>
          {/* Labubu 一排 */}
          <div className="absolute right-[6%] top-[18%] flex gap-1">
            <IsoLabubu className="w-6" color="#E94B3C" />
            <IsoLabubu className="w-6" color="#5DB0FF" />
            <IsoLabubu className="w-6" color="#F2C744" />
          </div>
          {/* 健身房 */}
          <div className="absolute left-0 right-0 bottom-0 top-[52%] border-t border-dashed border-white/20">
            <span className="absolute left-2 top-1 rounded bg-slate-700 px-1.5 py-0.5 text-[9px] text-white">🏋️ 健身房</span>
            <IsoTreadmill className="absolute left-[6%] top-[28%] w-[44%]" />
            <IsoBench className="absolute right-[6%] top-[34%] w-[40%]" />
            <IsoDumbbell className="absolute left-[18%] bottom-[8%] w-[30%]" />
          </div>
        </RoomBox>

        {/* 氛围文字 */}
        <p className="pointer-events-none absolute left-1/2 bottom-1 max-w-md -translate-x-1/2 text-center text-[10px] italic text-amber-50/60">
          {config.ambient}
        </p>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        已发现线索 {foundIds.length} / {config.hotspots.length} · 点击发光物件
      </p>

      <AnswerInput
        prompt={config.puzzlePrompt}
        hint={config.puzzleHint}
        answer={config.answer}
        errorMessages={config.errorMessages}
        onSolved={() => setSolved(true)}
      />

      <Modal open={!!openClue} onClose={() => setOpenClue(null)} title={openClue?.clueTitle}>
        {openClue?.clueText}
      </Modal>
      <Modal open={solved} onClose={onComplete} title="🔓 门开了">
        {config.successText}
      </Modal>

      {solved && (
        <button
          onClick={onComplete}
          className="mx-auto rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-lg transition hover:opacity-90"
        >
          {config.nextCta} →
        </button>
      )}
    </div>
  );
}

function RoomBox({
  side, tone, children,
}: { side: "left" | "right"; tone: "warm" | "cool"; children: React.ReactNode }) {
  const isLeft = side === "left";
  return (
    <div
      className={`absolute top-[6%] h-[82%] w-[37%] overflow-hidden rounded-xl border-2 border-[oklch(0.45_0.06_45)] shadow-2xl ${
        tone === "warm" ? "room-wall-warm" : "room-wall-cool"
      }`}
      style={{
        [isLeft ? "left" : "right"]: "2%",
        transform: isLeft
          ? "perspective(1100px) rotateY(7deg)"
          : "perspective(1100px) rotateY(-7deg)",
        transformOrigin: isLeft ? "right center" : "left center",
      } as React.CSSProperties}
    >
      {/* 房内木地板 */}
      <div className="absolute inset-x-0 bottom-0 h-[52%] wood-floor opacity-90" />
      {children}
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`absolute z-10 rounded px-2 py-0.5 text-[10px] font-semibold text-white shadow ${className}`}>
      {children}
    </span>
  );
}
