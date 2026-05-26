## 目标

把礼物档案室的 10 个展品改成可点击的热区，点击后弹出详情 modal（展示上传的实物图 + 名称 + 文字介绍）。展品编号 1→10 重新定义如下。

## 1. 复制上传图到项目

把 10 张图复制到 `src/assets/room2/`：
- `e1.png` ← image-12（护肤套盒）
- `e2.png` ← image-13（宝矿力）
- `e3.png` ← image-14（蛋白粉 ISOLATE）
- `e4.png` ← image-15（电动牙刷）
- `e5.png` ← image-16（乐高法拉利）
- `e6.png` ← image-17（Kangol 薄荷绿斜挎包）
- `e7.png` ← image-18（蓝色 T 恤）
- `e8.png` ← image-19（Omega-3 鱼油）
- `e9.png` ← image-20（宝格丽香水）
- `e10.png` ← image-21（AirPods）

## 2. 改写 `ROOM_2_DATA.exhibits`（src/components/escape/config.ts）

按新编号顺序重写 10 件展品，并新增 `image` 字段：

| no | name | desc |
|---|---|---|
| 1 | 护肤套盒 | 做好皮肤管理。 |
| 2 | 宝矿力 | 好喝小甜水。 |
| 3 | ON 金标蛋白粉 | 第一次知道这家伙这么贵。 |
| 4 | 电动牙刷 | 不用还给我。 |
| 5 | 乐高法拉利 | 我也想要。 |
| 6 | Kangol 斜挎包 | 薄荷绿的斜挎包，好久都没有出场了呢…… |
| 7 | lululemon T 恤 | 怎么已经淘汰给爸爸了？ |
| 8 | Seven Seas Omega-3 鱼油 | 漂洋过海来见你…… |
| 9 | 宝格丽大吉岭茶香水 | 香香的！ |
| 10 | AirPods | 保持耳机干净！保持耳道干燥！ |

`Exhibit` 类型新增 `image: string`（指向 `@/assets/room2/eN.png`）。

同时同步更新 `sortablePool` / `correctOrder` / `slotLabels`：保留"五件按时间排序"的玩法，但 id 重新映射为新编号下对应的展品。建议沿用之前的实物（宝矿力→AirPods→香水→鱼油→乐高）：

- `sortablePool: ["e2","e10","e9","e8","e5"]`
- `correctOrder: ["e2","e10","e9","e8","e5"]`
- `slotLabels: ["2020","2022","2023","2025","2026"]`（不变）

## 3. 为 10 个热区接上点击 + 详情 modal（src/components/escape/Room2.tsx）

- 在底图上为 `hotspots[i]` 渲染 10 个透明 `<button>`，`onClick={() => setOpenExhibit(exhibits[i])}`，`aria-label={exhibits[i].name}`，className 保持 `bg-transparent focus:outline-none`（不要 hover 高亮，跟门一致）。
- 坐标先沿用现有 `hotspots` 数组顺序占位（0→展品1, …, 9→展品10），等用户进调试模式给新坐标后再调。
- 改写已有的"展品详情" Modal：把当前的 `text-5xl` emoji 区换成
  ```tsx
  <img src={openExhibit.image} alt={openExhibit.name}
       className="mx-auto h-56 w-auto rounded-lg object-contain" />
  ```
  下方保留 `openExhibit.desc`。
- 排序面板里 pool 卡片继续用 `ex.icon`（emoji），不动。

## 4. 不动的部分

门热区、布告板、排序逻辑、调试网格、错误文案、过关跳转——全部保持现状。
