## 问题
看了 zoom crop：瓶子在 scene.png 上实际位置约 (65%, 15%)，而代码里写的是 (74%, 22%) — 整整偏了一截，所以视觉上点瓶子时点中的是瓶子右下方的墙面空白处，看起来"无响应"。

## 改动

### `src/components/escape/Room3.tsx`

1. 校正 `BOTTLE_POS`：`{ x: 65, y: 18, w: 8 }`，按钮 `aspectRatio: "1 / 1.6"`。
2. 给瓶子按钮加一个非常淡的调试 ring（`ring-1 ring-amber-300/40` + `hover:ring-amber-300/70`），方便你直接看到热点位置；位置确认后下一轮再去掉。
3. 把内层 stage 的 `aspect-ratio` 写法保持 `"1449 / 1086"`，不变。

## 范围之外
其他热点、文案、逻辑都不动。
