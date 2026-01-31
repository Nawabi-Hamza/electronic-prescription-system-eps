import { useState } from "react";
import { inputStyle, tableStyles } from "../../../../styles/componentsStyle";
import { dosageOptions, medicineForms, numberOptions, timeOptions } from "./data";
import SectionContainer from "../../../../componenets/SectionContainer";
import CreatableSelect from "react-select/creatable";




// Updated selectStyles for smaller size
const smallSelectStyles = {
  control: (base) => ({
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

export function SimpleBody({ medicineSearch, setMedicineSearch, suggestions, setSuggestions, height='min-h-[68vh]', setMed }) {
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
        dosage: m.strength || "",
        number: m.number || "",
        time: m.time || ""
      }
    ]);
    setMed((prev) => [
      ...prev,
      {
        id: m.id || Date.now(),
        name: m.name,
        brand_name: m.brand_name || "",
        form: m.form || "",
        dosage: m.strength || "",
        number: m.number || "",
        time: m.time || ""
      }
    ])
    setMedicineSearch("");
    setSuggestions([]);
  };

  const insertCustom = () => {
    if (!medicineSearch.trim()) return;
    insertMedicine({ id: Date.now(), name: medicineSearch.trim() });
  };

  const update = (i, field, val) => {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, [field]: val } : it)))
    setMed((prev) => prev.map((it, idx) => (idx === i ? { ...it, [field]: val } : it)))
  };
  const remove = (i) => {
    setItems((prev) => prev.filter((_, idx) => idx !== i))
    setMed((prev) => prev.filter((_, idx) => idx !== i))
  };

  return (
    <SectionContainer title="RX:" className="shadow-none border-l border-slate-400 rounded-none">
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
      <div className={"max-w-[100%] sm:max-w-full overflow-auto "+height}>
        <table className="w-full border border-slate-200 text-xs">
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
                  <div className="hidden text-center print:block text-xs">{it.form || "—"}</div>
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
                  <div className="hidden text-center print:block text-xs">{it.number || "—"}</div>
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
      </div>
    </SectionContainer>
  );
}
