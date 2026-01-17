
import { useReactToPrint } from "react-to-print";


// Simple mobile detection
const isMobile = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
// const isMobileScreen = () => window.innerWidth <= 868;

export const usePrintTemplate = (printRef) => {
  const handlePrintOrPDF = async () => {
    const element = printRef.current;
    if (!element) return;

    if (isMobile()) {
      // MOBILE: save as PDF image
      print(element)
    //   const canvas = await html2canvas(element, { scale: 2 });
    //   const imgData = canvas.toDataURL("image/png");
    //   const pdf = new jsPDF("p", "mm", "a4");
    //   const pdfWidth = 210;
    //   const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    //   pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    //   pdf.save(`Prescription_${new Date().toISOString()}.pdf`);
    } else {
      // DESKTOP: print dialog
      reactPrint();
    }
  };

  const reactPrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Prescription",
    pageStyle: `
      @page {
        size: A4;
        margin: 10mm;
        overflow: hidden;
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
        max-height: 297mm;
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

  return handlePrintOrPDF;
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



