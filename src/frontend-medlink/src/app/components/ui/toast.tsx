"use client";

import React, { useEffect, useRef, useState } from "react";

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
    // limpa todos os toasts de todos os viewports
    listeners.forEach((set) => {
      set([]);
      // não retornar nada aqui
    });
  },
};

function emitir(t: Toast) {
  // notifica todos os listeners
  listeners.forEach((set) => {
    set((prev) => [...prev, t]);
    // não retornar nada aqui
  });

  // auto dismiss
  if (t.duration && t.duration > 0) {
    const id = t.id;
    window.setTimeout(() => fechar(id), t.duration);
  }
}

function fechar(id: number) {
  listeners.forEach((set) => {
    set((prev) => prev.filter((x) => x.id !== id));
    // não retornar nada aqui
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
          <button
            key={t.id}
            type="button"
            onClick={() => fechar(t.id)}
            aria-label="Dispensar notificação"
            style={{
              ...toastButtonStyle,
              ...byTypeStyle[t.type ?? "info"],
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 2 }}>
              {titleByType[t.type ?? "info"]}
            </div>
            <div>{t.message}</div>
          </button>
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

const toastButtonStyle: React.CSSProperties = {
  appearance: "none",
  WebkitAppearance: "none",
  border: "1px solid #e5e7eb",
  background: "#fff",
  color: "#111",
  textAlign: "left",
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  boxShadow:
    "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
  animation: "slideIn 200ms ease-out",
  cursor: "pointer",
  outline: "none",
  transition: "box-shadow 80ms ease, transform 80ms ease",
} as const;

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
button[aria-label="Dispensar notificação"]:focus-visible {
  box-shadow: 0 0 0 3px #bfdbfe;
}
button[aria-label="Dispensar notificação"]:active {
  transform: translateY(1px);
}
`;