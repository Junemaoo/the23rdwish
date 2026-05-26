只改动房间3的交互与问答卡片。背景、热点坐标、桌门柜瓶位置全部保持不变。

## 1. 上传图片入项目

把 5 张参考图拷到 `src/assets/room3/`：
- `room3-面.png` → `meal.png`
- `room3-小票.png` → `popmart.png`
- `room3-登机牌.png` → `ticket.png`
- `room3-manner.png` → `manner.png`
- `room3-map.png` → `map.png`

## 2. 改 `src/components/escape/config.ts` 中 `ROOM_3_DATA`

仅改 `items` 的文案 + 给每个 item 加 `image` 字段；保留 `x/y` 不动（坐标仍由 Room3.tsx 的 `SPOTS` 控制，配置里的 `x/y` 当前未被使用，可保留）。同时移除 `visual` 文本，改用图片展示。

新增/修改的 `Room3Item` 字段：
- `image: string`（必填，物件特写图）
- 删除 `visual: string[]`
- `label` 文案按需替换

五个物件对应：

| id | label | image | question | fields | answers | fragment |
|----|-------|-------|----------|--------|---------|----------|
| noodles | 一顿大餐 | meal | "我们说下次见面要再去哪里吃？" | 1 个 4 字输入 | [["胖妹面庄"]] | 快 |
| popmart | POP MART 小票 | popmart | "我们下次要再一起拆盲盒！考考你，它们分别是多少钱？" | 3 个数字框（标签：Nyota系列 / 星星人系列 / Labubu机甲系列；占位都留空） | [["69"],["69"],["89"]] | 日 |
| ticket | 一张从伦敦到北京的机票 | ticket | "请问从伦敦飞到北京要几个小时？" | 1 个数字框（占位空） | [["10","10小时","约10","约10小时"]] | 生 |
| coffee | 两杯 Manner | manner | "我们都最爱喝 Manner 的哪款咖啡！" | 1 个 4 字输入 | [["冰葡美式"]] | 乐 |
| map | 一张北京地图 | map | "这条路很眼熟吧！请问是经过了哪三个区？" | 3 个区名输入 | [["房山"],["朝阳"],["怀柔"]] | 呀 |

错误提示沿用原有 `errorMessages` 风格但不暴露答案。
`fragmentOrder` 保持 `["生","日","快","乐","呀"]`。

## 3. 改 `src/components/escape/Room3.tsx`

保持现有：背景图、`SPOTS` 坐标、`DOOR_BTN_POS`、热点透明可点击逻辑。

### 3.1 左上角碎片收集盒
在 stage 容器内左上角绝对定位一个半透明小卡片：
- 标题 "愿望碎片 X/5"
- 下方 5 个小槽位（虚线方框），按 **玩家答题顺序**填入碎片字（不按正确顺序）
- 新碎片入盒用 `animate-in zoom-in` 轻微弹入
- 尺寸约 w-40，不挡桌面

### 3.2 已答对再次点击
`ItemModal` 中当 `alreadyDone` 时直接显示 "这个线索已经收集过啦～"（替换现有"已获得碎片"块）。

### 3.3 物件卡片改用图片
`ItemModal` 顶部用 `<img src={item.image}>` 替换原 `visual` 文本块；POP MART 那张图本身含三个标签，输入框单独排在图片下方且**不显示前缀/不在 placeholder 里放答案**——为保证字段标签清晰，每个 input 上方加 label（如 "Nyota系列"）。

### 3.4 集齐后不自动通关
- 移除 "集齐后自动 setShowSuccess" 的 setTimeout。
- 集齐后 `bottle` 周边出现轻微脉冲光晕 + 一行小字提示 "碎片已集齐，可以点亮许愿瓶了"。
- 点击许愿瓶：
  - 未集齐 → 现有 `bottleNudge` 提示
  - 已集齐且未点亮 → 打开新的「排序弹窗」`SortModal`
  - 已点亮 → 不再打开

### 3.5 新组件 `SortModal`（同文件内）
标题："放入碎片开始点亮许愿瓶吧！"

UI：
- 上方 5 个空槽（按点击顺序填入）
- 下方 5 个乱序碎片按钮（用收集顺序，再 shuffle 一次固定）
- 点击碎片 → 进入第一个空槽；点击已放入的槽 → 取出回到下方
- 底部 "确认放入" 按钮（5 槽满后启用）

判断：
- 正确（顺序 = 生日快乐呀）→ 切到成功视图：标题 "许愿瓶已成功点亮🌟" + "知道了" 按钮关闭；同时设 `bottleLit=true`
- 错误 → 显示 "顺序好像不对哦，先把这句话念完整～"，清空槽位让玩家重排

### 3.6 许愿瓶点亮视觉
新增 `bottleLit` 状态。`bottleLit=true` 时：
- 瓶子区域显示更强的黄色光晕（在现有 `allCollected` 光效基础上加深 + 加 sparkle 粒子，用 3 个绝对定位 `✨` span 加 `animate-pulse` 延迟）
- 门按钮（现有 `DOOR_BTN_POS`）才出现，文案改为 "成功通关"，按钮配色改为 emerald 绿 + 绿色 glow shadow

集齐但未点亮时不显示门按钮。

## 范围之外
- 不改背景、不动 `SPOTS` 任何坐标、`DOOR_BTN_POS` 位置不变
- 不改房间1、房间2、Finale
- 不加音乐、不改路由
