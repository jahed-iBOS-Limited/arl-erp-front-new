import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

export const useBluePillInvoiceHandler = () => {
  const printRefBluePill = useRef();

  const handleInvoicePrintBluePill = useReactToPrint({
    content: () => printRefBluePill.current,
    documentTitle: "salesInvoice",
    pageStyle:
      "@media print{body { -webkit-print-color-adjust: exact; margin: 0mm;}@page {size: portrait ! important}}",
  });

  return { handleInvoicePrintBluePill, printRefBluePill };
};

export const useCementInvoicePrintHandler = () => {
  const printRefCement = useRef();

  const handleInvoicePrintCement = useReactToPrint({
    content: () => printRefCement.current,
    documentTitle: "salesInvoice",
    pageStyle:
      "@media print{body { -webkit-print-color-adjust: exact; margin: 0mm;}@page {size: portrait ! important}}",
  });

  return { handleInvoicePrintCement, printRefCement };
};

export const usePolyFibreInvoicePrintHandler = () => {
  const printRefPolyFibre = useRef();

  const handleInvoicePrintPolyFibre = useReactToPrint({
    content: () => printRefPolyFibre.current,
    documentTitle: "salesInvoice",
    pageStyle:
      "@media print{body { -webkit-print-color-adjust: exact; margin: 0mm;}@page {size: portrait ! important}}",
  });

  return { handleInvoicePrintPolyFibre, printRefPolyFibre };
};
