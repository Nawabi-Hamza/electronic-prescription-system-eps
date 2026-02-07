import React, { useEffect, useRef, useState } from "react";
import ImageViewer from "../../../../componenets/ImageViewer";
import "react-quill/dist/quill.snow.css";
// import "./Style.css"; 
import { btnStyle,  } from "../../../../styles/componentsStyle";
import SectionContainer from "../../../../componenets/SectionContainer";
import CreatableSelect from "react-select/creatable";
import { Printer } from "lucide-react";
import { CustomeFooter } from "./Footers";
import { SimpleBody } from "./Bodys";
import { PatientDetailsFields } from "./PatientDetailsFields";
import { usePrintTemplate } from "../../../../hooks/usePrintTemplate";
import { INVESTIGATION_OPTIONS, SIGN_OPTIONS, SYMPTOM_OPTIONS } from "./data";
import { getPrescriptionNumber, nextBillNumber } from "../../../../utils/offlineDB";
import { exportPrescriptionPDF } from "./exportPrescriptionPDF";
import PrescriptionPrintA4 from "./ClassicPrescriptionA4";


/* ---------- Helpers ---------- */
const isoToday = () => new Date().toISOString().split("T")[0];
const formatMonthDay = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "__________";

/* ---------- Main Component ---------- */
export default function ClassicTemplate({ doctor, medicines }) {
  const { doctor_name, lastname, clinic_name, name_prefex, clinic_logo, signature_logo, registration_number, description, addresses, phone, } = doctor || {};

  const logoUrl = clinic_logo ? `/uploads/clinic_logo/${clinic_logo}` : null;
  const signatureUrl = signature_logo ? `/uploads/doctor_signatures/${signature_logo}` : null;

  const [medicineSearch, setMedicineSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState("");
  const [nextVisit, setNextVisit] = useState(isoToday());
    const [download, setDownload] = useState(false)
  

    const [symptoms, setSymptoms] = useState([]);
    const [signs, setSigns] = useState([]);
    const [investigations, setInvestigations] = useState([]);

    const [prescriptionItems, setPrescriptionItems] = useState([]);

      // Get bill number from localStorage or default
    const [billNumber, setBillNumber] = useState();
    
    useEffect(() => {
        getPrescriptionNumber({ seter: setBillNumber })
    },[])
  


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
    const pdfRef = useRef(null);
    const printTemplate = usePrintTemplate(printRef);
    const handleUpdateAndPrint = async function(){
          printTemplate()
          await nextBillNumber({ seter: setBillNumber })
    }

  return (
    <div className="text-black">
      <div className="">
        <button onClick={handleUpdateAndPrint} className={`${btnStyle.filled} hidden md:fixed bottom-20 right-4 xl:right-56 md:flex gap-1 items-center z-10 print:hidden`}>
          <Printer size={18} /> Print
        </button>

          {/* MOBILE SAVE PDF */}
          {!download ?
            <button
              onClick={async() => {
                setDownload(true)
                await exportPrescriptionPDF(pdfRef)
                await nextBillNumber({ seter: setBillNumber })
                // toast.success("Prescription Downloaded.")
                setDownload(false)
              }}
              className={`${btnStyle.filled} flex items-center gap-2 md:hidden fixed right-4 bottom-20 z-10`}
            >
              <Printer size={18} /> Save PDF
            </button>
            : <button className={`${btnStyle.filled} flex items-center gap-2 md:hidden fixed right-4 bottom-20 z-10`}>Downloading...</button>
          }
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

            <div className="flex flex-col md:flex-row print:flex-row gap-2 mt-2">
                {/* MAIN SECTION: Quill Left 30%, Body Right 70% */}
                <div className="w-full md:w-[30%] print:w-[30%] bg-green-50 p-2 rounded space-y-4">

                    {/* SYMPTOMS */}
                    <div>
                        <label className="text-md font-semibold">Symptoms</label>
                        <CreatableSelect
                          isMulti
                          options={SYMPTOM_OPTIONS}
                          value={symptoms}
                          onChange={setSymptoms}
                          className="print:hidden"
                          placeholder="Add symptoms..."
                          />
                          <ul className="hidden print:block list-disc ml-5 text-sm">
                          {symptoms.map((s) => (
                              <li key={s.value}>{s.label}</li>
                          ))}
                        </ul>
                    </div>

                    {/* SIGNS */}
                    <div>
                        <label className="text-md font-semibold">Signs</label>
                        <CreatableSelect
                        isMulti
                        options={SIGN_OPTIONS}
                        value={signs}
                        onChange={setSigns}
                        className="print:hidden"
                        placeholder="Add signs..."
                        />
                        <ul className="hidden print:block list-disc ml-5 text-sm">
                        {signs.map((s) => (
                            <li key={s.value}>{s.label}</li>
                        ))}
                        </ul>
                    </div>

                    {/* INVESTIGATIONS */}
                    <div>
                        <label className="text-md font-semibold">Investigations</label>
                        <CreatableSelect
                        isMulti
                        options={INVESTIGATION_OPTIONS}
                        value={investigations}
                        onChange={setInvestigations}
                        className="print:hidden"
                        placeholder="Add labs / imaging..."
                        />
                        <ul className="hidden print:block list-disc ml-5 text-sm">
                        {investigations.map((i) => (
                            <li key={i.value}>{i.label}</li>
                        ))}
                        </ul>
                    </div>

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

        {/* </div> */}


        <div className="h-0 print:h-full">
          <CustomeFooter signatureUrl={signatureUrl} doctor_name={doctor_name} lastname={lastname} addresses={addresses} />
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
          sideContent={
               <div className="w-full p-2 space-y-4">
                  {/* Symptoms */}
                  <h2>Symptoms</h2>
                  <ul className=" ml-1 text-[10px]">
                    {symptoms.map((s) => (
                      <li key={s.value}>-{s.label}</li>
                    ))}
                  </ul>

                  {/* Signs */}
                  <h2>Signs</h2>
                  <ul className=" ml-1 text-[10px]">
                    {signs.map((s) => (
                      <li key={s.value}>-{s.label}</li>
                    ))}
                  </ul>

                  {/* Investigations */}
                  <h2>Investigations</h2>
                  <ul className=" ml-1 text-[10px]">
                    {investigations.map((i) => (
                      <li key={i.value}>-{i.label}</li>
                    ))}
                  </ul>
                </div>
          }
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
