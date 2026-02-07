export function PrintTemplate({ printAreaId = "", width="900", height="1200"}){
    const content = document.getElementById(printAreaId);

    if (!content) return;

    // Clone existing Tailwind styles
    const styles = Array.from(document.styleSheets)
      .map((sheet) => {
        try {
          return Array.from(sheet.cssRules)
            .map((rule) => rule.cssText)
            .join("\n");
        } catch (e) {
          console.log(e)
          return "";
        }
      })
      .join("\n");

    const printWindow = window.open("", "_blank", `width=${width},height=${height}`);

    printWindow.document.write(`
      <html>
        <head>
          <title>Prescription</title>
          <style>
            ${styles}

            /* Ensure clean A4 print */
            @page {
              size: A4;
              margin: 12mm;
            }

            /* Fix flex & grid issues in print */
            .flex { display: flex !important; }
            .grid { display: grid !important; }
            .hidden, .print\\:hidden { display: none !important; }

            /* Ensure table prints clean */
            table { width: 100%; border-collapse: collapse !important; }
            th, td { border: 1px solid black !important; padding: 6px !important; }

            /* Ensure images print correctly */
            img, .object-contain {
              max-width: 100% !important;
              max-height: 100% !important;
              object-fit: contain !important;
            }

            /* Fix clipping inside A4 */
            body { font-family: sans-serif; -webkit-print-color-adjust: exact; padding: 20px; }
          </style>
        </head>
        <body>${content.innerHTML}</body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 400);
  };
