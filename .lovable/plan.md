# 开门动画 & 进入下一关按钮

## 目标
密码输入正确后：
1. 不再弹出"🔓 门开了"的 Modal（删除）
2. 在场景中门的位置上叠加一扇可"向外推开"的门，播放铰链旋转动画
3. 动画结束后，在门洞内出现一颗"进入下一关 →"按钮

## 实现

### 1. `src/components/escape/Room1.tsx`
- 删除 `<Modal open={solved} ...>` 整段（lines 275-285）。
- 在 hotspots/密码锁之后，新增一段「门动画层」，仅当 `solved === true` 时渲染：
  - 一个绝对定位的容器，对齐到木门位置：`left:60% top:25% width:14% height:55%`。
  - 容器内部：
    - 底层"门洞"：深色渐变 + 中心暖色光晕（`bg-gradient-radial from-amber-200/90 via-amber-500/40 to-black/80`），代表门后透出的光。
    - 上层"门板"：使用一张木门贴图（或纯 CSS 木纹渐变 + 高光 + 门把手小圆点）。
      - `transform-origin: left center`（沿左侧铰链向外推）
      - 初始 `rotateY(0deg)`，加上 `transition: transform 1.2s cubic-bezier(.22,.61,.36,1)`；solved 后用 `useEffect` 在下一帧设置 `rotateY(-75deg)` 触发动画。
      - 配合轻微 `perspective: 1200px`（加在父容器）让旋转有立体感。
    - 一段开门音效感的光晕脉冲（可选：`animate-pulse` 在光晕层）。
  - 进入按钮：`solved && doorOpened` 时才渲染（用 `setTimeout(1200)` 或 `onTransitionEnd` 切 `doorOpened=true`），定位在门洞中央：
    ```
    absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
    rounded-full bg-primary px-6 py-2 text-sm text-primary-foreground
    shadow-[0_0_30px_rgba(255,200,120,.7)] animate-in fade-in zoom-in
    ```
    文案使用 `config.nextCta`（"进入下一关"），点击调用 `onComplete`。
- 新增 state：`const [doorOpened, setDoorOpened] = useState(false)`，并在 `solved` 变 true 时启动定时器；卸载时清除。

### 2. 视觉细节
- 门板用 CSS 实现，避免新增素材：
  - 背景：`linear-gradient(180deg,#6b4423,#4a2d18)` + 木纹叠层（重复线性渐变）
  - 边框：`border border-amber-950/60 ring-1 ring-black/40`
  - 门把手：右侧居中一个 `w-1.5 h-1.5 rounded-full bg-yellow-300 shadow`
- 容器加 `pointer-events-none`，让按钮独立处理 `pointer-events-auto`，避免门板挡住按钮点击。

### 3. 不动的部分
- `config.successText`、`config.nextCta`、`onComplete` 流程保持。
- 密码输入、关闭逻辑不变。

## 备注
门的定位 `left:60% top:25% w:14% h:55%` 是按当前背景图的估算值，实装后如果发现偏移可再微调（这是纯 CSS 数值，不需重新生成图）。
