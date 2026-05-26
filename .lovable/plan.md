## 改动 1 — 布告板弹窗居中

`src/components/escape/ui.tsx` 的 `Modal` 渲染在 `Room2` 内部，受外层 `fixed + overflow-hidden` 容器影响，所以排序面板也偏上。

修复：把 `Modal` 内部内容用 `createPortal` 挂到 `document.body`。

```tsx
// ui.tsx
import { createPortal } from "react-dom";
// ...
if (!open) return null;
return createPortal(
  <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 px-4 py-8 animate-in fade-in"
       onClick={onClose}>
    <div className="relative my-auto w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl"
         onClick={(e) => e.stopPropagation()}>
      ...
    </div>
  </div>,
  document.body,
);
```

这样所有用到 `Modal` 的地方（包括布告板排序面板、归档完成提示）都会自动居中。

## 改动 2 — 排序逻辑改为随机 5 选 5

`src/components/escape/config.ts`：
- `correctOrder` 改为完整 10 件礼物的正确时间序列：`["e2","e6","e1","e4","e10","e9","e7","e3","e8","e5"]`（对应展品编号 2、6、1、4、10、9、7、3、8、5）。
- `sortablePool` 改为全部 10 个 id（候选池）。
- `slotLabels` 改为占位符（如 `["①","②","③","④","⑤"]`），因为每次随机抽不能再固定年份。
- 删除/改写 `puzzlePrompt` 和底部 `← 更早 2020 … 2026 →` 文案为通用的"按时间早 → 晚 排序"。

`src/components/escape/Room2.tsx`：
- 新增 state `pickedFive: string[]`，在每次 `sortOpen` 由 `false → true` 时（用 `useEffect`）从 `sortablePool` 随机洗牌取前 5 个，同时重置 `slots`、`picked`、`errMsg`、`wrong`。
- 把当前用 `sortablePool` 渲染候选区/计算 `pool` 的逻辑改为基于 `pickedFive`。
- `handleConfirm` 的正确性判断改为：对当前 `slots` 中的 id，按它们在 `ROOM_2_DATA.correctOrder`（10 项全序）中的下标升序排出"该 5 件礼物的正确顺序"，再与 `slots` 顺序逐一比较。

```ts
const subsetCorrect = [...pickedFive].sort(
  (a, b) => correctOrder.indexOf(a) - correctOrder.indexOf(b)
);
const ok = slots.every((id, i) => id === subsetCorrect[i]);
```

## 改动 3 — 排序时只显示展品数字

`src/components/escape/Room2.tsx`：
- 候选池按钮：去掉 icon + 中文名称，只渲染 `ex.no`（大号居中数字），保留选中/未选中样式。
- `Slot` 组件：占用槽位时同样只显示数字（去掉 `ex.icon` 与 `ex.name`），空槽位仍显示"空"。
- 标签栏（`slotLabels`）保留为序号 ①②③④⑤ 或直接隐藏。

详情页（展品图卡）保持现状，依旧显示「展品 N + 文案 + 图」，本次不动。

## 范围之外

- 展品坐标、详情卡片样式、其他房间逻辑不变。
- 不引入新依赖。
