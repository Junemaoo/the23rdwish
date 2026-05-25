## 目标
把房间1当前由 SVG 拼出的"假房间"替换成一张高保真 2.5D 微缩房间渲染图，作为静态背景，再在图上叠加 4 个透明可点击热点；日历区域单独换成带爱心标记的图片以契合谜题。

## 实现步骤

### 1. 生成两张图片
用 `imagegen--generate_image`（premium 档，jpg 16:9）生成：

**a) `src/assets/room1-bg.jpg`** —— 房间1主背景  
prompt 要点：以用户上传图为参考重新创作，2.5D isometric dollhouse cutaway，16:9 宽幅；左半 = 英国学生公寓（蓝床单/鹅黄被子/红方格枕、长书桌+笔记本屏幕显示"05:20"、UCL 紫色海报、小冰箱+灶台+水池+多彩蔬菜、衣柜、台灯、墙面黑板拍立得）；中间 = 木门+数字密码锁+小走廊吊灯；右半 = 工位（iMac 显示"14:20"、Labubu 一排、办公椅）+ 健身房（跑步机、卧推凳、哑铃）；暖色木地板、柔和暖光、灰色房屋外壳；干净、无文字噪点。

**b) `src/assets/room1-calendar.jpg`** —— 点击日历后弹窗用图  
prompt：单张木质相框日历近景，月份格子里某一格用马克笔画着红色爱心，其它格子留白不写数字；2.5D 微缩风、暖色调。

### 2. 重写 `src/components/escape/Room1.tsx`
- 删除所有 `Iso*` 组件和 `RoomBox`、`Badge` 拼装代码。
- 用单个相对定位容器，`<img src={room1Bg}>` 作为底图，`aspectRatio: 16/9`。
- 叠加 4 个绝对定位的透明 `<button>` 热点（用百分比定位，配现有 `HotspotRing` 发光环）：
  - 左侧笔记本 → `pc-left`（线索 520）
  - 右侧台式机 → `pc-right`（线索 1420）
  - 中间日历 → `calendar`（线索：爱心方格，弹窗里展示生成的日历图）
  - 中间门旁密码锁 → 触发 `AnswerInput` 聚焦
- 解谜逻辑、`AnswerInput`、`Modal`、`onComplete` 流程保持不变；继续读取 `ROOMS[0]` 的 hotspots / answer / 错误文案。
- 日历 Modal 内容除原有 `clueText` 外，额外渲染 `room1-calendar.jpg` 缩略图。

### 3. 不动的部分
- `iso.tsx` 保留（房间2/3/最终页仍依赖它）。
- `config.ts`、路由、章节页、`AnswerInput`、进度条均不变。

### 4. QA
生成后用 `code--view` 查看两张图确认构图正确；预览页核对四个热点位置与底图对齐。若某热点偏移，仅调整百分比坐标，不重生成图片。

## 技术说明
- 图片走 ES6 import：`import room1Bg from "@/assets/room1-bg.jpg"`。
- 热点用 `absolute inset-0` 容器 + 百分比 `left/top/width/height`，确保随底图缩放。
- 不引入新依赖。
