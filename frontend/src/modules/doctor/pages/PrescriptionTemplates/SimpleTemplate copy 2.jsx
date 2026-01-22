import React, { useEffect, useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { btnStyle } from "../../../../styles/componentsStyle";
import { Printer } from "lucide-react";
import { SimpleFooter } from "./Footers";
import { SimpleHeader } from "./Headers";
import { SimpleBody } from "./Bodys";
import { PatientDetailsFields } from "./PatientDetailsFields";
import { usePrintTemplate } from "../../../../hooks/usePrintTemplate";
import "./SimpleTemplate.css"
import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"


/* ---------- Helpers ---------- */
const isoToday = () => new Date().toISOString().split("T")[0];

export default function SimpleTemplate({ doctor, medicines }) {
  const {
    doctor_name,
    lastname,
    clinic_name,
    name_prefex,
    clinic_logo,
    signature_logo,
    registration_number,
    description,
    addresses,
    phone,
  } = doctor || {};

  const logoUrl = clinic_logo ? `/uploads/clinic_logo/${clinic_logo}` : null;
  const signatureUrl = signature_logo
    ? `/uploads/doctor_signatures/${signature_logo}`
    : null;

  const [medicineSearch, setMedicineSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState("");
  const [nextVisit, setNextVisit] = useState(isoToday());
  // Get bill number from localStorage or default
  const [billNumber, setBillNumber] = React.useState(() => {
      const stored = localStorage.getItem("billNumber");
      if (stored) return stored;
      const defaultBill = 1;
      localStorage.setItem("billNumber", defaultBill);
      return defaultBill;
  });
  

  useEffect(() => {
    if (!medicineSearch || medicineSearch.length < 2) {
      setSuggestions([]);
      return;
    }
    const text = medicineSearch.toLowerCase();
    setSuggestions(
      medicines
        .filter(
          (m) =>
            m.name.toLowerCase().includes(text) ||
            (m.brand_name &&
              m.brand_name.toLowerCase().includes(text))
        )
        .slice(0, 15)
    );
  }, [medicineSearch, medicines]);

  /* ---------- PRINT ---------- */
  const printRef = useRef(null);
  const printTemplate = usePrintTemplate(printRef);
    const handleUpdateAndPrint = function(){
        const stored = localStorage.getItem("billNumber");
        const defaultBill = Number(stored) + 1;
        localStorage.setItem("billNumber", defaultBill);
        setBillNumber(defaultBill)
        printTemplate()
  }


  const handleSavePDF = async () => {
    const element = printRef.current;
    if (!element) return;

    // Force print styles
    element.classList.add("print-force");

    const canvas = await html2canvas(element, {
      scale: 2, // high quality
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight =
      (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("prescription.pdf");

    element.classList.remove("print-force");
  };


  return (
    <div className="text-black ">
      {/* PRINT BUTTON */}
      <button
        onClick={handleUpdateAndPrint}
        className={`${btnStyle.filled} fixed right-4 xl:right-56 bottom-20 flex gap-1 items-center z-10 print:hidden`}
      >
        <Printer size={18} /> Print
      </button>
      <button
        onClick={handleSavePDF}
        className={`${btnStyle.filled} fixed right-4 xl:right-56 bottom-0 flex gap-1 items-center z-10 print:hidden`}
      >
        <Printer size={18} /> PDF
      </button>


      {/* PRINT AREA */}
      <div ref={printRef} className="prescription-area">
        <div className="hidden print:block">
          <SimpleHeader
            billNumber={billNumber}
            logoUrl={logoUrl}
            name_prefex={name_prefex}
            doctor_name={doctor_name}
            lastname={lastname}
            clinic_name={clinic_name}
            registration_number={registration_number}
            description={description}
            phone={phone}
            patientName={patientName}
            patientAge={patientAge}
            patientGender={patientGender}
            nextVisit={nextVisit}
          />
        </div>

        <PatientDetailsFields
          patientName={patientName}
          setPatientName={setPatientName}
          patientAge={patientAge}
          setPatientAge={setPatientAge}
          patientGender={patientGender}
          setPatientGender={setPatientGender}
          nextVisit={nextVisit}
          setNextVisit={setNextVisit}
        />

        <div className="mt-2 bg-white p-2 rounded">
          <SimpleBody
            medicineSearch={medicineSearch}
            setMedicineSearch={setMedicineSearch}
            suggestions={suggestions}
            setSuggestions={setSuggestions}
          />
        </div>

        <div className="hidden print:block">
          <SimpleFooter
            signatureUrl={signatureUrl}
            doctor_name={doctor_name}
            lastname={lastname}
            addresses={addresses}
          />
        </div>
      </div>
    </div>
  );
}
