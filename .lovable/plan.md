## 问题诊断

- `Room1` 容器用 `fixed inset-0 z-0`，但在 `src/routes/index.tsx` 里它被 `<Fade k="r1">` 包裹，`Fade` 的 div 使用 `transition-all` 并带 `translate-y` —— CSS transform 会让内部 `position: fixed` 子元素相对该 transform 容器定位（而不是 viewport）。`Fade` 自身没显式高度，导致 Room1 整张图被压成 0 高，页面看起来空白。
- 同时上一个改动里数字密码锁的热点坐标 `left: 56%, top: 52%` 偏右，离背景图里的木门稍远。

## 修复方案

### 1. Room1 容器改为正常块级全屏（不再用 fixed）
- 把 `fixed inset-0 z-0 overflow-hidden bg-black` 改为 `relative w-full min-h-[100svh] overflow-hidden bg-black`。
- 底图 `<img>` 继续 `absolute inset-0 h-full w-full object-cover`，让它填满容器。
- 所有热点的 `absolute` + 百分比定位天然就以这个容器为基准，无需调整。
- 这样不依赖 viewport 定位，Fade 的 transform 不再破坏布局；顶部 sticky 进度条也能正常浮在上面。

### 2. 密码锁热点向门靠近
- 当前：`left: 56%, top: 52%, w: 5%, h: 12%`。
- 调整为：`left: 50%, top: 48%, w: 6%, h: 14%`（更贴近背景图中央木门右侧门框/把手位置）。
- 仅改 `Room1.tsx` 里那个 `<button>` 的内联 style，其它热点不动。

### 3. （不动）背景图、日历图、答题流程、Modal、config 均保持不变。

## QA
- 浏览器打开 `/`，点开场 → 章节 1 → 进入房间 1，确认能看到完整房间图。
- 鼠标移到门附近的密码锁区域，能弹出答题 Modal。
- 点笔记本/台式机/日历三个热点能弹出对应线索；日历 Modal 仍展示生成的日历图。
