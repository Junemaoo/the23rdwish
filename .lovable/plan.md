删除房间2门旁的提示气泡。

文件：`src/components/escape/Room2.tsx`

1. 删除 state：`const [doorHint, setDoorHint] = useState(false);`
2. `handleDoor` 改为：解锁则 `onComplete()`，未解锁不做任何反应
3. 删除 `{doorHint && (...)}` 整段渲染块（"🔒 门锁着 · 先点击门旁的布告板完成展品排序"）
