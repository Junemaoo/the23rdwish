## 房间 1 线索特写 + 收集动画 改造

### 1. 替换/新增物件图

- `src/assets/room1-laptop.png`（新，替换原 jpg）：直接使用上传的 `room1-macbook锁屏.png`，**抠去白底**变成透明 PNG，屏幕显示 `5:20 伦敦`。
- `src/assets/room1-desktop.png`（新，替换原 jpg）：直接使用上传的 `1420_北京，中国.png`，**抠去白底**变成透明 PNG，屏幕显示 `14:20 北京`。
- `room1-calendar.jpg` 保持不变。

（透明 PNG 直接放在米色卡片中央，效果就和上传的日历示意图一致）

### 2. 统一的线索卡片样式（参考用户上传的日历示意图）

新建 `ClueCard` 视觉规范，三个线索点开后都使用：

- 弹层背景：暗色遮罩 `bg-black/85`
- 卡片：米色面板 `bg-[#f5ede0]`，圆角 `rounded-3xl`，padding 充足，宽度约 `max-w-sm`
- 顶部标题（黑色，居中，semibold，`text-2xl`）
- 中部物件图（透明 PNG，居中，约占卡片宽度 70%）
- 底部「收集线索」按钮：陶土红 `bg-[#c97259]`、白字、圆角胶囊形、宽度约卡片 70%、`text-base`
- 标题字号 / 图片 / 按钮 三者比例协调（图最大，标题与按钮字号接近）

三个线索的标题：
| id | 标题 |
|---|---|
| `pc-left` | zcx 的电脑屏幕 |
| `pc-right` | mjm 的电脑屏幕 |
| `calendar` | 墙上的日历 |

线索本（InventoryModal）里的物件名称同步改为以上三个。

### 3. 收集动画特效

点击「收集线索」后：

1. 卡片中的物件图触发一个 ~700ms 的飞行动画：图片 **缩小 + 平移** 到左上角线索本图标位置，同时透明度渐隐到 0。
2. 与此同时左上角线索本图标 **弹一下**（scale 1 → 1.25 → 1，约 400ms），徽章数字 `+1` 更新。
3. 动画结束后再关闭弹层并把该 id 加入 `collected`。

技术做法：
- 用一个绝对定位的 `<img>` clone 叠在弹层上，通过 `requestAnimationFrame` 切换 `transform: translate(...) scale(0.1)` + `opacity: 0`，配合 CSS `transition: all 700ms cubic-bezier(.4,.0,.2,1)`。
- 起点 = 当前图片的 `getBoundingClientRect()`，终点 = 线索本按钮的 `getBoundingClientRect()`。
- 线索本图标用 `ref` 拿到位置；动画期间给该按钮加一个 `animate-clue-pop` 类（在 `styles.css` 里定义 keyframes）。
- 按钮在动画期间 disabled，防止重复点击。

### 4. 文件改动清单

- `src/assets/room1-laptop.png`（新，透明 PNG）
- `src/assets/room1-desktop.png`（新，透明 PNG）
- `src/components/escape/Room1.tsx`：
  - 引入新 PNG，去掉旧 jpg 引用
  - 给 `hotspots` 加 `title` 字段（zcx 的电脑屏幕 / mjm 的电脑屏幕 / 墙上的日历）
  - 重写 ClueModal → ClueCard（米色卡片样式）
  - 加飞行动画逻辑 + 线索本按钮 ref
  - InventoryModal 用新 `title` 字段
- `src/styles.css`：添加 `@keyframes clue-pop` 与 `.animate-clue-pop` 工具类

### 5. 不动的部分
- 密码锁热点、答题 Modal、成功 Modal
- `config.ts`、`ui.tsx`、其它房间、路由
- 房间背景 `room1-bg.jpg`

### QA
- 三个线索弹层视觉与上传的日历示意图一致（米色卡 + 黑标题 + 陶土红胶囊按钮）
- 标题分别为 zcx / mjm / 墙上的日历
- 点「收集线索」后，图片飞到左上角图标，图标弹一下，徽章 +1
- 线索本里三个槽位的标题同步更新
- 已收集后再点开，按钮显示「已收集 ✓」且 disabled
