## 改动 `src/components/escape/Room2.tsx`

1. **去黑边 — 米色背景延伸全屏**
   - 外层容器 `bg-black` → `bg-[#d4c4a0]`，保留 `object-contain`

2. **删除左上角章节标题 `<header>` 整块**

3. **布告板贴合墙上"GIFTS INSPIRED BY DISCOVERY"**
   - 新增内层 `<div className="relative mx-auto h-full aspect-[1456/1080] max-h-full max-w-full">`，把底图 `<img>` 和所有热区（后门、布告板、调试层）放进去，使所有百分比坐标基于底图本身而非视口
   - 布告板坐标改为 `left: 56.5%, top: 13.5%, width: 10%, height: 9%`
   - 后门坐标保持 `{x:50, y:16, w:7, h:18}`

4. 排序 Modal / D 键调试 / 进入下一关按钮全部保留
