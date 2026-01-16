import React, { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { btnStyle } from "../../../../styles/componentsStyle";
import { Printer } from "lucide-react";
import { SimpleFooter } from "./Footers";
import { SimpleHeader } from "./Headers";
import { SimpleBody } from "./Bodys";
import { PatientDetailsFields } from "./PatientDetailsFields";


/* ---------- Helpers ---------- */
const isoToday = () => new Date().toISOString().split("T")[0];

/* ---------- Main Component ---------- */
export default function SimpleTemplate({ doctor, medicines }) {
  const { doctor_name, lastname, clinic_name, name_prefex, clinic_logo, signature_logo, registration_number, description, addresses, phone, } = doctor || {};
  const logoUrl = clinic_logo ? `/uploads/clinic_logo/${clinic_logo}` : null;
  const signatureUrl = signature_logo ? `/uploads/doctor_signatures/${signature_logo}` : null;
  // console.log(medicines)
  const [medicineSearch, setMedicineSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState("");
  const [nextVisit, setNextVisit] = useState(isoToday());

  useEffect(() => {
    if (!medicineSearch || medicineSearch.length < 2) return setSuggestions([]);
    const text = medicineSearch.toLowerCase();
    setSuggestions(
      medicines
        .filter((m) => m.name.toLowerCase().includes(text) || (m.brand_name && m.brand_name.toLowerCase().includes(text)))
        .slice(0, 15)
    );
  }, [medicineSearch, medicines]);

  const printPage = () => {
    const el = document.getElementById("prescription-area");
    if (!el) return;

    const styles = Array.from(document.styleSheets)
      .map((s) => {
        try {
          return Array.from(s.cssRules).map((r) => r.cssText).join("\n");
        } catch {
          return "";
        }
      })
      .join("\n");

    const printCSS = `
      ${styles}
      @page{ size: A4; margin: 12mm; }
      body{ font-family: sans-serif; -webkit-print-color-adjust: exact; padding: 12mm; padding-bottom: 0mm; }
      .hidden{ display:none !important; }
      .print\\:block{ display:block !important; }
      .print\\:hidden{ display:none !important; }

      /* Quill wrap + print alignment */
      .ql-editor{ white-space: normal !important; word-break: break-word !important; overflow-wrap: break-word !important; max-width:100% !important;}
      .ql-align-center{ text-align:center !important; }
      .ql-align-right{ text-align:right !important; }
      .ql-align-justify{ text-align:justify !important; }

      /* ensure content-sidebar wraps extremely long strings */
      #content-sidebar, #content-sidebar * { white-space: normal !important; word-break: break-all !important; overflow-wrap: break-word !important; }
    `;

    const w = window.open("", "_blank", "width=900,height=1200");
    w.document.write(`<html><head><title>Prescription</title><style>${printCSS}</style></head><body>${el.innerHTML}</body></html>`);
    w.document.close();
    w.focus();
    setTimeout(() => {
      w.print();
      w.close();
    }, 400);
  };

  return (
    <div className="text-black">
      <div className="flex justify-end mb-4 print:hidden">
        <button onClick={printPage} className={`${btnStyle.filled} fixed bottom-20 flex gap-1 items-center z-10`}>
          <Printer size={18} /> Print
        </button>
      </div>

      <div id="prescription-area">
        <div className="hidden print:block">
          <SimpleHeader
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

        {/* Patient Details Fields */}
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

        <div id="main-section" className="overflow-hidden md:grid-cols-3 gap-2 mt-2 bg-white p-2 rounded">
          <div className="overflow-auto">
            <SimpleBody
              medicineSearch={medicineSearch}
              setMedicineSearch={setMedicineSearch}
              suggestions={suggestions}
              setSuggestions={setSuggestions}
            />
          </div>
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




