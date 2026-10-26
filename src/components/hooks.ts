"use client";
import { useCallback, useEffect, useState } from "react";
import { defaultPreferences } from "@/lib/content";
import { preferencesSchema } from "@/lib/preferences";
import type { Preferences } from "@/lib/types";
export function usePreferences() {
  const [prefs, setPrefs] = useState<Preferences>(defaultPreferences),
    [ready, setReady] = useState(false),
    [storageError, setStorageError] = useState("");
  useEffect(() => {
    try {
      const saved = localStorage.getItem("gp-preferences-v1");
      if (saved) {
        const result = preferencesSchema.safeParse(JSON.parse(saved));
        if (result.success) setPrefs(result.data);
        else
          setStorageError(
            "Los datos guardados no son compatibles. Puedes volver a importarlos.",
          );
      }
    } catch {
      setStorageError("No se pudo leer el almacenamiento local.");
    }
    setReady(true);
  }, []);
  const update = useCallback((fn: (p: Preferences) => Preferences) => {
    setPrefs((p) => {
      const next = fn(p);
      try {
        localStorage.setItem("gp-preferences-v1", JSON.stringify(next));
        setStorageError("");
      } catch {
        setStorageError(
          "No se pudo guardar. Tus cambios se perderán al cerrar esta página.",
        );
      }
      return next;
    });
  }, []);
  const clear = useCallback(() => {
    try {
      localStorage.removeItem("gp-preferences-v1");
      setPrefs(defaultPreferences);
      setStorageError("");
    } catch {
      setStorageError(
        "No se pudieron borrar los datos. Revisa los permisos del navegador.",
      );
    }
  }, []);
  return { prefs, update, ready, storageError, clear };
}
export function useRemote<T>(url: string, interval = 60000, enabled = true) {
  const [data, setData] = useState<T | null>(null),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(false),
    [refresh, setRefresh] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    let alive = true,
      busy = false,
      failures = 0,
      timer: ReturnType<typeof setTimeout>;
    const controller = new AbortController();
    setData(null);
    setError("");
    try {
      const saved = localStorage.getItem(`gp-cache:${url}`);
      if (saved) setData(JSON.parse(saved) as T);
    } catch {
      /* Cache is optional. */
    }
    const run = async () => {
      if (busy || !alive) return;
      if (document.hidden || !navigator.onLine) {
        timer = setTimeout(run, interval);
        return;
      }
      busy = true;
      setLoading(true);
      try {
        const r = await fetch(url, { signal: controller.signal });
        if (!r.ok)
          throw new Error(
            "Actualización pendiente. Se conserva el último dato disponible.",
          );
        const value = (await r.json()) as T;
        if (alive) {
          setData(value);
          setError("");
          try {
            localStorage.setItem(`gp-cache:${url}`, JSON.stringify(value));
          } catch {
            /* Keep memory data if storage is full. */
          }
        }
        failures = 0;
      } catch {
        if (alive && !controller.signal.aborted) {
          setError(
            "No pudimos actualizar. Se conserva el último dato disponible; revisa tu conexión.",
          );
          failures++;
        }
      } finally {
        busy = false;
        if (alive) {
          setLoading(false);
          timer = setTimeout(run, Math.min(interval * 2 ** failures, 300000));
        }
      }
    };
    const resume = () => {
      clearTimeout(timer);
      void run();
    };
    void run();
    window.addEventListener("online", resume);
    document.addEventListener("visibilitychange", resume);
    return () => {
      alive = false;
      controller.abort();
      clearTimeout(timer);
      window.removeEventListener("online", resume);
      document.removeEventListener("visibilitychange", resume);
    };
  }, [url, interval, enabled, refresh]);
  return { data, error, loading, reload: () => setRefresh((x) => x + 1) };
}
