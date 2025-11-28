import React from "react";

function StatCard({ title, value, icon, gradient }) {
  return (
    <div
      className={`rounded-md bg-gradient-to-br ${gradient} p-6 shadow-sm border border-gray-200 hover:shadow-lg transition transform  duration-200`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="p-3 bg-white rounded-xl shadow-sm">{icon}</div>
      </div>
    </div>
  );
}

export default StatCard;
