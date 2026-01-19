import { useEffect, useState } from "react";
import { mainSectionStyles } from "../../../styles/dashboardStyles";
import { fetchDashboard, fetchLogs } from "../../../api/ownerAPI";
import { toast } from "react-toastify";
import { Coins, Pill, UserCheck, UserX } from "lucide-react";
import Table from "../../../componenets/Table";
import { dropdownStyle, inputStyle } from "../../../styles/componentsStyle";
import { useMemo } from "react";
import SectionContainer from "../../../componenets/SectionContainer";
import { FormatLastLogin } from "../../../componenets/Date&Time";

const cards = [
  {
    key: "active",
    title: "Active Doctors",
    color: "green",
    icon: UserCheck,
  },
  {
    key: "inactive",
    title: "Inactive Doctors",
    color: "red",
    icon: UserX,
  },
  {
    key: "total_medicines",
    title: "Total Medicine",
    color: "indigo",
    icon: Pill,
  },
  {
    key: "total_payments",
    title: "Total Payments",
    color: "sky",
    icon: Coins,
    suffix: " AF",
  },
];

const OwnerDashboard = () => {
  const [counts, setCounts] = useState({});
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");


  useEffect(() => {
    fetchDashboard()
      .then(setCounts)
      .catch((err) => toast.error(err.message));

    fetchLogs()
      .then(setLogs)
      .catch((err) => toast.error(err.message));
  }, []);

    const normalizedLogs = useMemo(() =>
      logs.map(l => ({
        ...l,
        fullName: `${l.doctor_name || ""} ${l.lastname || ""}`.toLowerCase(),
      })),
    [logs]);

    const filteredLogs = useMemo(() => {
      const q = search.toLowerCase();

      return normalizedLogs.filter(
        l => l.fullName.includes(q) &&
        (actionFilter ? l.action === actionFilter : true)
      );
    }, [normalizedLogs, search, actionFilter]);


    const actions = useMemo(() => {
      if (!Array.isArray(logs)) return [];
      return [...new Set(logs.map(l => l.action).filter(Boolean))];
    }, [logs]);
  return (
    <>
      <div className={mainSectionStyles.grid}>

        {/* Active Doctors */}
        <div className="flex items-center bg-green-50 rounded-xl p-6 shadow hover:shadow-lg transition">
          <div className="p-4 bg-green-100 rounded-full">
            <UserCheck className="w-8 h-8 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-lg font-semibold text-green-700">
              Active Doctors
            </p>
            <p className="text-3xl font-bold text-green-800">
              {counts.active || 0}
            </p>
          </div>
        </div>

        {/* Inactive Doctors */}
        <div className="flex items-center bg-red-50 rounded-xl p-6 shadow hover:shadow-lg transition">
          <div className="p-4 bg-red-100 rounded-full">
            <UserX className="w-8 h-8 text-red-600" />
          </div>
          <div className="ml-4">
            <p className="text-lg font-semibold text-red-700">
              Inactive Doctors
            </p>
            <p className="text-3xl font-bold text-red-800">
              {counts.inactive || 0}
            </p>
          </div>
        </div>

        {/* Total Medicine */}
        <div className="flex items-center bg-indigo-50 rounded-xl p-6 shadow hover:shadow-lg transition">
          <div className="p-4 bg-indigo-100 rounded-full">
            <Pill className="w-8 h-8 text-indigo-600" />
          </div>
          <div className="ml-4">
            <p className="text-lg font-semibold text-indigo-700">
              Total Medicine
            </p>
            <p className="text-3xl font-bold text-indigo-800">
              {counts.total_medicines || 0}
            </p>
          </div>
        </div>

        {/* Total Payments */}
        <div className="flex items-center bg-sky-50 rounded-xl p-6 shadow hover:shadow-lg transition">
          <div className="p-4 bg-sky-100 rounded-full">
            <Coins className="w-8 h-8 text-sky-600" />
          </div>
          <div className="ml-4">
            <p className="text-lg font-semibold text-sky-700">
              Total Payments
            </p>
            <p className="text-3xl font-bold text-sky-800">
              {counts.total_payments || 0} AF
            </p>
          </div>
        </div>
      </div>
      <br />

      <SectionContainer title="Doctors Logger">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* Search by Doctor Name */}
            <input
              type="text"
              placeholder="Search by doctor name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={inputStyle.primary}
            />

            {/* Filter by Action */}
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className={dropdownStyle.base}
            >
              <option value="">All Actions</option>

              {actions.map((action) => (
                <option key={action} value={action}>
                  {action}
                </option>
              ))}
            </select>
          </div>

        <Table
              columns={[
                { key: "id", label: "id", render: (v, r) => `${v} ${r.lastname}` },
                { key: "doctor_name", label: "Doctor", render: (v, r) => `${v} ${r.lastname}` },
                { key: "clinic_name", label: "Clinic" },
                { key: "action", label: "Action" },
                { key: "table_access", label: "Table" },
                { key: "created_at", label: "Date", render: val => FormatLastLogin(val) },
              ]}
              records={filteredLogs}
        />
      </SectionContainer>
    </>
  );
};

export default OwnerDashboard;
