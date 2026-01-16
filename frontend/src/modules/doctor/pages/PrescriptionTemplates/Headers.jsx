

const formatMonthDay = (iso) => iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "__________";

export function SimpleHeader({ name_prefex, doctor_name, lastname, clinic_name, description, phone, patientName, patientAge, patientGender, nextVisit }) {
  // Get bill number from localStorage or default
  const billNumber = () => {
    const stored = localStorage.getItem("billNumber");
    if (stored) return stored;
    const defaultBill = 1;
    localStorage.setItem("billNumber", defaultBill);
    return defaultBill;
  };

  // Compute next visit date if not provided
  const computeNextVisit = () => {
    if (nextVisit) return nextVisit;
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 2, today.getDate());
    return nextMonth.toISOString().split("T")[0];
  };

  const displayNextVisit = computeNextVisit();

  return (
    <div id="header-container">
      <div className="md:flex items-center justify-between">
        <div className="px-4">
          <h1 className="text-3xl font-bold uppercase tracking-wide">
            {name_prefex} {doctor_name} {lastname}
          </h1>
          <p className="text-lg font-semibold">{clinic_name}</p>
          {description && <p className="text-xs mt-2 italic text-gray-600">{description}</p>}
        </div>
        <div>
          <p>Phone: {phone}</p>
          <p>Bill No: {billNumber()}</p>
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