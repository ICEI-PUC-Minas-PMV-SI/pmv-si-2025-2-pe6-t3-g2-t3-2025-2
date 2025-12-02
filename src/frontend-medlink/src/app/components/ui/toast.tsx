"use client";

import { useEffect, useRef, useState } from "react";

type Toast = {
  id: number;
  message: string;
  type?: "success" | "error" | "info" | "warning";
  duration?: number; // ms
};

let listeners: React.Dispatch<React.SetStateAction<Toast[]>>[] = [];
let counter = 1;

export const toast = {
  success(message: string, duration = 3000) {
    emitir({ id: counter++, message, type: "success", duration });
  },
  error(message: string, duration = 4000) {
    emitir({ id: counter++, message, type: "error", duration });
  },
  info(message: string, duration = 3000) {
    emitir({ id: counter++, message, type: "info", duration });
  },
  warning(message: string, duration = 3500) {
    emitir({ id: counter++, message, type: "warning", duration });
  },
  clear() {
    listeners.forEach((set) => {
      set([]);
    });
  },
};

function emitir(t: Toast) {
  listeners.forEach((set) => {
    set((prev) => [...prev, t]);
  });
  if (t.duration && t.duration > 0) {
    const id = t.id;
    window.setTimeout(() => fechar(id), t.duration);
  }
}

function fechar(id: number) {
  listeners.forEach((set) => {
    set((prev) => prev.filter((x) => x.id !== id));
  });
}

export function ToastViewport() {
  const [items, setItems] = useState<Toast[]>([]);
  const setRef = useRef(setItems);
  setRef.current = setItems;

  useEffect(() => {
    listeners.push(setRef.current);
    return () => {
      listeners = listeners.filter((l) => l !== setRef.current);
    };
  }, []);

  return (
    <>
      <div style={viewportStyle} aria-live="polite">
        {items.map((t) => (
          <div
            key={t.id}
            style={{
              ...toastContainerStyle,
              ...byTypeStyle[t.type ?? "info"],
            }}
          >
            {/* Conteúdo do toast */}
            <div style={{ paddingRight: 36 }}>
              <div style={{ fontWeight: 600, marginBottom: 2 }}>
                {titleByType[t.type ?? "info"]}
              </div>
              <div>{t.message}</div>
            </div>

            {/* Botão X (semântico) */}
            <button
              type="button"
              aria-label="Fechar notificação"
              onClick={() => fechar(t.id)}
              style={closeBtnStyle}
            >
              ×
            </button>

            {/* Botão “dismiss” cobrindo o card (sem aninhar botões) */}
            <button
              type="button"
              onClick={() => fechar(t.id)}
              aria-label="Dispensar notificação"
              style={dismissOverlayBtnStyle}
              title="Clique para dispensar"
            />
          </div>
        ))}
      </div>
      <style jsx global>{globalAnim}</style>
    </>
  );
}

const viewportStyle: React.CSSProperties = {
  position: "fixed",
  right: 16,
  top: 16,
  display: "grid",
  gap: 8,
  zIndex: 9999,
  width: "min(360px, 90vw)",
};

const toastContainerStyle: React.CSSProperties = {
  position: "relative",
  padding: "10px 12px",
  borderRadius: 8,
  background: "#fff",
  color: "#111",
  border: "1px solid #e5e7eb",
  boxShadow:
    "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
  animation: "slideIn 200ms ease-out",
} as const;

const closeBtnStyle: React.CSSProperties = {
  position: "absolute",
  top: 6,
  right: 6,
  width: 28,
  height: 28,
  lineHeight: "28px",
  textAlign: "center",
  borderRadius: 6,
  border: "1px solid transparent",
  background: "transparent",
  color: "#444",
  cursor: "pointer",
  zIndex: 2,
} as const;

const dismissOverlayBtnStyle: React.CSSProperties = {
  // botão transparente que cobre o card todo para permitir dismiss por clique/teclado
  position: "absolute",
  inset: 0,
  background: "transparent",
  border: "none",
  cursor: "pointer",
  zIndex: 1,
} as const;

// zIndex set inline above on closeBtnStyle

const byTypeStyle: Record<string, React.CSSProperties> = {
  success: { borderColor: "#c7f9cc", background: "#f0fff4" },
  error: { borderColor: "#fecaca", background: "#fef2f2" },
  info: { borderColor: "#bfdbfe", background: "#eff6ff" },
  warning: { borderColor: "#fde68a", background: "#fffbeb" },
};

const titleByType: Record<string, string> = {
  success: "Sucesso",
  error: "Erro",
  info: "Info",
  warning: "Atenção",
};

const globalAnim = `
@keyframes slideIn {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}
`;