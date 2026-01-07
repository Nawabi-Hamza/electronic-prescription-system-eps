import React, { useEffect, useState } from "react";
import ImageViewer from "../../../../componenets/ImageViewer";
import "react-quill/dist/quill.snow.css";
import "./Style.css";
import { btnStyle, dropdownStyle, inputStyle, labelStyle, tableStyles } from "../../../../styles/componentsStyle";
import SectionContainer from "../../../../componenets/SectionContainer";
import ReactQuill from "react-quill";
import CreatableSelect from "react-select/creatable";
import { Printer } from "lucide-react";
import { dosageOptions, medicineForms, timeOptions, numberOptions } from "./data";

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
      body{ font-family: sans-serif; -webkit-print-color-adjust: exact; padding: 12mm; }
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
        <button onClick={printPage} className={`${btnStyle.filled} fixed bottom-10 flex gap-1 items-center z-10`}>
          <Printer size={18} /> Print
        </button>
      </div>

      <div id="prescription-area">
        <div className="hidden print:block">
          <Header
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

        <SectionContainer title="Patient Information Fields" className="bg-white print:hidden">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
            <Field label="Patient Name" className="md:col-span-2">
              <input className={inputStyle.primary} placeholder="Enter name..." value={patientName} onChange={(e) => setPatientName(e.target.value)} />
            </Field>

            <Field label="Age">
              <input className={inputStyle.primary} type="number" placeholder="Age" value={patientAge} onChange={(e) => setPatientAge(e.target.value)} />
            </Field>

            <Field label="Gender">
              <select className={dropdownStyle.base} value={patientGender} onChange={(e) => setPatientGender(e.target.value)}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </Field>

            <Field label="Next Visit">
              <input className={inputStyle.primary} type="date" value={nextVisit} onChange={(e) => setNextVisit(e.target.value)} />
            </Field>
          </div>
        </SectionContainer>

        <div id="main-section" className="grid overflow-hidden md:grid-cols-3 gap-2 mt-2 bg-white p-2 rounded">
          <div className="md:col-span-1 w-full bg-sky-50 p-2 rounded">
            <ReactQuill theme="snow" value={content} onChange={setContent} modules={modules} formats={formats} className="print:hidden h-auto" />
            <div id="content-sidebar" className="hidden print:block p-2 rounded">
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          </div>

          <div className="md:col-span-2 overflow-auto">
            <Body
              medicineSearch={medicineSearch}
              setMedicineSearch={setMedicineSearch}
              suggestions={suggestions}
              setSuggestions={setSuggestions}
            />
          </div>
        </div>

        <div className="hidden print:block">
          <Footer signatureUrl={signatureUrl} doctor_name={doctor_name} lastname={lastname} addresses={addresses} />
        </div>
      </div>
    </div>
  );
}

/* ---------- Small components (kept inline and compact) ---------- */

function Field({ label, children, className = "" }) {
  return (
    <div className={className}>
      <label className={labelStyle.primary}>{label}</label>
      <div>{children}</div>
    </div>
  );
}

function Header({ logoUrl, name_prefex, doctor_name, lastname, clinic_name, registration_number, description, phone, patientName, patientAge, patientGender, nextVisit }) {
  // Get bill number from localStorage or default
  const [billNumber, setBillNumber] = React.useState(() => {
    const stored = localStorage.getItem("billNumber");
    if (stored) return stored;
    const defaultBill = 1;
    localStorage.setItem("billNumber", defaultBill);
    return defaultBill;
  });

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
      <div className="md:flex items-center justify-center">
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

      <div className="border-y p-2 px-4 mt-2" id="patient_info">
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


// Updated selectStyles for smaller size
const smallSelectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: 24,         // smaller height
    height: 24,
    fontSize: 12,
    padding: "0 4px",
    borderRadius: 4
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "0 4px",
    height: 24
  }),
  indicatorsContainer: (base) => ({
    ...base,
    height: 24,
    padding: "0 2px"
  }),
  dropdownIndicator: (base) => ({
    ...base,
    padding: 2
  }),
  clearIndicator: (base) => ({
    ...base,
    padding: 2
  }),
  menu: (base) => ({ ...base, zIndex: 9999, fontSize: 12 })
};

function Body({ medicineSearch, setMedicineSearch, suggestions, setSuggestions }) {
  const [items, setItems] = useState([]);


  // Insert medicine — auto-fill if available
  const insertMedicine = (m) => {
    setItems((prev) => [
      ...prev,
      {
        id: m.id || Date.now(),
        name: m.name,
        brand_name: m.brand_name || "",
        form: m.form || "",
        dosage: m.dosage || "",
        number: m.number || "",
        time: m.time || ""
      }
    ]);
    setMedicineSearch("");
    setSuggestions([]);
  };

  const insertCustom = () => {
    if (!medicineSearch.trim()) return;
    insertMedicine({ id: Date.now(), name: medicineSearch.trim() });
  };

  const update = (i, field, val) => setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, [field]: val } : it)));
  const remove = (i) => setItems((prev) => prev.filter((_, idx) => idx !== i));



  return (
    <SectionContainer title="RX:" className="min-h-[58vh] shadow-none border-l border-slate-400 rounded-none">
      {/* Medicine Search */}
      <div className="mb-2 relative print:hidden">
        <input
          value={medicineSearch}
          onChange={(e) => setMedicineSearch(e.target.value)}
          placeholder="Type medicine name..."
          className={inputStyle.primary}
        />
        {(suggestions.length > 0 || medicineSearch.length >= 2) && (
          <div className="absolute w-full bg-white border rounded shadow-lg z-50 mt-1 max-h-60 overflow-auto">
            {suggestions.map((m) => (
              <div key={m.id} onClick={() => insertMedicine(m)} className="p-2 hover:bg-gray-100 cursor-pointer">
                <strong>{m.name}</strong> {m.brand_name && <span className="text-gray-500"> — {m.brand_name}</span>}
              </div>
            ))}
            {suggestions.length === 0 && medicineSearch.length >= 2 && (
              <div onClick={insertCustom} className="p-2 bg-blue-50 text-blue-700 cursor-pointer hover:bg-blue-100 border-t">
                + Add "<strong>{medicineSearch}</strong>" as custom medicine
              </div>
            )}
          </div>
        )}
      </div>

      {/* Prescription Table */}
      <table className="w-full border border-slate-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            {["Medicine", "Form", "Dosage", "Number", "Time", ""].map((t, i) => (
              <th key={i} className="p-1">{t}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((it, idx) => (
            <tr key={idx}>
              {/* Medicine */}
              <td className={tableStyles.td + " w-[30%]"}>{it.name}</td>

              {/* Form */}
              <td className={tableStyles.medicine_td + " w-[20%]"}>
                <div className="print:hidden">
                  <CreatableSelect
                    className="text-xs"
                    placeholder="Form"
                    value={it.form ? { value: it.form, label: it.form } : null}
                    onChange={(option) => update(idx, "form", option?.value || "")}
                    options={medicineForms}
                    isClearable
                    styles={smallSelectStyles}
                  />
                </div>
                <div className="hidden print:block text-xs">{it.form || "—"}</div>
              </td>

              {/* Dosage */}
              <td className={tableStyles.medicine_td + " w-[18%]"}>
                <div className="print:hidden">
                  <CreatableSelect
                    className="text-xs"
                    placeholder="Dosage"
                    value={it.dosage ? { value: it.dosage, label: it.dosage } : null}
                    onChange={(option) => update(idx, "dosage", option?.value || "")}
                    options={dosageOptions}
                    isClearable
                    styles={smallSelectStyles}
                  />
                </div>
                <div className="hidden print:block text-xs">{it.dosage || "—"}</div>
              </td>

              {/* Number */}
              <td className={tableStyles.medicine_td + " w-[14%]"}>
                <div className="print:hidden">
                  <CreatableSelect
                    className="text-xs"
                    placeholder="Number"
                    value={it.number ? { value: it.number, label: it.number } : null}
                    onChange={(option) => update(idx, "number", option?.value || "")}
                    options={numberOptions}
                    isClearable
                    styles={smallSelectStyles}
                  />
                </div>
                <div className="hidden print:block text-xs">{it.number || "—"}</div>
              </td>

              {/* Time */}
              <td className={tableStyles.medicine_td + " w-[30%]"}>
                <div className="print:hidden">
                  <CreatableSelect
                    className="text-xs"
                    placeholder="Select time..."
                    value={it.time ? { value: it.time, label: it.time } : null}
                    onChange={(option) => update(idx, "time", option?.value || "")}
                    options={timeOptions}
                    isClearable
                    styles={smallSelectStyles}
                  />
                </div>
                <div className="hidden print:block text-sm break-words">{it.time || "—"}</div>
              </td>

              {/* Remove */}
              <td className={tableStyles.td + " print:hidden"}>
                <button
                  onClick={() => remove(idx)}
                  className="text-red-600 font-bold text-sm cursor-pointer border border-red-400 rounded-full w-4 h-4 flex items-center justify-center"
                >
                  −
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </SectionContainer>
  );
}



function Footer({ signatureUrl, doctor_name, lastname, addresses }) {
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

      <div className="text-sm flex gap-2 mt-4 border-t-2 ">
        <p className="font-semibold">Address:</p>
        <p>{addresses?.address}</p>
        <p>{addresses?.province}, {addresses?.country}</p>
        <p>District: {addresses?.district}</p>
        <p>Room: {addresses?.room_number}, Floor: {addresses?.floor_number}</p>
      </div>
    </>
  );
}
