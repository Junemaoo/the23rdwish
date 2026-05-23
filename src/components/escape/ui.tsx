import { useEffect, useState } from "react";

// 通用弹窗
export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h3 className="mb-3 text-lg font-semibold text-card-foreground">
            {title}
          </h3>
        )}
        <div className="whitespace-pre-line text-sm leading-relaxed text-card-foreground">
          {children}
        </div>
        <button
          onClick={onClose}
          className="mt-5 w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          知道了
        </button>
      </div>
    </div>
  );
}

// 热点按钮
export function Hotspot({
  x,
  y,
  icon,
  label,
  found,
  onClick,
}: {
  x: number;
  y: number;
  icon: string;
  label: string;
  found: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{ left: `${x}%`, top: `${y}%` }}
      className="group absolute -translate-x-1/2 -translate-y-1/2"
    >
      <span
        className={`relative flex h-14 w-14 items-center justify-center rounded-full border-2 text-2xl shadow-lg transition ${
          found
            ? "border-primary/40 bg-card/70 opacity-60"
            : "border-primary bg-card hover:scale-110"
        }`}
      >
        {icon}
        {!found && (
          <span className="absolute inset-0 animate-ping rounded-full border-2 border-primary/40" />
        )}
      </span>
      <span className="mt-1 block whitespace-nowrap rounded-md bg-card/90 px-2 py-0.5 text-xs text-card-foreground opacity-0 transition group-hover:opacity-100">
        {label}
      </span>
    </button>
  );
}

// 答案输入
export function AnswerInput({
  prompt,
  hint,
  answer,
  onSolved,
}: {
  prompt: string;
  hint: string;
  answer: string;
  onSolved: () => void;
}) {
  const [value, setValue] = useState("");
  const [wrong, setWrong] = useState(0);
  const [msg, setMsg] = useState("");

  function submit() {
    const v = value.trim().toLowerCase();
    const a = answer.trim().toLowerCase();
    if (!v) return;
    if (v === a) {
      setMsg("");
      onSolved();
    } else {
      const next = wrong + 1;
      setWrong(next);
      if (next >= 3) setMsg(`不对哦…… 小提示：${hint}`);
      else setMsg(`再想想（已尝试 ${next} 次）`);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card/80 p-5 backdrop-blur">
      <p className="mb-3 text-sm font-medium text-card-foreground">{prompt}</p>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="输入答案……"
          className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <button
          onClick={submit}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          确认
        </button>
      </div>
      {msg && <p className="mt-2 text-xs text-destructive">{msg}</p>}
    </div>
  );
}

// 进度指示
export function ProgressDots({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-2 rounded-full transition-all ${
            i < step ? "w-6 bg-primary" : "w-2 bg-muted"
          }`}
        />
      ))}
    </div>
  );
}

// 淡入容器
export function Fade({ children, k }: { children: React.ReactNode; k: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(false);
    const t = setTimeout(() => setShow(true), 30);
    return () => clearTimeout(t);
  }, [k]);
  return (
    <div
      className={`transition-all duration-700 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
    >
      {children}
    </div>
  );
}
