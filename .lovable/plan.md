## 目标
把房间 2（礼物档案室）现有的"几何方块+俯视图"换成你上传的等距展厅渲染图作为底图，亮度调到与房间 1（木门密码锁那张）一致，再在图上对齐 10 个展柜热区做点击交互，下方时间排序面板保持不变。

## 步骤

1. **导入素材**
   - 把 `user-uploads://room2_draft.png` 复制到 `src/assets/room2-hall.png`
   - 在 `Room2.tsx` 里 `import room2Bg from "@/assets/room2-hall.png"`

2. **替换房间底图**
   - 删除现有的 `wood-floor`、地毯 div、`IsoDisplayCase` 渲染、`IsoDoor`、聚光圆
   - 把外层容器换成 `aspectRatio: 4/3`（贴近原图比例），`background-image: url(room2Bg)`，`background-size: cover`
   - 加一层与房间 1 一致的暖色调蒙版（参考 Room1 的 `bg-[oklch(...)]/xx` 叠加值），统一亮度

3. **对齐 10 个透明热区**
   - 保留 `exhibits` 数据，按图中 10 个展柜实际位置重写 `wallPositions`（左列 3 个、中列 2 个、右列 3 个、最前 2 个，按图核对）
   - 每个热区改成透明按钮（`bg-transparent` + hover 时淡黄描边/光晕），尺寸约 `w-[12%] h-[18%]`，仍点击打开 `Modal` 显示展品信息
   - 加调试开关（沿用 Room1 的 D 键网格+鼠标坐标），方便你微调坐标到完全贴合展柜

4. **门的处理**
   - 图中正后方已有木门：在门位置加一个透明热区，`solved` 后点击触发 `onComplete`，否则提示"先完成排序"
   - 移除原先右侧浮动的 `IsoDoor` 元素

5. **保留原有逻辑**
   - 下方时间排序卡槽、拖拽、确认/重置、错误提示、`Modal`、`successText` 完全不动
   - `solved` 后的"进入下一关"按钮保留

## 需要你确认
- 蒙版亮度以 Room1 当前画面为基准对齐，可在调试时再微调，OK 吗？
- 10 个展柜中下排"T 恤模特"位置在图中央偏前，它对应 `exhibits[7]`（下墙左）还是中央独立位？我倾向把它当作中央位（坐标 ~50%/62%），其它 9 个绕墙分布。