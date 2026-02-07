import React, { useEffect, useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { btnStyle } from "../../../../styles/componentsStyle";
import { Printer } from "lucide-react";

import { SimpleFooter } from "./Footers";
import { SimpleHeader } from "./Headers";
import { SimpleBody } from "./Bodys";
import { PatientDetailsFields } from "./PatientDetailsFields";
import { usePrintTemplate } from "../../../../hooks/usePrintTemplate";

// import { exportPrescriptionPDF } from "./exportPrescriptionPDF";
// import PrescriptionPrintA4 from "./PrescriptionPrintA4";
import { exportPrescriptionPDF } from "./exportPrescriptionPDF";
import PrescriptionPrintA4 from "./SimplePrescriptionA4";
import { getPrescriptionNumber, nextBillNumber } from "../../../../utils/offlineDB";
// import "./PDF.css"


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
    description,
    addresses,
    phone,
  } = doctor || {};

  const logoUrl = clinic_logo ? `/uploads/clinic_logo/${clinic_logo}` : null;
  const signatureUrl = signature_logo
    ? `/uploads/doctor_signatures/${signature_logo}`
    : null;

    // console.log(signatureUrl)
  
  const [medicineSearch, setMedicineSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState("");
  const [nextVisit, setNextVisit] = useState(isoToday());

  const [prescriptionItems, setPrescriptionItems] = useState([]);

  const [download, setDownload] = useState(false)

  const [billNumber, setBillNumber] = useState();

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
            m.brand_name?.toLowerCase().includes(text)
        )
        .slice(0, 15)
    );
  }, [medicineSearch, medicines]);

  useEffect(() => {
      getPrescriptionNumber({ seter: setBillNumber })
   },[])

  /* ---------- DESKTOP PRINT ---------- */
  const printRef = useRef(null);
  const printTemplate = usePrintTemplate(printRef);

  const handleUpdateAndPrint = async() => {
    printTemplate();
    await nextBillNumber({ seter: setBillNumber })
  };

  /* ---------- PDF EXPORT ---------- */
  const pdfRef = useRef(null);

  return (
    <div className="text-black ">
      {/* DESKTOP PRINT */}
      <button
        onClick={handleUpdateAndPrint}
        className={`${btnStyle.filled} hidden md:fixed right-[10%] bottom-20 md:flex gap-1 items-center z-10 print:hidden`}
      >
        <Printer size={18} /> Print
      </button>

      {/* MOBILE SAVE PDF */}
      {!download ?
        <button
          onClick={async() => {
            setDownload(true)
            await exportPrescriptionPDF(pdfRef)
            nextBillNumber({ seter: setBillNumber })
            setDownload(false)
          }}
          className={`${btnStyle.filled} flex items-center gap-2 md:hidden fixed right-4 bottom-20 z-10`}
        >
          <Printer size={18} /> Save PDF
        </button>
        : <button className={`${btnStyle.filled} flex items-center gap-2 md:hidden fixed right-4 bottom-20 z-10`}>Downloading...</button>
      }

      {/* SCREEN + DESKTOP PRINT AREA */}
      <div ref={printRef} className="prescription-area">
        <div className="hidden print:block">
          <SimpleHeader
            billNumber={billNumber}
            name_prefex={name_prefex}
            doctor_name={doctor_name}
            lastname={lastname}
            clinic_name={clinic_name}
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
            onChange={setPrescriptionItems}
            setMed={setPrescriptionItems}
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

      {/* OFF-SCREEN PDF TEMPLATE */}
      <div style={{ position: "fixed", left: "-9999px", top: '-9999px', }}>
        <PrescriptionPrintA4
          ref={pdfRef}
          billNumber={billNumber}
          date={new Date().toLocaleDateString()}
          doctor={{
            prefix: name_prefex,
            name: doctor_name,
            lastname,
            clinic: clinic_name,
            description,
            phone,
          }}
          patient={{
            name: patientName,
            age: patientAge,
            gender: patientGender,
            nextVisit,
          }}
          medicines={prescriptionItems}
          logoUrl={logoUrl}
          signatureUrl={signatureUrl}
          footer={{
            address: addresses?.[0]?.address,
            province: addresses?.[0]?.province,
            country: addresses?.[0]?.country,
            district: addresses?.[0]?.district,
            room: addresses?.[0]?.room_number,
            floor: addresses?.[0]?.floor_number,
          }}
        />
      </div>
    </div>
  );
}
