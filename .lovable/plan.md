## 目标
把房间 2 的展厅底图从当前受 `max-w-6xl` + `aspectRatio 4/3` 限制的卡片，扩展成铺满整个浏览器视口的全屏场景，排序面板浮在底部。

## 改动 `src/components/escape/Room2.tsx`

1. **外层容器换成全屏**
   - 最外层 `div` 改为 `fixed inset-0 w-screen h-screen overflow-hidden`（或 `min-h-screen w-full` 配合 body），去掉 `max-w-6xl px-4 py-6`
   - 顶部 header（章节标题）改为绝对定位浮层，放在左上角，半透明背景，避免占据布局空间

2. **展厅图占满视口**
   - 去掉 `aspectRatio: "4/3"` 与 `rounded-3xl border` 卡片样式
   - 展厅容器改成 `absolute inset-0`，`<img>` 继续 `object-cover h-full w-full`，让图自动裁切适配任意比例
   - 10 个热区与后门热区坐标已是百分比，跟随容器自动缩放，无需改

3. **排序面板浮在底部**
   - 把现有 `<section>` 排序区改成 `absolute bottom-0 left-0 right-0`，加 `backdrop-blur` 半透明背景
   - 可折叠/最大宽度 `max-w-4xl mx-auto`，避免在超宽屏上拉伸过长
   - 错误提示、确认/重置按钮位置不变

4. **Modal 与"进入下一关"按钮**
   - Modal 不动（本身是覆盖层）
   - "进入下一关"按钮改为绝对定位，放在屏幕正中或后门附近

5. **保留**
   - 所有交互逻辑、调试 D 键、热区数据、排序校验完全不动

## 需要你确认
- 顶部章节标题（"房间2/3《礼物档案室》"）是要保留为左上浮层，还是直接隐藏只在 Modal/进入下一关时显示？
- 排序面板浮在底部的方式 OK 吗？还是希望它默认收起、点击图标才展开（更沉浸）？
