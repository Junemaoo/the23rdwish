## 调整 Room2

文件：`src/components/escape/Room2.tsx`

### 1. 布告板再左移半格（5% 网格的一半 = 2.5%）
- `left: "56.5%"` → `left: "54%"`（top/width/height 不变）

### 2. 消除"分层颜色"出戏感
现在外层是纯色 `bg-[#d4c4a0]`，与底图 `object-contain` 后留出的左右带颜色对不上，形成明显色块。

方案：在外层容器里再放一张同一张 `room2Bg`，铺满 + 放大 + 模糊 + 暗化，作为背景填充；上面再叠原来的 contain 图层。这样两侧"留白"无缝融入展厅氛围，不再是异色色带。

```tsx
<div className="fixed inset-0 z-0 flex h-screen w-screen items-center justify-center overflow-hidden bg-[#2a2118]">
  {/* 背景模糊填充层 */}
  <img
    src={room2Bg}
    aria-hidden
    className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl opacity-60 select-none"
  />
  {/* 内层 contain 图层（原结构不变）*/}
  <div className="relative aspect-[1456/1080] ...">
    ...
  </div>
</div>
```

不改任何热区坐标、排序逻辑、modal。仅这两处视觉调整。
