"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

/**
 * Sits inside the dashboard layout, so the shell stays usable when a page fails
 * to load -- typically because the API is down.
 */
export default function DashboardError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex flex-col items-start gap-4 rounded-lg border-[1.5px] border-stroke bg-card p-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-[15px] font-semibold text-headline">No se pudo cargar la información</h2>
        <p className="text-[14.5px]">Verifica que el servidor esté disponible e inténtalo de nuevo.</p>
      </div>
      <Button variant="secondary" onClick={retry}>
        Reintentar
      </Button>
    </section>
  );
}
