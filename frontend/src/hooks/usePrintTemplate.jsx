// hooks/usePrintTemplate.js
import { useReactToPrint } from "react-to-print";

export const usePrintTemplate = (printRef) => {
  return useReactToPrint({
    contentRef: printRef, // ✅ REQUIRED in v3+
    documentTitle: "Prescription",
    pageStyle: `
      @page {
        size: A4;
        margin: 12mm;
      }

      body {
        font-family: sans-serif;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        background: white;
        padding: 25px;
      }

      .print\\:hidden {
        display: none !important;
      }

      .print\\:block {
        display: block !important;
      }

      .ql-editor {
        white-space: normal !important;
        word-break: break-word !important;
        overflow-wrap: break-word !important;
      }
    `,
  });
};
