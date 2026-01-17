
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













// import { useReactToPrint } from "react-to-print";
// import html2pdf from "html2pdf.js";

// // Simple mobile detection
// const isMobile = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// export const usePrintTemplate = (printRef) => {
//   const handlePrintOrPDF = () => {
//     const element = printRef;
//     if (!element) return;

//     if (isMobile()) {
//       // MOBILE: Save as PDF
//       const opt = {
//         margin: 12, // mm
//         filename: `Prescription_${new Date().toISOString()}.pdf`,
//         image: { type: "jpeg", quality: 0.98 },
//         html2canvas: { scale: 2, useCORS: true },
//         jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
//       };
//       html2pdf().set(opt).from(element).save();
//     } else {
//       // DESKTOP: Use react-to-print
//       reactPrint();
//     }
//   };

//   const reactPrint = useReactToPrint({
//     contentRef: printRef,
//     documentTitle: "Prescription",
//     pageStyle: `
//       @page {
//         size: A4;
//         margin: 10mm;
//       }

//       body {
//         font-family: sans-serif;
//         -webkit-print-color-adjust: exact;
//         print-color-adjust: exact;
//         margin: 0;
//         padding: 0;
//         background: white;
//       }
      
//       .prescription-area {
//         width: 210mm;
//         min-height: 297mm;
//         padding: 12mm;
//         margin: 0 auto;
//         box-sizing: border-box;
//         background: white;
//       }

//       .ql-editor {
//         white-space: normal !important;
//         word-break: break-word !important;
//         overflow-wrap: break-word !important;
//         max-width: 100% !important;
//       }

//       /* hide buttons in print */
//       .print-hidden {
//         display: none !important;
//       }
//     `,
//   });

//   return handlePrintOrPDF;
// };

  

// export const usePrintTemplate = (printRef) => {
//   return useReactToPrint({
//     contentRef: printRef,
//     documentTitle: "Prescription",
//     pageStyle: `
//       @page {
//         size: A4;
//         margin: 10mm;
//       }

//       body {
//         font-family: sans-serif;
//         -webkit-print-color-adjust: exact;
//         print-color-adjust: exact;
//         margin: 0;
//         padding: 0;
//         background: white;
//       }
      
//       .prescription-area {
//         width: 210mm;
//         min-height: 297mm;
//         padding: 12mm;
//         margin: 0 auto;
//         box-sizing: border-box;
//         background: white;
//       }

//       .ql-editor {
//         white-space: normal !important;
//         word-break: break-word !important;
//         overflow-wrap: break-word !important;
//         max-width: 100% !important;
//       }

//       /* hide buttons in print */
//       .print-hidden {
//         display: none !important;
//       }
//     `,
//   });
// };



