"use client";
export default function ErrorBoundary({ reset }: { reset: () => void }) {
  return (
    <main className="loading-screen">
      <h1>No pudimos abrir esta vista</h1>
      <p>
        Tus datos guardados siguen en el dispositivo. Intenta volver a cargar la
        pantalla.
      </p>
      <button onClick={reset}>Intentar de nuevo</button>
    </main>
  );
}
