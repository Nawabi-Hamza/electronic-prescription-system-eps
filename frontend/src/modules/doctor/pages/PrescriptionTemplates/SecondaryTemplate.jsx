import React, { useEffect, useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
// import "./Style.css";
import { btnStyle } from "../../../../styles/componentsStyle";
import ReactQuill from "react-quill";
import { Printer } from "lucide-react";
import { usePrintTemplate } from "../../../../hooks/usePrintTemplate";
import { SimpleHeader } from "./Headers";
import { PatientDetailsFields } from "./PatientDetailsFields";
import { SimpleBody } from "./Bodys";
import ImageViewer from "../../../../componenets/ImageViewer";
import { CustomeFooter } from "./Footers";

/* ---------- Quill config ---------- */
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["clean"],
  ],
};
const formats = ["header", "bold", "italic", "underline", "list", "bullet", "align"];

/* ---------- Helpers ---------- */
const isoToday = () => new Date().toISOString().split("T")[0];

/* ---------- Main Component ---------- */
export default function SecondaryTemplate({ doctor, medicines }) {
  const {
    doctor_name,
    lastname,
    clinic_name,
    name_prefex,
    signature_logo,
    registration_number,
    description,
    addresses,
    phone,
  } = doctor || {};

  const signatureUrl = signature_logo
    ? `/uploads/doctor_signatures/${signature_logo}`
    : null;

  const [medicineSearch, setMedicineSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState("");
  const [nextVisit, setNextVisit] = useState(isoToday());
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!medicineSearch || medicineSearch.length < 2) return setSuggestions([]);
    const text = medicineSearch.toLowerCase();
    setSuggestions(
      medicines
        .filter(
          (m) =>
            m.name.toLowerCase().includes(text) ||
            (m.brand_name && m.brand_name.toLowerCase().includes(text))
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
        className={`${btnStyle.filled} fixed bottom-20 right-4 md:right-56 flex gap-1 items-center z-10 print:hidden`}
      >
        <Printer size={18} /> Print
      </button>

      {/* PRESCRIPTION CONTAINER */}
      <div ref={printRef} className="print-area bg-white p-2 rounded" id="prescription-area">
        {/* HEADER */}
        <div className="hidden print:block">
          <SimpleHeader
            logoUrl={null}
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
        {/* PATIENT DETAILS */}
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

        {/* MAIN SECTION: Quill Left 30%, Body Right 70% */}
        <div className="flex flex-col md:flex-row print:flex-row gap-2 mt-2">
          {/* Quill Editor */}
          <div className="w-full md:w-[30%] print:w-[30%] bg-amber-50 p-2 rounded">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              formats={formats}
              className="print:hidden h-auto"
            />
            {/* Print HTML */}
            <div
              className="hidden print:block p-2"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>

          {/* Body Table */}
          <div className="w-full md:w-[70%] print:w-[70%] overflow-auto">
            <SimpleBody
              medicineSearch={medicineSearch}
              setMedicineSearch={setMedicineSearch}
              suggestions={suggestions}
              setSuggestions={setSuggestions}
              height={"min-h-[61vh]"}
            />
          </div>
        </div>

        {/* FOOTER */}
        <CustomeFooter
          signatureUrl={signatureUrl}
          doctor_name={doctor_name}
          lastname={lastname}
          addresses={addresses}
        />
      </div>
    </div>
  );
}

