import { useState } from "react";
import { ROOMS, type RoomConfig } from "./config";
import { Modal, Hotspot, AnswerInput } from "./ui";

export function Room({
  config,
  onComplete,
}: {
  config: RoomConfig;
  onComplete: () => void;
}) {
  const [foundIds, setFoundIds] = useState<string[]>([]);
  const [openClue, setOpenClue] = useState<RoomConfig["hotspots"][number] | null>(
    null,
  );
  const [solved, setSolved] = useState(false);

  function openHotspot(h: RoomConfig["hotspots"][number]) {
    setOpenClue(h);
    if (!foundIds.includes(h.id)) setFoundIds([...foundIds, h.id]);
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6">
      <header className="text-center">
        <p className="text-xs tracking-[0.3em] text-muted-foreground">
          房间 {config.index} / {ROOMS.length}
        </p>
        <h2 className="mt-1 font-serif text-3xl text-foreground sm:text-4xl">
          《{config.name}》
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{config.subtitle}</p>
      </header>

      {/* 房间场景 */}
      <div
        className="relative w-full overflow-hidden rounded-3xl border border-border shadow-2xl"
        style={{
          aspectRatio: "16 / 9",
          background:
            "radial-gradient(ellipse at 50% 30%, oklch(0.85 0.08 70) 0%, oklch(0.62 0.09 55) 55%, oklch(0.38 0.06 45) 100%)",
        }}
      >
        {/* 木地板 */}
        <div
          className="absolute inset-x-0 bottom-0 h-1/3"
          style={{
            background:
              "repeating-linear-gradient(90deg, oklch(0.38 0.07 50) 0 60px, oklch(0.32 0.06 45) 60px 62px)",
            boxShadow: "inset 0 20px 40px rgba(0,0,0,.35)",
          }}
        />
        {/* 暖光晕 */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-80 -translate-x-1/2 rounded-full bg-amber-200/40 blur-3xl" />

        {/* 氛围文字 */}
        <p className="absolute left-4 top-3 max-w-xs text-xs italic text-amber-50/80">
          {config.ambient}
        </p>

        {/* 热点 */}
        {config.hotspots.map((h) => (
          <Hotspot
            key={h.id}
            x={h.x}
            y={h.y}
            icon={h.icon}
            label={h.label}
            found={foundIds.includes(h.id)}
            onClick={() => openHotspot(h)}
          />
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        已发现线索 {foundIds.length} / {config.hotspots.length} · 点击发光物件查看
      </p>

      <AnswerInput
        prompt={config.puzzlePrompt}
        hint={config.puzzleHint}
        answer={config.answer}
        onSolved={() => setSolved(true)}
      />

      <Modal
        open={!!openClue}
        onClose={() => setOpenClue(null)}
        title={openClue?.clueTitle}
      >
        {openClue?.clueText}
      </Modal>

      <Modal open={solved} onClose={onComplete} title="🔓 这道门开了">
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
