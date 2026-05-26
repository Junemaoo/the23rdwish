## 改动 1 — 删除排序面板的"知道了"按钮

`src/components/escape/ui.tsx` 的 `Modal` 给所有调用方都渲染了底部"知道了"按钮，其他场景仍需要它。

- 给 `Modal` 加可选 prop `hideClose?: boolean`。
- 隐藏底部按钮时，在卡片右上角加一个 ✕ 关闭按钮，避免无法主动关闭。

```tsx
{!hideClose && (
  <button onClick={onClose} className="…">知道了</button>
)}
{hideClose && (
  <button onClick={onClose}
    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground">✕</button>
)}
```

`Room2.tsx` 排序面板的 `<Modal …>` 传 `hideClose`。

## 改动 2 — 顺序点击候选项自动放入第一个空槽

`src/components/escape/Room2.tsx`：

- 新增 `placeIntoNextEmpty(exId)`：
  ```ts
  const idx = slots.findIndex((s) => s === null);
  if (idx >= 0) placeIntoSlot(idx, exId);
  ```
- 候选区按钮 `onClick` 由 `setPicked(...)` 改为 `placeIntoNextEmpty(id)`；保留 `draggable` 与 `onDragStart`。
- 移除 `picked` 状态、移除 `Slot` 的 `isTarget` / `onClickEmpty` 相关入参（拖拽和"点击已占用槽位取回"逻辑保持）。
- 顶部提示文案改为：「按顺序点击下方礼物会自动放入第一个空槽，也支持拖拽。点击已占用的卡槽可取回。」

## 范围之外

详情卡片、坐标、随机抽 5、其他房间均不动。
