import React, { useEffect, useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { btnStyle } from "../../../../styles/componentsStyle";
import { Printer } from "lucide-react";
import { SimpleFooter } from "./Footers";
import { SimpleHeader } from "./Headers";
import { SimpleBody } from "./Bodys";
import { PatientDetailsFields } from "./PatientDetailsFields";
import { usePrintTemplate } from "../../../../hooks/usePrintTemplate";

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

  return (
    <div className="text-black">
      {/* PRINT BUTTON */}
      <button
        onClick={printTemplate}
        className={`${btnStyle.filled} fixed bottom-20 flex gap-1 items-center z-10 print:hidden`}
      >
        <Printer size={18} /> Print
      </button>

      {/* PRINT AREA */}
      <div ref={printRef} id="prescription-area">
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
