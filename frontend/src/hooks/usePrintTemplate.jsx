import { useReactToPrint } from "react-to-print";

export const usePrintTemplate = (printRef) => {
  return useReactToPrint({
    contentRef: printRef,
    documentTitle: "Prescription",
    pageStyle: `
      @page {
        size: A4;
        margin: 10mm;
      }

      body {
        font-family: sans-serif;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        margin: 0;
        padding: 0;
        background: white;
      }
      
      .prescription-area {
        width: 210mm;
        min-height: 297mm;
        padding: 12mm;
        margin: 0 auto;
        box-sizing: border-box;
        background: white;
      }

      .ql-editor {
        white-space: normal !important;
        word-break: break-word !important;
        overflow-wrap: break-word !important;
        max-width: 100% !important;
      }

      /* hide buttons in print */
      .print-hidden {
        display: none !important;
      }
    `,
  });
};







// // hooks/usePrintTemplate.js
// import { useReactToPrint } from "react-to-print";

// export const usePrintTemplate = (printRef) => {
//   return useReactToPrint({
//     contentRef: printRef, // ✅ REQUIRED in v3+
//     documentTitle: "Prescription",
//     pageStyle: `
//       @page {
//         size: A4;
//       }

//       body {
//         font-family: sans-serif;
//         -webkit-print-color-adjust: exact;
//         print-color-adjust: exact;
//         background: white;
//         padding: 25px;
//       }

//       .print\\:hidden {
//         display: none !important;
//       }

//       .print\\:block {
//         display: block !important;
//       }

//       .ql-editor {
//         white-space: normal !important;
//         word-break: break-word !important;
//         overflow-wrap: break-word !important;
//       }
//     `,
//   });
// };
