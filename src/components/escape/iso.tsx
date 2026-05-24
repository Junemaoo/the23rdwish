/**
 * 卡通 2.5D / isometric dollhouse 家具库（纯 SVG）
 * 统一风格：圆角、柔和阴影、暖色木质 + 米黄 + 金色
 * 使用：<IsoFridge className="absolute left-[6%] top-[40%] w-[60px]" />
 */
import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement>;

// —— 色票 ——
const C = {
  wood: "#B9825A",
  woodDark: "#8C5E3C",
  woodLight: "#D9A878",
  warm: "#FFDFA3",
  cream: "#FFF2D6",
  pink: "#FFDDE8",
  text: "#3E2F2A",
  gold: "#F5C45E",
  white: "#FFF8EC",
  shadow: "#3E2F2A",
};

// 阴影滤镜，全部组件复用
function Defs({ id }: { id: string }) {
  return (
    <defs>
      <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor={C.shadow} floodOpacity="0.28" />
      </filter>
    </defs>
  );
}

const wrap = (cls?: string) =>
  `iso-shadow ${cls ?? ""}`.trim();

// ============ 房间 1：英国公寓 ============
export function IsoFridge({ className, ...p }: Props) {
  return (
    <svg viewBox="0 0 100 120" className={wrap(className)} {...p}>
      <Defs id="frg" />
      <g filter="url(#frg)">
        {/* 侧面 */}
        <polygon points="20,30 20,115 5,108 5,22" fill={C.woodDark} />
        {/* 顶 */}
        <polygon points="5,22 20,30 80,30 65,22" fill="#E8EEF2" />
        {/* 正面 */}
        <rect x="20" y="30" width="60" height="85" rx="6" fill="#F5F7F9" />
        <line x1="20" y1="62" x2="80" y2="62" stroke="#C9D1D6" strokeWidth="1.5" />
        <rect x="70" y="40" width="3" height="12" rx="1.5" fill={C.wood} />
        <rect x="70" y="72" width="3" height="20" rx="1.5" fill={C.wood} />
        {/* 磁贴 */}
        <circle cx="35" cy="48" r="3" fill={C.pink} />
        <circle cx="48" cy="52" r="2.5" fill={C.gold} />
      </g>
    </svg>
  );
}

export function IsoStove({ className, ...p }: Props) {
  return (
    <svg viewBox="0 0 110 80" className={wrap(className)} {...p}>
      <Defs id="stv" />
      <g filter="url(#stv)">
        <polygon points="20,30 20,75 5,68 5,22" fill={C.woodDark} />
        <polygon points="5,22 20,30 95,30 80,22" fill={C.warm} />
        <rect x="20" y="30" width="75" height="45" rx="4" fill="#E8E2D6" />
        <circle cx="38" cy="48" r="6" fill="#444" />
        <circle cx="38" cy="48" r="3" fill="#FF6B3D" />
        <circle cx="62" cy="48" r="6" fill="#444" />
        <rect x="80" y="42" width="10" height="3" fill={C.gold} />
        <rect x="80" y="50" width="10" height="3" fill={C.gold} />
        <rect x="22" y="62" width="55" height="10" rx="2" fill="#D6CFC0" />
      </g>
    </svg>
  );
}

export function IsoSink({ className, ...p }: Props) {
  return (
    <svg viewBox="0 0 90 70" className={wrap(className)} {...p}>
      <Defs id="snk" />
      <g filter="url(#snk)">
        <polygon points="15,25 15,65 3,58 3,18" fill={C.woodDark} />
        <polygon points="3,18 15,25 78,25 66,18" fill="#B6CFD8" />
        <rect x="15" y="25" width="63" height="40" rx="4" fill="#E5ECEF" />
        <rect x="22" y="32" width="48" height="22" rx="3" fill="#7FA3B0" />
        <rect x="44" y="20" width="3" height="14" fill="#9BAEB6" />
        <circle cx="45.5" cy="20" r="4" fill="#9BAEB6" />
      </g>
    </svg>
  );
}

export function IsoVeggies({ className, ...p }: Props) {
  return (
    <svg viewBox="0 0 80 36" className={wrap(className)} {...p}>
      <ellipse cx="14" cy="28" rx="10" ry="6" fill="#F47A4A" />
      <path d="M14 22 l-2 -6 l4 0 z" fill="#5FA85E" />
      <circle cx="34" cy="24" r="9" fill="#E94B3C" />
      <path d="M34 16 l-3 -5 h6 z" fill="#5FA85E" />
      <ellipse cx="56" cy="26" rx="9" ry="7" fill="#F2C744" />
      <ellipse cx="70" cy="25" rx="6" ry="9" fill="#6FBF5A" />
    </svg>
  );
}

export function IsoWardrobe({ className, ...p }: Props) {
  return (
    <svg viewBox="0 0 70 130" className={wrap(className)} {...p}>
      <Defs id="wdr" />
      <g filter="url(#wdr)">
        <polygon points="18,18 18,128 5,118 5,8" fill={C.woodDark} />
        <polygon points="5,8 18,18 65,18 52,8" fill={C.woodLight} />
        <rect x="18" y="18" width="47" height="110" rx="3" fill={C.wood} />
        <line x1="41.5" y1="18" x2="41.5" y2="128" stroke={C.woodDark} strokeWidth="1.5" />
        <circle cx="38" cy="72" r="1.6" fill={C.gold} />
        <circle cx="45" cy="72" r="1.6" fill={C.gold} />
      </g>
    </svg>
  );
}

export function IsoBed({ className, ...p }: Props) {
  return (
    <svg viewBox="0 0 160 90" className={wrap(className)} {...p}>
      <Defs id="bed" />
      <g filter="url(#bed)">
        {/* 床架 */}
        <polygon points="20,55 20,82 8,75 8,48" fill={C.woodDark} />
        <polygon points="8,48 20,55 145,55 133,48" fill={C.woodLight} />
        <rect x="20" y="55" width="125" height="27" rx="3" fill={C.wood} />
        {/* 蓝床单 */}
        <rect x="22" y="44" width="120" height="14" rx="3" fill="#6CB1E5" />
        {/* 鹅黄被子 */}
        <rect x="42" y="36" width="100" height="20" rx="4" fill="#F7D86B" />
        {/* 红方格枕 */}
        <g transform="translate(28,32)">
          <rect width="34" height="20" rx="4" fill="#E94B3C" />
          <path d="M0 6 H34 M0 14 H34 M11 0 V20 M22 0 V20" stroke="#FFF8EC" strokeWidth="1.2" opacity="0.7" />
        </g>
        {/* 床头 */}
        <rect x="6" y="20" width="14" height="40" rx="3" fill={C.woodDark} />
      </g>
    </svg>
  );
}

export function IsoDesk({ className, children, ...p }: Props & { children?: React.ReactNode }) {
  return (
    <svg viewBox="0 0 180 90" className={wrap(className)} {...p}>
      <Defs id="dsk" />
      <g filter="url(#dsk)">
        <polygon points="22,30 22,80 8,72 8,22" fill={C.woodDark} />
        <polygon points="8,22 22,30 168,30 154,22" fill={C.woodLight} />
        <rect x="22" y="30" width="146" height="6" fill={C.wood} />
        {/* 桌腿 */}
        <rect x="22" y="36" width="4" height="44" fill={C.woodDark} />
        <rect x="160" y="36" width="4" height="44" fill={C.woodDark} />
      </g>
      {children}
    </svg>
  );
}

export function IsoLaptop({ className, time, ...p }: Props & { time?: string }) {
  return (
    <svg viewBox="0 0 80 60" className={wrap(className)} {...p}>
      <Defs id="lap" />
      <g filter="url(#lap)">
        {/* 屏 */}
        <rect x="14" y="6" width="52" height="34" rx="3" fill="#2A2A33" />
        <rect x="17" y="9" width="46" height="28" rx="1.5" fill="#5DB0FF" />
        {time && (
          <text x="40" y="27" textAnchor="middle" fill="#FFF" fontSize="9" fontWeight="700" fontFamily="ui-monospace,monospace">
            {time}
          </text>
        )}
        {/* 底座 */}
        <polygon points="8,44 72,44 76,52 4,52" fill="#C8CCD3" />
        <rect x="34" y="46" width="12" height="2" rx="1" fill="#888" />
      </g>
    </svg>
  );
}

export function IsoLamp({ className, ...p }: Props) {
  return (
    <svg viewBox="0 0 50 70" className={wrap(className)} {...p}>
      <Defs id="lmp" />
      <g filter="url(#lmp)">
        <ellipse cx="25" cy="62" rx="14" ry="4" fill={C.woodDark} />
        <rect x="23" y="28" width="4" height="34" fill={C.wood} />
        <path d="M10 8 L40 8 L34 28 L16 28 Z" fill={C.gold} />
        <ellipse cx="25" cy="30" rx="9" ry="2" fill={C.warm} opacity="0.9" />
      </g>
      <circle cx="25" cy="36" r="20" fill={C.warm} opacity="0.35" />
    </svg>
  );
}

export function IsoWindow({ className, ...p }: Props) {
  return (
    <svg viewBox="0 0 90 70" className={wrap(className)}{...p}>
      <Defs id="win" />
      <g filter="url(#win)">
        <rect x="3" y="3" width="84" height="64" rx="4" fill={C.woodDark} />
        <rect x="7" y="7" width="76" height="56" rx="2" fill="#FFE9B3" />
        <line x1="45" y1="7" x2="45" y2="63" stroke={C.woodDark} strokeWidth="2" />
        <line x1="7" y1="35" x2="83" y2="35" stroke={C.woodDark} strokeWidth="2" />
        {/* 远景：伦敦塔小剪影 */}
        <path d="M14 50 v-8 h3 v-3 h2 v3 h3 v8 z" fill="#A88460" opacity="0.7" />
        <path d="M55 50 v-12 h2 v-2 h2 v2 h2 v12 z" fill="#A88460" opacity="0.7" />
      </g>
    </svg>
  );
}

export function IsoBlackboard({ className, ...p }: Props) {
  return (
    <svg viewBox="0 0 110 60" className={wrap(className)} {...p}>
      <Defs id="blk" />
      <g filter="url(#blk)">
        <rect x="3" y="3" width="104" height="54" rx="4" fill={C.woodDark} />
        <rect x="7" y="7" width="96" height="46" rx="2" fill="#2A4636" />
        {/* 拍立得 */}
        <g transform="translate(14,12) rotate(-6)">
          <rect width="20" height="22" fill="#FFF8EC" />
          <rect x="2" y="2" width="16" height="14" fill="#7FB0E0" />
        </g>
        <g transform="translate(40,14) rotate(4)">
          <rect width="20" height="22" fill="#FFF8EC" />
          <rect x="2" y="2" width="16" height="14" fill="#F2C57C" />
        </g>
        {/* UCL 紫色徽章 */}
        <rect x="72" y="18" width="22" height="12" rx="2" fill="#5B2B82" />
        <text x="83" y="27" textAnchor="middle" fill="#FFF" fontSize="7" fontWeight="800">UCL</text>
      </g>
    </svg>
  );
}

export function IsoCalendar({ className, ...p }: Props) {
  return (
    <svg viewBox="0 0 90 100" className={wrap(className)} {...p}>
      <Defs id="cal" />
      <g filter="url(#cal)">
        <rect x="5" y="5" width="80" height="90" rx="6" fill="#FFF8EC" stroke={C.woodDark} strokeWidth="2" />
        <rect x="5" y="5" width="80" height="18" rx="6" fill={C.wood} />
        <text x="45" y="18" textAnchor="middle" fill="#FFF" fontSize="11" fontWeight="700">SEPTEMBER</text>
        {/* 网格 */}
        {Array.from({ length: 5 }).map((_, r) =>
          Array.from({ length: 7 }).map((_, c) => (
            <rect key={`${r}-${c}`} x={9 + c * 11} y={28 + r * 13} width="10" height="12" fill="none" stroke="#E2D6BC" />
          )),
        )}
        {/* 红色爱心标记 */}
        <path
          d="M52 58 c-3 -4 -9 -3 -9 2 c0 4 5 7 9 10 c4 -3 9 -6 9 -10 c0 -5 -6 -6 -9 -2 z"
          fill="#E94B3C"
        />
      </g>
    </svg>
  );
}

// ============ 房间 1：工位 + 健身房 ============
export function IsoMonitor({ className, time, ...p }: Props & { time?: string }) {
  return (
    <svg viewBox="0 0 100 80" className={wrap(className)} {...p}>
      <Defs id="mon" />
      <g filter="url(#mon)">
        <rect x="10" y="6" width="80" height="50" rx="3" fill="#1F2330" />
        <rect x="14" y="10" width="72" height="42" rx="1.5" fill="#3CC4A8" />
        {time && (
          <text x="50" y="36" textAnchor="middle" fill="#FFF" fontSize="13" fontWeight="800" fontFamily="ui-monospace,monospace">
            {time}
          </text>
        )}
        <rect x="44" y="56" width="12" height="8" fill="#1F2330" />
        <rect x="32" y="64" width="36" height="4" rx="2" fill="#888" />
      </g>
    </svg>
  );
}

export function IsoLabubu({ className, color = "#E94B3C", ...p }: Props & { color?: string }) {
  return (
    <svg viewBox="0 0 40 50" className={wrap(className)} {...p}>
      <ellipse cx="20" cy="44" rx="10" ry="3" fill={C.shadow} opacity="0.2" />
      <path d="M8 28 Q8 12 20 12 Q32 12 32 28 L32 38 Q32 44 20 44 Q8 44 8 38 Z" fill={color} />
      {/* 耳朵 */}
      <path d="M10 16 L6 4 L14 12 Z" fill={color} />
      <path d="M30 16 L34 4 L26 12 Z" fill={color} />
      <circle cx="16" cy="26" r="2" fill="#1F2330" />
      <circle cx="24" cy="26" r="2" fill="#1F2330" />
      {/* 牙齿 */}
      <rect x="17" y="30" width="2" height="3" fill="#FFF" />
      <rect x="21" y="30" width="2" height="3" fill="#FFF" />
    </svg>
  );
}

export function IsoTreadmill({ className, ...p }: Props) {
  return (
    <svg viewBox="0 0 140 90" className={wrap(className)} {...p}>
      <Defs id="trd" />
      <g filter="url(#trd)">
        <polygon points="22,52 22,82 6,76 6,46" fill={C.woodDark} />
        <polygon points="6,46 22,52 122,52 106,46" fill="#3A3F4A" />
        <rect x="22" y="52" width="100" height="30" rx="4" fill="#2A2E38" />
        {/* 控制台 */}
        <rect x="100" y="14" width="22" height="38" fill="#444" />
        <rect x="103" y="18" width="16" height="10" fill="#5DB0FF" />
        <rect x="103" y="32" width="16" height="3" fill="#888" />
        <rect x="103" y="38" width="16" height="3" fill="#888" />
      </g>
    </svg>
  );
}

export function IsoDumbbell({ className, ...p }: Props) {
  return (
    <svg viewBox="0 0 80 30" className={wrap(className)} {...p}>
      <Defs id="dmb" />
      <g filter="url(#dmb)">
        <rect x="22" y="13" width="36" height="4" fill="#444" />
        <rect x="6" y="6" width="14" height="18" rx="2" fill="#2A2E38" />
        <rect x="60" y="6" width="14" height="18" rx="2" fill="#2A2E38" />
      </g>
    </svg>
  );
}

export function IsoBench({ className, ...p }: Props) {
  return (
    <svg viewBox="0 0 120 60" className={wrap(className)} {...p}>
      <Defs id="bch" />
      <g filter="url(#bch)">
        <rect x="14" y="20" width="92" height="14" rx="4" fill="#444" />
        <rect x="14" y="20" width="92" height="6" rx="3" fill="#E94B3C" />
        <rect x="20" y="34" width="6" height="20" fill="#222" />
        <rect x="94" y="34" width="6" height="20" fill="#222" />
      </g>
    </svg>
  );
}

// ============ 房间 1：通用 / 门 ============
export function IsoDoor({ className, locked = true, ...p }: Props & { locked?: boolean }) {
  return (
    <svg viewBox="0 0 80 140" className={wrap(className)} {...p}>
      <Defs id="dor" />
      <g filter="url(#dor)">
        {/* 门框 */}
        <rect x="3" y="3" width="74" height="134" rx="6" fill={C.woodDark} />
        {/* 门板 */}
        <rect x="9" y="9" width="62" height="122" rx="4" fill={C.wood} />
        <rect x="14" y="14" width="52" height="50" rx="3" fill="none" stroke={C.woodDark} strokeWidth="1.5" />
        <rect x="14" y="70" width="52" height="50" rx="3" fill="none" stroke={C.woodDark} strokeWidth="1.5" />
        {/* 门把 */}
        <circle cx="58" cy="80" r="3.5" fill={C.gold} />
        {/* 锁 */}
        {locked ? (
          <g transform="translate(28,84)">
            <rect width="24" height="18" rx="3" fill={C.gold} />
            <text x="12" y="13" textAnchor="middle" fontSize="10" fontWeight="800" fill={C.text}>4桁</text>
          </g>
        ) : (
          <circle cx="40" cy="93" r="6" fill={C.gold} className="twinkle" />
        )}
      </g>
    </svg>
  );
}

// ============ 房间 2：展柜 ============
export function IsoDisplayCase({
  className,
  icon,
  no,
  highlight = false,
  ...p
}: Props & { icon: string; no: number; highlight?: boolean }) {
  return (
    <svg viewBox="0 0 90 110" className={wrap(className)} {...p}>
      <Defs id={`dpc-${no}`} />
      <g filter={`url(#dpc-${no})`}>
        {/* 木底座 */}
        <polygon points="14,82 14,102 4,96 4,76" fill={C.woodDark} />
        <polygon points="4,76 14,82 86,82 76,76" fill={C.wood} />
        <rect x="14" y="82" width="72" height="20" rx="2" fill={C.woodDark} />
        {/* 玻璃罩 */}
        <polygon points="14,82 14,18 76,12 86,18 86,82" fill="#E6F3FA" opacity="0.55" />
        <polygon points="14,18 76,12" fill="none" stroke={highlight ? C.gold : "#A8C7D8"} strokeWidth="2" />
        <polygon
          points="14,82 14,18 76,12 86,18 86,82"
          fill="none"
          stroke={highlight ? C.gold : "#A8C7D8"}
          strokeWidth="1.8"
        />
        {/* 聚光灯 */}
        <ellipse cx="50" cy="22" rx="22" ry="6" fill={C.warm} opacity="0.55" />
        {/* 物品 */}
        <text x="50" y="58" textAnchor="middle" fontSize="32">{icon}</text>
        {/* 编号 */}
        <rect x="32" y="88" width="36" height="10" rx="2" fill={C.cream} />
        <text x="50" y="96" textAnchor="middle" fontSize="8" fill={C.text} fontWeight="700">
          展品 {no}
        </text>
      </g>
    </svg>
  );
}

// ============ 房间 3：桌面物件 ============
export function IsoTable({ className, ...p }: Props) {
  return (
    <svg viewBox="0 0 400 240" className={wrap(className)} preserveAspectRatio="none" {...p}>
      <Defs id="tbl" />
      <g filter="url(#tbl)">
        <polygon points="60,40 340,40 380,200 20,200" fill="#FFFCF5" />
        <polygon points="60,40 340,40 360,52 40,52" fill="#F2EAD8" />
      </g>
    </svg>
  );
}

export function IsoTicket({ className, ...p }: Props) {
  return (
    <svg viewBox="0 0 110 60" className={wrap(className)} {...p}>
      <Defs id="tkt" />
      <g filter="url(#tkt)" transform="rotate(-6 55 30)">
        <rect x="5" y="10" width="100" height="40" rx="4" fill="#FFF8EC" />
        <rect x="5" y="10" width="30" height="40" fill={C.gold} />
        <text x="20" y="32" textAnchor="middle" fontSize="11" fontWeight="800" fill={C.text}>BA</text>
        <text x="20" y="42" textAnchor="middle" fontSize="6" fill={C.text}>FLIGHT</text>
        <text x="48" y="26" fontSize="7" fill={C.text}>LHR ✈ PEK</text>
        <text x="48" y="38" fontSize="6" fill="#888">Economy</text>
        <circle cx="35" cy="10" r="2" fill={C.cream} />
        <circle cx="35" cy="50" r="2" fill={C.cream} />
      </g>
    </svg>
  );
}

export function IsoReceipt({ className, ...p }: Props) {
  return (
    <svg viewBox="0 0 70 100" className={wrap(className)} {...p}>
      <Defs id="rcp" />
      <g filter="url(#rcp)" transform="rotate(4 35 50)">
        <path d="M8 6 H62 V88 L55 94 L48 88 L41 94 L34 88 L27 94 L20 88 L13 94 L8 88 Z" fill="#FFF8EC" />
        <text x="35" y="20" textAnchor="middle" fontSize="8" fontWeight="800" fill={C.text}>POP MART</text>
        <line x1="14" y1="26" x2="56" y2="26" stroke="#CFC4AC" strokeDasharray="2 2" />
        <text x="14" y="38" fontSize="6" fill={C.text}>星星人 ¥??</text>
        <text x="14" y="50" fontSize="6" fill={C.text}>Nyota   ¥??</text>
        <text x="14" y="62" fontSize="6" fill={C.text}>Labubu  ¥??</text>
      </g>
    </svg>
  );
}

export function IsoBowls({ className, ...p }: Props) {
  return (
    <svg viewBox="0 0 130 70" className={wrap(className)} {...p}>
      <Defs id="bwl" />
      <g filter="url(#bwl)">
        <ellipse cx="35" cy="48" rx="28" ry="10" fill="#FFF8EC" />
        <ellipse cx="35" cy="45" rx="24" ry="8" fill="#E94B3C" />
        <text x="35" y="49" textAnchor="middle" fontSize="14" fontWeight="800" fill="#FFF8EC">✕</text>
        <ellipse cx="95" cy="50" rx="28" ry="10" fill="#FFF8EC" />
        <ellipse cx="95" cy="47" rx="24" ry="8" fill="#F2EAD8" />
        <text x="95" y="51" textAnchor="middle" fontSize="14" fontWeight="800" fill="#B94A48">✕</text>
      </g>
    </svg>
  );
}

export function IsoCoffeeCups({ className, ...p }: Props) {
  return (
    <svg viewBox="0 0 110 80" className={wrap(className)} {...p}>
      <Defs id="cof" />
      <g filter="url(#cof)">
        {[10, 55].map((x, i) => (
          <g key={i} transform={`translate(${x},10)`}>
            <path d="M5 10 H40 L36 60 H9 Z" fill="#FFF8EC" />
            <rect x="5" y="6" width="35" height="6" rx="2" fill="#6B4836" />
            <rect x="14" y="18" width="22" height="3" fill="#6B4836" />
            <text x="22" y="44" textAnchor="middle" fontSize="7" fontWeight="700" fill="#6B4836">manner</text>
            <circle cx="14" cy="28" r="1.6" fill="#9C75B7" opacity="0.7" />
            <circle cx="28" cy="34" r="1.4" fill="#9C75B7" opacity="0.7" />
          </g>
        ))}
      </g>
    </svg>
  );
}

export function IsoMap({ className, ...p }: Props) {
  return (
    <svg viewBox="0 0 140 100" className={wrap(className)} {...p}>
      <Defs id="map" />
      <g filter="url(#map)" transform="rotate(-3 70 50)">
        <rect x="6" y="6" width="128" height="88" rx="4" fill="#FFF8EC" />
        <rect x="6" y="6" width="128" height="88" rx="4" fill="none" stroke={C.woodDark} strokeWidth="1.5" />
        {/* 环线 */}
        <ellipse cx="70" cy="50" rx="50" ry="32" fill="none" stroke="#B6CFD8" strokeWidth="1.2" />
        <ellipse cx="70" cy="50" rx="36" ry="22" fill="none" stroke="#B6CFD8" strokeWidth="1.2" />
        <ellipse cx="70" cy="50" rx="22" ry="14" fill="none" stroke="#B6CFD8" strokeWidth="1.2" />
        {/* 三个点 + 路径 */}
        <path d="M28 78 L72 38 L96 18" fill="none" stroke="#E94B3C" strokeWidth="2" strokeDasharray="4 3" />
        <circle cx="28" cy="78" r="4" fill="#E94B3C" />
        <circle cx="72" cy="38" r="4" fill="#E94B3C" />
        <circle cx="96" cy="18" r="4" fill="#E94B3C" />
        <text x="20" y="92" fontSize="6" fill={C.text}>房山</text>
        <text x="76" y="50" fontSize="6" fill={C.text}>朝阳</text>
        <text x="100" y="14" fontSize="6" fill={C.text}>怀柔</text>
      </g>
    </svg>
  );
}

export function IsoBottle({ className, lit, filled, ...p }: Props & { lit?: boolean; filled?: boolean }) {
  return (
    <svg viewBox="0 0 90 140" className={wrap(className)} {...p}>
      <Defs id="btl" />
      <g filter="url(#btl)">
        {/* 软木塞 */}
        <rect x="34" y="6" width="22" height="14" rx="3" fill="#A36C3F" />
        {/* 瓶颈 */}
        <rect x="36" y="18" width="18" height="14" fill={lit ? "#FFE5A8" : "#D8D4C4"} />
        {/* 瓶身 */}
        <path
          d="M22 40 Q22 30 36 30 L54 30 Q68 30 68 40 L68 120 Q68 132 45 132 Q22 132 22 120 Z"
          fill={lit ? "#FFE9B3" : "#D8D4C4"}
          opacity="0.85"
        />
        <path
          d="M22 40 Q22 30 36 30 L54 30 Q68 30 68 40 L68 120 Q68 132 45 132 Q22 132 22 120 Z"
          fill="none"
          stroke={lit ? C.gold : "#9C9A8A"}
          strokeWidth="2"
        />
        {/* 高光 */}
        <path d="M30 50 Q28 80 32 110" fill="none" stroke="#FFF8EC" strokeWidth="3" opacity="0.6" />
      </g>
      {filled && (
        <>
          <circle cx="14" cy="14" r="3" fill={C.gold} className="twinkle" />
          <circle cx="78" cy="22" r="2.5" fill={C.gold} className="twinkle" />
          <circle cx="82" cy="60" r="2" fill={C.gold} className="twinkle" />
          <circle cx="8" cy="50" r="2" fill={C.gold} className="twinkle" />
        </>
      )}
    </svg>
  );
}

// ============ 最终页：礼物盒 / 蛋糕 ============
export function IsoGiftBox({ className, open, ...p }: Props & { open?: boolean }) {
  return (
    <svg viewBox="0 0 140 130" className={wrap(className)} {...p}>
      <Defs id="gft" />
      <g filter="url(#gft)">
        {/* 盒身 */}
        <polygon points="24,52 24,118 12,110 12,44" fill="#C2452F" />
        <polygon points="12,44 24,52 116,52 128,44 128,110 116,118 24,118" fill="#E94B3C" />
        <rect x="24" y="52" width="92" height="66" fill="#E94B3C" />
        {/* 缎带竖 */}
        <rect x="62" y="52" width="16" height="66" fill={C.gold} />
        {/* 盖子 */}
        <g transform={open ? "translate(0,-22) rotate(-12 70 30)" : ""} style={{ transition: "transform .5s" }}>
          <polygon points="6,38 70,28 134,38 122,46 70,52 18,46" fill="#C2452F" />
          <rect x="18" y="38" width="104" height="14" fill="#E94B3C" />
          <rect x="62" y="38" width="16" height="14" fill={C.gold} />
          {/* 蝴蝶结 */}
          <ellipse cx="56" cy="32" rx="10" ry="6" fill={C.gold} />
          <ellipse cx="84" cy="32" rx="10" ry="6" fill={C.gold} />
          <circle cx="70" cy="32" r="4" fill="#D8A640" />
        </g>
      </g>
    </svg>
  );
}

export function IsoCake({ className, lit, ...p }: Props & { lit?: boolean }) {
  return (
    <svg viewBox="0 0 200 160" className={wrap(className)} {...p}>
      <Defs id="cak" />
      <g filter="url(#cak)">
        {/* 盘 */}
        <ellipse cx="100" cy="138" rx="86" ry="10" fill="#E6D9BD" />
        {/* 第二层 */}
        <ellipse cx="100" cy="118" rx="78" ry="10" fill="#FFF8EC" />
        <rect x="22" y="92" width="156" height="28" fill="#FFE5EE" />
        <ellipse cx="100" cy="92" rx="78" ry="10" fill="#FFDDE8" />
        {/* 装饰小点 */}
        {[40, 70, 100, 130, 160].map((x, i) => (
          <circle key={i} cx={x} cy="106" r="3" fill="#E94B3C" />
        ))}
        {/* 第一层 */}
        <ellipse cx="100" cy="78" rx="62" ry="8" fill="#FFF8EC" />
        <rect x="38" y="58" width="124" height="22" fill="#FFE9B3" />
        <ellipse cx="100" cy="58" rx="62" ry="8" fill={C.warm} />
        {/* 蜡烛：23 简化为 7 根代表 */}
        {[34, 50, 66, 82, 98, 114, 130, 146, 162].map((x, i) => (
          <g key={i} transform={`translate(${x - 100},0)`}>
            <rect x="98" y="42" width="4" height="14" fill="#FFDDE8" />
            {lit && (
              <g className="candle-flame">
                <ellipse cx="100" cy="38" rx="2" ry="5" fill="#FFB347" />
                <ellipse cx="100" cy="36" rx="1.2" ry="3" fill="#FFE5A8" />
              </g>
            )}
            {!lit && <path d="M99 38 q1 -2 2 0" stroke="#888" strokeWidth="0.8" fill="none" />}
          </g>
        ))}
        {/* 23 牌 */}
        <rect x="80" y="20" width="40" height="20" rx="3" fill={C.gold} />
        <text x="100" y="35" textAnchor="middle" fontSize="14" fontWeight="800" fill={C.text}>23</text>
      </g>
    </svg>
  );
}

// ============ 通用：发光小热点环 ============
export function HotspotRing({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute inset-0 rounded-full border-2 border-[oklch(0.80_0.135_80)] ${className ?? ""}`}
      style={{ boxShadow: "0 0 14px 3px oklch(0.92 0.075 85 / 0.7)" }}
    />
  );
}
