import { useState } from "react";
import { ROOMS, type Hotspot as HotspotType } from "./config";
import { Modal, Hotspot, AnswerInput } from "./ui";

/**
 * 房间 1：我们，在世界的两端
 * 2.5D 微缩房间：左侧伦敦公寓 / 中间长廊+密码门+日历 / 右侧工位+健身房
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

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6">
      <header className="text-center">
        <p className="text-xs tracking-[0.3em] text-muted-foreground">
          房间 {config.index} / {ROOMS.length}
        </p>
        <h2 className="mt-1 font-serif text-3xl text-foreground sm:text-4xl">
          《{config.name}》
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{config.subtitle}</p>
      </header>

      {/* 2.5D 微缩房间 */}
      <div
        className="relative w-full overflow-hidden rounded-3xl border border-border shadow-2xl"
        style={{
          aspectRatio: "16 / 9",
          background:
            "linear-gradient(180deg, oklch(0.32 0.04 250) 0%, oklch(0.22 0.03 250) 60%, oklch(0.18 0.02 250) 100%)",
        }}
      >
        {/* 木地板（透视感） */}
        <div
          className="absolute inset-x-0 bottom-0 h-[40%]"
          style={{
            background:
              "repeating-linear-gradient(92deg, oklch(0.42 0.06 50) 0 56px, oklch(0.35 0.05 45) 56px 58px)",
            transform: "perspective(800px) rotateX(28deg)",
            transformOrigin: "bottom",
            boxShadow: "inset 0 30px 60px rgba(0,0,0,.5)",
          }}
        />

        {/* 左侧房间：英国学生公寓 */}
        <RoomBox side="left">
          <div className="absolute left-2 top-2 rounded bg-purple-700/80 px-2 py-0.5 text-[10px] font-semibold text-white">
            UCL · 伦敦
          </div>
          {/* 厨房：冰箱/微波炉/灶台/水池 */}
          <div className="absolute left-3 top-7 flex gap-1">
            <span title="小冰箱" className="text-2xl">🧊</span>
            <span title="微波炉" className="text-2xl">📺</span>
            <span title="灶台" className="text-2xl">🍳</span>
            <span title="水池" className="text-2xl">🚰</span>
          </div>
          {/* 多彩蔬菜 */}
          <div className="absolute left-3 top-[58px] text-lg">🥕🥦🍅🌽</div>
          {/* 衣柜 */}
          <div className="absolute right-3 top-7 text-3xl" title="衣柜">🚪</div>
          {/* 床：蓝床单+鹅黄被+亮红方格枕 */}
          <div className="absolute right-2 top-[80px] flex flex-col items-center">
            <div className="h-4 w-16 rounded-sm bg-red-500" />
            <div className="h-5 w-20 -mt-1 rounded-sm bg-yellow-300" />
            <div className="h-2 w-20 rounded-b-md bg-blue-400" />
          </div>
          {/* 长书桌 + 电脑 + 台灯 */}
          <div className="absolute left-2 bottom-2 right-2 h-[78px] rounded-md bg-amber-900/70 shadow-inner">
            <div className="absolute left-2 top-1 text-xl" title="台灯">💡</div>
            <div className="absolute right-2 top-1 text-lg">📷</div>
            <div className="absolute right-12 top-1 rounded bg-purple-600 px-1 text-[8px] text-white">
              UCL
            </div>
            <div className="absolute left-12 top-2 text-sm">📄📄</div>
            {/* 窗户 */}
            <div className="absolute -top-12 left-2 h-10 w-12 rounded-sm border-2 border-slate-300/70 bg-slate-700/60">
              <div className="h-full w-full bg-[linear-gradient(90deg,transparent_49%,rgba(255,255,255,.4)_49%_51%,transparent_51%),linear-gradient(0deg,transparent_49%,rgba(255,255,255,.4)_49%_51%,transparent_51%)]" />
            </div>
            {/* 黑板+拍立得 */}
            <div className="absolute -top-14 right-2 h-10 w-20 rounded-sm bg-emerald-900 p-0.5">
              <div className="inline-block h-3 w-4 bg-white" />
              <div className="inline-block h-3 w-4 bg-white ml-0.5" />
            </div>
          </div>
        </RoomBox>

        {/* 中间走廊 */}
        <div className="absolute left-1/2 top-0 h-full w-[22%] -translate-x-1/2">
          {/* 长廊地面 */}
          <div className="absolute inset-x-0 bottom-0 top-[35%] bg-gradient-to-b from-slate-700/40 to-slate-900/60" />
          {/* 走廊尽头墙 */}
          <div className="absolute inset-x-0 top-0 h-[35%] bg-slate-800/80" />
          {/* 暖光 */}
          <div className="pointer-events-none absolute left-1/2 top-[30%] h-32 w-32 -translate-x-1/2 rounded-full bg-amber-300/30 blur-3xl" />
          {/* 通往下一关的门 */}
          <div className="absolute left-1/2 top-[40%] h-[40%] w-[60%] -translate-x-1/2 rounded-t-lg border-2 border-amber-700 bg-gradient-to-b from-amber-800 to-amber-950 shadow-2xl">
            <div className="absolute right-2 top-1/2 h-2 w-2 rounded-full bg-yellow-400 shadow-[0_0_8px_2px_rgba(250,204,21,.7)]" />
            <div className="absolute inset-x-2 bottom-2 rounded bg-slate-900/70 px-1 py-0.5 text-center text-[10px] text-amber-200">
              ⌨ 密码锁
            </div>
          </div>
        </div>

        {/* 右侧房间：工位 + 健身房 */}
        <RoomBox side="right">
          <div className="absolute right-2 top-2 rounded bg-slate-700 px-2 py-0.5 text-[10px] font-semibold text-white">
            我的工位
          </div>
          {/* 工位 */}
          <div className="absolute left-2 top-8 right-2 h-[70px] rounded-md bg-slate-800/80 p-1">
            <div className="absolute left-1 top-1 text-[10px] text-white/70">📑</div>
            <div className="absolute right-1 top-1 text-[10px] text-white/70">📑</div>
            <div className="mx-auto mt-1 h-8 w-14 rounded bg-slate-900 text-center text-[8px] leading-8 text-cyan-300">
              ◾◾◾
            </div>
            <div className="mx-auto mt-1 h-2 w-16 rounded bg-white" />
            {/* 小台子上的 Labubu */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-sm">
              🧸🧌👹🐰
            </div>
          </div>
          {/* 健身房 */}
          <div className="absolute left-2 bottom-2 right-2 h-[80px] rounded-md bg-slate-700/60 p-1">
            <div className="text-[10px] text-white/70">🏋️ 健身房</div>
            <div className="mt-1 flex justify-around text-2xl">
              <span title="跑步机">🏃</span>
              <span title="卧推">🛏️</span>
              <span title="哑铃">💪</span>
            </div>
          </div>
        </RoomBox>

        {/* 氛围文字 */}
        <p className="absolute left-1/2 bottom-1 max-w-md -translate-x-1/2 text-center text-[10px] italic text-amber-50/60">
          {config.ambient}
        </p>

        {/* 可点击热点 */}
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
        已发现线索 {foundIds.length} / {config.hotspots.length} ·
        点击发光的物件查看
      </p>

      <AnswerInput
        prompt={config.puzzlePrompt}
        hint={config.puzzleHint}
        answer={config.answer}
        errorMessages={config.errorMessages}
        onSolved={() => setSolved(true)}
      />

      <Modal
        open={!!openClue}
        onClose={() => setOpenClue(null)}
        title={openClue?.clueTitle}
      >
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

/** 左/右两侧的微缩房间盒子（带 2.5D 倾斜） */
function RoomBox({
  side,
  children,
}: {
  side: "left" | "right";
  children: React.ReactNode;
}) {
  const isLeft = side === "left";
  return (
    <div
      className="absolute top-[8%] h-[78%] w-[36%] rounded-lg border border-amber-900/40 shadow-2xl"
      style={{
        [isLeft ? "left" : "right"]: "3%",
        background:
          "linear-gradient(180deg, oklch(0.55 0.06 60) 0%, oklch(0.40 0.05 50) 100%)",
        transform: isLeft
          ? "perspective(900px) rotateY(8deg)"
          : "perspective(900px) rotateY(-8deg)",
        transformOrigin: isLeft ? "right center" : "left center",
      } as React.CSSProperties}
    >
      {/* 房间内部相对容器 */}
      <div className="relative h-full w-full overflow-hidden rounded-lg">
        {children}
      </div>
    </div>
  );
}
