## 1. 更新 10 个展品热区坐标（src/components/escape/Room2.tsx）

将 `hotspots` 数组的 `x, y` 改为：

| no | x | y |
|---|---|---|
| 1 | 47.4 | 40.7 |
| 2 | 26.9 | 35.4 |
| 3 | 72.8 | 56.7 |
| 4 | 35.6 | 21.4 |
| 5 | 60.4 | 19.9 |
| 6 | 25.6 | 73.2 |
| 7 | 47.1 | 56.1 |
| 8 | 78.4 | 78.2 |
| 9 | 68.9 | 33.2 |
| 10 | 33.6 | 51.2 |

`w / h` 暂保留现值（13~14 / 22~24）。

## 2. 展品详情弹窗改版（src/components/escape/Room2.tsx）

把现有"展品 N · 名称"的 `Modal` 替换为自定义居中卡片，匹配截图样式：

- 容器：`fixed inset-0 z-50 flex items-center justify-center bg-black/50`，点遮罩关闭——居中于整个房间/屏幕。
- 卡片：约 `max-w-lg w-[90vw]`，圆角 `rounded-3xl`，米粉色背景（`bg-[#fbe9e0]`，与图一致），`p-8 shadow-2xl`。
- 内部从上到下：
  1. 标题 `展品{no}`，居中、加粗、`text-2xl text-[#2b2b2b]`。
  2. 描述 `desc`，左对齐、`text-base text-[#3a3a3a] mt-6`。
  3. 实物图，`mx-auto mt-6 max-h-60 object-contain`。
- 不再显示"知道了"按钮（点遮罩或按 Esc 关闭，Esc 监听已存在）。

排序面板那个 `Modal` 不动。
