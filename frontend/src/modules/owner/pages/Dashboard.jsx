import React, { useEffect, useState } from "react";
import { mainSectionStyles } from "../../../styles/dashboardStyles";
import { fetchDashboard } from "../../../api/ownerAPI";
import { toast } from "react-toastify";
import { UserCheck, UserX } from "lucide-react";

const OwnerDashboard = () => {
  const [counts, setCounts] = useState({ active: 0, inactive: 0 });

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const result = await fetchDashboard();
        setCounts(result);
      } catch (err) {
        toast.error(err.message);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className={mainSectionStyles.grid + " gap-6 p-6"}>
      {/* Active Doctors Card */}
      <div className="flex items-center bg-green-50 rounded-xl p-6 shadow hover:shadow-lg transition">
        <div className="p-4 bg-green-100 rounded-full">
          <UserCheck className="w-8 h-8 text-green-600" />
        </div>
        <div className="ml-4">
          <p className="text-lg font-semibold text-green-700">Active Doctors</p>
          <p className="text-3xl font-bold text-green-800">{counts.active}</p>
        </div>
      </div>

      {/* Inactive Doctors Card */}
      <div className="flex items-center bg-red-50 rounded-xl p-6 shadow hover:shadow-lg transition">
        <div className="p-4 bg-red-100 rounded-full">
          <UserX className="w-8 h-8 text-red-600" />
        </div>
        <div className="ml-4">
          <p className="text-lg font-semibold text-red-700">Inactive Doctors</p>
          <p className="text-3xl font-bold text-red-800">{counts.inactive}</p>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
