import React, { useEffect, useRef, useState } from "react";
import ImageViewer from "../../../../componenets/ImageViewer";
import "react-quill/dist/quill.snow.css";
import "./Style.css";
import { btnStyle, dropdownStyle, inputStyle, labelStyle, tableStyles } from "../../../../styles/componentsStyle";
import SectionContainer from "../../../../componenets/SectionContainer";
import ReactQuill from "react-quill";
import CreatableSelect from "react-select/creatable";
import { Printer } from "lucide-react";
import { dosageOptions, medicineForms, timeOptions, numberOptions } from "./data";
import { CustomeFooter } from "./Footers";
import { SimpleBody } from "./Bodys";
import { PatientDetailsFields } from "./PatientDetailsFields";
import { usePrintTemplate } from "../../../../hooks/usePrintTemplate";

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
const formatMonthDay = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "__________";

/* ---------- Main Component ---------- */
export default function ModernTemplate({ doctor, medicines }) {
  const { doctor_name, lastname, clinic_name, name_prefex, clinic_logo, signature_logo, registration_number, description, addresses, phone, } = doctor || {};

  const logoUrl = clinic_logo ? `/uploads/clinic_logo/${clinic_logo}` : null;
  const signatureUrl = signature_logo ? `/uploads/doctor_signatures/${signature_logo}` : null;

  const [medicineSearch, setMedicineSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState("");
  const [nextVisit, setNextVisit] = useState(isoToday());
  const [content, setContent] = useState("");

    const [prescriptionItems, setPrescriptionItems] = useState([]);
  

  // Get bill number from localStorage or default
  const [billNumber, setBillNumber] = React.useState(() => {
    const stored = localStorage.getItem("billNumber");
    if (stored) return stored;
    const defaultBill = 1;
    localStorage.setItem("billNumber", defaultBill);
    return defaultBill;
  });


  useEffect(() => {
    if (!medicineSearch || medicineSearch.length < 2) return setSuggestions([]);
    const text = medicineSearch.toLowerCase();
    setSuggestions(
      medicines
        .filter((m) => m.name.toLowerCase().includes(text) || (m.brand_name && m.brand_name.toLowerCase().includes(text)))
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

  return (
    <div className="text-black">
      <div className="flex justify-end mb-4 print:hidden">
        <button onClick={handleUpdateAndPrint} className={`${btnStyle.filled} fixed bottom-20 right-4 xl:right-56 flex gap-1 items-center z-10`}>
          <Printer size={18} /> Print
        </button>
      </div>

      <div ref={printRef} className="prescription-area print-area bg-white p-2 rounded ">
        <div className="h-0 print:h-full">
          <Header
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
          <div className="w-full md:w-[30%] print:w-[30%] bg-sky-50 p-2 rounded">
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
          <div className="w-full md:w-[70%] bg-white print:w-[70%] overflow-auto">
            <SimpleBody
              medicineSearch={medicineSearch}
              setMedicineSearch={setMedicineSearch}
              suggestions={suggestions}
              setSuggestions={setSuggestions}
              height={"min-h-[61vh]"}
              setMed={setPrescriptionItems}

            />
          </div>
        </div>


        <div className="h-0 print:h-full">
          <CustomeFooter signatureUrl={signatureUrl} doctor_name={doctor_name} lastname={lastname} addresses={addresses} />
        </div>
      </div>
    </div>
  );
}


function Header({ billNumber, logoUrl, name_prefex, doctor_name, lastname, clinic_name, registration_number, description, phone, patientName, patientAge, patientGender, nextVisit }) {

  // Compute next visit date if not provided
  const computeNextVisit = () => {
    if (nextVisit) return nextVisit;
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
    return nextMonth.toISOString().split("T")[0];
  };

  const displayNextVisit = computeNextVisit();

  return (
    <div id="header-container">
      <div className="flex items-center justify-center">
        <div className="w-32 h-32 rounded overflow-hidden flex items-center justify-center">
          {logoUrl ? (
            <ImageViewer imagePath={logoUrl} alt="Clinic Logo" className="w-full object-contain" showPreview={false} />
          ) : (
            <span className="text-xs text-gray-400">No Logo</span>
          )}
        </div>

        <div className="flex-1 text-center px-4">
          <h1 className="text-3xl font-bold uppercase tracking-wide">
            {name_prefex} {doctor_name} {lastname}
          </h1>
          <p className="text-lg font-semibold">{clinic_name}</p>
          <p className="text-sm mt-1">Reg. No: {registration_number}</p>
          {description && <p className="text-xs mt-2 italic text-gray-600">{description}</p>}
        </div>

        <div>
          <p>Phone: {phone}</p>
          <p>Bill No: {billNumber}</p>
          <p>Date: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="border-y p-2 px-4 mt-2 hidden print:block" id="patient_info">
        <div className="grid grid-cols-5 text-sm justify-between">
          <span className="col-span-2"><strong>Name:</strong> {patientName || "___________________________"}</span>
          <span><strong>Age:</strong> {patientAge || "____________"}</span>
          <span><strong>Gender:</strong> {patientGender || "_________"}</span>
          <span><strong>Next Visit:</strong> {formatMonthDay(displayNextVisit)}</span>
        </div>
      </div>
    </div>
  );
}
