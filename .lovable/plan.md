## 改动概览

把房间 3 的"假桌面 SVG"换成你上传的真实等距图（room3_draft.PNG）作为整张背景；房间 3 占满整个浏览器窗口；删除下方"愿望碎片"面板（包括拖入瓶子的所有逻辑），保留五个物件答题获得碎片 + 集齐后许愿瓶亮起 + 出现"进入下一关"按钮的流程。

## 文件改动

### 1. `src/assets/room3/scene.png`（新增）
把 `user-uploads://room3_draft.PNG` 拷到 `src/assets/room3/scene.png`，作为整间房间的背景图。

### 2. `src/components/escape/Room3.tsx`（重写主体）

**布局**
- 外层容器从 `mx-auto max-w-6xl … py-6` 改为 `relative h-screen w-screen overflow-hidden`，背景图 `scene.png` 用 `object-cover` 铺满，叠加一层极轻的暗角让热点更显眼。
- 顶部 header（房间编号/标题/副标题）改成左上角的小浮层（半透明卡片，`absolute top-3 left-3`），不再独占一行。
- 不再使用现在的"白色梯形桌面 + IsoXxx SVG"，全部删掉。

**热点（按图中实际位置）**
在背景图上叠 5 个透明可点击区域（`button`，绝对定位 + 百分比坐标），坐标按上传图大致比例设：
- ticket（机票，桌面中间偏下那张红色登机牌）：约 `x:45%, y:73%`
- popmart（POP MART 小票，桌面左下白条）：约 `x:27%, y:78%`
- noodles（两碗面 + 小菜，桌面左前方红汤碗一带）：约 `x:35%, y:62%`
- coffee（两杯冰葡美式，桌面右前方两杯红饮）：约 `x:58%, y:68%`
- map（北京地图，桌面右下角折叠地图）：约 `x:72%, y:77%`
- 每个热点视觉：仅一圈柔和的金色脉冲光环（`animate-ping` + `ring`），鼠标 hover 时显示物件名 tooltip；答对后光环消失，浮一个小金色 ✓。
- 坐标可在后续基于真实预览微调，先用上面这套。

**许愿瓶 / 门**
- 图里右上角柜子上已经画了一个空玻璃瓶。把"瓶子"热点定位到那个瓶子上（约 `x:73%, y:30%`），不再用 `IsoBottle`。
- 集齐 5 个碎片前：瓶子热点 hover 显示"还差 X 片"，点击无效。
- 集齐 5 个碎片后：瓶子位置生出一层金黄发光（参考房间 2 的"进入下一关"按钮风格：`bg-amber-300/40` 光晕 + `shadow-[0_0_30px_8px_rgba(252,211,77,.7)]` + `animate-pulse`），瓶子被"点亮"。
- 同时在图中那扇木门上（约 `x:42%, y:18%`）渐显出一个发光按钮"进入下一关"，点击 → `onComplete()`。样式复用房间 2 已经定型的发光按钮。

**删掉的内容**
- 整个 `section` 碎片面板（lines 152-222）。
- `placed` / `dragging` / `picked` / `bottleMsg` / `tryPlace` / `poolFragments` 全部移除。
- `Bottle` 子组件移除，`IsoBottle` / `IsoDoor` / `IsoTicket` 等 iso 导入移除。
- 拖拽相关 DnD 逻辑全部移除（不再需要拖入瓶子）。

**保留的内容**
- `solvedItems` / `collected`（仍用于判断"集齐"）。
- `ItemModal` 答题弹窗逻辑不变（视觉文案、字段、答案、错误提示、获得碎片 toast）。
- `ROOM_3_DATA` 不动（坐标字段 x/y 在 config 里会被覆盖：直接在 Room3.tsx 用本文件内的新坐标常量，不改 config，避免影响其他东西）。

### 3. `src/routes/index.tsx`
房间 3 现在自带全屏布局，所以让它脱离顶部进度条：当 `stage === "room3"` 时不渲染顶部 sticky 条，或让 Room3 自己渲染一个浮层进度。简单做法——在 Room3 内部左上角的浮层里直接显示"房间 3 / 3"，外层进度条对房间 3 仍照常显示（房间 3 的全屏容器从 sticky 条下方开始，用 `h-[calc(100vh-49px)]` 而不是 `h-screen`），这样不破坏现有进度系统。

## 范围之外
- 房间 1、房间 2、章节页、结算页都不动。
- `ROOM_3_DATA` 内容文案、答案、错误提示都不动。
- 不修改 `iso.tsx`（只是停止使用其中几个组件）。
