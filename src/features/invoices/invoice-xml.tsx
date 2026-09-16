"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/dialog";
import { getInvoiceXml } from "@/services/invoices";

type XmlState =
  | { status: "loading" }
  | { status: "ready"; xml: string }
  | { status: "error" };

const COPIED_FEEDBACK_MS = 2000;

interface InvoiceXmlViewerProps {
  invoiceId: string;
  /** Printed number, for the dialog title. */
  number: string;
}

/**
 * "Ver XML" and the dialog it opens.
 *
 * The request is handled here rather than with `use()` and a Suspense boundary,
 * as the record details do, because a failure has to stay inside the dialog: a
 * thrown promise would reach the route's error boundary and replace the invoice
 * list with an error page, over a document the user only asked to preview.
 */
export function InvoiceXmlViewer({ invoiceId, number }: InvoiceXmlViewerProps) {
  const [state, setState] = useState<XmlState | null>(null);
  const [copied, setCopied] = useState(false);
  // Closing the dialog must also discard an answer that is still on its way,
  // or a slow request would reopen it.
  const requestId = useRef(0);

  useEffect(() => {
    if (!copied) return;

    const timer = setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS);
    return () => clearTimeout(timer);
  }, [copied]);

  function open() {
    const id = ++requestId.current;
    setCopied(false);
    setState({ status: "loading" });

    getInvoiceXml(invoiceId).then(
      (xml) => {
        if (requestId.current === id) setState({ status: "ready", xml });
      },
      () => {
        if (requestId.current === id) setState({ status: "error" });
      },
    );
  }

  function close() {
    requestId.current++;
    setState(null);
  }

  async function copy(xml: string) {
    try {
      await navigator.clipboard.writeText(xml);
      setCopied(true);
    } catch {
      // The clipboard is denied outside a secure context; the XML is on screen
      // and selectable either way, so there is nothing to report.
    }
  }

  return (
    <>
      <Button variant="secondary" onClick={open}>
        Ver XML
      </Button>
      {state && (
        <Modal open size="lg" onClose={close} eyebrow={`Factura ${number}`} title="XML del comprobante">
          {state.status === "loading" && (
            <div role="status" className="h-64 animate-pulse rounded-md bg-secondary">
              <span className="sr-only">Cargando XML…</span>
            </div>
          )}

          {state.status === "error" && (
            <p className="text-[14.5px] text-paragraph">
              No se pudo cargar el XML. Inténtalo de nuevo.
            </p>
          )}

          {state.status === "ready" && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-end gap-3">
                <span aria-live="polite" className="text-[12.5px] font-medium text-paragraph">
                  {copied && "Copiado"}
                </span>
                <Button variant="secondary" onClick={() => copy(state.xml)}>
                  Copiar
                </Button>
              </div>
              <pre className="overflow-x-auto rounded-md bg-secondary p-4 font-mono text-[12.5px] leading-relaxed text-headline">
                {state.xml}
              </pre>
            </div>
          )}
        </Modal>
      )}
    </>
  );
}
