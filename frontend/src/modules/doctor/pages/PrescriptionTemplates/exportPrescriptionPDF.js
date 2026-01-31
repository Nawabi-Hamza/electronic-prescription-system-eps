import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function exportPrescriptionPDF(ref) {
  const canvas = await html2canvas(ref.current, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
  });

  const img = canvas.toDataURL("image/png");

  const timestamp = new Date().toISOString();

  const pdf = new jsPDF("p", "mm", "a4");
  pdf.addImage(img, "PNG", 0, 0, 210, 297);
  pdf.save(`prescription-${timestamp}.pdf`);
}
