## 目标
1. 重新生成房间1主背景图：拓宽中间走廊，同时容纳数字密码锁和墙上日历；删除左右房间外侧的门。
2. 重新生成日历图：参考用户上传的 Risotto Studio 月历风格（大号月份字母、网格、彩色印刷感），但**抹去所有日期数字**，仅在中上某一天格子里画一个手绘红色爱心。
3. 房间页面改为纯沉浸式：去掉标题、副标题、"房间 1/3"、底部提示文字、进度条、ambient 文字、`HotspotRing` 发光环——背景图占满整屏，玩家完全靠自行点击探索热点。

## 实施步骤

### 1. 重新生成 `src/assets/room1-bg.jpg`
prompt 调整：
- 2.5D isometric dollhouse cutaway, 16:9。
- 左半：英国学生公寓（蓝床、UCL 海报、长书桌+笔记本屏 "05:20"、小厨房）。**左外墙整面砖墙/壁纸，无外门。**
- **中间走廊加宽至约整图 22% 宽度**：左侧墙挂木质相框日历（约占走廊上半），右侧墙装数字密码键盘（约占走廊下半，键盘清晰可见），中间地面木地板+吊灯，走廊尽头一扇通往下一房间的木门（保留中间门，这是密室门）。
- 右半：工位（iMac 屏 "14:20"、一排 Labubu）+ 健身房（跑步机、卧推凳）。**右外墙整面墙，无外门。**
- 暖色木地板、柔和暖光、灰色房屋外壳，无文字噪点。

### 2. 重新生成 `src/assets/room1-calendar.jpg`
参考用户上传的 Risotto Studio 月历视觉：
- 单张挂历近景特写，顶部金属线圈，奶白纸张。
- 顶部超大粗体月份缩写字母（如 "SEP"，绿色印刷），左上角小字 "SEPTEMBER"，右上角小号月份编号。
- 下方 7 列日历网格（M T W T F SAT SUN 表头紫色横条），**所有日期格子完全留空，不写任何数字**。
- **仅在中上部分某一天的格子中央，用红色马克笔手绘一个爱心 ❤**（其它格子纯白）。
- 紫绿双色印刷质感、轻微 risograph 颗粒、2.5D 微缩拍摄角度。

### 3. 改写 `src/components/escape/Room1.tsx`（沉浸式）
- 删除：`<header>` 标题区、"已发现线索 x/y" 提示、底部 ambient 浮条、`HotspotRing` 调用、找到后的 ✓ 角标。
- 容器改为全宽：`w-screen h-screen` 或 `fixed inset-0`，背景图 `object-cover` 占满；`AnswerInput` 和成功 Modal 浮在底部/中央。
- 热点：保留 4 个透明 `<button>`（笔记本、台式机、日历、密码锁），**无任何视觉提示**（无环、无 hover 描边、无 label），仅保留 `title` 供无障碍。
- 重新校准热点百分比坐标以匹配新底图（走廊加宽后：日历约 `left: 41% top: 18% w: 10% h: 16%`，密码锁约 `left: 44% top: 42% w: 7% h: 10%`，左笔记本和右台式机按新构图微调）。
- 日历 Modal 内容保留：展示新生成的 `room1-calendar.jpg` + clueText。
- 解谜/答题/`onComplete` 流程不变。

### 4. （可选，后续）Room2/Room3 / Chapter 页
本次只动 Room1。若用户后续要求 Room2/Room3 也沉浸式，同样模式套用。本计划暂不改动它们以及 `Chapter.tsx`、`config.ts`、路由、`iso.tsx`。

### 5. QA
- `code--view` 查看两张新图：确认走廊加宽、外门移除、日历空白+爱心。
- 预览页核对 4 个热点位置；偏移则只调百分比，不重生成图。
- 浏览器查看 Room1 是否真正全屏沉浸、无任何文字/发光提示。

## 技术说明
- 图片 ES6 import 不变。
- 全屏容器用 `fixed inset-0 overflow-hidden`，内部 `<img class="absolute inset-0 w-full h-full object-cover">`；`AnswerInput` 用 `absolute bottom-6 left-1/2 -translate-x-1/2 w-[min(90%,420px)]`。
- 热点 `<button>` 仅 `absolute` 定位 + 透明背景，无任何 className 视觉样式。
- 不引入新依赖。
