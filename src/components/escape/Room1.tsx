import { useState } from "react";
import { ROOMS, type Hotspot as HotspotType } from "./config";
import { Modal, AnswerInput } from "./ui";
import { HotspotRing } from "./iso";
import room1Bg from "@/assets/room1-bg.jpg";
import room1Calendar from "@/assets/room1-calendar.jpg";

/**
 * 房间 1：我们，在世界的两端
 * 高保真 2.5D 微缩房间渲染图 + 四个透明热点
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

  // 热点位置（百分比，相对 16:9 底图）
  const hotspots = [
    { id: "pc-left",  cfg: config.hotspots[0], left: 12,   top: 38, w: 12, h: 14, label: "笔记本" },
    { id: "pc-right", cfg: config.hotspots[1], left: 72.5, top: 30, w: 13, h: 16, label: "台式机" },
    { id: "calendar", cfg: config.hotspots[2], left: 50.5, top: 11, w: 9,  h: 14, label: "走廊上的日历" },
  ] as const;

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
        className="relative w-full overflow-hidden rounded-3xl border border-[oklch(0.5_0.05_45)] shadow-2xl bg-[oklch(0.18_0.02_60)]"
        style={{ aspectRatio: "1536 / 1024" }}
      >
        <img
          src={room1Bg}
          alt="2.5D 微缩房间：左侧伦敦学生公寓，中间走廊和密码门，右侧工位与健身房"
          className="absolute inset-0 h-full w-full select-none object-cover"
          draggable={false}
        />

        {hotspots.map((h) => (
          <button
            key={h.id}
            onClick={() => openHotspot(h.cfg)}
            className="group absolute"
            style={{
              left: `${h.left}%`,
              top: `${h.top}%`,
              width: `${h.w}%`,
              height: `${h.h}%`,
            }}
            title={h.label}
            aria-label={h.label}
          >
            {!found(h.id) && <HotspotRing />}
            {found(h.id) && (
              <span className="absolute -right-1 -top-1 rounded-full bg-[oklch(0.58_0.08_145)] px-1.5 text-[10px] font-semibold text-white shadow">
                ✓
              </span>
            )}
          </button>
        ))}

        {/* 密码锁热点：滚动到下方输入框 */}
        <button
          onClick={() => {
            const el = document.getElementById("room1-answer");
            el?.scrollIntoView({ behavior: "smooth", block: "center" });
          }}
          className="group absolute"
          style={{ left: "47%", top: "30%", width: "5%", height: "8%" }}
          title="数字密码锁"
          aria-label="数字密码锁"
        >
          {!solved && <HotspotRing />}
        </button>

        {/* 氛围文字 */}
        <p className="pointer-events-none absolute bottom-2 left-1/2 max-w-md -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 text-center text-[11px] italic text-amber-50/90 backdrop-blur-sm">
          {config.ambient}
        </p>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        已发现线索 {foundIds.length} / {config.hotspots.length} · 点击房间内发光的物件
      </p>

      <div id="room1-answer">
        <AnswerInput
          prompt={config.puzzlePrompt}
          hint={config.puzzleHint}
          answer={config.answer}
          errorMessages={config.errorMessages}
          onSolved={() => setSolved(true)}
        />
      </div>

      <Modal open={!!openClue} onClose={() => setOpenClue(null)} title={openClue?.clueTitle}>
        <div className="space-y-3">
          {openClue?.id === "calendar" && (
            <img
              src={room1Calendar}
              alt="日历上被红色马克笔画了爱心的方格"
              loading="lazy"
              className="mx-auto w-full max-w-sm rounded-xl shadow-lg"
            />
          )}
          <p className="whitespace-pre-line">{openClue?.clueText}</p>
        </div>
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
