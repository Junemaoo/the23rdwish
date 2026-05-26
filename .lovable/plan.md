## 问题

展品详情卡片虽然写了 `fixed inset-0 flex items-center justify-center`，但看起来贴在房间顶部、底部被裁。原因是它渲染在 Room2 的根 `<div className="fixed inset-0 z-0 ...">` 内部——该父层 `overflow-hidden` 且自身是 fixed/flex 容器，在某些浏览器/缩放下 fixed 子元素的可视区域会被父层的 contain 行为影响。

## 修复（src/components/escape/Room2.tsx）

用 React `createPortal` 把展品详情遮罩挂到 `document.body`，彻底脱离房间容器：

1. `import { createPortal } from "react-dom";`
2. 把当前 `{openExhibit && (<div className="fixed inset-0 ...">…</div>)}` 改为
   ```tsx
   {openExhibit && createPortal(
     <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 px-4 py-8 animate-in fade-in"
          onClick={() => setOpenExhibit(null)}>
       <div className="relative my-auto w-[90vw] max-w-lg rounded-3xl bg-[#fbe9e0] p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}>
         …标题 / 描述 / 图片…
       </div>
     </div>,
     document.body,
   )}
   ```
   关键改动：`z-[100]`、`overflow-y-auto` + `py-8`、`my-auto` —— 卡片永远在视口正中；过高时整体可滚动。

其余坐标、文案、排序逻辑不变。
