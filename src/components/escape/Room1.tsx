import { useState } from "react";
import { ROOMS, type Hotspot as HotspotType } from "./config";
import { Modal, AnswerInput } from "./ui";
import room1Bg from "@/assets/room1-bg.jpg";
import room1Calendar from "@/assets/room1-calendar.jpg";

/**
 * 房间 1：沉浸式全屏，热点无视觉提示
 */
export function Room1({ onComplete }: { onComplete: () => void }) {
  const config = ROOMS[0];
  const [openClue, setOpenClue] = useState<HotspotType | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [solved, setSolved] = useState(false);

  // 热点位置（百分比，相对 1536x1024 底图）
  const hotspots = [
    { id: "pc-left",  cfg: config.hotspots[0], left: 8,  top: 50, w: 14, h: 14, label: "笔记本" },
    { id: "calendar", cfg: config.hotspots[2], left: 41, top: 27, w: 9,  h: 22, label: "走廊上的日历" },
    { id: "pc-right", cfg: config.hotspots[1], left: 70, top: 26, w: 14, h: 14, label: "台式机" },
  ] as const;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-black">
      <img
        src={room1Bg}
        alt=""
        className="absolute inset-0 h-full w-full select-none object-cover"
        draggable={false}
      />

      {hotspots.map((h) => (
        <button
          key={h.id}
          onClick={() => setOpenClue(h.cfg)}
          className="absolute cursor-pointer bg-transparent"
          style={{
            left: `${h.left}%`,
            top: `${h.top}%`,
            width: `${h.w}%`,
            height: `${h.h}%`,
          }}
          title={h.label}
          aria-label={h.label}
        />
      ))}

      {/* 密码锁热点 → 打开答题框 */}
      <button
        onClick={() => setShowAnswer(true)}
        className="absolute cursor-pointer bg-transparent"
        style={{ left: "56%", top: "52%", width: "5%", height: "12%" }}
        title="数字密码锁"
        aria-label="数字密码锁"
      />

      <Modal open={!!openClue} onClose={() => setOpenClue(null)} title={openClue?.clueTitle}>
        <div className="space-y-3">
          {openClue?.id === "calendar" && (
            <img
              src={room1Calendar}
              alt="日历上被红色马克笔画了爱心的方格"
              loading="lazy"
              className="mx-auto w-full max-w-xs rounded-xl shadow-lg"
            />
          )}
          <p className="whitespace-pre-line">{openClue?.clueText}</p>
        </div>
      </Modal>

      <Modal open={showAnswer && !solved} onClose={() => setShowAnswer(false)} title="🔒 数字密码锁">
        <AnswerInput
          prompt={config.puzzlePrompt}
          hint={config.puzzleHint}
          answer={config.answer}
          errorMessages={config.errorMessages}
          onSolved={() => {
            setSolved(true);
            setShowAnswer(false);
          }}
        />
      </Modal>

      <Modal open={solved} onClose={onComplete} title="🔓 门开了">
        <div className="space-y-4">
          <p className="whitespace-pre-line">{config.successText}</p>
          <button
            onClick={onComplete}
            className="w-full rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-lg transition hover:opacity-90"
          >
            {config.nextCta} →
          </button>
        </div>
      </Modal>
    </div>
  );
}
