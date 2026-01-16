import React, { useEffect, useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
import "./Style.css";
import { btnStyle } from "../../../../styles/componentsStyle";
import ReactQuill from "react-quill";
import { Printer } from "lucide-react";
import { usePrintTemplate } from "../../../../hooks/usePrintTemplate";
import { SimpleHeader } from "./Headers";
import { PatientDetailsFields } from "./PatientDetailsFields";
import { FooterWithSignature } from "./Footers";
import { SimpleBody } from "./Bodys";
import ImageViewer from "../../../../componenets/ImageViewer";

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
  const { doctor_name, lastname, clinic_name, name_prefex, signature_logo, registration_number, description, addresses, phone, } = doctor || {};

  const signatureUrl = signature_logo ? `/uploads/doctor_signatures/${signature_logo}` : null;

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
        .filter((m) => m.name.toLowerCase().includes(text) || (m.brand_name && m.brand_name.toLowerCase().includes(text)))
        .slice(0, 15)
    );
  }, [medicineSearch, medicines]);

    /* ---------- PRINT ---------- */
    const printRef = useRef(null);
    const printTemplate = usePrintTemplate(printRef);

  return (
    <div className="text-black">
      <div className="flex justify-end mb-4 print:hidden">
        <button
          onClick={printTemplate}
          className={`${btnStyle.filled} fixed bottom-20 right-4 md:right-56 flex gap-1 items-center z-10 print:hidden`}
        >
          <Printer size={18} /> Print
        </button>
      </div>

      <div ref={printRef} id="prescription-area">
        <div className="hidden print:block">
          <SimpleHeader
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

        <div
          id="main-section"
          className="flex flex-col md:flex-row print:flex-row gap-2 mt-2 bg-white p-2 rounded"
        >
          {/* Quill Editor — Left 30% in print */}
          <div className="md:w-[30%] print:w-[30%] bg-amber-50 p-2 rounded">
            {/* On screen: ReactQuill editor */}
            <ReactQuill theme="snow" value={content} onChange={setContent} modules={modules} formats={formats} className="print:hidden h-auto" />

            {/* On print: show content */}
            <div
              id="content-sidebar"
              className="hidden print:block p-2"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>

          {/* Body Table — Right 70% in print */}
          <div className="md:w-[70%] print:w-[70%] overflow-auto">
            <SimpleBody
              medicineSearch={medicineSearch}
              setMedicineSearch={setMedicineSearch}
              suggestions={suggestions}
              setSuggestions={setSuggestions}
            />
          </div>
        </div>



        <div className="opacity-0 print:opacity-100 print:block">
            <CustomeFooter
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



function CustomeFooter({ signatureUrl, doctor_name, lastname, addresses }) {
  return (
    <>
      <div className="flex justify-end">
        <div className="text-center">
          <div className="h-20 w-48 flex justify-center items-center">
            {signatureUrl ? <ImageViewer imagePath={signatureUrl} alt="Signature" className="h-full object-contain" showPreview={false} /> : <span className="text-xs text-gray-400">No Signature</span>}
          </div>
          <p className="border-t pt-1 font-semibold">Dr. {doctor_name} {lastname}</p>
        </div>
      </div>

      <div>
        {addresses?.length && 
          <div className="text-sm flex gap-1 mt-4 border-t-2 ">
            <p className="font-semibold">Address:</p>
            <p>{addresses[0]?.address}</p>
            <p>{addresses[0]?.province}, {addresses[0]?.country}</p>
            <p>District: {addresses[0]?.district}</p>
            <p>Room: {addresses[0]?.room_number}, Floor: {addresses[0]?.floor_number}</p>
          </div>
        }
        <p>
            &copy; All RIGHTS RESERVED BY: https://paikareps.com / SUPPORT: +93 771844770
        </p>
      </div>
    </>
  );
}